import React from 'react';
import { 
  PhoneFilled, 
  MailFilled, 
  EnvironmentFilled, 
  UserOutlined 
} from '@ant-design/icons';

// --- Modern Header Template ---
// Feature: Top colored header banner, single column body
const ModernHeader = ({ resume }) => {
  const { config, modules } = resume;
  const themeColor = config.themeColor || '#24be58';

  const styles = {
    page: { 
        height: '100%', 
        fontFamily: config.fontFamily,
        lineHeight: config.lineHeight,
        fontSize: '13.5px',
        color: '#333',
        backgroundColor: '#fff'
    },
    // Top Banner
    header: {
        backgroundColor: themeColor,
        color: '#fff',
        padding: '35px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25
    },
    headerInfo: { flex: 1 },
    name: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 6, letterSpacing: 1.5 },
    job: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 15, fontWeight: 500 },
    
    // Contact Info in Header
    contactRow: { display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: 13, color: '#fff' },
    contactItem: { display: 'flex', alignItems: 'center', gap: 6, opacity: 0.95 },
    
    avatar: { 
        width: 110, 
        height: 110, 
        objectFit: 'cover', 
        borderRadius: '50%', 
        border: '3px solid rgba(255,255,255,0.4)',
        marginLeft: 20,
        backgroundColor: '#fff'
    },

    // Main Content
    body: { padding: '0 40px 40px' },
    section: { marginBottom: config.moduleMargin },
    
    // Section Title (Modern Style)
    sectionTitleWrapper: { 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 14,
        borderBottom: `1px solid #eee`,
        paddingBottom: 8
    },
    sectionTitleIcon: {
        backgroundColor: themeColor,
        color: '#fff',
        width: 24,
        height: 24,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        fontSize: 14,
        fontWeight: 'bold'
    },
    sectionTitleText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333'
    },

    // List Items
    listItem: { marginBottom: 14 },
    itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#222' },
    itemDate: { fontSize: 13, color: '#666', fontFamily: 'Arial' },
    itemSubtitle: { fontSize: 14, fontWeight: 500, color: themeColor, marginBottom: 4 }, // Subtitle uses theme color
    itemDesc: { fontSize: 13.5, color: '#555', whiteSpace: 'pre-line', textAlign: 'justify', lineHeight: 1.6 }
  };

  const renderBaseInfo = (data) => (
      <div style={styles.header}>
          <div style={styles.headerInfo}>
              <div style={styles.name}>{data.name || '您的姓名'}</div>
              <div style={styles.job}>{data.job || '求职意向'}</div>
              <div style={styles.contactRow}>
                  {data.mobile && <div style={styles.contactItem}><PhoneFilled /> {data.mobile}</div>}
                  {data.email && <div style={styles.contactItem}><MailFilled /> {data.email}</div>}
                  {data.city && <div style={styles.contactItem}><EnvironmentFilled /> {data.city}</div>}
                  {data.age && <div style={styles.contactItem}><UserOutlined /> {data.age}</div>}
              </div>
          </div>
          {data.avatar && <img src={data.avatar} alt="Avatar" style={styles.avatar} />}
      </div>
  );

  const renderSection = (module) => (
      <div style={styles.section}>
          <div style={styles.sectionTitleWrapper}>
             <div style={styles.sectionTitleIcon}>{module.title.charAt(0)}</div>
             <span style={styles.sectionTitleText}>{module.title}</span>
          </div>
          
          {module.type === 'list' && module.data.map((item) => (
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
  );

  return (
    <div style={styles.page}>
        {/* Render BaseInfo First (Fixed at top) */}
        {(modules || []).filter(m => m.type === 'baseInfo').map(m => (
            <React.Fragment key={m.id}>{renderBaseInfo(m.data)}</React.Fragment>
        ))}

        {/* Render Other Modules */}
        <div style={styles.body}>
            {(modules || []).filter(m => m.type !== 'baseInfo').map(m => (
                <React.Fragment key={m.id}>{renderSection(m)}</React.Fragment>
            ))}
        </div>
    </div>
  );
};

export default ModernHeader;
