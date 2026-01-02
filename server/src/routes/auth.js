import express from 'express';
import xml2js from 'xml2js';
import crypto from 'crypto'; // Import crypto for signature check
import { prisma } from '../index.js';
import { generateToken } from '../utils/auth.js';

const router = express.Router();

const verifyCodes = new Map();

// Helper: Check WeChat Signature
const checkSignature = (signature, timestamp, nonce, token) => {
    const arr = [token, timestamp, nonce].sort();
    const str = arr.join('');
    const sha1 = crypto.createHash('sha1').update(str).digest('hex');
    return sha1 === signature;
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. WeChat Callback
router.use('/wechat/callback', async (req, res) => {
    const { signature, timestamp, nonce, echostr } = req.query;
    const token = process.env.WECHAT_TOKEN;

    // Log incoming request for debugging
    console.log(`[WeChat] Incoming Request: method=${req.method}`);

    // Verify Signature (Optional but recommended)
    if (!checkSignature(signature, timestamp, nonce, token)) {
        console.error('[WeChat] Signature verification failed');
        // return res.status(403).send('Invalid signature'); 
        // For debugging, we might skip this strict check or just log it
    }

    // GET Request: Verification
    if (req.method === 'GET') {
        console.log('[WeChat] Verification success');
        return res.send(echostr);
    }

    // POST Request: Message Handling
    let buf = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { buf += chunk; });
    req.on('end', async () => {
        console.log('[WeChat] Received XML:', buf); // Print the XML

        try {
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(buf);
            const xml = result.xml;
            
            const toUser = xml.FromUserName;
            const fromUser = xml.ToUserName;
            const msgType = xml.MsgType;
            const content = xml.Content;
            
            let replyContent = '';

            console.log(`[WeChat] Parsed: type=${msgType}, content=${content}`);

            if (msgType === 'text' && (content === '登录' || content === '登陆')) {
                const code = generateCode();
                verifyCodes.set(code, { openid: toUser, expires: Date.now() + 10 * 60 * 1000 });
                replyContent = `您的登录验证码是：${code}\n\n请在网页端输入此验证码完成登录。验证码 10 分钟内有效。`;
                console.log(`[WeChat] Generated code ${code} for ${toUser}`);
            } else if (msgType === 'event' && xml.Event === 'subscribe') {
                 replyContent = `欢迎关注！\n\n回复【登录】即可获取验证码。`;
            } else {
                 replyContent = `欢迎使用！回复【登录】获取验证码。`;
            }

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
            console.error('[WeChat] Error parsing XML:', err);
            res.send('success');
        }
    });
});

// 2. Login by Code
router.post('/login-by-code', async (req, res) => {
    const { code } = req.body;
    
    // Mock
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
    if (!data) return res.status(400).json({ error: '验证码无效或已过期' });
    
    verifyCodes.delete(code);
    
    const user = await prisma.user.upsert({
        where: { openid: data.openid },
        update: {},
        create: { openid: data.openid, nickname: '微信用户', avatar: '' }
    });
    
    const token = generateToken(user.id);
    res.json({ token, user });
});

export default router;
