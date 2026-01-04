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
        '--theme-color': resume.config.themeColor,
        // --- 分页参考线核心逻辑 ---
        // 使用线性渐变绘制虚线：透明 -> 红色警戒线 -> 透明
        // 1122px 处开始绘制 1px 宽的线
        backgroundImage: 'linear-gradient(to bottom, transparent 1122px, #ff4d4f 1122px, #ff4d4f 1123px, transparent 1123px)',
        // 让背景每 1123px (A4高度) 重复一次
        backgroundSize: '100% 1123px', 
        position: 'relative'
    }}>
      {/* 提示语：仅在第一页底部显示一次，告知用户含义 */}
      <div style={{
          position: 'absolute', 
          top: '1110px', 
          right: '10px', 
          fontSize: '12px', 
          color: '#ff4d4f', 
          opacity: 0.6,
          pointerEvents: 'none'
      }}>
        --- 分页位置 (导出时将被裁切) ---
      </div>

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
