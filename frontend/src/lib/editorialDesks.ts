export interface EditorialDesk {
  slug: string;
  nameHi: string;
  nameEn: string;
  roleHi: string;
  roleEn: string;
  descHi: string;
  descEn: string;
  email: string;
  badge: string;
}

export const EDITORIAL_DESKS: Record<string, EditorialDesk> = {
  national: {
    slug: 'national-desk',
    nameHi: 'नेशनल डेस्क, द फ्रीलांस',
    nameEn: 'National Desk, The Freelance',
    roleHi: 'राजनीतिक, नीतिगत एवं राष्ट्रीय सरोकार रिपोर्टिंग टीम',
    roleEn: 'Politics, Governance & Public Interest Reporting Team',
    descHi: 'द फ्रीलांस की राष्ट्रीय संपादकीय डेस्क देश की राजनीति, संसद, नीतिगत फैसलों, केंद्रीय योजनाओं और जनसरोकार से जुड़े बड़े मुद्दों पर 24/7 निष्पक्ष, तथ्यपरक और खोजी रिपोर्टिंग करती है। यह टीम दोहरे तथ्य-सत्यापन के कठोर सिद्धांतों का पालन करती है।',
    descEn: 'The Freelance National Desk provides round-the-clock, verified, and in-depth analytical reporting on Indian politics, governance, policy decisions, parliamentary affairs, and public interest matters.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'राष्ट्रीय संपादकीय ब्यूरो'
  },
  business: {
    slug: 'business-desk',
    nameHi: 'बिजनेस एवं मार्केट डेस्क, द फ्रीलांस',
    nameEn: 'Business & Economy Desk, The Freelance',
    roleHi: 'अर्थव्यवस्था, शेयर बाजार, बजट व पर्सनल फाइनेंस टीम',
    roleEn: 'Economy, Financial Markets & Consumer Affairs Team',
    descHi: 'द फ्रीलांस की बिजनेस डेस्क भारतीय अर्थव्यवस्था, शेयर बाजार, बजट, महंगाई, बैंकिंग, स्टार्टअप्स और आम नागरिक के घरेलू बजट पर पड़ने वाले नीतिगत प्रभावों का गहन डेटा-आधारित विश्लेषण करती है।',
    descEn: 'Covering macroeconomics, equity markets, consumer finances, regulatory shifts, and digital economy trends with deep data-driven analysis.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'अर्थव्यवस्था व बाजार ब्यूरो'
  },
  entertainment: {
    slug: 'entertainment-desk',
    nameHi: 'सिनेमा एवं मनोरंजन डेस्क, द फ्रीलांस',
    nameEn: 'Entertainment & Culture Desk, The Freelance',
    roleHi: 'सिनेमा, ओटीटी, कला एवं सेलिब्रिटी जगत टीम',
    roleEn: 'Cinema, OTT, Culture & Arts Reporting Team',
    descHi: 'द फ्रीलांस की मनोरंजन डेस्क भारतीय सिनेमा, ओटीटी प्लेटफॉर्म्स, संगीत और सांस्कृतिक जगत से जुड़ी हर खबर, निष्पक्ष फिल्म समीक्षाएं और कलाकारों के विशेष संदर्भों को बिना किसी पीआर या सनसनीखेज हाइप के पाठकों तक पहुँचाती है।',
    descEn: 'Covering Indian cinema, OTT platforms, arts, and cultural trends with objective reviews, critical insights, and authentic storytelling.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'सिनेमा व संस्कृति डेस्क'
  },
  states: {
    slug: 'states-desk',
    nameHi: 'राज्य एवं प्रादेशिक ब्यूरो, द फ्रीलांस',
    nameEn: 'States & Regional Bureau, The Freelance',
    roleHi: 'उत्तर प्रदेश व प्रादेशिक विकास रिपोर्टिंग टीम',
    roleEn: 'State Affairs & Grassroots Reporting Bureau',
    descHi: 'द फ्रीलांस का प्रादेशिक ब्यूरो उत्तर प्रदेश सहित विभिन्न राज्यों के जमीनी मुद्दों, विकास योजनाओं, प्रशासनिक कार्रवाइयों और ग्रामीण-शहरी समस्याओं की निष्पक्ष और वास्तविक रिपोर्टिंग करता है।',
    descEn: 'Delivering verified, on-the-ground reporting on state governance, regional development, grassroots public challenges, and local administrative reforms across India.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'प्रादेशिक एवं राज्य ब्यूरो'
  },
  'tech-auto': {
    slug: 'tech-auto-desk',
    nameHi: 'टेक एवं ऑटोमोबाइल डेस्क, द फ्रीलांस',
    nameEn: 'Tech & Auto Desk, The Freelance',
    roleHi: 'गैजेट्स, आर्टिफिशियल इंटेलिजेंस, साइबर सुरक्षा व मोबिलिटी टीम',
    roleEn: 'Technology, AI, Cybersecurity & Mobility Bureau',
    descHi: 'द फ्रीलांस की टेक और ऑटो डेस्क आर्टिफिशियल इंटेलिजेंस, साइबर सुरक्षा, उपभोक्ता गैजेट्स, इलेक्ट्रिक मोबिलिटी और ऑटोमोबाइल इंडस्ट्री के नए नवाचारों पर प्रामाणिक और उपभोक्ता-केंद्रित रिव्यू व रिपोर्ट्स प्रस्तुत करती है।',
    descEn: 'Providing objective product reviews, cybersecurity alerts, artificial intelligence breakthroughs, and automotive industry developments for smart consumers.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'तकनीक व ऑटोमोबाइल डेस्क'
  },
  sports: {
    slug: 'sports-desk',
    nameHi: 'स्पोर्ट्स डेस्क, द फ्रीलांस',
    nameEn: 'Sports Desk, The Freelance',
    roleHi: 'क्रिकेट, ओलंपिक व राष्ट्रीय-अंतरराष्ट्रीय खेल टीम',
    roleEn: 'Sports & Athletics Reporting Desk',
    descHi: 'द फ्रीलांस की खेल डेस्क क्रिकेट, फुटबॉल, एथलेटिक्स, ओलंपिक खेलों और उभरती भारतीय खेल प्रतिभाओं के प्रदर्शन, मैच विश्लेषण और रणनीति पर गहन और निष्पक्ष रिपोर्टिंग करती है।',
    descEn: 'Covering cricket, Olympic sports, football, athletics, and emerging grassroots talent with in-depth match analysis and tactical breakdowns.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'खेल एवं एथलेटिक्स ब्यूरो'
  },
  education: {
    slug: 'education-desk',
    nameHi: 'शिक्षा एवं करियर डेस्क, द फ्रीलांस',
    nameEn: 'Education & Career Desk, The Freelance',
    roleHi: 'प्रतियोगी परीक्षाएं, सरकारी भर्तियां व युवा मार्गदर्शन टीम',
    roleEn: 'Education, Competitive Exams & Career Bureau',
    descHi: 'द फ्रीलांस की शिक्षा डेस्क प्रतियोगी परीक्षाओं, सरकारी भर्तियों, रोजगार के अवसरों, यूनिवर्सिटी एडमिशन और देश के युवाओं से जुड़े नीतिगत मुद्दों पर सबसे सटीक और समयबद्ध मार्गदर्शन प्रदान करती है।',
    descEn: 'Dedicated to student guidance, competitive exams, government recruitment updates, higher education policy, and career opportunities.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'शिक्षा व करियर मार्गदर्शन'
  },
  lifestyle: {
    slug: 'lifestyle-desk',
    nameHi: 'लाइफस्टाइल एवं स्वास्थ्य डेस्क, द फ्रीलांस',
    nameEn: 'Health & Lifestyle Desk, The Freelance',
    roleHi: 'स्वास्थ्य, वेलनेस, पोषण व जीवनशैली टीम',
    roleEn: 'Health, Wellness & Lifestyle Reporting Team',
    descHi: 'द फ्रीलांस की लाइफस्टाइल और हेल्थ डेस्क चिकित्सा विशेषज्ञों, प्रमाणित शोध पत्रों और स्वास्थ्य एजेंसियों के दिशा-निर्देशों के आधार पर सटीक और उपयोगी स्वास्थ्य परामर्श व जीवनशैली की खबरें प्रस्तुत करती है।',
    descEn: 'Delivering verified health advisories, medical research summaries, wellness insights, and lifestyle trends vetted by scientific evidence.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'स्वास्थ्य व वेलनेस डेस्क'
  },
  crime: {
    slug: 'crime-desk',
    nameHi: 'क्राइम एवं लीगल डेस्क, द फ्रीलांस',
    nameEn: 'Crime & Legal Desk, The Freelance',
    roleHi: 'कानून, न्यायपालिका, नागरिक अधिकार व जनसुरक्षा टीम',
    roleEn: 'Law, Judiciary & Investigative Reporting Bureau',
    descHi: 'द फ्रीलांस की क्राइम और लीगल डेस्क अदालती फैसलों, सुप्रीम कोर्ट के ऐतिहासिक आदेशों, कानून व्यवस्था और जनसुरक्षा के मामलों की बिना किसी पूर्वाग्रह के तथ्यपरक रिपोर्टिंग करती है।',
    descEn: 'Focusing on judicial verdicts, constitutional rights, legal awareness, and public safety investigations with strict editorial objectivity.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'कानून व न्यायपालिका ब्यूरो'
  },
  religion: {
    slug: 'religion-desk',
    nameHi: 'धर्म एवं संस्कृति डेस्क, द फ्रीलांस',
    nameEn: 'Culture & Spirituality Desk, The Freelance',
    roleHi: 'भारतीय परंपरा, दर्शन, पर्व व ऐतिहासिक धरोहर टीम',
    roleEn: 'Culture, Heritage & Philosophy Desk',
    descHi: 'द फ्रीलांस की धर्म एवं संस्कृति डेस्क भारतीय दर्शन, ऐतिहासिक धरोहरों, पर्वों और सांस्कृतिक परंपराओं के मूल तत्वों और ऐतिहासिक संदर्भों को प्रस्तुत करती है।',
    descEn: 'Exploring Indian philosophy, heritage architecture, cultural festivals, and spiritual traditions with historical context and respect.',
    email: 'thefreelancetfl@gmail.com',
    badge: 'संस्कृति व विरासत डेस्क'
  }
};

export function getEditorialDesk(category?: string | null): EditorialDesk {
  const cat = (category || 'national').toLowerCase().trim();
  if (EDITORIAL_DESKS[cat]) {
    return EDITORIAL_DESKS[cat];
  }
  if (cat.includes('state') || cat.includes('up') || cat.includes('rajya')) {
    return EDITORIAL_DESKS.states;
  }
  if (cat.includes('biz') || cat.includes('market') || cat.includes('econ') || cat.includes('money')) {
    return EDITORIAL_DESKS.business;
  }
  if (cat.includes('tech') || cat.includes('auto') || cat.includes('cyber')) {
    return EDITORIAL_DESKS['tech-auto'];
  }
  if (cat.includes('health') || cat.includes('life')) {
    return EDITORIAL_DESKS.lifestyle;
  }
  if (cat.includes('film') || cat.includes('cinema') || cat.includes('ent')) {
    return EDITORIAL_DESKS.entertainment;
  }
  if (cat.includes('sport') || cat.includes('khel')) {
    return EDITORIAL_DESKS.sports;
  }
  if (cat.includes('law') || cat.includes('crime') || cat.includes('legal')) {
    return EDITORIAL_DESKS.crime;
  }
  if (cat.includes('edu') || cat.includes('exam') || cat.includes('job')) {
    return EDITORIAL_DESKS.education;
  }
  return EDITORIAL_DESKS.national;
}
