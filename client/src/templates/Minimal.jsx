import React from 'react';

// --- Minimal Template (Simple, Clean, Centered) ---
const MinimalTemplate = ({ resume }) => {
  const { config, modules } = resume;
  const themeColor = '#000'; // Force black/grey for minimal look usually, or use config.themeColor

  const styles = {
    page: { padding: '50px 60px', color: '#111', fontFamily: config.fontFamily, lineHeight: config.lineHeight, height: '100%', boxSizing: 'border-box' },
    // Centered Header
    header: { textAlign: 'center', marginBottom: 40 },
    name: { fontSize: 36, fontWeight: 300, letterSpacing: 4, marginBottom: 10, textTransform: 'uppercase' },
    job: { fontSize: 16, color: '#666', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 },
    divider: { width: 40, height: 1, background: '#ccc', margin: '0 auto 20px' },
    contactRow: { display: 'flex', justifyContent: 'center', gap: 20, fontSize: 13, color: '#555' },
    
    // Body
    section: { marginBottom: config.moduleMargin },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#000', 
        marginBottom: 16, 
        textTransform: 'uppercase', 
        letterSpacing: 1,
        textAlign: 'center'
    },
    
    // Items
    listItem: { marginBottom: 16 },
    itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: 'bold' },
    itemDate: { fontSize: 13, color: '#666', fontStyle: 'italic' },
    itemSubtitle: { fontSize: 14, color: '#444', fontStyle: 'italic', marginBottom: 4 },
    itemDesc: { fontSize: 13.5, color: '#333', textAlign: 'justify' }
  };

  const renderBaseInfo = (data) => (
      <div style={styles.header}>
          <div style={styles.name}>{data.name}</div>
          <div style={styles.job}>{data.job}</div>
          <div style={styles.divider}></div>
          <div style={styles.contactRow}>
              {data.mobile && <span>{data.mobile}</span>}
              {data.email && <span>{data.email}</span>}
              {data.city && <span>{data.city}</span>}
          </div>
      </div>
  );

  return (
    <div style={styles.page}>
        {modules.map(module => (
            <div key={module.id} style={styles.section}>
                {module.type === 'baseInfo' ? renderBaseInfo(module.data) : (
                    <>
                        <div style={styles.sectionTitle}>{module.title}</div>
                        {module.type === 'list' && module.data.map(item => (
                            <div key={item.id} style={styles.listItem}>
                                <div style={styles.itemRow}>
                                    <span style={styles.itemTitle}>{item.title}</span>
                                    <span style={styles.itemDate}>{item.date}</span>
                                </div>
                                {item.subtitle && <div style={styles.itemSubtitle}>{item.subtitle}</div>}
                                <div style={styles.itemDesc}>{item.desc}</div>
                            </div>
                        ))}
                         {module.type === 'text' && (
                            <div style={styles.itemDesc}>{module.data.content}</div>
                        )}
                    </>
                )}
            </div>
        ))}
    </div>
  );
};

export default MinimalTemplate;
