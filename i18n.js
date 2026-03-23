/* ── i18n.js — language detection, translations, theme ─────── */
(function () {
  'use strict';

  var T = {

    /* ── English ──────────────────────────────────────────── */
    en: {
      'title.index':    'Khelifi Mohamed Yacine — Portfolio',
      'title.personal': 'Life Beyond Code — Khelifi Mohamed Yacine',
      'nav.home': 'Home', 'nav.about': 'About', 'nav.projects': 'Projects',
      'nav.skills': 'Skills', 'nav.contact': 'Contact',
      'nav.hire': 'Hire Me', 'nav.portfolio': '← Portfolio',
      'hero.greeting': "Hello, I'm",
      'hero.bio': 'Computer Science student at the University of Exeter. I build full-stack applications and work with machine learning, computer vision, and NLP. Outside of code: anime, drawing, books, and writing.',
      'hero.work': 'View My Work', 'hero.touch': 'Get In Touch', 'hero.life': 'More About My Life',
      'stat.projects': 'Projects', 'stat.tech': 'Technologies', 'stat.years': 'Years Coding',
      'about.tag': '// who I am', 'about.h': 'About', 'about.accent': 'Me',
      'about.lead': "I'm <strong>Khelifi Mohamed Yacine</strong>, a final-year Computer Science student at the University of Exeter. I've worked across machine learning, computer vision, NLP, and full-stack development, from training CNNs on medical imaging data to building microservice backends with language model integrations.",
      'about.body': "My degree covered machine learning, computer vision, NLP, full-stack web development, functional programming, and team-based software engineering. Every project pushed me into a different part of the stack.",
      'card.degree': 'BSc Computer Science', 'card.uni': 'University of Exeter',
      'card.year': 'Final Year · 2022 – 2025', 'card.location': 'United Kingdom',
      'card.city': 'Exeter, England', 'card.avail': 'Remote · Hybrid · On-site',
      'card.uni.back': 'Final year studying Machine Learning, Computer Vision, NLP, Functional Programming, and Software Engineering. Theory and practical systems side by side.',
      'card.loc.hl': 'Open to the World',
      'card.loc.back': "Based in Exeter, UK. Open to remote, hybrid, or on-site roles. I've lived across 5 countries and adjust easily to new team environments.",
      'proj.tag': "// what I've built", 'proj.h': 'Featured', 'proj.accent': 'Projects',
      'orb.notice': 'Click the central circuit to pause rotation, then select a project node',
      'orb.idle': 'Click any node<br>to see project details',
      'orb.r1': 'Inner — Core Projects', 'orb.r2': 'Middle — Academic', 'orb.r3': 'Outer — Additional',
      'orb.view': 'View Details →',
      'skills.tag': '// what I work with', 'skills.h': 'Skills & ', 'skills.accent': 'Tech',
      'contact.tag': "// let's connect", 'contact.h': 'Get In', 'contact.accent': 'Touch',
      'contact.lead': "I'm open to new opportunities and collaborations. If you have a project in mind or just want to connect, feel free to reach out.",
      'contact.name.l': 'Name', 'contact.email.l': 'Email', 'contact.msg.l': 'Message',
      'contact.name.p': 'Your name', 'contact.email.p': 'your@email.com', 'contact.msg.p': "What's on your mind?",
      'contact.send': 'Send Message',
      'personal.tag': '// beyond the code', 'personal.h': 'Life Beyond', 'personal.accent': 'Code',
      'personal.lead': "Software is my craft, but curiosity is my nature. When I step away from the terminal, you'll find me deep in an anime arc, filling sketchbooks with character art, chasing big ideas in books, or writing to understand the world a little better.",
      'tab.anime': 'Anime', 'tab.drawing': 'Drawing', 'tab.reading': 'Reading', 'tab.travels': 'Travels',
      'anime.desc': "A few series that left a permanent mark — stories I'll carry for life.",
      'drawing.desc': 'Character art, manga-style panels, and creatures from the worlds I love.',
      'reading.desc': 'Books that permanently changed how I see the world — ones I keep coming back to.',
      'travels.langs': '🗣️ Languages I Speak', 'travels.h': "Countries I've Visited",
      'travels.desc': 'Five countries, each one reshaping how I see the world.',
      'lang.arabic': 'Arabic', 'lang.french': 'French', 'lang.english': 'English',
      'lang.native': 'Native', 'lang.fluent': 'Fluent',
    },

    /* ── Français ─────────────────────────────────────────── */
    fr: {
      'title.index':    'Khelifi Mohamed Yacine — Portfolio',
      'title.personal': 'La vie au-delà du code — Khelifi Mohamed Yacine',
      'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.projects': 'Projets',
      'nav.skills': 'Compétences', 'nav.contact': 'Contact',
      'nav.hire': 'Embauchez-moi', 'nav.portfolio': '← Portfolio',
      'hero.greeting': 'Bonjour, je suis',
      'hero.bio': "Étudiant en informatique à l'Université d'Exeter. Je développe des applications full-stack et travaille en machine learning, vision par ordinateur et TAL. En dehors du code : anime, dessin, livres et écriture.",
      'hero.work': 'Voir mes projets', 'hero.touch': 'Me contacter', 'hero.life': 'Ma vie en dehors du code',
      'stat.projects': 'Projets', 'stat.tech': 'Technologies', 'stat.years': 'Ans de code',
      'about.tag': '// qui je suis', 'about.h': 'À propos', 'about.accent': 'de moi',
      'about.lead': "Je suis <strong>Khelifi Mohamed Yacine</strong>, étudiant en dernière année d'informatique à l'Université d'Exeter. J'ai travaillé en machine learning, vision par ordinateur, TAL et développement full-stack, de l'entraînement de CNN sur images médicales à la construction de backends microservices avec intégration de modèles de langage.",
      'about.body': "Mon cursus couvre le machine learning, la vision par ordinateur, le TAL, le développement web full-stack, la programmation fonctionnelle et l'ingénierie logicielle en équipe. Chaque projet m'a poussé dans une autre partie du stack.",
      'card.degree': 'Licence Informatique', 'card.uni': "Université d'Exeter",
      'card.year': 'Dernière année · 2022–2025', 'card.location': 'Royaume-Uni',
      'card.city': 'Exeter, Angleterre', 'card.avail': 'Distanciel · Hybride · Présentiel',
      'card.uni.back': "Dernière année en Machine Learning, Vision par ordinateur, TAL, Programmation fonctionnelle et Génie logiciel. Théorie et systèmes pratiques côte à côte.",
      'card.loc.hl': 'Ouvert au monde',
      'card.loc.back': "Basé à Exeter, Royaume-Uni. Ouvert aux postes en distanciel, hybride ou présentiel. J'ai vécu dans 5 pays et m'adapte facilement à de nouveaux environnements.",
      'proj.tag': "// ce que j'ai construit", 'proj.h': 'Projets', 'proj.accent': 'phares',
      'orb.notice': 'Cliquez sur le circuit central pour mettre en pause, puis sélectionnez un projet',
      'orb.idle': 'Cliquez sur un nœud<br>pour voir les détails',
      'orb.r1': 'Intérieur — Projets principaux', 'orb.r2': 'Milieu — Académique', 'orb.r3': 'Extérieur — Supplémentaire',
      'orb.view': 'Voir les détails →',
      'skills.tag': '// mes outils', 'skills.h': 'Compétences ', 'skills.accent': 'Techniques',
      'contact.tag': '// restons en contact', 'contact.h': 'Prendre', 'contact.accent': 'contact',
      'contact.lead': "Je suis ouvert aux nouvelles opportunités et collaborations. Si vous avez un projet en tête ou souhaitez simplement échanger, n'hésitez pas à me contacter.",
      'contact.name.l': 'Nom', 'contact.email.l': 'E-mail', 'contact.msg.l': 'Message',
      'contact.name.p': 'Votre nom', 'contact.email.p': 'votre@email.com', 'contact.msg.p': 'Votre message…',
      'contact.send': 'Envoyer',
      'personal.tag': '// au-delà du code', 'personal.h': 'La vie au-delà du', 'personal.accent': 'code',
      'personal.lead': "Le logiciel est mon métier, mais la curiosité est ma nature. Quand je m'éloigne du terminal, vous me trouverez plongé dans un anime, à remplir des carnets de croquis, à chasser de grandes idées dans des livres, ou à écrire pour mieux comprendre le monde.",
      'tab.anime': 'Anime', 'tab.drawing': 'Dessin', 'tab.reading': 'Lecture', 'tab.travels': 'Voyages',
      'anime.desc': "Quelques séries qui ont laissé une empreinte permanente — des histoires que je porterai toute ma vie.",
      'drawing.desc': "Art de personnages, planches manga et créatures des mondes que j'aime.",
      'reading.desc': "Des livres qui ont changé ma façon de voir le monde — que je relis sans cesse.",
      'travels.langs': '🗣️ Langues que je parle', 'travels.h': 'Pays visités',
      'travels.desc': 'Cinq pays, chacun ayant façonné ma vision du monde.',
      'lang.arabic': 'Arabe', 'lang.french': 'Français', 'lang.english': 'Anglais',
      'lang.native': 'Langue maternelle', 'lang.fluent': 'Courant',
    },

    /* ── العربية ──────────────────────────────────────────── */
    ar: {
      'title.index':    'خليفي محمد ياسين — المحفظة',
      'title.personal': 'الحياة خارج الكود — خليفي محمد ياسين',
      'nav.home': 'الرئيسية', 'nav.about': 'عني', 'nav.projects': 'المشاريع',
      'nav.skills': 'المهارات', 'nav.contact': 'تواصل',
      'nav.hire': 'وظّفني', 'nav.portfolio': 'المحفظة ←',
      'hero.greeting': 'مرحباً، أنا',
      'hero.bio': 'طالب علوم حاسوب في جامعة إكستر. أطوّر تطبيقات full-stack وأعمل في التعلم الآلي والرؤية الحاسوبية ومعالجة اللغات. خارج الكود: أنيمي، رسم، كتب وكتابة.',
      'hero.work': 'استعرض أعمالي', 'hero.touch': 'تواصل معي', 'hero.life': 'المزيد عن حياتي',
      'stat.projects': 'مشروع', 'stat.tech': 'تقنية', 'stat.years': 'سنوات',
      'about.tag': '// من أنا', 'about.h': 'نبذة', 'about.accent': 'عني',
      'about.lead': "أنا <strong>خليفي محمد ياسين</strong>، طالب في السنة الأخيرة لعلوم الحاسوب في جامعة إكستر. عملت في التعلم الآلي والرؤية الحاسوبية ومعالجة اللغات والتطوير full-stack، من تدريب شبكات CNN على صور طبية إلى بناء خدمات مصغّرة مع تكامل نماذج اللغة.",
      'about.body': "غطّى تخصصي التعلم الآلي والرؤية الحاسوبية ومعالجة اللغات وتطوير الويب والبرمجة الوظيفية وهندسة البرمجيات. كل مشروع دفعني إلى جزء مختلف من المنظومة.",
      'card.degree': 'بكالوريوس علوم الحاسوب', 'card.uni': 'جامعة إكستر',
      'card.year': 'السنة الأخيرة · 2022–2025', 'card.location': 'المملكة المتحدة',
      'card.city': 'إكستر، إنجلترا', 'card.avail': 'عن بُعد · هجين · حضوري',
      'card.uni.back': 'السنة الأخيرة في تعلم الآلة والرؤية الحاسوبية ومعالجة اللغات والبرمجة الوظيفية وهندسة البرمجيات. نظرية وتطبيق عملي جنباً إلى جنب.',
      'card.loc.hl': 'منفتح على العالم',
      'card.loc.back': 'مقيم في إكستر، المملكة المتحدة. منفتح للعمل عن بُعد أو هجين أو حضوري. عشت في 5 دول وأتأقلم بسهولة مع بيئات الفرق الجديدة.',
      'proj.tag': '// ما بنيته', 'proj.h': 'المشاريع', 'proj.accent': 'المميّزة',
      'orb.notice': 'انقر على الدائرة المركزية لإيقاف الدوران، ثم اختر مشروعاً',
      'orb.idle': 'انقر على أي نقطة<br>لرؤية تفاصيل المشروع',
      'orb.r1': 'داخلي — المشاريع الأساسية', 'orb.r2': 'وسط — أكاديمي', 'orb.r3': 'خارجي — إضافي',
      'orb.view': 'عرض التفاصيل',
      'skills.tag': '// أدواتي', 'skills.h': 'المهارات ', 'skills.accent': 'التقنية',
      'contact.tag': '// لنتحدث', 'contact.h': 'تواصل', 'contact.accent': 'معي',
      'contact.lead': 'أنا منفتح للفرص والتعاونات الجديدة. إن كان لديك مشروع في ذهنك أو تريد فقط التواصل، لا تتردد.',
      'contact.name.l': 'الاسم', 'contact.email.l': 'البريد الإلكتروني', 'contact.msg.l': 'الرسالة',
      'contact.name.p': 'اسمك', 'contact.email.p': 'your@email.com', 'contact.msg.p': 'ما الذي تريد قوله؟',
      'contact.send': 'إرسال الرسالة',
      'personal.tag': '// خارج الكود', 'personal.h': 'الحياة خارج', 'personal.accent': 'الكود',
      'personal.lead': 'البرمجة حرفتي، لكن الفضول طبيعتي. حين أبتعد عن الطرفية، ستجدني غارقاً في أنيمي، أملأ دفاتر رسم بفن الشخصيات، أطارد أفكاراً كبيرة في الكتب، أو أكتب لأفهم العالم أكثر.',
      'tab.anime': 'أنيمي', 'tab.drawing': 'رسم', 'tab.reading': 'قراءة', 'tab.travels': 'سفر',
      'anime.desc': 'بعض المسلسلات التي تركت أثراً دائماً — قصص أحملها مدى الحياة.',
      'drawing.desc': 'فن الشخصيات، لوحات على طراز المانغا، ومخلوقات من العوالم التي أحبها.',
      'reading.desc': 'كتب غيّرت نظرتي للعالم بشكل دائم — أعود إليها مراراً.',
      'travels.langs': '🗣️ اللغات التي أتكلمها', 'travels.h': 'الدول التي زرتها',
      'travels.desc': 'خمس دول، كلٌّ منها أعادت تشكيل نظرتي للعالم.',
      'lang.arabic': 'العربية', 'lang.french': 'الفرنسية', 'lang.english': 'الإنجليزية',
      'lang.native': 'الأم', 'lang.fluent': 'طليق',
    },
  };

  /* ─────────────── core ──────────────────────────────────── */
  function getLang() {
    var s = localStorage.getItem('lang');
    if (s && T[s]) return s;
    var l = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').slice(0, 2).toLowerCase();
    return T[l] ? l : 'en';
  }

  function apply(lang) {
    var t = T[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t[el.dataset.i18nHtml];
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var v = t[el.dataset.i18nPh];
      if (v !== undefined) el.placeholder = v;
    });

    var titleKey = document.getElementById('personal-hero') ? 'title.personal' : 'title.index';
    if (t[titleKey]) document.title = t[titleKey];

    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    localStorage.setItem('lang', lang);
  }

  /* ─────────────── theme ─────────────────────────────────── */
  function initTheme() {
    var html = document.documentElement;
    var s    = localStorage.getItem('theme');
    if (s === 'dark')  html.classList.add('dark');
    if (s === 'light') html.classList.add('light');

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isLight = html.classList.contains('light') ||
          (!html.classList.contains('dark') &&
           window.matchMedia('(prefers-color-scheme: light)').matches);
        html.classList.remove('light', 'dark');
        if (isLight) {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          html.classList.add('light');
          localStorage.setItem('theme', 'light');
        }
      });
    });
  }

  /* ─────────────── boot ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    apply(getLang());
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { apply(btn.dataset.lang); });
    });
    initTheme();
  });
})();
