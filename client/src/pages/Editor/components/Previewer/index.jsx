import React, { useState, useEffect, useRef } from 'react';
import useResumeStore from '../../../../store/useResumeStore';
import { TEMPLATES } from '../../../../templates';

const A4_HEIGHT_PX = 1123; // Standard A4 height in pixels (96 DPI)

const Previewer = () => {
  const { resume } = useResumeStore();
  const { config } = resume;
  const contentRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  
  // Resolve Template
  const templateKey = config.templateId || 'classic';
  const TemplateConfig = TEMPLATES[templateKey] || TEMPLATES['classic'];
  const TemplateComponent = TemplateConfig.component;

  useEffect(() => {
      if (!contentRef.current) return;
      
      const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
              const height = entry.contentRect.height;
              // Calculate pages needed based on A4 height
              const pages = Math.max(1, Math.ceil(height / A4_HEIGHT_PX));
              setPageCount(pages);
          }
      });

      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
  }, [resume]);

  return (
    <div style={{ position: 'relative', width: '210mm', margin: '0 auto' }}>
        
        {/* 1. Background Layer (Simulated Pages) */}
        <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            // Extend height to cover all pages
            height: `${pageCount * A4_HEIGHT_PX}px`, 
            zIndex: 0,
            overflow: 'hidden'
        }}>
            {Array.from({ length: pageCount }).map((_, idx) => (
                <div key={idx} style={{ 
                    position: 'absolute',
                    top: idx * A4_HEIGHT_PX,
                    left: 0,
                    width: '100%', 
                    height: `${A4_HEIGHT_PX}px`, // Exactly one A4 page
                    backgroundColor: '#fff', 
                    // Add a bottom border to simulate page gap
                    borderBottom: '2px dashed #d9d9d9',
                    boxSizing: 'border-box'
                }}>
                    {/* Visual Page Gap (Gray Strip at bottom) */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '10px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))',
                        pointerEvents: 'none'
                    }}></div>
                    
                    {/* Page Number Indicator */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        right: '-40px', 
                        transform: 'translateY(-50%)',
                        fontSize: 12, 
                        color: '#999',
                        writingMode: 'vertical-rl',
                        pointerEvents: 'none'
                    }}>
                        第 {idx + 1} 页
                    </div>
                </div>
            ))}
        </div>

        {/* 2. Content Layer */}
        <div ref={contentRef} style={{ 
            position: 'relative', 
            zIndex: 1, 
            minHeight: '297mm',
            backgroundColor: 'transparent' 
        }}>
             <TemplateComponent resume={resume} />
        </div>

    </div>
  );
};

export default Previewer;
