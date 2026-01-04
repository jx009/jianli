import express from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../utils/auth.js';

import multer from 'multer';
import { parseResumePdf } from '../services/importService.js';

// Multer setup for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

// 0. 导入简历 (PDF Import)
router.post('/import', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        // Extract params from body (Multer parses body too)
        const { mode, templateId } = req.body;

        const result = await parseResumePdf(req.file.buffer, { mode, templateId });
        
        // Create a new resume record immediately
        const newResume = await prisma.resume.create({
            data: {
                title: result.title || '导入的简历',
                content: result.content,
                userId: req.userId,
                thumbnail: null,
                // rawText: result.rawText // We could store this if we update schema
            }
        });

        res.json(newResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to import resume' });
    }
});

// 1. 获取我的简历列表 (Dashboard)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, updatedAt: true, thumbnail: true } // Don't fetch heavy content
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. 获取单份简历详情
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) }
    });
    if (!resume) return res.status(404).json({ error: 'Not found' });
    
    // Permission check could be here (public vs private)
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. 创建/保存简历 (Upsert)
// 如果 ID 存在则更新，不存在则创建
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, thumbnail } = req.body;
        
        const newResume = await prisma.resume.create({
            data: {
                title: title || '未命名简历',
                content: content, // Json
                thumbnail,        // Save thumbnail
                userId: req.userId
            }
        });
        res.json(newResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content, thumbnail } = req.body;
    
    try {
        // Verify ownership
        const existing = await prisma.resume.findUnique({ where: { id: parseInt(id) } });
        if (!existing) return res.status(404).json({ error: 'Not found' });
        if (existing.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

        const updated = await prisma.resume.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                thumbnail
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

export default router;
