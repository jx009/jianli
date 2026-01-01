import { prisma } from '../index.js';
import { generatePDF } from '../services/pdfService.js';

// Get all resumes for the current user
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single resume details
export const getResumeById = async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const { title, content } = req.body;
    const resume = await prisma.resume.create({
      data: {
        title: title || '未命名简历',
        content: content || {},
        userId: req.user.id
      }
    });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing resume
export const updateResume = async (req, res) => {
  try {
    const { title, content } = req.body;
    const resume = await prisma.resume.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content
      }
    });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    await prisma.resume.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export Resume as PDF
export const exportResumePdf = async (req, res) => {
  try {
    const host = req.get('host');
    const pdfBuffer = await generatePDF(req.params.id, host);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=resume-${req.params.id}.pdf`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'PDF Generation failed' });
  }
};
