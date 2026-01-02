import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import ModuleRenderer from './components/ModuleRenderer';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Canvas = () => {
  const { resume, reorderModules } = useResumeStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = resume.modules.findIndex((item) => item.id === active.id);
      const newIndex = resume.modules.findIndex((item) => item.id === over.id);
      reorderModules(arrayMove(resume.modules, oldIndex, newIndex));
    }
  };

  return (
    <div className="resume-canvas" style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        background: '#fff', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '30px 40px',
        color: '#333',
        fontFamily: resume.config.fontFamily,
        lineHeight: resume.config.lineHeight,
        '--theme-color': resume.config.themeColor
    }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={resume.modules || []} strategy={verticalListSortingStrategy}>
          {(resume.modules || []).map((module) => (
            <ModuleRenderer key={module.id} module={module} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Canvas;
