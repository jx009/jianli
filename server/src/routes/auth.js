import express from 'express';
import xml2js from 'xml2js';
import { prisma } from '../index.js';
import { generateToken } from '../utils/auth.js';

const router = express.Router();

// 内存存储验证码: { "884826": { openid: "wx_xxx", expires: 1700000000 } }
// 生产环境建议用 Redis
const verifyCodes = new Map();

// 生成 6 位数字验证码
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 清理过期验证码 (简单定时任务，每10分钟清理一次)
setInterval(() => {
    const now = Date.now();
    for (const [code, data] of verifyCodes.entries()) {
        if (data.expires < now) verifyCodes.delete(code);
    }
}, 10 * 60 * 1000);


// 1. 微信回调接口 (核心逻辑)
router.use('/wechat/callback', async (req, res) => {
    const { signature, timestamp, nonce, echostr } = req.query;
    
    // 验证签名逻辑 (略，为了演示直接通过，生产环境必须加上)
    // if (!checkSignature(signature, timestamp, nonce)) return res.send('fail');

    if (req.method === 'GET') {
        return res.send(echostr); // 微信服务器验证 URL
    }

    // 处理 POST 消息
    // Express 默认不解析 XML，我们需要手动处理或者假设已经有中间件
    // 这里我们用一个简化的流式处理来演示解析
    let buf = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { buf += chunk; });
    req.on('end', async () => {
        try {
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(buf);
            const xml = result.xml;
            
            const toUser = xml.FromUserName;   // 用户 OpenID
            const fromUser = xml.ToUserName;   // 公众号 ID
            const msgType = xml.MsgType;
            const content = xml.Content;
            
            let replyContent = '';

            // 逻辑：如果是文本消息，且内容是“登录”
            if (msgType === 'text' && (content === '登录' || content === '登陆')) {
                const code = generateCode();
                // 存入内存，有效期 10 分钟
                verifyCodes.set(code, { openid: toUser, expires: Date.now() + 10 * 60 * 1000 });
                
                replyContent = `您的登录验证码是：${code}\n\n请在网页端输入此验证码完成登录。验证码 10 分钟内有效。`;
            } else if (msgType === 'event' && xml.Event === 'subscribe') {
                 replyContent = `欢迎关注！\n\n回复【登录】即可获取验证码。`;
            } else {
                 replyContent = `欢迎使用！回复【登录】获取验证码。`;
            }

            // 构造 XML 回复
            const replyXml = `
                <xml>
                  <ToUserName><![CDATA[${toUser}]]></ToUserName>
                  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
                  <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
                  <MsgType><![CDATA[text]]></MsgType>
                  <Content><![CDATA[${replyContent}]]></Content>
                </xml>
            `;
            
            res.type('application/xml');
            res.send(replyXml);

        } catch (err) {
            console.error(err);
            res.send('success'); // 避免微信重试
        }
    });
});


// 2. 验证码登录接口 (网页端调用)
router.post('/login-by-code', async (req, res) => {
    const { code } = req.body;
    
    // MOCK MODE: 如果是特殊验证码 '123456'，直接登录（方便开发测试）
    if (code === '123456') {
         const mockUser = await prisma.user.upsert({
            where: { openid: 'mock-openid-dev' },
            update: {},
            create: { openid: 'mock-openid-dev', nickname: '开发测试员', avatar: '' }
        });
        const token = generateToken(mockUser.id);
        return res.json({ token, user: mockUser });
    }

    const data = verifyCodes.get(code);

    if (!data) {
        return res.status(400).json({ error: '验证码无效或已过期' });
    }
    
    // 验证通过，销毁验证码
    verifyCodes.delete(code);
    
    // 查找或创建用户
    const user = await prisma.user.upsert({
        where: { openid: data.openid },
        update: {},
        create: { openid: data.openid, nickname: '微信用户', avatar: '' }
    });
    
    const token = generateToken(user.id);
    res.json({ token, user });
});

export default router;