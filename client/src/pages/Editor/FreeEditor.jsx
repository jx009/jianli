import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { Button, Tooltip, Divider, ColorPicker } from 'antd';
import { 
    BoldOutlined, 
    ItalicOutlined, 
    UnderlineOutlined, 
    OrderedListOutlined, 
    UnorderedListOutlined,
    AlignLeftOutlined, 
    AlignCenterOutlined, 
    AlignRightOutlined,
    FontSizeOutlined
} from '@ant-design/icons';

const FreeEditor = ({ initialContent, onChange }) => {
    const text = useRef(initialContent || '');
    
    // Helper to execute commands
    const exec = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
    };

    const handleChange = (evt) => {
        text.current = evt.target.value;
        if(onChange) onChange(evt.target.value);
    };

    return (
        <div className="free-editor-container" style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            background: '#fff', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Simple Toolbar */}
            <div className="editor-toolbar" style={{ 
                padding: '10px 20px', 
                borderBottom: '1px solid #eee', 
                background: '#fafafa',
                display: 'flex',
                gap: 8,
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <Tooltip title="加粗 (Cmd+B)"><Button size="small" icon={<BoldOutlined />} onClick={() => exec('bold')} /></Tooltip>
                <Tooltip title="斜体 (Cmd+I)"><Button size="small" icon={<ItalicOutlined />} onClick={() => exec('italic')} /></Tooltip>
                <Tooltip title="下划线 (Cmd+U)"><Button size="small" icon={<UnderlineOutlined />} onClick={() => exec('underline')} /></Tooltip>
                <Divider type="vertical" />
                <Tooltip title="无序列表"><Button size="small" icon={<UnorderedListOutlined />} onClick={() => exec('insertUnorderedList')} /></Tooltip>
                <Tooltip title="有序列表"><Button size="small" icon={<OrderedListOutlined />} onClick={() => exec('insertOrderedList')} /></Tooltip>
                <Divider type="vertical" />
                <Tooltip title="居左"><Button size="small" icon={<AlignLeftOutlined />} onClick={() => exec('justifyLeft')} /></Tooltip>
                <Tooltip title="居中"><Button size="small" icon={<AlignCenterOutlined />} onClick={() => exec('justifyCenter')} /></Tooltip>
                <Tooltip title="居右"><Button size="small" icon={<AlignRightOutlined />} onClick={() => exec('justifyRight')} /></Tooltip>
                <Divider type="vertical" />
                <Tooltip title="大标题"><Button size="small" onClick={() => exec('formatBlock', 'H2')}>H2</Button></Tooltip>
                <Tooltip title="小标题"><Button size="small" onClick={() => exec('formatBlock', 'H3')}>H3</Button></Tooltip>
                <Tooltip title="正文"><Button size="small" onClick={() => exec('formatBlock', 'P')}>P</Button></Tooltip>
            </div>

            {/* Editable Area */}
            <div style={{ padding: '40px 50px', flex: 1 }}>
                <ContentEditable
                    className="editable-content"
                    html={text.current} 
                    disabled={false} 
                    onChange={handleChange} 
                    tagName="div"
                    style={{ 
                        outline: 'none', 
                        minHeight: '800px', 
                        lineHeight: 1.6, 
                        fontSize: '14px' 
                    }}
                />
            </div>
            
            <style>{`
                .editable-content h2 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 8px; margin-top: 20px; }
                .editable-content h3 { font-size: 18px; font-weight: bold; color: #24be58; margin-top: 16px; }
                .editable-content ul, .editable-content ol { margin-left: 20px; }
            `}</style>
        </div>
    );
};

export default FreeEditor;
