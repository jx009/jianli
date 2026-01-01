import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { TEMPLATES } from '../../../../templates';

const Previewer = () => {
  const { resume } = useResumeStore();
  const { config } = resume;
  
  // Resolve Template
  const templateKey = config.templateId || 'classic';
  const TemplateConfig = TEMPLATES[templateKey] || TEMPLATES['classic'];
  const TemplateComponent = TemplateConfig.component;

  return (
    <div style={{ height: '100%', backgroundColor: '#fff' }}>
        <TemplateComponent resume={resume} />
    </div>
  );
};

export default Previewer;