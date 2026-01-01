import React from 'react';
import { Form, Input, Slider, ColorPicker } from 'antd';
import useResumeStore from '../../store/useResumeStore';

const ConfigPanel = () => {
  const { resume, updateConfig } = useResumeStore();

  return (
    <div>
      <h3>全局样式</h3>
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
