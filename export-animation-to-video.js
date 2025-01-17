const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');

async function exportAnimationToVideo(htmlPath) {
  let browser;
  try {
    console.log('正在启动浏览器...');
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: 1280,
        height: 720,
        deviceScaleFactor: 2,
      }
    });

    console.log('正在创建新页面...');
    const page = await browser.newPage();
    
    // 监听控制台日志
    page.on('console', msg => console.log('页面日志:', msg.text()));
    page.on('pageerror', err => console.error('页面错误:', err.message));

    // 注入 PIXI.js 渲染器选择
    await page.evaluateOnNewDocument(() => {
      window.PIXI_FORCE_RENDERER = 'canvas';
    });

    // 加载本地HTML文件
    const filePath = path.join(__dirname, htmlPath);
    const fileUrl = `file://${filePath}`;
    console.log('正在加载页面:', fileUrl);
    
    await page.goto(fileUrl, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 60000
    });

    // 等待页面加载完成
    console.log('等待页面元素加载...');
    await page.waitForSelector('#canvas-container', { timeout: 60000 });

    // 配置录制选项
    const config = {
      followNewTab: true,
      fps: 60,
      ffmpeg_Path: null,
      videoFrame: {
        width: 1280 * 2,
        height: 720 * 2
      },
      aspectRatio: '16:9',
      recordDurationLimit: 70,
    };

    // 创建录制器
    const recorder = new PuppeteerScreenRecorder(page, config);
    const outputPath = path.join(__dirname, 'output', `${htmlPath.split('/').pop().split('.')[0]}.webm`);

    console.log('开始录制视频...');
    await recorder.start(outputPath);

    // 等待动画完成（这里设置为60秒，你可以根据需要调整）
    await new Promise(resolve => setTimeout(resolve, 70000));

    console.log('停止录制...');
    await recorder.stop();

    console.log(`视频已保存到: ${outputPath}`);

  } catch (error) {
    console.error('发生错误:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('正在关闭浏览器...');
      try {
        await browser.close();
      } catch (err) {
        console.error('关闭浏览器时出错:', err);
      }
    }
  }
}

// 如果从命令行传入参数
if (process.argv.length > 2) {
  const htmlPath = process.argv[2];
  exportAnimationToVideo(htmlPath).catch(console.error);
} else {
  console.error('请提供HTML文件路径作为参数');
  process.exit(1);
} 