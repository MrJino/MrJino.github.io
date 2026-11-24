import { skillAreas, skills } from './skills-data.js';

const STORAGE_KEY = 'mrjino-language';
const savedLanguage = localStorage.getItem(STORAGE_KEY);
const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
const isKorean = browserLocales.some((locale) => /^ko(?:-|$)/i.test(locale) || /-KR$/i.test(locale))
  || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul';
const language = savedLanguage === 'ko' || savedLanguage === 'en' ? savedLanguage : isKorean ? 'ko' : 'en';

const english = {
  skip: 'Skip to the skills list',
  backGurunun: 'About Gurunun',
  heroDescription: 'A simple, growing record of the working principles shaped while building Gurunun.',
  collectionTitle: 'Skills',
  skillCountUnit: ' entries',
  emptyArea: 'No skills have been added yet.',
  interfaceDescription: 'UI design principles for creating consistent screens and interactions.',
  modalTitle: 'Edit modal',
  modalRuleHeader: 'Keep the header outside the scroll area and add a divider below it.',
  modalRuleFooter: 'Keep the footer actions outside the scroll area and add a divider above them.',
  modalRuleDeleteButton: 'Place the delete button on the left side of the footer actions in an edit modal.',
  modalRuleDeleteConfirm: 'Always show the user a confirmation dialog before proceeding with any deletion.',
  modalExampleCaption: 'Edit modal example',
  confirmationTitle: 'Confirmation dialog',
  confirmationExampleCaption: 'Confirmation dialog example',
  confirmationRuleContextIcon: 'Show an icon appropriate to the situation on the left side of the dialog.',
  notificationTitle: 'User notifications',
  notificationRuleSnackbar: 'Show brief user notifications, such as “Your feedback has been received,” as a snackbar instead of creating a separate notification area.',
  footerBack: 'BACK TO MRJINO ↑',
};

const englishAttributes = {
  homeLabel: 'MrJino home',
  languageLabel: 'Language selection',
  modalExampleAlt: 'Example task edit modal with a separated header, scrollable body, and footer actions for delete, cancel, and save',
  confirmationExampleAlt: 'Example confirmation dialog asking whether to cancel card creation, with actions to keep editing or confirm',
};

function localized(value) {
  if (typeof value === 'string') return value;
  return value?.[language] || value?.ko || value?.en || '';
}

function createSkillItem(skill, index) {
  const item = document.createElement('li');
  const content = document.createElement(skill.href ? 'a' : 'div');
  content.className = 'skill-item';
  if (skill.href) content.href = skill.href;

  const number = document.createElement('span');
  number.className = 'skill-item__number';
  number.textContent = String(index + 1).padStart(2, '0');

  const title = document.createElement('h2');
  title.textContent = localized(skill.title);

  const summary = document.createElement('p');
  summary.textContent = localized(skill.summary);

  content.append(number, title, summary);
  if (skill.href) {
    const arrow = document.createElement('span');
    arrow.className = 'skill-item__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    content.append(arrow);
  }

  item.append(content);
  return item;
}

function createSkillGroup(area) {
  const areaSkills = skills.filter((skill) => skill.area === area.id);
  const section = document.createElement('section');
  section.className = 'skill-group';
  section.setAttribute('aria-labelledby', `skill-area-${area.id}`);

  const header = document.createElement('header');
  header.className = 'skill-group__header';

  const heading = document.createElement('div');
  const title = document.createElement('h3');
  title.id = `skill-area-${area.id}`;
  title.textContent = area.title;
  const description = document.createElement('p');
  description.textContent = localized(area.description);
  heading.append(title, description);

  const count = document.createElement('span');
  count.textContent = String(areaSkills.length).padStart(2, '0');
  count.setAttribute('aria-label', `${areaSkills.length}`);
  header.append(heading, count);

  const list = document.createElement('ol');
  list.className = 'skills-list';
  if (areaSkills.length) {
    list.append(...areaSkills.map(createSkillItem));
  } else {
    const empty = document.createElement('li');
    empty.className = 'skill-group__empty';
    empty.textContent = language === 'en' ? english.emptyArea : '아직 정리된 Skill이 없습니다.';
    list.append(empty);
  }

  section.append(header, list);
  return section;
}

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

document.querySelectorAll('[data-skill-count]').forEach((element) => {
  element.textContent = String(skills.length);
});

document.querySelector('[data-skill-groups]').replaceChildren(...skillAreas.map(createSkillGroup));
