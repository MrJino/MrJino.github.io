const tabs = [...document.querySelectorAll('[data-history-tab]')];
const panels = [...document.querySelectorAll('[data-history-panel]')];
const defaultCategory = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.dataset.historyTab;

function getCategoryFromUrl() {
  const category = new URLSearchParams(window.location.search).get('tab');
  return tabs.some((tab) => tab.dataset.historyTab === category) ? category : defaultCategory;
}

function updateTabParameter(category) {
  const url = new URL(window.location.href);
  if (url.searchParams.get('tab') === category) return;
  url.searchParams.set('tab', category);
  window.history.pushState({}, '', url);
}

function selectHistory(category, focusTab = false, updateUrl = false) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.historyTab === category;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) tab.focus();
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.historyPanel !== category;
  });
  if (updateUrl) updateTabParameter(category);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectHistory(tab.dataset.historyTab, false, true));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectHistory(tabs[nextIndex].dataset.historyTab, true, true);
  });
});

window.addEventListener('popstate', () => selectHistory(getCategoryFromUrl()));

selectHistory(getCategoryFromUrl());
