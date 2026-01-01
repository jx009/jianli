import puppeteer from 'puppeteer';

export const generatePDF = async (resumeId, host) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();
  
  // Navigate to the client preview URL (assuming client and server are in the same docker network or accessible)
  // In Docker, client service is named 'client'. 
  // If running locally, it's localhost:5173.
  // We can pass the full URL or construct it.
  // For Docker (production): http://client/preview/${resumeId}
  // For Local Dev: http://localhost:5173/preview/${resumeId}
  
  const targetUrl = host.includes('localhost') 
    ? `http://localhost:5173/preview/${resumeId}` 
    : `http://client/preview/${resumeId}`;

  await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  return pdfBuffer;
};
