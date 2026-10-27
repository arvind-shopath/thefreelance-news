
### 
पोर्ट 3000 & 3001**: ये shopath.in के **Next.js** (शपथ का मुख्य फ्रंटएंड और API) के लिए इस्तेमाल हो रहे हैं.. 
- पोर्ट 8055**: यह shopath.in के **Directus CMS** के लिए इस्तेमाल हो रहा है (जो Docker के ज़रिए चल रहा है)।
### **2. डेटाबेस और कैश पोर्ट्स (Database & Cache)**
- **पोर्ट 5432**: यह shopath.in  के **PostgreSQL** डेटाबेस के लिए है (यह भी Docker के ज़रिए चल रहा है)।
- **पोर्ट 6379**: यह shopath.in के **Redis** सर्वर के लिए है, जिसका इस्तेमाल डेटा कैशिंग और तेज़ परफॉरमेंस के लिए किया जाता है।

### **3. सर्वर और नेटवर्क पोर्ट्स (Server & Networking)**
- **पोर्ट 80 (HTTP) & 443 (HTTPS)**: ये shopath.in **Nginx** द्वारा इस्तेमाल किए जा रहे हैं ताकि बाहरी दुनिया आपकी वेबसाइट को एक्सेस कर सके। 
- **पोर्ट 22**: यह shopath.in **SSH** के लिए है जिससे हम सर्वर को रिमोटली मैनेज करते हैं।

### **4. इंटरनल पोर्ट्स (System/Node Processes)**
- **पोर्ट 45935, 34109, आदि**: ये shopath.in के बैकग्राउंड में चल रहे **Node.js** और लैंग्वेज सर्वर के अस्थायी पोर्ट्स हैं जो कोड को रन करने में मदद करते हैं।

**संक्षेप में:** मेरा shopath.in का मुख्य डेटा **8055 (Directus)** और **5432 (Postgres)** पर है, जबकि वेबसाइट **3000/3001 (Next.js)** पर चल रही है। 

Important Rule- नोट इसे किसी भी हाल में छूना या छेड़ना नहीं है.. 



thefreelance.in — Rules.md
________________________________________
1) Tech Stack (MANDATORY)
Frontend
•	Next.js (App Router)
•	React
•	TypeScript
•	Tailwind CSS
•	Framer Motion
Backend
•	NestJS (Node.js)
•	REST API architecture
Database
•	PostgreSQL
Cache & Queue
•	Redis
•	BullMQ (job queues)
Search
•	OpenSearch / Elasticsearch
Storage
•	AWS S3 / Cloudflare R2
Infra
•	Docker
•	Nginx
•	Cloudflare CDN
________________________________________
2) Folder Structure (Frontend)
/src
  /app
  /components
  /modules
  /services
  /hooks
  /lib
  /styles
  /types
Important Rules
•	components = reusable UI
•	modules = feature-based (article, story, homepage)
•	services = API calls
•	hooks = custom hooks
________________________________________
Backend Structure
/src
  /modules
    /articles
    /stories
    /feeds
    /categories
    /seo
  /workers
  /jobs
  /services
  /utils
________________________________________
3) Core Rule
Think → Plan → Double Check → Implement
No direct coding.
________________________________________
4) Priority Order
1.	Homepage + UX
2.	Article system
3.	Story system
4.	Automation engine
5.	SEO + Ads
6.	CMS
________________________________________
5) Code Quality Rules
•	Strict TypeScript
•	No duplicate logic
•	Reusable components
•	Clean modular code
________________________________________
6) Performance Rules
•	lazy loading images
•	prefetch routes
•	SSR/ISR usage
•	minimal JS bundle
________________________________________
7) Mobile + Desktop Rule
•	Design first: Desktop
•	Convert later: Mobile
________________________________________
8) SEO Rules (Global)
Every page must include:
•	meta title
•	meta description
•	canonical
•	schema (NewsArticle)
•	OpenGraph
________________________________________
backend_function.md
1) Full Automation Flow
RSS Fetch → Clean → Topic Extract → Research → Rewrite → Translate → Image Fetch → Categorize → SEO Optimize → Verify → Publish
Runs every 5 minutes.
________________________________________
2) RSS Feed Intake
System pulls RSS from sources.
Extract:
•	title
•	description
•	content
•	publish time
•	source
Remove:
•	links
•	branding
•	tracking
________________________________________
3) Topic Extraction
From RSS data:
•	main keywords
•	entities
•	topic category hints
Example:
iPhone 15 price cut → topic = smartphone price drop
________________________________________
4) Research Layer
System gathers supporting context:
•	previous related articles
•	background info
•	additional facts
Goal:
Make article original, not copy.
________________________________________
5) Rewrite Engine
Convert into structured Hindi news format:
Headline
Summary
Main Update
Background
Why it matters
Conclusion
Source reference
Rules:
•	natural tone
•	non-robotic
•	no direct copying
________________________________________
6) Translation Layer
Use:
•	Google Translate API / Indic engine
Then clean:
•	grammar
•	readability
•	Hindi tone
________________________________________
7) Image Engine
Flow:
keyword extraction → image search → filter → attach
Sources:
•	Google Image API
•	Bing Image API
Filters:
•	remove watermark
•	remove logos
•	high resolution only
Convert:
•	WebP
•	multiple sizes
________________________________________
8) Category Engine
Rules-based classification:
tech → iphone, google
politics → election, minister
business → market, stock
sports → cricket, match
Confidence score applied.
________________________________________
9) SEO Engine
Auto-generate:
Meta Title
Include primary keyword
Meta Description
Include summary + keyword
Slug
Hindi + keyword optimized
Keywords
Extract:
•	primary keyword
•	secondary keywords
•	trending keywords
________________________________________
10) Internal Linking
Auto attach:
•	related articles
•	same category articles
________________________________________
11) Cross Check Layer
Before publish:
Check:
•	duplicate content
•	broken text
•	missing image
•	missing category
•	SEO fields
If fail → reject or retry
________________________________________
12) Publish Engine
Auto publish:
States:
draft → verified → published
Also generate:
•	article page
•	story slides
________________________________________
13) Story Generator
From article create:
6–7 slides
Each slide:
•	headline
•	short text
•	image
________________________________________
14) Scheduling
•	every 5 min fetch
•	instant publish for breaking
________________________________________
15) Logging & Monitoring
Track:
•	feed failures
•	publish errors
•	image errors
•	duplicate detection
________________________________________
16) Final Rule
System must run fully automated with minimal human intervention.
But must always:
ensure originality + SEO + readability
________________________________________

17) वायरल वीडियो और सोशल मीडिया एम्बेड्स नियम (Viral Video & Playable Social Embeds)
• हेडलाइन नियम (Mandatory Headline Rule):
  - जिस भी खबर में सोशल मीडिया (X/Twitter, Instagram Reels, YouTube) का वीडियो मौजूद हो, उसकी हेडलाइन अनिवार्य रूप से "वीडियो: " या "[वीडियो] " से ही शुरू होगी।
  - उदाहरण: "वीडियो: पहाड़ पर बने आलीशान मकान तक पहुंचने के लिए बना दिया अपना निजी ब्रिज, लोग बोले- 'इसे कहते हैं रईसी'"
• इंटरएक्टिव वीडियो प्लेयर (Interactive Playable Embeds):
  - वीडियो को सिर्फ लिंक या स्थिर तस्वीर की तरह नहीं लगाना है।
  - ऑफिशियल प्लेटफॉर्म एम्बेड (`blockquote.twitter-tweet`, `blockquote.instagram-media`) के साथ लगाना है ताकि यूज़र सीधे आर्टिकल के अंदर ही वीडियो को प्ले कर सके।
  - फ्रंटएंड पर `SocialEmbedLoader.tsx` घटक ट्विटर (`widgets.js`) और इंस्टाग्राम (`embed.js`) को लोड और प्रोसेस करता है।
• गूगल एडसेंस व सेफ्टी पॉलिसी सुरक्षा नियम (Strict Google Policy & AdSense Safe):
  - खून-खराबा, गंभीर हिंसक घटना, क्षत-विक्षत शव, अश्लीलता, नग्नता, सांप्रदायिक नफरत या यौन हिंसा से जुड़े वीडियो को तुरंत ड्रॉप/स्किप (Skip) करना है। कोई समझौता नहीं।
• अनिवार्य डिस्क्लेमर एवं साभार नियम (Mandatory Verification Disclaimer Box):
  - हर वायरल वीडियो वाली खबर के अंत में टीएफएल का आधिकारिक वेरिफिकेशन डिस्क्लेमर बॉक्स अनिवार्य रूप से लगेगा:
    ```html
    <div class="my-8 p-5 rounded-2xl bg-[#12141c] border-l-4 border-amber-500 text-sm text-gray-300 shadow-xl">
      <div class="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        डिस्क्लेमर एवं साभार
      </div>
      <p class="leading-relaxed">सोशल मीडिया प्लेटफॉर्म पर वायरल इस वीडियो के दावों की सत्यता की 'The Freelance' स्वतंत्र रूप से पुष्टि नहीं करता है। यह वीडियो सोशल मीडिया पर व्यापक चर्चा का विषय बना हुआ है। वीडियो साभार: संबंधित सोशल मीडिया हैंडल / क्रिएटर।</p>
    </div>
    ```
• प्रमुख वायरल सोर्स हैंडल्स:
  - X: `@gharkekalesh`, `@rareindianclips`, `@cctvincidents`, `@PTI_News` (पीटीआई से केवल सिविक, दुर्घटना, अनोखी घटनाएं - STRICTLY NO POLITICAL VIDEOS)।
________________________________________

18) डायरेक्ट एआई वेब-स्क्रैपिंग नियम (Direct AI Web Scraping Without RSS)
• सिस्टम व शेड्यूल:
  - `aajtak-scraper.service.ts` हर 6 घंटे (`@Cron('0 */6 * * *')` — 00:00, 06:00, 12:00, 18:00) में सीधे AajTak ट्रेंडिंग (`https://www.aajtak.in/trending`) और होमपेज को बिना RSS के सीधे स्क्रैप करता है।
• स्मार्ट डुप्लीकेशन फिल्टर:
  - डेटाबेस में `sourceUrl` और हेडलाइन का मिलान करके पहले से मौजूद खबरों को छोड़ देता है और सिर्फ बिल्कुल नई खबरों को प्रोसेस करता है।
• कंटेंट एक्सट्रैक्शन व क्लीनिंग:
  - ओरिजिनल शीर्षक, पैराग्राफ, मुख्य फोटो (`og:image`), और वीडियो एम्बेड ब्लॉकक्वोट्स को निकालता है।
  - 'ये भी पढ़ें', ऐप डाउनलोड लिंक, ट्रैकिंग पैरामीटर्स को साफ करता है।
• एआई रीराइट इंजन (Gemini 3.6 Flash / 2.5 Flash):
  - गूगल सेफ्टी पॉलिसी जांच के बाद मौलिक हिन्दी और अंग्रेजी दोनों आर्टिकल तैयार करता है।
________________________________________

19) टुडेज टॉपिक नियम (Today's Topic & Google Trends Ingestion)
• सिस्टम व शेड्यूल:
  - `automation.service.ts` में `@Cron('0 */2 * * *')` — हर 2 घंटे में गूगल ट्रेंड्स के 4 घंटे के रियल-टाइम डेटा (`geo=IN`, `hours=4`) की जांच।
• क्लस्टरिंग नियम (4-आर्टिकल क्लस्टर):
  - भारत के #1 ट्रेंडिंग टॉपिक को चुनकर उस पर 4 अलग-अलग दृष्टिकोणों (angles) से 4 आर्टिकल्स का क्लस्टर तैयार किया जाता है।
  - इन्हें `subCategory: 'today-topic'` टैग देकर होमपेज के टॉप "टुडेज टॉपिक / Today's Topic" ब्लॉक में लीड स्टोरी बनाया जाता है।
• डायनामिक रोटेशन (No Hardcoding):
  - कोई भी एक खबर (जैसे सुशांत या दिशा) स्थायी रूप से टॉप पर नहीं रहेगी। हर 2 घंटे में जैसे ही गूगल ट्रेंड्स बदलेंगे, टुडेज टॉपिक स्वतः अपडेट होगा और पुरानी खबरें सामान्य कैटिगरी फ़ीड में नीचे चली जाएंगी।
________________________________________

20) रिसर्च व इन-डेप्थ इन्वेस्टिगेटिव स्टोरी नियम (Research & Investigative Stories)
• गहराई व संरचना:
  - न्यूनतम 800+ शब्द, विस्तृत पृष्ठभूमि, 'यह क्यों महत्वपूर्ण है', सांख्यिकी आंकड़े, और आधिकारिक बयानों के साथ इन-डेप्थ रिपोर्ट।
• तथ्यात्मक सत्यता (Zero False Implications):
  - किसी भी नेता, अधिकारी या आम नागरिक पर तब तक आरोपी या संदिग्ध का टैग नहीं लगेगा जब तक कि जांच एजेंसी या कोर्ट का आधिकारिक आदेश न हो।
  - सनसनीखेज या भ्रामक हेडलाइन पूरी तरह वर्जित हैं।
• क्विक कॉमर्स / उपभोक्ता मुद्दे:
  - क्विक कॉमर्स (Blinkit, Zepto, Instamart) पर साप्ताहिक खोजी रिपोर्ट, डिलीवरी कर्मियों की जमीनी हकीकत, और डार्क स्टोर्स की पड़ताल।
________________________________________

21) फोटो स्टोरी और एंटरटेनमेंट गैलरी नियम (Photo Stories & Entertainment Galleries)
• प्रारूप:
  - `postType: 'gallery'` — न्यूनतम 8 से 10 उच्च गुणवत्ता वाले ओरिजिनल पोस्टर्स/फोटोज़ प्रति गैलरी।
• मुख्य कैटेगरीज व थीम्स:
  1. इस हफ्ते ओटीटी (OTT) पर क्या देखें — नेटफ्लिक्स, प्राइम वीडियो, हॉटस्टार की नई रिलीज, उनके पोस्टर, कास्ट और कहानी।
  2. बॉलीवुड व साउथ अभिनेत्रियों के लेटेस्ट ग्लैमरस लुक्स, रेड कार्पेट फैशन और फोटोशूट्स।
  3. पर्यटन, हेरिटेज साइट्स, और सांस्कृतिक आयोजन।
• शेड्यूल:
  - दिन में 4 से 6 फोटो स्टोरी स्वतः या मैनुअल प्रकाशित हों।
________________________________________

22) पूर्ण द्विभाषी (Bilingual English Edition) नियम
• डेटाबेस अनिवार्यता:
  - हर पोस्ट में `headlineEn`, `summaryEn`, `contentEn`, `slugEn` सुरक्षित होना चाहिए।
• यूआई व नेविगेशन:
  - `/en` पर स्विच करने पर पूरी वेबसाइट (हेडलाइन, समरी, ब्रेडक्रम्स, साइडबार, विज्ञापन टैग, यूआई लेबल्स) पूर्णतः अंग्रेजी में ही दिखेगी।
  - दोनों भाषाओं के बीच स्विच करने के लिए "Read in English" और "यह खबर हिन्दी में पढ़ें" के बटन हमेशा कार्यरत रहेंगे।
________________________________________

23) क्विक कॉमर्स अनिवार्य दैनिक न्यूज़ नियम (Mandatory Daily Quick Commerce News Rule)
• अनिवार्य नियम (Mandatory 1 News Daily):
  - प्रतिदिन क्विक कॉमर्स (Blinkit, Zepto, Swiggy Instamart, BigBasket Now) के ईकोसिस्टम पर कम से कम **1 खोजी व विश्लेषणात्मक न्यूज़ प्रकाशित करना अनिवार्य है**।
• ऑटोमेशन शेड्यूल:
  - `quick-commerce.service.ts` द्वारा प्रतिदिन सुबह 07:30 बजे (`@Cron('30 7 * * *')`) स्वतः एक गहन खोजी रिपोर्ट जनरेट व पब्लिश होती है।
  - ज़रूरत पड़ने पर इसे `/api/v1/feeds/quick-commerce/generate` से ऑन-डिमांड भी पब्लिश किया जा सकता है।
• कैटेगरी एवं टैग्स:
  - `categoryStr: 'business'` (व्यापार) या `'special'` (स्पेशल)।
  - `subCategory: 'quick-commerce'`
  - `tags: 'क्विक कॉमर्स,Blinkit,Zepto,Instamart,ई-कॉमर्स,उपभोक्ता अधिकार,#QuickCommerce'`
• प्रमुख फोकस टॉपिक्स (Core Angles):
  1. **हिडन फीस व बिल का गणित:** प्लेटफॉर्म फीस (₹5-₹10), हैंडलिंग चार्ज (₹4-₹15), स्मॉल कार्ट सरचार्ज (₹20-₹35), और रेन/सर्ज फीस की विस्तृत पड़ताल।
  2. **श्रिंकफ्लेशन (Shrinkflation):** दाम वही लेकिन पैकेट का वजन 15% से 25% तक कम करने का खेल।
  3. **पारंपरिक किराना दुकानों का संकट:** CAIT के आंकड़े, मोहल्ले के दुकानदारों की 30% गिरती बिक्री, और FMCG कंपनियों का डार्क स्टोर्स को अनुचित फेवर।
  4. **डिलीवरी पार्टनर्स की जमीनी हकीकत:** 10 मिनट के डिलीवरी दबाव में जान जोखिम, घटता पे-आउट (₹20-₹25 प्रति ऑर्डर), और ट्रैफिक एक्सीडेंट्स का खतरा।
  5. **एक्सपायरी, बासी सामान व फूड सेफ्टी:** डार्क स्टोर्स में ब्रेड, दूध, सब्जियों की क्वालिटी और FSSAI व कंज्यूमर प्रोटेक्शन एक्ट 2019 के नियम।
• लेख का प्रारूप व आवश्यकताएं:
  - न्यूनतम 700–900 शब्द।
  - लोकल किराना बनाम क्विक कॉमर्स की वास्तविक मूल्य तुलना तालिका (Price Comparison Table)।
  - ग्राहक के लिए 'स्मार्ट गाइड' (मासिक ग्रॉसरी पर ₹3,000-₹5,000 बचाने के व्यावहारिक तरीके)।
  - हिन्दी और अंग्रेजी दोनों भाषाओं में पूर्ण रिपोर्ट।
________________________________________

24) विदेशी व अप्रासंगिक समाचार निषेध नियम (Strict India Relevance & Domestic Trend Rule)
• गूगल ट्रेंड्स (Google Trends) एवं एआई ऑटोमेशन अनिवार्यता:
  - विदेश की ऐसी कोई भी खबर, विदेशी सेलिब्रिटी, या विदेशी स्थानीय खेल (उदा. अमेरिकी बेसबॉल, पॉल स्कीन्स, निकी बेला आदि) जिसका भारत और भारतीय जनता से सीधा कोई प्रभाव या सरोकार नहीं है, उसे किसी भी हाल में ऑटोमेशन, गूगल ट्रेंड्स या टुडेज़ टॉपिक में नहीं उठाया जाएगा।
  - यदि गूगल ट्रेंड्स के RSS में कोई विदेशी या अप्रासंगिक विषय शीर्ष पर आ भी जाए, तो एआई और सिस्टम उसे तुरंत खारिज (Discard) करके भारत के राष्ट्रीय, राज्यीय, छात्र राजनीति, अर्थव्यवस्था, सुप्रीम कोर्ट या जनहित के वास्तविक ट्रेंड को ही चुनेगा।
• टुडेज़ टॉपिक (Today's Topic) नियम:
  - हर 2 घंटे में भारत के शीर्ष ट्रेंडिंग व प्रासंगिक मुद्दे की पहचान होगी।
  - पुराने मामलों (जैसे 5 दिन पुरानी सुशांत/दिशा सालियान या बासी खबरें) को टुडेज़ टॉपिक अथवा हीरो सेक्शन में कतई स्थान नहीं मिलेगा।
  - मुख्य खबर (Lead Story) के साथ 4 संबंधित या आज की ताज़ा ब्रेकिंग खबरें ही लगेंगी।
