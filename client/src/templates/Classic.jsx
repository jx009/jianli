import React from 'react';
import { 
  PhoneFilled, 
  MailFilled, 
  EnvironmentFilled, 
  UserOutlined 
} from '@ant-design/icons';

// --- Classic Template (The original one) ---
const ClassicTemplate = ({ resume }) => {
  const { config, modules } = resume;
  const themeColor = config.themeColor || '#24be58';
  
  // Reuse existing styles logic
  const styles = {
    // ... (Keep the styles from the previous Previewer)
    page: { padding: '40px 40px', color: '#333', fontFamily: config.fontFamily, lineHeight: config.lineHeight, fontSize: '14px', height: '100%', boxSizing: 'border-box' },
    headerContainer: { marginBottom: 30, borderBottom: `2px solid ${themeColor}`, paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 4, letterSpacing: 1 },
    job: { fontSize: 18, color: themeColor, fontWeight: 500, marginBottom: 12 },
    contactRow: { display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: 13, color: '#555', marginTop: 8 },
    contactItem: { display: 'flex', alignItems: 'center', gap: 6 },
    avatar: { width: 100, height: 125, objectFit: 'cover', borderRadius: 4, marginLeft: 24, border: '1px solid #eee', backgroundColor: '#f5f5f5' },
    section: { marginBottom: config.moduleMargin },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: themeColor, borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 12, display: 'flex', alignItems: 'center', textTransform: 'uppercase' },
    listItem: { marginBottom: 12 },
    itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    itemDate: { fontSize: 13, color: '#888', fontWeight: 'normal' },
    itemSubtitle: { fontSize: 14, fontWeight: 500, color: '#444', marginBottom: 4 },
    itemDesc: { fontSize: 13.5, color: '#555', whiteSpace: 'pre-line', textAlign: 'justify' },
    textContent: { fontSize: 13.5, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.8 }
  };

  // Helper renders (Same as before)
  const renderBaseInfo = (data) => (
      <div style={styles.headerContainer}>
          <div style={{flex:1}}>
              <div style={styles.name}>{data.name || '您的姓名'}</div>
              <div style={styles.job}>{data.job || '求职意向'}</div>
              <div style={styles.contactRow}>
                  {data.mobile && <div style={styles.contactItem}><PhoneFilled style={{color: themeColor}}/> {data.mobile}</div>}
                  {data.email && <div style={styles.contactItem}><MailFilled style={{color: themeColor}}/> {data.email}</div>}
                  {data.city && <div style={styles.contactItem}><EnvironmentFilled style={{color: themeColor}}/> {data.city}</div>}
                  {data.age && <div style={styles.contactItem}><UserOutlined style={{color: themeColor}}/> {data.age}</div>}
              </div>
          </div>
          {data.avatar && <img src={data.avatar} alt="Avatar" style={styles.avatar} />}
      </div>
  );

  const renderList = (module) => (
      <div style={styles.section}>
          <div style={styles.sectionTitle}>
             <span style={{ display: 'inline-block', width: 4, height: 16, background: themeColor, marginRight: 8 }}></span>
             {module.title}
          </div>
          {module.data.map((item) => (
              <div key={item.id} style={styles.listItem}>
                  <div style={styles.itemHeader}>
                      <div style={styles.itemTitle}>{item.title}</div>
                      <div style={styles.itemDate}>{item.date}</div>
                  </div>
                  {item.subtitle && <div style={styles.itemSubtitle}>{item.subtitle}</div>}
                  {item.desc && <div style={styles.itemDesc}>{item.desc}</div>}
              </div>
          ))}
      </div>
  );

  const renderText = (module) => (
      <div style={styles.section}>
          <div style={styles.sectionTitle}>
              <span style={{ display: 'inline-block', width: 4, height: 16, background: themeColor, marginRight: 8 }}></span>
              {module.title}
          </div>
          <div style={styles.textContent}>{module.data.content}</div>
      </div>
  );

  return (
    <div style={styles.page}>
        {modules.map(module => (
            <React.Fragment key={module.id}>
                {module.type === 'baseInfo' && renderBaseInfo(module.data)}
                {module.type === 'list' && renderList(module)}
                {module.type === 'text' && renderText(module)}
            </React.Fragment>
        ))}
    </div>
  );
};

export default ClassicTemplate;
