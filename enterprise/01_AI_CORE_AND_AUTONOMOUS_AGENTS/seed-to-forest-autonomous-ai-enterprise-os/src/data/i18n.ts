export type SupportedLanguage = 'en' | 'hi' | 'de' | 'ja' | 'ar';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  motto: string;
  tabs: {
    deepDive: string;
    simulator: string;
    constitution: string;
    treasury: string;
    microBusiness: string;
    techStack: string;
    roadmap: string;
  };
  badges: {
    concept: string;
    proposed: string;
    simulated: string;
    prototype: string;
    implemented: string;
    tested: string;
    humanVerified: string;
    productionReady: string;
    demoData: string;
    astEnforced: string;
  };
  actions: {
    exportCode: string;
    integrityAudit: string;
    simulateRevenue: string;
    emergencyFreeze: string;
    resetState: string;
    close: string;
    testValidation: string;
    signWithKey: string;
    reject: string;
    runLoop: string;
  };
  treasury: {
    proposedTitle: string;
    proposedSubtitle: string;
    totalCapital: string;
    humanReserve: string;
    aiOps: string;
    spendingCap: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: 'Seed to Forest',
    appSubtitle: 'Autonomous AI Enterprise OS • 90-Day Execution Engine',
    motto: '"One human planted the seed, the system grew the entire forest" — Autonomous AI Venture OS',
    tabs: {
      deepDive: '🎯 Strategic Choice',
      simulator: '🧠 Opportunity Engine',
      constitution: '🏛️ Constitution',
      treasury: '💰 Treasury Vault',
      microBusiness: '💡 Micro-Businesses',
      techStack: '⚡ Tech Stack',
      roadmap: '📅 90-Day Roadmap'
    },
    badges: {
      concept: 'CONCEPT',
      proposed: 'PROPOSED',
      simulated: 'SIMULATED',
      prototype: 'PROTOTYPE',
      implemented: 'IMPLEMENTED',
      tested: 'TESTED',
      humanVerified: 'HUMAN VERIFIED',
      productionReady: 'PRODUCTION READY',
      demoData: 'DEMO DATA',
      astEnforced: 'AST ENFORCED'
    },
    actions: {
      exportCode: 'Export Code',
      integrityAudit: 'Integrity Audit (10-Point)',
      simulateRevenue: '+₹398 Simulate Revenue',
      emergencyFreeze: 'Emergency Circuit Breaker',
      resetState: 'Reset State',
      close: 'Close',
      testValidation: 'Execute Constitution Check',
      signWithKey: 'Sign with Founder Key',
      reject: 'Reject & Abort',
      runLoop: 'Run 5-Agent Pipeline'
    },
    treasury: {
      proposedTitle: 'CURRENT PROPOSED ALLOCATION — NOT YET FINAL PROTOCOL PARAMETERS',
      proposedSubtitle: 'Proposed economic split to be governed by decentralized parameters at scale.',
      totalCapital: 'Total Initial Capital',
      humanReserve: '80% Human Reserved (Multi-Sig)',
      aiOps: '20% AI Autonomous Ops Budget',
      spendingCap: 'Hard ₹5,000 Single Action Cap'
    }
  },
  hi: {
    appTitle: 'बीज से जंगल (Seed to Forest)',
    appSubtitle: 'स्वायत्त AI उद्यम ओएस • 90-दिवसीय निष्पादन इंजन',
    motto: '"एक इंसान ने बीज लगाया, बाकी जंगल system ने खुद उगाया" — The Seed Phase (Day 1 - 90)',
    tabs: {
      deepDive: '🎯 त्वरित निर्णय (Quick Focus)',
      simulator: '🧠 अवसर इंजन (Agent Brain)',
      constitution: '🏛️ संविधान (Constitution)',
      treasury: '💰 खजाना (Treasury Vault)',
      microBusiness: '💡 पहला व्यापार (Micro-SaaS)',
      techStack: '⚡ टेक स्टैक (Tech Stack)',
      roadmap: '📅 90-दिन रोडमैप (Roadmap)'
    },
    badges: {
      concept: 'संकल्पना (CONCEPT)',
      proposed: 'प्रस्तावित (PROPOSED)',
      simulated: 'सिम्युलेटेड (SIMULATED)',
      prototype: 'प्रोटोटाइप (PROTOTYPE)',
      implemented: 'लागू (IMPLEMENTED)',
      tested: 'परीक्षित (TESTED)',
      humanVerified: 'मानव सत्यापित (HUMAN VERIFIED)',
      productionReady: 'उत्पादन तैयार (PRODUCTION READY)',
      demoData: 'डेमो डेटा (DEMO DATA)',
      astEnforced: 'AST लागू (AST ENFORCED)'
    },
    actions: {
      exportCode: 'एक्सपोर्ट कोड',
      integrityAudit: 'सत्यनिष्ठा ऑडिट (10-बिंदु)',
      simulateRevenue: '+₹398 राजस्व सिमुलेशन',
      emergencyFreeze: 'आपातकालीन सर्किट ब्रेकर',
      resetState: 'स्टेट रीसेट करें',
      close: 'बंद करें',
      testValidation: 'संविधान चेक रन करें',
      signWithKey: 'संस्थापक कुंजी से साइन करें',
      reject: 'अस्वीकार करें',
      runLoop: '5-एजेंट पाइपलाइन चलाएं'
    },
    treasury: {
      proposedTitle: 'वर्तमान प्रस्तावित आवंटन — अभी अंतिम प्रोटोकॉल पैरामीटर नहीं',
      proposedSubtitle: 'भविष्य के विकेंद्रीकृत प्रोटोकॉल के लिए प्रस्तावित आर्थिक आवंटन ढांचा।',
      totalCapital: 'कुल प्रारंभिक पूंजी',
      humanReserve: '80% सुरक्षित रिज़र्व (मल्टी-सिग)',
      aiOps: '20% स्वायत्त AI ऑप्स बजट',
      spendingCap: 'प्रति एक्शन ₹5,000 की सीमा'
    }
  },
  de: {
    appTitle: 'Samen zum Wald (Seed to Forest)',
    appSubtitle: 'Autonomes KI-Unternehmens-Betriebssystem • 90-Tage-Ausführungs-Engine',
    motto: '"Ein Mensch pflanzte den Samen, das System ließ den ganzen Wald wachsen"',
    tabs: {
      deepDive: '🎯 Strategie-Studio',
      simulator: '🧠 Opportunity-Engine',
      constitution: '🏛️ Verfassung',
      treasury: '💰 Schatzamt-Tresor',
      microBusiness: '💡 Mikro-Unternehmen',
      techStack: '⚡ Technologie-Stack',
      roadmap: '📅 90-Tage-Roadmap'
    },
    badges: {
      concept: 'KONZEPT',
      proposed: 'VORGESCHLAGEN',
      simulated: 'SIMULIERT',
      prototype: 'PROTOTYP',
      implemented: 'IMPLEMENTIERT',
      tested: 'GETESTET',
      humanVerified: 'MENSCHLICH VERIFIZIERT',
      productionReady: 'PRODUKTIONSBEREIT',
      demoData: 'DEMODATEN',
      astEnforced: 'AST-ERZWUNGEN'
    },
    actions: {
      exportCode: 'Code exportieren',
      integrityAudit: 'Integritätsprüfung (10 Punkte)',
      simulateRevenue: '+₹398 Einnahmen simulieren',
      emergencyFreeze: 'Notfall-Trennschalter',
      resetState: 'Status zurücksetzen',
      close: 'Schließen',
      testValidation: 'Verfassungsprüfung ausführen',
      signWithKey: 'Mit Gründer-Schlüssel signieren',
      reject: 'Ablehnen & Abbrechen',
      runLoop: '5-Agenten-Pipeline ausführen'
    },
    treasury: {
      proposedTitle: 'AKTUELL VORGESCHLAGENE ZUTEILUNG — NOCH KEINE ENDGÜLTIGEN PROTOKOLLPARAMETER',
      proposedSubtitle: 'Vorgeschlagene Verteilung zur dezentralen Steuerung im Maßstab.',
      totalCapital: 'Gesamtes Anfangskapital',
      humanReserve: '80% Menschliche Reserve (Multi-Sig)',
      aiOps: '20% KI-Betriebsbudget',
      spendingCap: 'Harte Obergrenze von ₹5.000 pro Aktion'
    }
  },
  ja: {
    appTitle: '種から森へ (Seed to Forest)',
    appSubtitle: '自律型AIエンタープライズOS • 90日実行エンジン',
    motto: '「一人の人間が種を蒔き、システムが森全体を育てた」 — 自律型AIベンチャーOS',
    tabs: {
      deepDive: '🎯 戦略的選択',
      simulator: '🧠 機会発見エンジン',
      constitution: '🏛️ 憲法 (ガバナンス)',
      treasury: '💰 トレジャリー金庫',
      microBusiness: '💡 マイクロSaaS',
      techStack: '⚡ 技術スタック',
      roadmap: '📅 90日ロードマップ'
    },
    badges: {
      concept: 'コンセプト',
      proposed: '提案中',
      simulated: 'シミュレーション',
      prototype: 'プロトタイプ',
      implemented: '実装済み',
      tested: 'テスト済み',
      humanVerified: '人間検証済み',
      productionReady: '本番稼働準備完了',
      demoData: 'デモデータ',
      astEnforced: 'AST強制適用'
    },
    actions: {
      exportCode: 'コードをエクスポート',
      integrityAudit: '完全性監査 (10項目)',
      simulateRevenue: '+₹398 収益シミュレーション',
      emergencyFreeze: '緊急サーキットブレーカー',
      resetState: '状態リセット',
      close: '閉じる',
      testValidation: '憲法チェックを実行',
      signWithKey: '創業者鍵で署名',
      reject: '拒否して中止',
      runLoop: '5エージェントループ実行'
    },
    treasury: {
      proposedTitle: '現在提案中の配分 — 最終プロトコルパラメータではありません',
      proposedSubtitle: '将来の分散型プロトコルで管理される予定の経済配分フレームワーク。',
      totalCapital: '初期資本総額',
      humanReserve: '80% 人間担保リザーブ (マルチシグ)',
      aiOps: '20% AI自律運用予算',
      spendingCap: '単一アクション最大 ₹5,000 上限'
    }
  },
  ar: {
    appTitle: 'من البذرة إلى الغابة (Seed to Forest)',
    appSubtitle: 'نظام تشغيل المؤسسات المستقلة بالذكاء الاصطناعي • محرك تنفيذ 90 يوماً',
    motto: '"زرع إنسان بذرة واحدة، ونمت المنظومة لتصبح غابة كاملة" — نظام المشاريع المستقلة',
    tabs: {
      deepDive: '🎯 الخيار الاستراتيجي',
      simulator: '🧠 محرك الفرص',
      constitution: '🏛️ الدستور والضوابط',
      treasury: '💰 خزينة البروتوكول',
      microBusiness: '💡 المشاريع المصغرة',
      techStack: '⚡ البنية التقنية',
      roadmap: '📅 خارطة الـ 90 يوماً'
    },
    badges: {
      concept: 'مفهوم',
      proposed: 'مقترح',
      simulated: 'محاكاة',
      prototype: 'نموذج أولي',
      implemented: 'منفذ',
      tested: 'تم اختباره',
      humanVerified: 'تم التحقق بشرياً',
      productionReady: 'جاهز للإنتاج',
      demoData: 'بيانات تجريبية',
      astEnforced: 'مفروض عبر AST'
    },
    actions: {
      exportCode: 'تصدير الكود',
      integrityAudit: 'تدقيق النزاهة (10 نقاط)',
      simulateRevenue: '+398 روبية محاكاة الإيراد',
      emergencyFreeze: 'قاطع الدائرة في حالات الطوارئ',
      resetState: 'إعادة ضبط الحالة',
      close: 'إغلاق',
      testValidation: 'تشغيل فحص الدستور',
      signWithKey: 'توقيع بمفتاح المؤسس',
      reject: 'رفض وإلغاء',
      runLoop: 'تشغيل خطة الـ 5 وكلاء'
    },
    treasury: {
      proposedTitle: 'التوزيع المقترح حالياً — ليست معايير بروتوكول نهائية بعد',
      proposedSubtitle: 'هيكل التوزيع الاقتصادي المقترح ليخضع لمعايير الحوكمة اللامركزية مستقبلاً.',
      totalCapital: 'إجمالي رأس المال الأولي',
      humanReserve: '80% احتياطي بشري محمي (متعدد التوقيع)',
      aiOps: '20% ميزانية تشغيل الذكاء الاصطناعي المستقلة',
      spendingCap: 'سقف صارم 5000 روبية للإجراء الواحد'
    }
  }
};

export function isRTL(language: SupportedLanguage): boolean {
  return language === 'ar';
}

export function formatINR(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
