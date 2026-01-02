import pdf from 'pdf-parse';

export const parseResumePdf = async (buffer) => {
    try {
        const data = await pdf(buffer);
        const text = data.text;
        
        // Basic Heuristics
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        
        // 1. Base Info
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const phoneRegex = /(?:\+?86)?1[3-9]\d{9}/; // Simple CN phone regex
        
        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);
        
        // Assume name is the first line or close to top
        const name = lines[0] || 'Unknown'; 

        // 2. Identify Sections (Simple Keyword Search)
        const sections = {
            education: [],
            work: [],
            project: [],
            skill: ''
        };

        let currentSection = null;
        
        // Keywords to trigger section switch
        const keywords = {
            '教育': 'education', 'Education': 'education',
            '工作': 'work', 'Experience': 'work',
            '项目': 'project', 'Project': 'project',
            '技能': 'skill', 'Skills': 'skill',
            '自我评价': 'skill', 'Summary': 'skill' // Map summary to skill text for now
        };

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            let foundKeyword = false;
            
            for (const [key, val] of Object.entries(keywords)) {
                if (line.includes(key) && line.length < 20) { // Section headers are usually short
                    currentSection = val;
                    foundKeyword = true;
                    break;
                }
            }

            if (foundKeyword) continue;

            if (currentSection) {
                if (currentSection === 'skill') {
                    sections.skill += line + '\n';
                } else {
                    // For lists, we just push raw lines for now as parsing structured items from raw text is hard without AI
                    // We'll group them loosely
                    if (sections[currentSection].length === 0 || sections[currentSection][sections[currentSection].length - 1].desc) {
                         sections[currentSection].push({ 
                             id: Math.random().toString(36).substr(2, 9),
                             title: line, // Assume first line of block is title
                             subtitle: '',
                             date: '',
                             desc: '' 
                         });
                    } else {
                        // Append to description of last item
                        sections[currentSection][sections[currentSection].length - 1].desc += line + '\n';
                    }
                }
            }
        }

        // Construct Resume Data
        const resumeData = {
            config: {
                themeColor: '#24be58',
                fontFamily: 'sans-serif',
                lineHeight: 1.5,
                paperSize: 'A4',
                moduleMargin: 24,
                templateId: 'classic'
            },
            modules: [
                {
                    id: 'base-info',
                    type: 'baseInfo',
                    title: '基本信息',
                    data: {
                        name: name,
                        job: '求职者', // Default
                        mobile: phoneMatch ? phoneMatch[0] : '',
                        email: emailMatch ? emailMatch[0] : '',
                        age: '',
                        city: '',
                        avatar: ''
                    }
                }
            ]
        };

        // Add sections if they have content
        if (sections.education.length > 0) {
            resumeData.modules.push({ id: 'education', type: 'list', title: '教育经历', data: sections.education });
        }
        if (sections.work.length > 0) {
            resumeData.modules.push({ id: 'work', type: 'list', title: '工作经历', data: sections.work });
        }
        if (sections.project.length > 0) {
            resumeData.modules.push({ id: 'project', type: 'list', title: '项目经历', data: sections.project });
        }
        if (sections.skill) {
            resumeData.modules.push({ id: 'skill', type: 'text', title: '专业技能', data: { content: sections.skill } });
        }

        return resumeData;

    } catch (error) {
        console.error('PDF Parse Error:', error);
        throw new Error('Failed to parse PDF');
    }
};
