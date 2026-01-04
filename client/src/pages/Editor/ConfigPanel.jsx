import React from 'react';
import { Form, Slider, ColorPicker, Button, Tooltip, message, Space } from 'antd';
import { ExperimentOutlined, FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import useResumeStore from '../../store/useResumeStore';

const ConfigPanel = () => {
  const { resume, updateConfig } = useResumeStore();

  const performAutoFit = (targetPages) => {
    const canvas = document.querySelector('.resume-canvas');
    if (!canvas) return;

    // A4 297mm @ 96DPI ≈ 1123px
    // targetPages=1 => 目标 ~1115px
    // targetPages=2 => 目标 ~2230px
    const PAGE_HEIGHT = 1115; 
    const TARGET_HEIGHT = PAGE_HEIGHT * targetPages;
    const TOLERANCE = 15; // 容错范围
    
    // 安全边界：根据目标页数设定合理的伸缩范围
    // 比如：想缩到1页，最大只允许1.4页的内容；想撑到2页，最小得有1.3页的内容
    const MAX_HEIGHT_LIMIT = TARGET_HEIGHT + (targetPages === 1 ? 400 : 500); 
    const MIN_HEIGHT_LIMIT = TARGET_HEIGHT - (targetPages === 1 ? 500 : 800);

    const currentHeight = canvas.scrollHeight;
    
    // 1. 检查是否合理
    if (Math.abs(currentHeight - TARGET_HEIGHT) < TOLERANCE) {
      message.success(`当前已经是完美的${targetPages}页布局！`);
      return;
    }

    if (currentHeight > MAX_HEIGHT_LIMIT) {
      message.warning(`内容过多，难以压缩到 ${targetPages} 页，建议删除部分模块`);
      return;
    }

    if (currentHeight < MIN_HEIGHT_LIMIT) {
      message.warning(`内容太少，难以撑满 ${targetPages} 页，建议增加内容`);
      return;
    }

    // 2. 算法核心
    const moduleCount = resume.modules.length;
    let newMargin = resume.config.moduleMargin;
    let newLineHeight = resume.config.lineHeight;
    const diff = currentHeight - TARGET_HEIGHT;
    
    if (diff > 0) {
      // --- 压缩 (Compress) ---
      const pixelsToSaveFromMargin = diff; 
      const marginReduction = Math.ceil(pixelsToSaveFromMargin / (moduleCount || 1));
      let potentialMargin = Math.max(8, newMargin - marginReduction);
      
      if (newMargin - marginReduction < 8) {
         newMargin = 8;
         // 粗略估算：行高减少 0.15 能省出不少空间
         newLineHeight = Math.max(1.1, newLineHeight - 0.15);
      } else {
         newMargin = potentialMargin;
         newLineHeight = Math.max(1.2, newLineHeight - 0.05);
      }
      message.loading({ content: '正在压缩布局...', duration: 1 });

    } else {
      // --- 撑开 (Expand) ---
      const pixelsToFill = -diff;
      const marginIncrease = Math.floor(pixelsToFill / (moduleCount || 1));
      // 限制最大间距 45px
      let potentialMargin = Math.min(45, newMargin + marginIncrease);
      
      if (potentialMargin >= 45) {
         newMargin = 45;
         newLineHeight = Math.min(2.0, newLineHeight + 0.1);
      } else {
         newMargin = potentialMargin;
         newLineHeight = Math.min(1.8, newLineHeight + 0.05);
      }
      message.loading({ content: '正在优化排版...', duration: 1 });
    }

    // 3. 应用
    newLineHeight = Math.round(newLineHeight * 100) / 100;
    updateConfig('moduleMargin', newMargin);
    updateConfig('lineHeight', newLineHeight);
    
    setTimeout(() => {
        message.success(`已调整为${targetPages}页布局 (间距${newMargin}, 行高${newLineHeight})`);
    }, 500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>全局样式</h3>
          <Space size={4}>
            <Tooltip title="自动调整为一页">
                <Button 
                    size="small" 
                    icon={<FileTextOutlined />} 
                    onClick={() => performAutoFit(1)}
                    style={{ fontSize: '12px' }}
                >
                    智能一页
                </Button>
            </Tooltip>
            <Tooltip title="自动调整为两页">
                <Button 
                    size="small" 
                    icon={<CopyOutlined />} 
                    onClick={() => performAutoFit(2)}
                    style={{ fontSize: '12px' }}
                >
                    智能两页
                </Button>
            </Tooltip>
          </Space>
      </div>
      
      <Form layout="vertical">
        <Form.Item label="主题颜色">
          <ColorPicker 
            value={resume.config.themeColor} 
            onChange={(c) => updateConfig('themeColor', c.toHexString())}
            showText
          />
        </Form.Item>
        
        <Form.Item label="行间距">
          <Slider 
            min={1} 
            max={3} 
            step={0.1} 
            value={resume.config.lineHeight} 
            onChange={(v) => updateConfig('lineHeight', v)} 
          />
        </Form.Item>
        
        <Form.Item label="模块间距">
          <Slider 
            min={0} 
            max={50} 
            value={resume.config.moduleMargin} 
            onChange={(v) => updateConfig('moduleMargin', v)} 
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConfigPanel;
