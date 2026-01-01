import express from 'express';
import { prisma } from '../index.js';
import authRoutes from './auth.js';
import resumeRoutes from './resume.js';
import uploadRoutes from './upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 静态资源服务 (让 uploads 目录可被访问)
// 例如: http://localhost:3000/uploads/xxx.jpg
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);

// Health
app.get('/api/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
