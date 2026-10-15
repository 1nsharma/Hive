import {
  CulturalClaim,
  CulturalHealthMetric,
  IdentityProfileItem,
  TrustExperimentVote,
  HomeFoodCandidateClaim,
  EvidenceLedgerRow,
  PluralityInterviewRecord
} from '../types';

export const INITIAL_CLAIMS: CulturalClaim[] = [
  {
    id: 'C-0001',
    entityName: 'Thaggu Ke Laddu',
    hindiName: 'ठग्गू के लड्डू (बड़ा चौराहा व मेस्टन रोड)',
    category: 'food',
    locality: 'Meston Road & Bada Chauraha, Kanpur',
    establishedEra: '1945',
    statement: 'Founded by Prakash Ram Tiwari in 1945 following Mahatma Gandhi’s lecture in Kanpur warning against white mill sugar. Formulated using pure suji, gond, mawa, and crushed dry fruits under the famous satirical tagline "Aisa Koi Saga Nahi Jisko Thaggu Ne Thaga Nahi".',
    statementHindi: '1945 में प्रकाश राम तिवारी द्वारा स्थापित। महात्मा गांधी के चीनी विरोधी भाषण से प्रेरित होकर परिष्कृत सफेद चीनी के स्थान पर देसी सूजी, गोंद, खोया और मेवों से बना विशुद्ध लड्डू। प्रसिद्ध नारा: "ऐसा कोई सगा नहीं जिसको हमने ठगा नहीं"।',
    evidence: [
      {
        id: 'E-101',
        type: 'gazetteer',
        title: 'Kanpur District Gazetteer (Trade & Commerce Section)',
        source: 'Uttar Pradesh District Gazetteers, Govt of UP',
        year: '1968',
        excerpt: 'Noted confectionery establishments in Meston Road ward established post-WWII featuring indigenous suji-gond preparations.',
        confidence: 0.96
      },
      {
        id: 'E-102',
        type: 'oral_audio',
        title: 'Proprietor Oral Archive (3rd Generation Audio Recording)',
        source: 'Voice Record by Adarsh Tiwari (Recorded Sep 2026)',
        year: '2026',
        excerpt: 'दादा जी ने गांधी जी का भाषण फूलबाग में सुना था। उन्होंने साफ कहा था कि सफेद चीनी सफेद जहर है। इसलिए हम सिर्फ देसी खांड और गोंद का उपयोग करते हैं।',
        confidence: 0.94
      },
      {
        id: 'E-103',
        type: 'newspaper',
        title: 'Dainik Jagran Heritage Feature',
        source: 'Kanpur Nagar Special Archives',
        year: '1989',
        excerpt: 'Report detailing 44 years of Bada Chauraha landmark sweetshop preserving original brass cauldrons.',
        confidence: 0.92
      }
    ],
    communityReviews: [
      {
        id: 'CR-01',
        name: 'Pt. Rameshwar Shukla',
        designation: 'Senior Resident & Local Historian (Age 78)',
        locality: 'Nayaganj, Kanpur',
        action: 'CONFIRMED',
        notes: 'सत्यापित है। 1950 के दशक से हम स्कूल के बाद यहाँ लड्डू खाने आते थे। स्वाद और अनुपात में कोई बदलाव नहीं आया।',
        timestamp: '2026-09-12'
      },
      {
        id: 'CR-02',
        name: 'Sunil Gupta',
        designation: 'Meston Road Vyapar Mandal Secretary',
        locality: 'Meston Road',
        action: 'CONFIRMED',
        notes: 'दुकान का मूल स्थान और गांधी जी के भाषण का प्रसंग हमारे व्यापार मंडल के 1954 के रजिस्टर में भी दर्ज है।',
        timestamp: '2026-09-14'
      }
    ],
    expertReviews: [
      {
        id: 'ER-01',
        name: 'Dr. Anurag Dixit',
        institution: 'Chhatrapati Shahu Ji Maharaj University (CSJMU) History Dept',
        field: 'Modern Awadh Economic History',
        verdict: 'ENDORSED',
        rationale: 'Primary oral testimonies correlate seamlessly with 1940s Congress convention records in Kanpur regarding swadeshi dietary boycott movements.'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 0.94,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-15',
    founderStory: 'प्रकाश राम तिवारी जी ने ब्रिटिश काल में मिल की चीनी के बहिष्कार हेतु देसी खांड से लड्डू बनाने की कला खोजी। उनका व्यंग्य था कि अगर ग्राहक को सच बताकर भी मीठा खिलाया जाए, तो वह प्रेम से ठगा जाना पसंद करता है।',
    traditionalMethod: 'शुद्ध तांबे व पीतल की कड़ाही में देसी घी में भुनी हुई सूजी, देसी बबूल का गोंद, बादाम, पिस्ता और न्यूनतम खांड का हाथ से मिश्रण।',
    economicOutcome: {
      experienceTitle: 'Historic Kanpur Sweet & Satire Food Walk',
      priceINR: 499,
      artisanSharePercent: 75,
      communityPreservationFundPercent: 15,
      platformFeePercent: 10,
      bookingActionText: 'Book Verified Tasting & Heritage Story (₹499)'
    }
  },
  {
    id: 'C-0002',
    entityName: 'Badnam Kulfi',
    hindiName: 'बदनाम कुल्फी (मलाई-रबड़ी मटका कुल्फी)',
    category: 'food',
    locality: 'Bada Chauraha, Kanpur',
    establishedEra: '1948',
    statement: 'Companion delicacy to Thaggu Ke Laddu, hand-churned in copper barrels encased in rock-salt ice slurry. Known as "Badnam" due to high calorie richness that makes patrons delightfully "ruined".',
    statementHindi: '1948 में शुरू की गई धीमी आंच पर 6 घंटे तक गाढ़ी की गई शुद्ध रबड़ी कुल्फी। सेंधा नमक और बर्फ की पारंपरिक लकड़ी की पेटी में हाथ से घूमाकर जमाई जाती है।',
    evidence: [
      {
        id: 'E-201',
        type: 'oral_audio',
        title: 'Third-generation Hand-churning Testimony',
        source: 'Field Interview with Head Karigar Munna Lal (Audio Record)',
        year: '2026',
        excerpt: 'मशीन से जमी कुल्फी में बर्फ के कण आ जाते हैं। हम अभी भी 70 साल पुरानी लकड़ी की पीपे वाली तकनीक इस्तेमाल करते हैं।',
        confidence: 0.92
      },
      {
        id: 'E-202',
        type: 'archival_photo',
        title: '1960s Wooden Churning Barrel Photographic Plate',
        source: 'Kanpur Photo Heritage Society Archive #KPH-442',
        year: '1964',
        excerpt: 'Black and white photograph showing customers around the brass-trimmed ice tub outside Bada Chauraha.',
        confidence: 0.90
      }
    ],
    communityReviews: [
      {
        id: 'CR-201',
        name: 'Vimla Devi',
        designation: 'Civil Lines Resident (Age 72)',
        locality: 'Civil Lines, Kanpur',
        action: 'CONFIRMED',
        notes: 'मिट्टी के कुल्हड़ में केसर पिस्ता कुल्फी का स्वाद बचपन से ऐसा ही है।',
        timestamp: '2026-09-11'
      }
    ],
    expertReviews: [
      {
        id: 'ER-201',
        name: 'Prof. Shalini Rastogi',
        institution: 'National Dairy Research Institute Alumni Council',
        field: 'Traditional Indian Dairy Preservation',
        verdict: 'ENDORSED',
        rationale: 'Thermal reduction process verified through chemical organoleptic analysis of fat solids.'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 0.91,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-14',
    founderStory: 'जब ग्राहक लड्डू खाने के बाद ठंडा मांगने लगे, तो प्रकाश राम जी ने कहा कि जो एक बार खाएगा वह स्वाद का गुलाम होकर बदनाम हो जाएगा।',
    traditionalMethod: 'भैंस के फुल क्रीम दूध को 70% तक कढ़ाकर गाढ़ा करना, छोटी इलायची व कश्मीर मोगरा केसर का हाथ से घोंटाव।',
    economicOutcome: {
      experienceTitle: 'Heritage Kulfi Tasting & Cold-Churn Workshop',
      priceINR: 299,
      artisanSharePercent: 80,
      communityPreservationFundPercent: 12,
      platformFeePercent: 8,
      bookingActionText: 'Order Certified Batch / Book Tasting (₹299)'
    }
  },
  {
    id: 'C-0003',
    entityName: 'Banarasi Misthan Bhandar Chura-Matar',
    hindiName: 'बनारसी मिष्ठान भंडार (चूड़ा-मटर एवं खस्ता कचोरी)',
    category: 'food',
    locality: 'Nayaganj Grain Market, Kanpur',
    establishedEra: '1952',
    statement: 'Pioneered the winter Chura-Matar delicacy in Kanpur wholesale grain mandi. Uses water-soaked local thick poha steamed in whole milk with green peas, black pepper, and pure cow ghee.',
    statementHindi: '1952 से नयागंज गल्ला मंडी में सर्दियों का अद्वितीय नाश्ता—दूध में भीगा हुआ मोटा पोहा, ताजे मीठे मटर, काली मिर्च और शुद्ध गाय के घी में तड़का।',
    evidence: [
      {
        id: 'E-301',
        type: 'gazetteer',
        title: 'Kanpur Mandi Parishad Historical Directory',
        source: 'Agricultural Marketing Board UP',
        year: '1974',
        excerpt: 'Nayaganj mandi dawn breakfast stations documented serving Chura Matar to interstate traders from 5:00 AM.',
        confidence: 0.89
      },
      {
        id: 'E-302',
        type: 'academic',
        title: 'Purvanchal to Central Doab Culinary Migration Paper',
        source: 'Journal of Indian Food Heritage Vol 14',
        year: '2021',
        excerpt: 'Analyzed the transfer of Varanasi steamed-flattened-rice breakfast into Kanpur mercantile hubs.',
        confidence: 0.87
      }
    ],
    communityReviews: [
      {
        id: 'CR-301',
        name: 'Om Prakash Tandon',
        designation: 'Nayaganj Kirana Vyapari (Age 69)',
        locality: 'Nayaganj',
        action: 'CONFIRMED',
        notes: 'हमारे पिताजी 1955 से यहीं गल्ला मंडी की आढ़त पर नाश्ता मंगाते थे। आज भी चूड़े का दाना-दाना अलग रहता है।',
        timestamp: '2026-09-10'
      }
    ],
    expertReviews: [
      {
        id: 'ER-301',
        name: 'Vikramaditya Pandey',
        institution: 'Culinary Archivist of Northern India',
        field: 'Mandi Foodways',
        verdict: 'ENDORSED',
        rationale: 'Authentic preparation verified; maintains pure steaming method rather than deep-frying.'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 0.88,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-13',
    founderStory: 'काशी से कानपुर व्यापार करने आए बाबू राधे मोहन जी ने गल्ला मंडी के आढ़तियों के लिए सुपाच्य और सात्विक ऊर्जावान नाश्ते के रूप में यह परंपरा रची।',
    traditionalMethod: 'पोहे को पानी के बाद मलाईदार दूध में भिगोना, लोहे की कड़ाही में जीरा-हींग और हरी मिर्च का छौंक, ताजी हरी मटर को भाप में पकाना।',
    economicOutcome: {
      experienceTitle: 'Nayaganj Mandi Dawn Food Tour & Tasting',
      priceINR: 349,
      artisanSharePercent: 70,
      communityPreservationFundPercent: 20,
      platformFeePercent: 10,
      bookingActionText: 'Join Morning Mandi Heritage Breakfast (₹349)'
    }
  },
  {
    id: 'C-0004',
    entityName: 'Jajmau Vegetable Tanning & Saddlery Cluster',
    hindiName: 'जाजमऊ पारंपरिक वनस्पति चमड़ा एवं सैडलरी क्लस्टर',
    category: 'craft',
    locality: 'Jajmau, River Ganges Bank, Kanpur',
    establishedEra: '1890s',
    statement: 'Traditional equestrian saddle making and natural babul/acacia bark vegetable tanning cluster dating to late 19th century British harness contracts, preserving hand-stitched welted bridle crafting without hazardous chrome.',
    statementHindi: '19वीं शताब्दी के उत्तरार्ध का प्रसिद्ध अश्व जीन (सैडलरी) व बबूल की छाल से वनस्पति चमड़ा संस्कारण क्लस्टर। हाथ से सिली गई जीन व लगाम की विश्वविख्यात कारीगरी।',
    evidence: [
      {
        id: 'E-401',
        type: 'gazetteer',
        title: 'Imperial Gazetteer of India, Vol. XV (Cawnpore)',
        source: 'Clarendon Press, Oxford',
        year: '1908',
        excerpt: 'The Government Harness and Saddlery Factory established in 1867 catalyzed native artisanal workshops along the Ganges at Jajmau.',
        confidence: 0.95
      },
      {
        id: 'E-402',
        type: 'oral_audio',
        title: 'Master Craftsman Ustad Rafiq Ahmed Oral History',
        source: 'Audio Documentation (Jajmau Guild Archive)',
        year: '2026',
        excerpt: 'हमारे दादा जी बबूल की छाल के अर्क में 40 दिन तक चमड़े को पकाते थे। उस चमड़े से बनी काठी 100 साल तक नहीं सड़ती थी।',
        confidence: 0.85
      }
    ],
    communityReviews: [
      {
        id: 'CR-401',
        name: 'Haji Noor Mohammad',
        designation: 'Master Saddle Maker (President, Karigar Guild)',
        locality: 'Jajmau Old Basti',
        action: 'CORRECTED',
        notes: 'दावे में यह जोड़ा जाए कि आज 90% काम एक्सपोर्ट का है, लेकिन वनस्पति टैनिंग केवल 4 खानदानी कार्यशालाओं में ही जीवित बची है। इसे संरक्षित करना अत्यावश्यक है।',
        timestamp: '2026-09-13'
      }
    ],
    expertReviews: [
      {
        id: 'ER-401',
        name: 'Prof. Tariq Manzoor',
        institution: 'Central Leather Research Institute (CLRI) Regional Centre',
        field: 'Eco-Tanning & Heritage Craft',
        verdict: 'QUALIFIED',
        rationale: 'Historical provenance is unimpeachable, though contemporary chemical compliance requires careful distinction between synthetic vs vegetable tannery records.'
      }
    ],
    status: 'PARTIALLY_VERIFIED',
    confidenceScore: 0.86,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-15',
    founderStory: '1857 के बाद कानपुर में ब्रिटिश कैवलरी हेतु दुनिया का सबसे बड़ा सैडलरी हब बना। भारतीय दस्तकारों ने इसमें अवधी नक्काशी और मजबूत मोची टांका (saddle stitch) का अनूठा मेल किया।',
    traditionalMethod: 'बबूल और हरड़ के प्राकृतिक अर्क में धीमी टैनिंग, मोम लगे सूती धागे से दोहरी सुई वाला मजबूत सिलाई टांका।',
    economicOutcome: {
      experienceTitle: 'Master Saddle Maker Workshop & Custom Leather Journal Crafting',
      priceINR: 1299,
      artisanSharePercent: 85,
      communityPreservationFundPercent: 10,
      platformFeePercent: 5,
      bookingActionText: 'Book Master Craftsman Studio Pass (₹1,299)'
    }
  },
  {
    id: 'C-0005',
    entityName: 'Bithoor Brahmavart Ghat Riverine Chants',
    hindiName: 'बिठूर ब्रह्मावर्त घाट मौखिक गाथा व नौका परंपरा',
    category: 'oral_history',
    locality: 'Brahmavart Ghat, Bithoor, Kanpur',
    establishedEra: 'Ancient / 1857 Revival',
    statement: 'Ganges boatmen oral ballad tradition narrating Valmiki Ashram legends and Nana Saheb Peshwa’s 1857 revolutionary river movements, preserved through metric rhythm rowing chants.',
    statementHindi: 'बिठूर के मल्लाहों द्वारा संरक्षित मौखिक गाथाएं—वाल्मीकि रामायण की किंवदंतियां और 1857 के क्रांतिकारी नाना साहब पेशवा व रानी लक्ष्मीबाई के गंगा पार करने के लोकगीत।',
    evidence: [
      {
        id: 'E-501',
        type: 'academic',
        title: 'Oral Ballads of Central Uttar Pradesh River Systems',
        source: 'CSJMU Folklore Archives Monograph',
        year: '2018',
        excerpt: 'Transcribed 14 rhythmic rowing songs (मल्लाह मल्हार) recording the night crossing of 1857 freedom fighters.',
        confidence: 0.88
      },
      {
        id: 'E-502',
        type: 'oral_audio',
        title: 'Audio Field Recording of Boatman Ram Charan Nishad',
        source: 'Field Tape recorded at Brahmavart Sunrise (Aug 2026)',
        year: '2026',
        excerpt: '"गंगा की लहर बोले, नाना का झंडा डोले..." - 82 वर्षीय राम चरन निषाद के मुख से गायी गई पारंपरिक नौका धुन।',
        confidence: 0.90
      }
    ],
    communityReviews: [
      {
        id: 'CR-501',
        name: 'Mahant Gyanendra Das',
        designation: 'Brahmavart Tirtha Purohit Council',
        locality: 'Bithoor Ghat',
        action: 'CONFIRMED',
        notes: 'यह मौखिक परंपरा पीढ़ी-दर-पीढ़ी गंगा आरती और नौका विहार के साथ बची हुई है। इसे रिकॉर्ड करना बहुत बड़ा काम है।',
        timestamp: '2026-09-08'
      }
    ],
    expertReviews: [
      {
        id: 'ER-501',
        name: 'Dr. Meera Srivastava',
        institution: 'Indian National Trust for Art and Cultural Heritage (INTACH)',
        field: 'Intangible Cultural Heritage',
        verdict: 'ENDORSED',
        rationale: 'UNESCO Intangible Cultural Heritage criteria met regarding living traditions and social practices.'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 0.89,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-14',
    founderStory: 'बिठूर के निषाद समाज ने गंगा नदी को केवल आजीविका नहीं, बल्कि 1857 की स्वतंत्रता क्रांति का मूक गवाह और रक्षक माना। उनके लोकगीत ऐतिहासिक प्रतिरोध के दस्तावेज हैं।',
    traditionalMethod: 'काठ की हस्तनिर्मित नावों पर चप्पू चलाते हुए सामूहिक सुर में तान छेड़ना, राग मल्हार और कजरी का स्थानीय अवधी रूप।',
    economicOutcome: {
      experienceTitle: 'Sunrise Heritage Boat Journey with Oral Historian Nishad',
      priceINR: 799,
      artisanSharePercent: 80,
      communityPreservationFundPercent: 15,
      platformFeePercent: 5,
      bookingActionText: 'Reserve Sunrise Oral History Boat (₹799)'
    }
  },
  {
    id: 'C-0006',
    entityName: 'Lal Bangla Makhan Malai (Daulat Ki Chaat)',
    hindiName: 'लाल बंगला शीतकालीन मक्खन मलाई',
    category: 'food',
    locality: 'Lal Bangla Market, Kanpur',
    establishedEra: '1962',
    statement: 'Traditional winter-only whipped milk foam exposed to cold night dew in clay vats. Spiced with green cardamom and saffron, garnished with pistachios and chandi ka varq.',
    statementHindi: '1962 से लाल बंगला में केवल सर्दियों के 3 महीने बनने वाली ओस में मथी हुई दूध की झागदार मलाई। रात भर खुले आसमान के नीचे ओस में रखने से इसमें प्राकृतिक मिठास व हल्कापन आता है।',
    evidence: [
      {
        id: 'E-601',
        type: 'oral_audio',
        title: 'Interview with Ustad Kanhaiya Lal Halwai',
        source: 'Field Recording (Recorded Sep 2026)',
        year: '2026',
        excerpt: 'अगर रात में ओस न गिरे, तो दूध का झाग नहीं बैठता। यह प्रकृति और कारीगरी की साझेदारी है।',
        confidence: 0.84
      }
    ],
    communityReviews: [
      {
        id: 'CR-601',
        name: 'Deepak Saxena',
        designation: 'Lal Bangla Traders Association',
        locality: 'Lal Bangla',
        action: 'CONFIRMED',
        notes: 'हर साल नवंबर से जनवरी तक सुबह 6 बजे से भीड़ लगती है। यह कानपुर की अनूठी धरोहर है।',
        timestamp: '2026-09-12'
      }
    ],
    expertReviews: [
      {
        id: 'ER-601',
        name: 'Chef Ravindra Negi',
        institution: 'UP Tourism Culinary Advisory Board',
        field: 'Micro-Seasonal Foods',
        verdict: 'ENDORSED',
        rationale: 'Distinct from Delhi Daulat ki Chaat in its denser saffron-infused layer and specific clay vat curing method.'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 0.85,
    consent: 'PUBLIC',
    lastReviewed: '2026-09-15',
    founderStory: 'कन्हैया लाल जी के पूर्वज ग्रामीण उन्नाव से कानपुर आए और उन्होंने औद्योगिक मिल मजदूरों को सर्दियों में स्निग्ध ऊर्जा देने हेतु इस व्यंजन को बाजार में उतारा।',
    traditionalMethod: 'मिट्टी के बड़े कुंडों में दूध को रात भर ओस में खुला छोड़ना, तड़के 4 बजे मथानी से 2 घंटे तक लगातार मथकर झाग एकत्र करना।',
    economicOutcome: {
      experienceTitle: 'Winter Dew Makhan Malai Tasting & Demonstration',
      priceINR: 199,
      artisanSharePercent: 85,
      communityPreservationFundPercent: 10,
      platformFeePercent: 5,
      bookingActionText: 'Pre-order Fresh Morning Batch (₹199)'
    }
  }
];

export const DISTRICT_HEALTH_METRIC: CulturalHealthMetric = {
  district: 'Kanpur Nagar (कानपुर नगर)',
  coveragePercent: 82,
  communityParticipation: 91,
  evidenceQuality: 76,
  authenticityScore: 88,
  digitalAccessibility: 63,
  economicActivation: 41,
  preservationRisk: 'HIGH'
};

export const COMPETITOR_AUDIT_DATA = [
  {
    name: 'VIVIDH (India)',
    scope: 'Cultural Intelligence & Spatial Heritage',
    culturalData: 'High (12,400 stories, 30 district digital twins in Karnataka)',
    communityGovernance: 'Low (Curator & government top-down model; limited practitioner veto)',
    provenanceQuality: 'Medium (Mentions consented data, but no granular evidence graph publicly auditable)',
    commercialLoop: 'Low (Primarily tourism display/AR-VR archives; no everyday local merchant transactions)',
    whiteSpaceGap: 'Missing local business economic loop & community-governed claim dispute mechanism.'
  },
  {
    name: 'Jon&Coo (Japan)',
    scope: 'Culture OS (Matsuri, J-Times, Creator Community)',
    culturalData: 'Medium (Curated Japanese aesthetics and traditional festival IP)',
    communityGovernance: 'Medium (Creator collectives and payout pipelines)',
    provenanceQuality: 'Medium (Web3 tokenization & on-chain provenance records)',
    commercialLoop: 'High (Shop, tickets, crowdfunding, payouts active in Japan)',
    whiteSpaceGap: 'Strictly Japan-centric; high-friction crypto/NFT barrier unsuitable for Indian MSMEs.'
  },
  {
    name: 'BHASHINI (Govt of India)',
    scope: 'National Language Translation Mission (NLTM)',
    culturalData: 'Very High (22+ languages, voice crowdsourcing)',
    communityGovernance: 'High (Citizen co-creation for linguistic data)',
    provenanceQuality: 'High (Academic & linguistic institution verification)',
    commercialLoop: 'None (Pure public digital infrastructure API layer)',
    whiteSpaceGap: 'Infrastructure only; does not provide end-user cultural discovery, verified commerce, or merchant tools.'
  },
  {
    name: 'IndiaHandmade (Govt of India)',
    scope: 'Direct Artisan e-Commerce Marketplace',
    culturalData: 'Low (Basic product tags, materials, weaver region)',
    communityGovernance: 'Low (Standard buyer-seller marketplace model)',
    provenanceQuality: 'Low (Handloom marks present, but no living oral evidence or founder provenance)',
    commercialLoop: 'High (Direct marketplace checkout)',
    whiteSpaceGap: 'Static catalog without AI context, experiences, or conversational decision guidance.'
  },
  {
    name: 'Europeana / CHAD-KG',
    scope: 'Academic Cultural Heritage Knowledge Graphs',
    culturalData: 'High (Bibliographic metadata, museums, 3D digitization)',
    communityGovernance: 'Low (Librarian/archivist driven)',
    provenanceQuality: 'Very High (Rigorous academic provenance citations)',
    commercialLoop: 'Zero (Non-commercial research infrastructure)',
    whiteSpaceGap: 'No economic activation for living artisans, local food joints, or urban tourism.'
  },
  {
    name: 'Generic AI (ChatGPT, Perplexity)',
    scope: 'General Conversational Information Retrieval',
    culturalData: 'Vast but unstructured',
    communityGovernance: 'None (Scraped web without community consent)',
    provenanceQuality: 'Low (Prone to hallucinations, conflates historical dates)',
    commercialLoop: 'None (Direct ad or search engine referral)',
    whiteSpaceGap: 'No verification audit, no confidence scores, no local community revenue share.'
  }
];

export const AMIT_SHARMA_IDENTITY_PROFILE: IdentityProfileItem[] = [
  {
    platform: 'Canonical Portfolio / Website',
    handle: 'amitsharma.dev (Recommended) / insharma.com',
    url: 'https://amitsharma.dev',
    currentRole: 'AI Systems Builder & Technology Architect',
    auditStatus: 'CREATE',
    notes: 'Single source of truth for projects, philosophy, publications, and contact.'
  },
  {
    platform: 'GitHub',
    handle: '1nsharma',
    url: 'https://github.com/1nsharma',
    currentRole: 'AI & Security Systems Architect (Sentinel Protocol, MSME AI)',
    auditStatus: 'CONFIRMED',
    notes: 'Primary developer footprint verified across open repositories and OpenTalent.'
  },
  {
    platform: 'LinkedIn',
    handle: 'Amit Sharma (Update from Amit S.)',
    url: 'https://linkedin.com/in/amit-sharma-tech',
    currentRole: 'Founder @ DukaanMitra | AI Systems Builder',
    auditStatus: 'NEEDS_FIX',
    notes: 'Fix display name to full "Amit Sharma" for search engine disambiguation.'
  },
  {
    platform: 'Technical Writing (Dev.to / Hashnode)',
    handle: 'ameyinsisde',
    url: 'https://dev.to/ameyinsisde',
    currentRole: 'Author: DukaanMitra, Indian MSME AI Systems',
    auditStatus: 'CONFIRMED',
    notes: 'High-value thought leadership proof showing domain expertise in SME AI automation.'
  },
  {
    platform: 'Google Scholar',
    handle: 'Amit Sharma (Kanpur)',
    url: 'https://scholar.google.com/citations?user=amitsharma',
    currentRole: 'Building AI-powered SaaS for Indian SMEs',
    auditStatus: 'CONFIRMED',
    notes: 'Strong academic credibility linking research to DukaanMitra and Kanpur MSMEs.'
  },
  {
    platform: 'Facebook Contact Exposure',
    handle: '@amit99976',
    url: 'https://facebook.com/amit99976',
    currentRole: 'Personal Profile / Old Page',
    auditStatus: 'NEEDS_FIX',
    notes: 'Correct misleading +1 country code to +91 or remove direct phone to avoid spam.'
  },
  {
    platform: 'Stale Aggregator Profiles (OpenTalent)',
    handle: '1nsharma / Amit Sharma',
    url: 'https://opentalent.co/1nsharma',
    currentRole: 'Kanpur AI Developer',
    auditStatus: 'REMOVE',
    notes: 'Update with canonical link or request removal to prevent fragmented profile indexing.'
  }
];

export const INITIAL_VOTES: TrustExperimentVote[] = [
  {
    id: 'V-01',
    timestamp: '2026-09-14 11:20',
    userType: 'tourist',
    selectedVersion: 'B',
    trustScore: 5,
    feedback: 'Google reviews are often paid or fake. The District Gazetteer 1968 citation and Mahatma Gandhi backstory made me immediately book the heritage tasting.',
    actionTaken: true
  },
  {
    id: 'V-02',
    timestamp: '2026-09-14 12:05',
    userType: 'local_resident',
    selectedVersion: 'B',
    trustScore: 5,
    feedback: 'I am from Kanpur, but seeing the elder testimonial and copper barrel photo gave me immense pride. Version B treats food as living heritage.',
    actionTaken: true
  },
  {
    id: 'V-03',
    timestamp: '2026-09-14 14:40',
    userType: 'food_historian',
    selectedVersion: 'B',
    trustScore: 5,
    feedback: 'The explicit confidence score and claim dispute status is groundbreaking. Finally an AI tool that gives citations rather than hallucinating dates.',
    actionTaken: true
  },
  {
    id: 'V-04',
    timestamp: '2026-09-14 16:15',
    userType: 'student',
    selectedVersion: 'A',
    trustScore: 3,
    feedback: 'Version A is simpler and has the phone number right away, but Version B feels far more authentic.',
    actionTaken: false
  },
  {
    id: 'V-05',
    timestamp: '2026-09-15 09:30',
    userType: 'tourist',
    selectedVersion: 'B',
    trustScore: 5,
    feedback: 'The fact that 75% of my booking fee directly goes to the halwai and 15% to community fund was the clincher.',
    actionTaken: true
  }
];

export const HOME_FOOD_10_CLAIMS: HomeFoodCandidateClaim[] = [
  {
    id: 'C001',
    claim: 'Satpaita is a traditional home-food practice native to the Kanpur region.',
    claimHindi: 'Satpaita Kanpur-region की traditional home-food practice है।',
    claimType: 'Culinary Heritage / Regional Practice',
    geographicScope: 'Kanpur and surrounding Central Doab districts (Uttar Pradesh)',
    peopleCommunityAssociated: 'Local Kanpur households, traditional home cooks across generations',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Oral history interviews (2+ generations), regional dialect cookbooks, district gazetteer citations',
    contradictoryEvidence: 'UNKNOWN (May share roots with wider Awadhi or Bhojpuri greens preparation)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या आपके परिवार में Satpaita (दाल-साग का संयोजन) बनाने की विधि पीढ़ियों से चली आ रही है? क्या आप इसके किसी पुराने लिखित संदर्भ या पारिवारिक परंपरा की पुष्टि कर सकते हैं?'
  },
  {
    id: 'C002',
    claim: 'Nimona is prepared intergenerationally within Kanpur households.',
    claimHindi: 'Nimona Kanpur households में intergenerationally बनाया जाता है।',
    claimType: 'Intergenerational Knowledge Transmission',
    geographicScope: 'Kanpur households (Nayaganj, Sisamau, Govind Nagar)',
    peopleCommunityAssociated: 'Multi-generational families in Kanpur',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Comparative structured interviews with grandparents, parents, and grandchildren regarding coarse-grinding techniques (silbatta vs mixer) and seasonal frequency',
    contradictoryEvidence: 'UNKNOWN',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या आपके घर में Nimona बनाना एक नियमित मौसमी परंपरा रही है? क्या परिवार की युवा पीढ़ी इसे सिलबट्टे पर दरदरा पीसकर पारंपरिक रूप से बनाना जानती है?'
  },
  {
    id: 'C003',
    claim: 'Buknu/paratha has a Kanpur-specific cultural and medicinal association.',
    claimHindi: 'Buknu/paratha की Kanpur-specific cultural association है।',
    claimType: 'Cultural Association / Regional Identity',
    geographicScope: 'Kanpur wholesale kirana hubs (Nayaganj, Collectorganj)',
    peopleCommunityAssociated: 'Local residents, Ayurvedic traditionalists, Kirana guild merchants',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Ethnographic field surveys, local food historian testimony, documented herb formulations from century-old grocery ledgers',
    contradictoryEvidence: 'UNKNOWN (Shared with Bundelkhand & Awadh; specific herbal balance in Kanpur to be investigated)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या Buknu/paratha को आप विशेष रूप से कानपुर की पहचान मानते हैं, या यह पड़ोसी क्षेत्रों में भी समान रूप से प्रचलित है? इसके 26 औषधीय घटकों के अनुपात में कानपुर का क्या विशिष्ट योगदान है?'
  },
  {
    id: 'C004',
    claim: 'Dal ka dulha exists within the local household food tradition of Kanpur.',
    claimHindi: 'Dal ka dulha local household food tradition में मौजूद है।',
    claimType: 'Household Tradition / Folk Food Practice',
    geographicScope: 'Kanpur households and peri-urban villages',
    peopleCommunityAssociated: 'Traditional home cooks, migrant working-class families',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Practitioner oral recordings, regional recipe archives, folk nomenclature comparison (Dal Pithi vs Dal Dhokli vs Dal ka Dulha)',
    contradictoryEvidence: 'UNKNOWN',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: "Dal ka dulha (आटे के 'दूल्हे'/फूल को दाल में पकाना) आपके घर में किन विशेष दिनों या मौसम में बनता है? क्या आटे की आकृतियों में कोई पारिवारिक विशिष्टता है?"
  },
  {
    id: 'C005',
    claim: 'Knowledge of these dishes is transmitted through families rather than formal restaurants.',
    claimHindi: 'इन dishes का knowledge formal restaurants से ज्यादा परिवारों के माध्यम से transmit होता है।',
    claimType: 'Knowledge Transmission Dynamics',
    geographicScope: 'Kanpur culinary ecosystem',
    peopleCommunityAssociated: 'Home cooks, matriarchs, and restaurant proprietors',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Comparative survey contrasting informal domestic apprenticeship vs commercial culinary menus in Kanpur',
    contradictoryEvidence: 'UNKNOWN (A few heritage sweetshops offer seasonal Chura-Matar, but home dishes like Satpaita are virtually absent from commercial menus)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'PUBLIC',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या आपने यह विधि किसी रेस्तरां/होटल से सीखी या अपनी माँ/दादी से? क्या स्थानीय ढाबों या रेस्तरां में यह पारंपरिक व्यंजन आसानी से मेनू पर मिलता है?'
  },
  {
    id: 'C006',
    claim: 'Meaningful recipe variations exist across distinct families in Kanpur.',
    claimHindi: 'अलग-अलग परिवारों में इनके recipes में meaningful variations हैं।',
    claimType: 'Culinary Diversity / Plural Traditions',
    geographicScope: 'Kanpur city wards (Nayaganj, Sisamau, Bithoor, Generalganj, Govind Nagar)',
    peopleCommunityAssociated: 'Distinct families representing Kayastha, Brahmin, Vaishya, and artisanal households',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Comparative recipe and technique breakdown (dal proportion, tempering fat, spice choice, iron vs brass cookware) from at least 5 distinct families',
    contradictoryEvidence: 'UNKNOWN (Crucial hypothesis: Culture is plural rather than a single canonical truth)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: "क्या आपके परिवार की विधि में कोई ऐसा विशेष छौंक, दाल का चयन या गुप्त सामग्री है जो पड़ोसी परिवारों से भिन्न है? क्या इसे एक मानक 'सत्य' में बांधना विविधता को खत्म करेगा?"
  },
  {
    id: 'C007',
    claim: 'Several traditional dishes are strictly seasonal or occasion-specific.',
    claimHindi: 'कुछ dishes seasonal या occasion-specific हैं।',
    claimType: 'Temporal Cultural Practice',
    geographicScope: 'Kanpur agricultural micro-seasons',
    peopleCommunityAssociated: 'Local households, Mandi greengrocers',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Seasonal calendar mapping (winter green peas, bathua greens, winter solstice) correlated with home cooking calendars',
    contradictoryEvidence: 'UNKNOWN (Frozen peas allow year-round cooking, but elders claim loss of authentic botanical flavor)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'PUBLIC',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या निमोना या सतपैता वर्ष भर बनता है या केवल सर्दियों की ताजी मटर/बथुआ के आने पर? फ्रोजन सामग्री के उपयोग पर आपकी क्या राय है?'
  },
  {
    id: 'C008',
    claim: 'Cultural and culinary knowledge is diminishing among the younger generation.',
    claimHindi: 'Younger generation में इनका knowledge कम हो रहा है।',
    claimType: 'Cultural Erosion / Endangerment',
    geographicScope: 'Kanpur urban youth (ages 18-30)',
    peopleCommunityAssociated: 'Elders (60+) and youth in joint vs nuclear households',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN VERIFICATION',
    evidenceTypeNeeded: 'Intergenerational knowledge gap survey measuring hands-on preparation capability vs mere consumption familiarity',
    contradictoryEvidence: 'UNKNOWN (Some youth culinary enthusiasts document heritage food on social media; must verify true preparation capability)',
    communityTestimony: 'PENDING INTERVIEW',
    consentStatus: 'PENDING',
    accessLevel: 'PUBLIC',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: '(बुजुर्गों से): क्या आपके बच्चे/पोते इसे बिना सहायता के बना सकते हैं? (युवाओं से): क्या आप इसे बनाना जानते हैं या केवल घर जाने पर खाते हैं?'
  },
  {
    id: 'C009',
    claim: 'Existing online discovery platforms do not adequately represent the cultural provenance of these foods.',
    claimHindi: 'Existing online discovery इन foods का cultural provenance adequately नहीं दिखाती।',
    claimType: 'Digital Representation Gap',
    geographicScope: 'Digital search platforms (Google Maps, Zomato, generic SEO recipe blogs)',
    peopleCommunityAssociated: 'Digital food discovery users, cultural travelers',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING HUMAN AUDIT',
    evidenceTypeNeeded: 'Systematic content audit of top 20 Google/YouTube results for "Satpaita" and "Kanpur Home Food", quantifying absence of primary evidence, provenance, and community consent',
    contradictoryEvidence: 'UNKNOWN',
    communityTestimony: 'N/A (Platform Content Audit)',
    consentStatus: 'N/A',
    accessLevel: 'PUBLIC',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'जब आप ऑनलाइन इन व्यंजनों की खोज करते हैं, तो क्या आपको उनकी ऐतिहासिक पृष्ठभूमि, परिवारिक भिन्नता और प्रामाणिक स्रोत मिलते हैं या केवल सतही व्यंजन विधियां?'
  },
  {
    id: 'C010',
    claim: 'A cultural profile with evidence and community validation will be demonstrably more useful than an ordinary food listing.',
    claimHindi: 'Evidence + community validation वाला profile ordinary food listing से अधिक useful होगा।',
    claimType: 'Business / Behavioral Hypothesis',
    geographicScope: 'Kanpur Pilot Study Group (20 targeted users & practitioners)',
    peopleCommunityAssociated: 'Heritage travelers, local food consumers, home-cook practitioners',
    evidence: 'EVIDENCE NOT PROVIDED',
    source: 'PENDING EXPERIMENT (Day 4-6 A/B Testing Sandbox)',
    evidenceTypeNeeded: 'Quantitative A/B testing differential measuring Trust Score (1-5), Preference Ratio, and Conversion Lift to home-dining / authentic spice blend reservations',
    contradictoryEvidence: 'UNKNOWN',
    communityTestimony: 'PENDING EXPERIMENT',
    consentStatus: 'PENDING',
    accessLevel: 'RESTRICTED',
    currentStatus: 'UNVERIFIED_HYPOTHESIS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या साक्ष्य, बुजुर्गों के ऑडियो उद्धरण और परिवार की प्रामाणिक कहानी देखकर आप इस अनुभव/उत्पाद के लिए भुगतान करने को तैयार हैं, तुलनात्मक सामान्य सूची के मुकाबले?',
    isPrimaryBusinessHypothesis: true
  }
];

export const INITIAL_EVIDENCE_LEDGER: EvidenceLedgerRow[] = [
  {
    id: 'C001',
    claimSummary: 'Satpaita local home-food tradition',
    source: 'Field Interview: Shanti Devi (Sisamau)',
    evidenceType: 'Oral Recording (2nd Gen)',
    communityFeedback: 'Confirmed with specific bathua+urad proportion',
    conflictFlag: 'Tempering: Mustard oil vs Ghee dispute',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-15',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C002',
    claimSummary: 'Nimona intergenerational transmission',
    source: 'Field Interview: Urmila Shukla (Nayaganj)',
    evidenceType: 'Oral Testimony + Silbatta Demo',
    communityFeedback: 'Youth eat with joy, but only 1 of 3 daughters can grind it',
    conflictFlag: 'None',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-15',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C003',
    claimSummary: 'Buknu/paratha regional identity',
    source: 'Kirana Mahasabha Archives, Nayaganj',
    evidenceType: 'Historical Merchant Ledger #1952',
    communityFeedback: '26 herbs documented; unique digestive formulation',
    conflictFlag: 'Bundelkhand also claims origin; Central Doab variant has more pippali',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-14',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C004',
    claimSummary: 'Dal ka dulha local household tradition',
    source: 'Field Interview: Kaushalya Gupta (Generalganj)',
    evidenceType: 'Oral Testimony',
    communityFeedback: 'Confirmed as flour pockets steamed in spiced toor dal',
    conflictFlag: 'Known as Dal Pithi in East UP, Dal Dulha in Kanpur Doab',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-14',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C005',
    claimSummary: 'Family transmission > Restaurant trade',
    source: 'Audit of 40 Kanpur Restaurant Menus',
    evidenceType: 'Empirical Menu Survey',
    communityFeedback: '0 of 40 formal restaurant menus feature Satpaita or Dal ka Dulha',
    conflictFlag: 'None',
    consentStatus: 'N/A',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-13',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C006',
    claimSummary: 'Plural recipe variations across families',
    source: '5 Multi-Family Comparative Interviews',
    evidenceType: 'Comparative Recipe Ledger',
    communityFeedback: 'Significant plurality: 3 distinct dal bases, 2 fat mediums',
    conflictFlag: 'Plurality Validated (No single monolithic truth)',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-15',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C007',
    claimSummary: 'Strict seasonal & festival temporality',
    source: 'Chakarapur Mandi Seasonal Price Series',
    evidenceType: 'Agricultural Price & Arrival Series',
    communityFeedback: 'Fresh green peas & bathua coincide with Kartik to Magh months',
    conflictFlag: 'Modern frozen alternatives exist, widely rejected by purists',
    consentStatus: 'N/A',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-12',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C008',
    claimSummary: 'Knowledge erosion in youth (18-30)',
    source: 'Demographic Sample (25 Kanpur College Students)',
    evidenceType: 'Survey Dataset',
    communityFeedback: '88% consume when made at home; only 12% can prepare independently',
    conflictFlag: 'None',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-14',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C009',
    claimSummary: 'Inadequate digital discovery & provenance',
    source: 'Systematic Google & YouTube Search Audit',
    evidenceType: 'Digital Content Audit',
    communityFeedback: 'Top 10 results are generic 60-second reels without historical origin',
    conflictFlag: 'None',
    consentStatus: 'N/A',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-13',
    verifiedBy: 'Human Researcher'
  },
  {
    id: 'C010',
    claimSummary: 'Evidence profile > ordinary listing (Business Hypothesis)',
    source: 'Day 5-6 A/B Test (20 Target Consumers)',
    evidenceType: 'Quantitative Experiment Dataset',
    communityFeedback: '80% prefer Version B; +34% higher booking intent for Home Dining pass',
    conflictFlag: 'Requires ongoing economic validation across bigger sample',
    consentStatus: 'Obtained',
    currentStatus: 'Corroborated',
    dateAdded: '2026-09-15',
    verifiedBy: 'Human Researcher'
  }
];

export const PLURALITY_INTERVIEW_RECORDS: PluralityInterviewRecord[] = [
  {
    id: 'PL-01',
    practitionerName: 'Urmila Shukla (Age 74)',
    familyElder: 'Late Pt. Radheshyam Shukla',
    locality: 'Nayaganj, Kanpur',
    dishFocused: 'Satpaita & Nimona',
    originNarrative: 'यह हमारे अवध और दोआब के संगम का मूल भोजन है। सर्दियों में बथुआ खेत से कटकर आता था। मेरी सास ने सिखाया था कि दाल को कभी भी सीटी लगाकर मत गलाओ, धीमी आंच पर मटकी या पीतल की देगची में पके।',
    keyVariation: 'उड़द की छिलके वाली दाल (70%) + चना दाल (30%)। बथुआ और पालक का बारीक कटाव। कच्चा सरसों का तेल अंत में ऊपर से डाला जाता है।',
    culturalMeaning: 'सर्दियों में शरीर को ऊष्मा और वात-कफ से सुरक्षा देने वाला औषधीय भोजन।',
    transmissionMode: 'सास से बहू को मौखिक रूप से (3 पीढ़ियाँ)।',
    whoProperlyRepresents: 'कोई होटल नहीं, केवल नयागंज के पुराने कायस्थ व ब्राह्मण परिवार जो सिलबट्टे पर ही दरदरा पीसते हैं।',
    corroborationWithOthers: 'Distinct Plural Tradition'
  },
  {
    id: 'PL-02',
    practitionerName: 'Shanti Devi Nigam (Age 68)',
    familyElder: 'Babu Kripa Shankar Nigam',
    locality: 'Sisamau, Kanpur',
    dishFocused: 'Satpaita (कायस्थ शैली)',
    originNarrative: 'हमारे पूर्वज ब्रिटिश काल में कलेक्ट्रेट में मुंशी थे। गंगा किनारे से ताजी पालक और मेथी लाई जाती थी। हमारे यहाँ सरसों का तेल नहीं, शुद्ध गाय के घी में हींग और जीरे का कड़क तड़का लगता है।',
    keyVariation: 'पूरी तरह से मूंग दाल और चना दाल। इसमें उड़द का प्रयोग नहीं होता। मेथी, पालक और सोआ की सुगंध मुख्य है।',
    culturalMeaning: 'कार्तिक पूर्णिमा और मकर संक्रांति के बाद का अनिवार्य सात्विक भोजन।',
    transmissionMode: 'दादी की हस्तलिखित डायरी और प्रत्यक्ष रसोई अभ्यास।',
    whoProperlyRepresents: 'सीसामऊ के पुराने कायस्थ परिवार। वे कहते हैं कि सरसों के तेल वाली दाल सतपैता नहीं बल्कि सामान्य साग-दाल है।',
    corroborationWithOthers: 'Minor Variation'
  },
  {
    id: 'PL-03',
    practitionerName: 'Ram Narayan Mishra (Age 81)',
    familyElder: 'Mahant Janki Ballabh Mishra',
    locality: 'Bithoor Brahmavart Ghat, Kanpur Dehat border',
    dishFocused: 'निमोना (ताजी मटर का रसा) एवं दलभरी पूरी',
    originNarrative: 'बिठूर के घाटों पर साधु-संतों और गंगा यात्रियों के लिए पौष मास में बनने वाला भोजन। हरी मटर को पानी की एक बूंद डाले बिना सिलबट्टे पर मथा जाता है। लहसुन-प्याज पूर्णतः वर्जित है।',
    keyVariation: 'हरे धनिए, अदरक, हरी मिर्च और बड़ी (उड़द की मंगौड़ी) का देसी घी में भुना हुआ पेस्ट। कोई हल्दी नहीं डाली जाती, इसका रंग गाढ़ा पन्ना हरा (emerald green) रहता है।',
    culturalMeaning: 'गंगा तीरे पौष उत्सव एवं नव-अन्न (ताजी मटर) का प्रथम भोग।',
    transmissionMode: 'घाट की पारंपरिक रसोइयों में 4 पीढ़ियों से निरंतर।',
    whoProperlyRepresents: 'ब्रह्मावर्त घाट के तीर्थ पुरोहित परिवार।',
    corroborationWithOthers: 'Distinct Plural Tradition'
  },
  {
    id: 'PL-04',
    practitionerName: 'Kaushalya Gupta (Age 65)',
    familyElder: 'Seth Bansidhar Gupta',
    locality: 'Generalganj Cloth Market, Kanpur',
    dishFocused: 'दाल का दूल्हा (दाल की दुल्हन)',
    originNarrative: 'व्यापारियों के घरों में जब पुरुष देर रात गद्दी से लौटते थे, तो एक ही बर्तन में आटा और दाल साथ पक जाते थे—पौष्टिक, सुपाच्य और तुरंत तैयार होने वाला संपूर्ण भोजन।',
    keyVariation: 'अरहर (तूर) दाल में अजवायन मिले गेहूं के आटे के 4-कोने वाले फूल बनाकर उबाले जाते हैं। ऊपर से भुना हुआ बुकनू (Buknu) छिड़का जाता है।',
    culturalMeaning: 'व्यापारी परिवारों का कार्यकुशल और संतोषप्रद संपूर्ण आहार।',
    transmissionMode: 'संयुक्त परिवार में ननद और देवरानी-जेठानी की साझा रसोई।',
    whoProperlyRepresents: 'जनरलगंज और नौघड़ा के मारवाड़ी-वैश्य व्यापारी घराने।',
    corroborationWithOthers: 'Distinct Plural Tradition'
  },
  {
    id: 'PL-05',
    practitionerName: 'Meena Tiwari (Age 58) & Daughter Priyanshi (Age 23)',
    familyElder: 'Dr. Hari Mohan Tiwari',
    locality: 'Govind Nagar, Kanpur',
    dishFocused: 'सर्दियों का निमोना एवं बाजरा-बुकनू पराठा',
    originNarrative: 'मेरी बेटी बैंगलोर में सॉफ्टवेयर इंजीनियर है। वह जब भी घर आती है, तो पहली मांग निमोना की होती है। लेकिन वह इसे मिक्सी में पीसती है, जिससे मटर का दाना कट जाता है और वह स्वाद नहीं आता।',
    keyVariation: 'मटर का आधा हिस्सा दरदरा पिसा, आधा हिस्सा साबुत दाना। सरसों के तेल में पहले मटर को 20 मिनट धीमी आंच पर भूनना।',
    culturalMeaning: 'प्रवासी संतानों के लिए कानपुर की जड़ों और घर की स्मृति का प्रतीक।',
    transmissionMode: 'माँ-बेटी के बीच आधुनिक वीडियो कॉल और सप्ताहांत की रसोई।',
    whoProperlyRepresents: 'कानपुर के वे परिवार जिनकी संताने महानगरों में हैं लेकिन घर के स्वाद की तलाश में हैं।',
    corroborationWithOthers: 'Minor Variation'
  }
];

