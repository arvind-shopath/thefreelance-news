# The Freelance (TFL) — Supabase Setup Guide ($0 Free Tier)

इस गाइड की मदद से आप सिर्फ 2 मिनट में अपने मुफ़्त Supabase प्रोजेक्ट पर The Freelance का पूरा डेटाबेस लाइव कर सकते हैं।

---

### Step 1: Create a Free Supabase Project
1. [Supabase](https://supabase.com/) पर जाएं और लॉगिन करें (मुफ़्त एकाउंट)।
2. **"New Project"** पर क्लिक करें:
   - **Name:** `thefreelance`
   - **Database Password:** एक मजबूत पासवर्ड दर्ज करें और सुरक्षित रख लें।
   - **Region:** `South Asia (Mumbai)` या नज़दीकी क्षेत्र चुनें।
   - **Pricing Plan:** Free Tier (मुफ़्त)।
3. प्रोजेक्ट बनने के लिए 1 मिनट प्रतीक्षा करें।

---

### Step 2: Run SQL Schema & Seed
1. Supabase डैशबोर्ड में बायीं ओर **"SQL Editor"** आइकन पर क्लिक करें।
2. **"New query"** पर क्लिक करें।
3. `database/schema.sql` की पूरी सामग्री को कॉपी करके यहाँ पेस्ट करें और **"Run"** दबाएँ।
4. इसके बाद `database/seed.sql` की पूरी सामग्री को कॉपी करके पेस्ट करें और **"Run"** दबाएँ।
5. आपके सभी 10 टेबल्स, इंडेक्स और RLS सुरक्षा नीतियां सेकंडों में सक्रिय हो जाएँगी!

---

### Step 3: Get API Keys
Supabase डैशबोर्ड में बायीं ओर **Settings (Cog icon)** -> **API** पर जाएं:
- **Project URL:** `https://your-project-id.supabase.co`
- **anon public key:** `eyJh...` (फ़्रंटएंड के लिए)
- **service_role secret key:** `eyJh...` (AI ऑटोमेशन इंजन और GitHub Actions के लिए)

इन कीज़ को सुरक्षित रखें। आगे फ़्रंटएंड और GitHub Actions में इनका उपयोग होगा।
