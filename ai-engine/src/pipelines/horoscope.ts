import { getSupabase } from '../db/supabase.js';
import { gemini } from '../services/gemini.service.js';

const ZODIAC_SIGNS = [
  { sign: 'aries', nameHi: 'मेष' },
  { sign: 'taurus', nameHi: 'वृषभ' },
  { sign: 'gemini', nameHi: 'मिथुन' },
  { sign: 'cancer', nameHi: 'कर्क' },
  { sign: 'leo', nameHi: 'सिंह' },
  { sign: 'virgo', nameHi: 'कन्या' },
  { sign: 'libra', nameHi: 'तुला' },
  { sign: 'scorpio', nameHi: 'वृश्चिक' },
  { sign: 'sagittarius', nameHi: 'धनु' },
  { sign: 'capricorn', nameHi: 'मकर' },
  { sign: 'aquarius', nameHi: 'कुंभ' },
  { sign: 'pisces', nameHi: 'मीन' },
];

export async function runHoroscopePipeline() {
  console.log('\n🔮 [Horoscope Pipeline] Checking Daily Rashifal for 12 Zodiac Signs...');
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];

  // Check if today's horoscopes already exist
  const { data: existing } = await supabase
    .from('Horoscope')
    .select('sign')
    .eq('date', today);

  const existingSigns = new Set((existing || []).map(e => e.sign));
  if (existingSigns.size >= 12) {
    console.log(`✅ Horoscopes for today (${today}) are already present (12/12). Skipping.`);
    return { success: true, count: 0 };
  }

  const prompt = `
आज दिनांक ${today} के लिए सभी 12 राशियों का दैनिक राशिफल (Horoscope in Hindi) तैयार करें।
प्रत्येक राशि के लिए 2-3 वाक्यों में करियर, स्वास्थ्य और पारिवारिक जीवन पर सकारात्मक व प्रेरणादायक भविष्यवाणी लिखें।

आउटपुट केवल वैध JSON एरे के रूप में दें:
[
  { "sign": "aries", "prediction": "मेष राशि का राशिफल..." },
  { "sign": "taurus", "prediction": "वृषभ राशि का राशिफल..." },
  ...
]
`;

  try {
    const list = await gemini.generateJson<Array<{ sign: string; prediction: string }>>(prompt);
    let inserted = 0;

    for (const item of list) {
      if (!existingSigns.has(item.sign)) {
        const { error } = await supabase.from('Horoscope').upsert({
          sign: item.sign,
          prediction: item.prediction,
          date: today,
        });
        if (!error) inserted++;
      }
    }

    console.log(`✅ [Horoscope Pipeline Complete] Inserted ${inserted} zodiac predictions for ${today}.\n`);
    return { success: true, count: inserted };
  } catch (err: any) {
    console.error(`❌ Horoscope generation error: ${err.message}`);
    return { success: false, error: err.message };
  }
}
