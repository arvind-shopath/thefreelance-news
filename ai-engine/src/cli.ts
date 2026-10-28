import { runHindiTrendsPipeline } from './pipelines/trends-hindi.js';
import { runInternationalTrendsPipeline } from './pipelines/trends-international.js';
import { runVisualStoriesPipeline } from './pipelines/visual-stories.js';
import { runHoroscopePipeline } from './pipelines/horoscope.js';
import { runViralVideosPipeline } from './pipelines/viral-videos.js';

async function main() {
  const command = process.argv[2] || 'all';

  console.log(`\n======================================================`);
  console.log(`  The FreeLance (TFL) - AI Automation Engine CLI`);
  console.log(`  Command: ${command}`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  try {
    switch (command) {
      case 'trends-hindi':
      case 'trends-hi':
        await runHindiTrendsPipeline();
        break;

      case 'trends-en':
      case 'trends-intl':
        await runInternationalTrendsPipeline();
        break;

      case 'visual-stories':
      case 'stories':
        await runVisualStoriesPipeline();
        break;

      case 'horoscope':
      case 'rashifal':
        await runHoroscopePipeline();
        break;

      case 'viral-videos':
      case 'viral':
      case 'videos':
        await runViralVideosPipeline();
        break;

      case 'all':
        console.log('--- Running All Active AI Pipelines ---');
        await runHindiTrendsPipeline();
        await runInternationalTrendsPipeline();
        await runViralVideosPipeline();
        await runHoroscopePipeline();
        break;

      default:
        console.error(`Unknown command: "${command}"`);
        console.log(`Available commands: trends-hindi, trends-en, visual-stories, viral-videos, horoscope, all`);
        process.exit(1);
    }

    console.log(`\n✨ Task "${command}" completed successfully.`);
    process.exit(0);
  } catch (error: any) {
    console.error(`\n❌ Pipeline Error: ${error.message}`);
    process.exit(1);
  }
}

main();
