import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent) => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // 防止内存不足崩溃
      '--font-render-hinting=none' // 优化字体渲染
    ],
    headless: 'new'
  });

  try {
    const page = await browser.newPage();
    
    // 设置视口大小，虽然打印是A4，但视口影响媒体查询解析
    await page.setViewport({ width: 1200, height: 1600 });

    // 直接注入 HTML 内容
    // waitUntil: 'networkidle0' 确保所有外部图片/字体加载完毕
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // 额外等待一下字体加载完成 (document.fonts.ready)
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true, // 尊重 CSS 中的 @page 设置
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    return pdfBuffer;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};
