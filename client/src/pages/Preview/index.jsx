import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ModuleRenderer from '../Editor/components/ModuleRenderer';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

// Read-only version of Canvas
const Preview = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get(`/api/resumes/${id}`).then(res => {
        setResume(res.data.content);
    });
  }, [id]);

  if (!resume) return <div>Loading...</div>;

  return (
    <div style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        margin: '0 auto', 
        padding: '30px 40px',
        background: '#fff',
        fontFamily: resume.config.fontFamily,
        lineHeight: resume.config.lineHeight,
        color: '#333'
    }}>
      {/* We reuse ModuleRenderer but dragging is disabled naturally if we don't wrap it in a DndContext with sensors active, 
          but ModuleRenderer uses useSortable which expects a context. 
          For preview, we might just map them as static divs if ModuleRenderer is tightly coupled to Dnd.
          However, ModuleRenderer wraps content in 'ref'. Let's see. 
          Actually, dragging logic is inside ModuleRenderer's hook. 
          To be safe, we wrap it in a Context but disable sensors.
      */}
      {resume.modules.map(module => (
          <div key={module.id} style={{ marginBottom: resume.config.moduleMargin }}>
             {/* We need a ReadOnly Module Renderer ideally, or just strip the drag handles */}
             <ReadOnlyModuleRenderer module={module} themeColor={resume.config.themeColor} />
          </div>
      ))}
    </div>
  );
};

const ReadOnlyModuleRenderer = ({ module, themeColor }) => {
    // Simplified renderer without hooks
    const renderContent = () => {
        switch (module.type) {
          case 'baseInfo':
            return (
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 24, margin: 0 }}>{module.data.name}</h1>
                    <div style={{ marginTop: 10 }}>
                        <span style={{ marginRight: 15 }}>{module.data.mobile}</span>
                        <span style={{ marginRight: 15 }}>{module.data.email}</span>
                        <span>{module.data.city}</span>
                    </div>
                  </div>
                  {/* Photo placeholder */}
                </div>
            );
          case 'list':
            return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, borderBottom: `2px solid ${themeColor}`, paddingBottom: 5 }}>
                    <h3 style={{ margin: 0, color: themeColor }}>{module.title}</h3>
                  </div>
                  {module.data.map((item, index) => (
                    <div key={index} style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>{item.title}</span>
                            <span>{item.date}</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#666' }}>{item.subtitle}</div>
                        <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
            );
          default:
            return null;
        }
    };
    return renderContent();
};

export default Preview;
