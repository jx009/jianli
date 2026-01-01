import express from 'express';
import { prisma } from '../index.js';
import * as resumeController from '../controllers/resumeController.js';

const router = express.Router();

// Mock User Middleware
const mockUser = async (req, res, next) => {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        openid: 'mock_openid_123',
        nickname: '测试用户'
      }
    });
  }
  req.user = user;
  next();
};

router.use(mockUser);

// Define Routes mapping to Controller methods
router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);
router.post('/', resumeController.createResume);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.get('/:id/pdf', resumeController.exportResumePdf);

export default router;