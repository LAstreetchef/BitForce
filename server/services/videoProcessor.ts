import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const ASSETS_DIR = path.join(process.cwd(), 'attached_assets', 'generated_videos');

const VIDEO_FILES = [
  'neighborhood_lemonade_stand_scene.mp4',
  'shiny_reward_tokens_appearing_magically.mp4',
  'tokens_growing_bigger_and_multiplying.mp4',
  'celebration_with_valuable_coin_treasure.mp4'
];

const SUBTITLES_FILE = 'explainer_captions.srt';
const MUSIC_FILE = 'epic_background.mp3';
const OUTPUT_FILE = 'bft_explainer_complete.mp4';

export async function combineExplainerVideos(): Promise<string> {
  const outputPath = path.join(ASSETS_DIR, OUTPUT_FILE);
  const tempConcatPath = path.join(ASSETS_DIR, 'temp_concat.mp4');
  const subtitlesPath = path.join(ASSETS_DIR, SUBTITLES_FILE);
  const musicPath = path.join(ASSETS_DIR, MUSIC_FILE);
  const videoListPath = path.join(ASSETS_DIR, 'videos.txt');

  if (fs.existsSync(outputPath)) {
    console.log('[VideoProcessor] Combined video already exists');
    return outputPath;
  }

  for (const video of VIDEO_FILES) {
    const videoPath = path.join(ASSETS_DIR, video);
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Missing video file: ${video}`);
    }
  }

  console.log('[VideoProcessor] Starting video combination...');

  const videoListContent = VIDEO_FILES.map(v => `file '${path.join(ASSETS_DIR, v)}'`).join('\n');
  fs.writeFileSync(videoListPath, videoListContent);

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoListPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental'])
      .output(tempConcatPath)
      .on('start', (cmd) => console.log('[VideoProcessor] Concatenating videos...'))
      .on('end', () => {
        console.log('[VideoProcessor] Videos concatenated');
        resolve();
      })
      .on('error', (err) => {
        console.error('[VideoProcessor] Concat error:', err.message);
        reject(err);
      })
      .run();
  });

  await new Promise<void>((resolve, reject) => {
    let command = ffmpeg()
      .input(tempConcatPath)
      .input(musicPath);

    if (fs.existsSync(subtitlesPath)) {
      command = command.videoFilters(`subtitles=${subtitlesPath}:force_style='FontSize=20,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=3,Outline=2'`);
    }

    command
      .outputOptions([
        '-map', '0:v',
        '-map', '1:a',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-shortest',
        '-preset', 'fast'
      ])
      .output(outputPath)
      .on('start', (cmd) => console.log('[VideoProcessor] Adding captions and music...'))
      .on('end', () => {
        console.log('[VideoProcessor] Video processing complete!');
        if (fs.existsSync(tempConcatPath)) fs.unlinkSync(tempConcatPath);
        if (fs.existsSync(videoListPath)) fs.unlinkSync(videoListPath);
        resolve();
      })
      .on('error', (err) => {
        console.error('[VideoProcessor] Final processing error:', err.message);
        if (fs.existsSync(tempConcatPath)) fs.unlinkSync(tempConcatPath);
        if (fs.existsSync(videoListPath)) fs.unlinkSync(videoListPath);
        reject(err);
      })
      .run();
  });

  return outputPath;
}

export function getCombinedVideoPath(): string | null {
  const outputPath = path.join(ASSETS_DIR, OUTPUT_FILE);
  return fs.existsSync(outputPath) ? outputPath : null;
}

export function deleteCombinedVideo(): boolean {
  const outputPath = path.join(ASSETS_DIR, OUTPUT_FILE);
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    return true;
  }
  return false;
}
