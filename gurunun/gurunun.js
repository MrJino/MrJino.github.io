(() => {
  const STORAGE_KEY = 'mrjino-language';
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
  const isKorean = browserLocales.some((locale) => /^ko(?:-|$)/i.test(locale) || /-KR$/i.test(locale))
    || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul';
  const language = savedLanguage === 'ko' || savedLanguage === 'en' ? savedLanguage : isKorean ? 'ko' : 'en';

  const english = {
    skip: 'Skip to Skills',
    backHome: 'MrJino home',
    heroLine1: 'Where fun and learning',
    heroLine2: 'naturally connect',
    heroDescription: 'Gurunun is a personal project that brings casual games, quizzes, music, and small everyday learning experiences together in one place.',
    openGurunun: 'Start Gurunun',
    viewSkills: 'Explore Skills',
    skillsTitle: 'Turning what I learn by building into reusable knowledge.',
    skillsDescription: 'A growing collection of workflows, design principles, and repeatable practices accumulated while building and operating Gurunun.',
    skillsAction: 'Explore the Skills Library',
    footerBack: 'BACK TO MRJINO ↑',
  };

  const englishAttributes = {
    homeLabel: 'MrJino home',
    languageLabel: 'Language selection',
    visualLabel: 'Gurunun service preview',
    visualAlt: 'Gurunun service home screen',
  };

  document.documentElement.lang = language;
  localStorage.setItem(STORAGE_KEY, language);

  if (language === 'en') {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const translated = english[element.dataset.i18n];
      if (translated) element.textContent = translated;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const translated = englishAttributes[element.dataset.i18nAriaLabel];
      if (translated) element.setAttribute('aria-label', translated);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const translated = englishAttributes[element.dataset.i18nAlt];
      if (translated) element.setAttribute('alt', translated);
    });
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
    button.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, button.dataset.language);
      window.location.reload();
    });
  });
})();
