import express from 'express';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// AI 润色接口
router.post('/polish', authMiddleware, async (req, res) => {
    const { text, type } = req.body; // type: 'desc' | 'summary'

    if (!text || text.length < 5) {
        return res.status(400).json({ error: '内容太短，无法润色' });
    }

    try {
        // TODO: 这里接入 DeepSeek / OpenAI API
        // const completion = await openai.chat.completions.create({ ... });
        
        // MOCK AI Response
        // 模拟 AI 思考 1.5秒
        await new Promise(resolve => setTimeout(resolve, 1500));

        let polishedText = text;
        if (type === 'summary') {
            polishedText = `[AI 优化] 具备扎实的${text}经验。善于团队协作，能够独立解决复杂问题。拥有强烈的责任心和持续学习能力，致力于通过技术提升业务价值。`;
        } else {
            polishedText = `[AI 优化] 负责${text}的核心开发工作。通过优化架构和重构代码，显著提升了系统性能与稳定性。主导了关键模块的设计与落地，获得团队高度认可。`;
        }

        res.json({ result: polishedText });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI 服务暂时繁忙' });
    }
});

export default router;
