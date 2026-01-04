import ClassicTemplate from './Classic';
import LeftRightTemplate from './LeftRight';
import MinimalTemplate from './Minimal';
import ModernHeader from './ModernHeader';

export const TEMPLATES = {
  'classic': { component: ClassicTemplate, name: '经典通用', color: '#fff' },
  'leftRight': { component: LeftRightTemplate, name: '左右分栏', color: '#2c3e50' }, // Dark preview
  'minimal': { component: MinimalTemplate, name: '极简黑白', color: '#fafafa' },
  'modernHeader': { component: ModernHeader, name: '现代商务', color: '#f0f2f5' }
};
