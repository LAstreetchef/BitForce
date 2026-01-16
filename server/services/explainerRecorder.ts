import puppeteer from 'puppeteer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'attached_assets', 'generated_videos');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'explainer_frames');
const OUTPUT_FILE = 'bitforce_explainer_presentation.mp4';

const TOTAL_DURATION = 78;
const FPS = 10;
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

export function getExplainerVideoPath(): string | null {
  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  return fs.existsSync(outputPath) ? outputPath : null;
}

export async function recordExplainerVideo(baseUrl: string): Promise<string> {
  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  
  if (fs.existsSync(outputPath)) {
    console.log('[ExplainerRecorder] Video already exists, returning cached version');
    return outputPath;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  console.log('[ExplainerRecorder] Starting browser recording...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });
    
    const explainerUrl = `${baseUrl}/explainer?recording=true`;
    console.log(`[ExplainerRecorder] Navigating to ${explainerUrl}`);
    
    await page.goto(explainerUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    
    await page.waitForFunction(
      () => document.querySelector('.bg-gradient-to-br') !== null,
      { timeout: 10000 }
    );
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('[ExplainerRecorder] Starting frame capture...');
    
    const totalFrames = TOTAL_DURATION * FPS;
    const frameInterval = 1000 / FPS;
    
    for (let i = 0; i < totalFrames; i++) {
      const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(6, '0')}.png`);
      await page.screenshot({ path: framePath, type: 'png' });
      
      if (i % (FPS * 5) === 0) {
        console.log(`[ExplainerRecorder] Captured frame ${i}/${totalFrames} (${Math.round(i/totalFrames*100)}%)`);
      }
      
      await new Promise(resolve => setTimeout(resolve, frameInterval));
    }
    
    console.log('[ExplainerRecorder] Frame capture complete, encoding video...');
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(path.join(FRAMES_DIR, 'frame_%06d.png'))
        .inputFPS(FPS)
        .outputOptions([
          '-c:v libx264',
          '-preset medium',
          '-crf 23',
          '-pix_fmt yuv420p',
          '-movflags +faststart'
        ])
        .output(outputPath)
        .on('start', () => console.log('[ExplainerRecorder] FFmpeg encoding started...'))
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`[ExplainerRecorder] Encoding: ${Math.round(progress.percent)}%`);
          }
        })
        .on('end', () => {
          console.log('[ExplainerRecorder] Video encoding complete!');
          resolve();
        })
        .on('error', (err) => {
          console.error('[ExplainerRecorder] FFmpeg error:', err.message);
          reject(err);
        })
        .run();
    });
    
    console.log('[ExplainerRecorder] Cleaning up frames...');
    const frames = fs.readdirSync(FRAMES_DIR);
    for (const frame of frames) {
      fs.unlinkSync(path.join(FRAMES_DIR, frame));
    }
    fs.rmdirSync(FRAMES_DIR);
    
    console.log(`[ExplainerRecorder] Video saved to ${outputPath}`);
    return outputPath;
    
  } finally {
    await browser.close();
  }
}

export async function deleteExplainerVideo(): Promise<boolean> {
  const videoPath = getExplainerVideoPath();
  if (videoPath && fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
    return true;
  }
  return false;
}
