const puppeteer = require('puppeteer');
const path = require('path');

async function exportHtmlToImage(htmlPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // 设置统一的视口大小
    await page.setViewport({
        width: 600,
        height: 800,
        deviceScaleFactor: 2  // 2倍分辨率以确保清晰度
    });

    const filePath = path.join(__dirname, htmlPath);
    const fileUrl = `file://${filePath}`;
    
    try {
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        // 使用HTML文件名作为输出文件名
        const fileName = path.basename(htmlPath, '.html');
        const outputPath = path.join(__dirname, 'output', `${fileName}.jpg`);
        
        await page.screenshot({
            path: outputPath,
            type: 'jpeg',
            quality: 100  // 最高质量
        });

        console.log(`Successfully exported ${fileName} to ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${htmlPath}:`, error);
    }

    await browser.close();
}

// 如果从命令行传入参数
if (process.argv.length > 2) {
    const htmlPath = process.argv[2];
    exportHtmlToImage(htmlPath).catch(console.error);
} else {
    console.error('Please provide the HTML file path as an argument');
    process.exit(1);
} 