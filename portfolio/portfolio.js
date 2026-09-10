const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
const closeButton = document.getElementById('close-project');
let opener = null;
let savedScrollY = 0;
let savedBodyStyles = null;

function openProject(button) {
  const template = document.getElementById(`${button.dataset.project}-content`);
  if (!template || dialog.open) return;
  opener = button;
  const content = template.content.cloneNode(true);
  content.querySelector('h3').id = 'dialog-title';
  dialogContent.replaceChildren(content);
  savedScrollY = window.scrollY;
  savedBodyStyles = {
    position: document.body.style.position,
    top: document.body.style.top,
    width: document.body.style.width,
  };
  // Keep the document still, including on touch devices.
  Object.assign(document.body.style, { position: 'fixed', top: `-${savedScrollY}px`, width: '100%' });
  dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button));
});
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    dialog.close();
  }
});
dialog.addEventListener('close', () => {
  if (savedBodyStyles) Object.assign(document.body.style, savedBodyStyles);
  window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  opener?.focus({ preventScroll: true });
  dialogContent.replaceChildren();
  opener = null;
  savedBodyStyles = null;
});

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.work-card');
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let visibleCount = 0;
    cards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) visibleCount += 1;
    });
    document.querySelector('.work-grid').classList.toggle('is-filtered', filter !== 'all');
    document.getElementById('work-count').textContent = `${visibleCount}개의 프로젝트`;
  });
});

// Update navigation without changing the user's natural scrolling behavior.
const sections = [...document.querySelectorAll('main > section[id]')];
const navLinks = document.querySelectorAll('.section-nav a');
let scrollUpdatePending = false;
function updateNavigation() {
  scrollUpdatePending = false;
  if (dialog.open) return;
  const headerHeight = document.querySelector('.site-header').offsetHeight;
  let active = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerHeight + 120) active = section;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) active = sections.at(-1);
  navLinks.forEach((link) => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!scrollUpdatePending) {
    scrollUpdatePending = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('load', updateNavigation);
updateNavigation();

// Keep native details behavior as a fallback, and animate both directions.
const aboutDetails = document.querySelector('.about-details');
if (aboutDetails && typeof aboutDetails.animate === 'function') {
  const summary = aboutDetails.querySelector('summary');
  const copy = aboutDetails.querySelector('.about-details-copy');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let expanded = aboutDetails.open;
  let heightAnimation = null;
  let fadeAnimation = null;

  function settleAboutDetails() {
    if (heightAnimation) heightAnimation.onfinish = null;
    heightAnimation?.cancel();
    fadeAnimation?.cancel();
    heightAnimation = null;
    fadeAnimation = null;
    aboutDetails.open = expanded;
    aboutDetails.classList.remove('is-animating');
  }

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const startHeight = aboutDetails.getBoundingClientRect().height;
    const startOpacity = aboutDetails.open ? Number(getComputedStyle(copy).opacity) : 0;
    expanded = !expanded;
    settleAboutDetails();
    if (reducedMotion.matches) return;

    // Measure the natural target height before keeping content visible to animate.
    const endHeight = aboutDetails.getBoundingClientRect().height;
    aboutDetails.open = true;
    aboutDetails.classList.add('is-animating');
    const timing = { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' };
    heightAnimation = aboutDetails.animate([
      { height: `${startHeight}px` },
      { height: `${endHeight}px` },
    ], timing);
    fadeAnimation = copy.animate([
      { opacity: startOpacity },
      { opacity: expanded ? 1 : 0 },
    ], timing);
    heightAnimation.onfinish = settleAboutDetails;
  });

  // Avoid stale pixel heights after a viewport or motion-preference change.
  window.addEventListener('resize', () => {
    if (heightAnimation) settleAboutDetails();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) settleAboutDetails();
  });
}
