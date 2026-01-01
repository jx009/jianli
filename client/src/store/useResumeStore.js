import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_MODULES = [
  {
    id: 'base-info',
    type: 'baseInfo',
    title: '基本信息',
    data: {
      name: '张三',
      job: '前端工程师',
      mobile: '13800138000',
      email: 'zhangsan@example.com',
      age: '25岁', // 也可以是生日
      city: '北京',
      avatar: '' // 待实现
    }
  },
  {
    id: 'education',
    type: 'list',
    title: '教育经历',
    data: [
      { id: '1', title: '北京大学', subtitle: '计算机科学与技术 / 本科', date: '2016.09 - 2020.06', desc: '主修课程：数据结构、算法、操作系统、计算机网络' }
    ]
  },
  {
    id: 'work',
    type: 'list',
    title: '工作经历',
    data: [
      { id: '1', title: '某某互联网公司', subtitle: '前端开发工程师', date: '2020.07 - 至今', desc: '负责公司核心产品的研发工作，主导重构了老旧系统，提升了50%的加载速度。' }
    ]
  },
  {
    id: 'project',
    type: 'list',
    title: '项目经历',
    data: [
      { id: '1', title: '在线简历制作平台', subtitle: '核心开发者', date: '2023.01 - 2023.06', desc: '独立开发了一个支持拖拽排序、实时预览的简历制作网站。' }
    ]
  },
  {
    id: 'skill',
    type: 'text',
    title: '专业技能',
    data: {
      content: `1. 熟练掌握 React, Vue 等主流前端框架.\n2. 熟悉 Node.js 后端开发，了解 MySQL, MongoDB.\n3. 具备良好的代码规范和团队协作能力.`
    }
  }
];

const useResumeStore = create((set) => ({
  resume: {
    config: {
      themeColor: '#24be58',
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
      paperSize: 'A4',
      moduleMargin: 24
    },
    modules: DEFAULT_MODULES
  },

  // Actions
  updateConfig: (key, value) => set((state) => ({
    resume: {
      ...state.resume,
      config: { ...state.resume.config, [key]: value }
    }
  })),

  // 更新整个模块的数据 (用于 BaseInfo 和 Text)
  updateModuleData: (moduleId, newData) => set((state) => ({
    resume: {
      ...state.resume,
      modules: state.resume.modules.map(m => m.id === moduleId ? { ...m, data: { ...m.data, ...newData } } : m)
    }
  })),

  // 更新 List 模块中的某一项 (用于 Education, Work, Project)
  updateListItem: (moduleId, itemId, itemData) => set((state) => ({
    resume: {
      ...state.resume,
      modules: state.resume.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          data: m.data.map(item => item.id === itemId ? { ...item, ...itemData } : item)
        };
      })
    }
  })),

  // 向 List 模块添加新项
  addListItem: (moduleId) => set((state) => ({
    resume: {
      ...state.resume,
      modules: state.resume.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          data: [...m.data, { id: uuidv4(), title: '新条目', subtitle: '', date: '', desc: '' }]
        };
      })
    }
  })),

  // 从 List 模块移除项
  removeListItem: (moduleId, itemId) => set((state) => ({
    resume: {
      ...state.resume,
      modules: state.resume.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          data: m.data.filter(item => item.id !== itemId)
        };
      })
    }
  })),

  // 移动整个模块 (拖拽排序用)
  reorderModules: (newModules) => set((state) => ({
    resume: { ...state.resume, modules: newModules }
  })),

  addModule: (type, title) => set((state) => {
    const newModule = {
      id: uuidv4(),
      type,
      title: title || '新模块',
      data: type === 'list' ? [] : { content: '' }
    };
    return {
      resume: {
        ...state.resume,
        modules: [...state.resume.modules, newModule]
      }
    };
  }),

  removeModule: (id) => set((state) => ({
    resume: {
      ...state.resume,
      modules: state.resume.modules.filter(m => m.id !== id)
    }
  }))
}));

export default useResumeStore;