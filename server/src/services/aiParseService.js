import axios from 'axios';

const SYSTEM_PROMPT = `
你是一个专业的简历解析助手。你的任务是将用户上传的简历纯文本，智能解析并转换为标准的 JSON 格式。
请严格按照以下 JSON 结构返回数据，不要包含 Markdown 格式（如 
```json
），直接返回纯 JSON 字符串。

目标数据结构 (Schema):
{
  "config": { "themeColor": "#24be58", "templateId": "classic" },
  "modules": [
    {
      "id": "base-info", "type": "baseInfo", "title": "基本信息",
      "data": { "name": "姓名", "job": "求职意向", "mobile": "电话", "email": "邮箱", "age": "年龄/生日", "city": "城市", "avatar": "" }
    },
    {
      "id": "education", "type": "list", "title": "教育经历",
      "data": [ { "id": "uuid", "title": "学校名", "subtitle": "学历/专业", "date": "时间段", "desc": "描述" } ]
    },
    {
      "id": "work", "type": "list", "title": "工作经历",
      "data": [ { "id": "uuid", "title": "公司名", "subtitle": "职位", "date": "时间段", "desc": "工作内容描述" } ]
    },
      {
      "id": "project", "type": "list", "title": "项目经历",
      "data": [ { "id": "uuid", "title": "项目名", "subtitle": "角色", "date": "时间段", "desc": "项目描述" } ]
    },
    {
      "id": "skill", "type": "text", "title": "专业技能",
      "data": { "content": "技能描述文本" }
    }
  ]
}

要求：
1. 自动识别并纠正文本中的错别字。
2. 如果某项内容缺失（如没有项目经历），则不要在 modules 中包含该模块。
3. "desc" 字段应适当优化语言，使其更专业。
4. "id" 字段请生成随机字符串。
`;

export const parseWithAI = async (text) => {
    try {
        const apiKey = process.env.AI_API_KEY;
        const baseURL = process.env.AI_API_BASE_URL || 'https://api.loveyouai.cn/v1';
        const model = process.env.AI_MODEL_NAME || 'gpt-3.5-turbo';

        if (!apiKey) {
            console.warn('AI_API_KEY is not set. Falling back to heuristic parsing.');
            return null; // Fallback
        }

        const response = await axios.post(`${baseURL}/chat/completions`, {
            model: model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `请解析这份简历：\n${text.substring(0, 3000)}` } // Limit context length
            ],
            temperature: 0.3
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        
        // Clean up markdown code blocks if present
        const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('AI Parse Error:', error.response?.data || error.message);
        return null; // Return null to signal fallback
    }
};
