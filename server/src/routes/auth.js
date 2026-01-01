import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import xml2js from 'xml2js';
import { prisma } from '../index.js';
import { generateToken } from '../utils/auth.js';

const router = express.Router();

// 配置（请在 .env 中设置）
const APP_ID = process.env.WECHAT_APP_ID;
const APP_SECRET = process.env.WECHAT_APP_SECRET;
const TOKEN = process.env.WECHAT_TOKEN || 'jianlixiaozhushou'; // 公众号后台配置的 Token

// 内存中临时存储登录场景 (Scene) -> Socket/Polling Map
// 结构: { sceneId: { status: 'pending' | 'scanned' | 'confirmed', openid: '...', ticket: '...' } }
const loginScenes = new Map();

// 1. 获取登录二维码
router.get('/wechat/qrcode', async (req, res) => {
  try {
    // A. 获取 Access Token
    // 注意：实际生产中需要缓存 Access Token，因为它每天有调用限额且有效期2小时
    // 这里简化为每次请求（由于只是 Demo，流量不大）
    const tokenRes = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`);
    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
        // DEV MODE: 如果没有配置微信，返回一个模拟的 sceneId
        if (!APP_ID) {
            const mockSceneId = 'mock-' + Date.now();
            loginScenes.set(mockSceneId, { status: 'pending' });
            return res.json({ 
                sceneId: mockSceneId, 
                url: 'https://via.placeholder.com/300?text=Mock+QRCode', 
                expire: 300,
                isMock: true
            });
        }
        return res.status(500).json({ error: 'Failed to get access token' });
    }

    // B. 生成带参数的二维码 (临时二维码)
    const sceneId = Date.now().toString(); // 简单的 SceneID
    const qrRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`, {
      expire_seconds: 600,
      action_name: 'QR_SCENE',
      action_info: { scene: { scene_id: parseInt(sceneId.slice(-9)) } } // 微信要求 scene_id 是 32位整型
    });

    const ticket = qrRes.data.ticket;
    const qrUrl = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(ticket)}`;

    // 存入内存等待回调
    loginScenes.set(sceneId, { status: 'pending' });

    res.json({ sceneId, url: qrUrl, expire: 600 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. 微信服务器回调接口 (Webhook)
// 微信会把用户扫码事件推送到这里
router.use('/wechat/callback', async (req, res) => {
    // 验证签名
    const { signature, timestamp, nonce, echostr } = req.query;
    // (此处省略签名验证逻辑，直接通过)
    
    if (req.method === 'GET') {
        // 微信后台验证 URL 有效性
        return res.send(echostr);
    }

    // POST: 接收 XML 消息
    const parser = new xml2js.Parser({ explicitArray: false });
    // Express 默认不解析 XML，需注意 body-parser 配置，这里假设 req.body 已经是解析后的或原始字符串
    // 简单起见，我们假设外部已配置 xml parser 中间件，或者手动收集流
    // 这里为了演示，我们先只写核心逻辑
    
    // ... 解析 XML ...
    // 假设得到: { ToUserName, FromUserName (OpenID), Event: 'SCAN'|'subscribe', EventKey: 'qrscene_...' }
    
    // 伪代码逻辑：
    // const openid = xml.FromUserName;
    // const sceneId = xml.EventKey.replace('qrscene_', '');
    
    // if (loginScenes.has(sceneId)) {
    //    loginScenes.set(sceneId, { status: 'confirmed', openid });
    // }
    
    res.send('success');
});

// 3. 前端轮询接口
router.get('/check', async (req, res) => {
    const { sceneId } = req.query;
    if (!sceneId) return res.status(400).json({ error: 'Missing sceneId' });

    const scene = loginScenes.get(sceneId);
    if (!scene) return res.status(404).json({ error: 'Expired' });

    // MOCK LOGIN FOR DEV
    if (sceneId.startsWith('mock-')) {
        // 模拟 2秒后登录成功
        const mockUser = await prisma.user.upsert({
            where: { openid: 'mock-openid-123' },
            update: {},
            create: { openid: 'mock-openid-123', nickname: '测试用户', avatar: '' }
        });
        const token = generateToken(mockUser.id);
        return res.json({ status: 'confirmed', token, user: mockUser });
    }

    if (scene.status === 'confirmed') {
        // 登录成功，查找或创建用户
        const user = await prisma.user.upsert({
            where: { openid: scene.openid },
            update: {},
            create: { openid: scene.openid, nickname: '微信用户', avatar: '' }
        });
        
        const token = generateToken(user.id);
        loginScenes.delete(sceneId); // 清除
        return res.json({ status: 'confirmed', token, user });
    }

    res.json({ status: 'pending' });
});

export default router;
