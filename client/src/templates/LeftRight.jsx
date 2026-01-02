import React from 'react';
import { 
  PhoneFilled, 
  MailFilled, 
  EnvironmentFilled, 
  UserOutlined 
} from '@ant-design/icons';

// --- LeftRight Template (Modern) ---
// Left side: Dark background, BaseInfo + Contact
// Right side: Main content
const LeftRightTemplate = ({ resume }) => {
  const { config, modules } = resume;
  const themeColor = config.themeColor || '#2c3e50'; // Default dark blue for this template if not set

  const styles = {
    page: { 
        display: 'flex', 
        height: '100%', 
        fontFamily: config.fontFamily,
        lineHeight: config.lineHeight,
        fontSize: '13.5px',
        color: '#333'
    },
    // Left Sidebar
    sidebar: {
        width: '30%',
        backgroundColor: themeColor, // Use theme color as background
        color: '#fff',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    // Right Content
    main: {
        width: '70%',
        padding: '40px 30px',
        backgroundColor: '#fff'
    },
    // Elements
    avatar: { width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', marginBottom: 20 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8, letterSpacing: 1 },
    job: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 30, fontWeight: 500 },
    
    // Sidebar Contact
    contactBlock: { width: '100%', textAlign: 'left', marginTop: 20 },
    contactItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'rgba(255,255,255,0.9)', fontSize: 13 },
    
    // Main Section
    section: { marginBottom: config.moduleMargin },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: themeColor, 
        borderBottom: `2px solid ${themeColor}`, 
        paddingBottom: 8, 
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    listItem: { marginBottom: 16 },
    itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#222' },
    itemDate: { fontSize: 13, color: '#666', fontWeight: 500 },
    itemSubtitle: { fontSize: 14, fontWeight: 600, color: '#444', marginBottom: 4 },
    itemDesc: { fontSize: 13.5, color: '#555', whiteSpace: 'pre-line', textAlign: 'justify' },
  };

  const safeModules = modules || [];
  const baseInfoModule = safeModules.find(m => m.type === 'baseInfo');
  const otherModules = safeModules.filter(m => m.type !== 'baseInfo');

  return (
    <div style={styles.page}>
        {/* Left Column */}
        <div style={styles.sidebar}>
            {baseInfoModule && (
                <>
                    {baseInfoModule.data.avatar && <img src={baseInfoModule.data.avatar} alt="avatar" style={styles.avatar} />}
                    <div style={styles.name}>{baseInfoModule.data.name}</div>
                    <div style={styles.job}>{baseInfoModule.data.job}</div>
                    
                    <div style={styles.contactBlock}>
                        {baseInfoModule.data.mobile && <div style={styles.contactItem}><PhoneFilled /> {baseInfoModule.data.mobile}</div>}
                        {baseInfoModule.data.email && <div style={styles.contactItem}><MailFilled /> {baseInfoModule.data.email}</div>}
                        {baseInfoModule.data.city && <div style={styles.contactItem}><EnvironmentFilled /> {baseInfoModule.data.city}</div>}
                        {baseInfoModule.data.age && <div style={styles.contactItem}><UserOutlined /> {baseInfoModule.data.age}</div>}
                    </div>
                </>
            )}
        </div>

        {/* Right Column */}
        <div style={styles.main}>
            {otherModules.map(module => (
                <div key={module.id} style={styles.section}>
                    <div style={styles.sectionTitle}>{module.title}</div>
                    
                    {module.type === 'list' && module.data.map(item => (
                        <div key={item.id} style={styles.listItem}>
                             <div style={styles.itemHeader}>
                                <div style={styles.itemTitle}>{item.title}</div>
                                <div style={styles.itemDate}>{item.date}</div>
                            </div>
                            {item.subtitle && <div style={styles.itemSubtitle}>{item.subtitle}</div>}
                            {item.desc && <div style={styles.itemDesc}>{item.desc}</div>}
                        </div>
                    ))}

                    {module.type === 'text' && (
                        <div style={styles.itemDesc}>{module.data.content}</div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default LeftRightTemplate;
