const FINAL_CARDS_STORAGE_KEY = 'worldcup-final-cards';
const DEFAULT_CARD_SOURCE = 'res/2020/boysgroup/cards.json';

let initialCards = [];
let activePool = [];
let currentRoundCards = [];
let selectedCards = [];
let currentPair = [];
let isTransitioning = false;
let hasStoredFinalWinner = false;

const poolGrid = document.getElementById('poolGrid');
const progressText = document.getElementById('progressText');
const battleTitle = document.getElementById('battleTitle');
const centerNote = document.getElementById('centerNote');
const resultBanner = document.getElementById('resultBanner');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const confirmModal = document.getElementById('confirmModal');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const cancelConfirmButton = document.getElementById('cancelConfirmButton');
const acceptConfirmButton = document.getElementById('acceptConfirmButton');
const battleGrid = document.getElementById('battleGrid');
const leftCard = document.getElementById('leftCard');
const rightCard = document.getElementById('rightCard');
const leftImage = document.getElementById('leftImage');
const rightImage = document.getElementById('rightImage');
const leftTitle = document.getElementById('leftTitle');
const rightTitle = document.getElementById('rightTitle');
const leftText = document.getElementById('leftText');
const rightText = document.getElementById('rightText');
const battleCards = [leftCard, rightCard];
const menuToggleButtons = document.querySelectorAll('[data-menu-toggle]');
const cardSourceButtons = document.querySelectorAll('[data-card-source]');
let confirmAction = null;

function shuffle(array) {
  const cloned = [...array];

  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[randomIndex]] = [cloned[randomIndex], cloned[i]];
  }

  return cloned;
}

function getRoundLabel(cardCount) {
  if (cardCount === 1) {
    return 'Winner';
  }

  return `Round of ${cardCount}`;
}

function getRoundTarget() {
  return Math.max(1, currentRoundCards.length / 2);
}

function normalizeCard(card, index, sourceDirectory) {
  return {
    id: card.id ?? index + 1,
    name: card.name ?? `Card ${String(index + 1).padStart(2, '0')}`,
    description: card.description ?? '',
    image: card.image ? `${sourceDirectory}/${card.image}` : '',
  };
}

async function loadCards(cardSource) {
  const response = await window.fetch(cardSource);

  if (!response.ok) {
    throw new Error(`Failed to load cards from ${cardSource}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : [];
  const sourceDirectory = cardSource.split('/').slice(0, -1).join('/');
  const cards = items.map((card, index) => normalizeCard(card, index, sourceDirectory));

  if (cards.length < 2) {
    throw new Error('At least two cards are required.');
  }

  initialCards = cards;
  activePool = shuffle([...initialCards]);
  currentRoundCards = [...activePool];
  selectedCards = [];
  currentPair = [];
  isTransitioning = false;
  hasStoredFinalWinner = false;

  renderPool();
  renderBattle();
}

function readFinalCards() {
  const rawValue = window.localStorage.getItem(FINAL_CARDS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse final cards from localStorage.', error);
    return [];
  }
}

function writeFinalCards(cards) {
  window.localStorage.setItem(FINAL_CARDS_STORAGE_KEY, JSON.stringify(cards));
}

function removeFinalCard(storedAt) {
  const filteredCards = readFinalCards().filter((card) => card.storedAt !== storedAt);
  writeFinalCards(filteredCards);
  renderFinalCardsHistory();
}

function clearFinalCards() {
  window.localStorage.removeItem(FINAL_CARDS_STORAGE_KEY);
  renderFinalCardsHistory();
}

function openConfirmModal(message, onConfirm) {
  confirmAction = onConfirm;
  confirmModalMessage.textContent = message;
  confirmModal.hidden = false;
  document.body.classList.add('modal-open');
  acceptConfirmButton.focus();
}

function closeConfirmModal() {
  confirmModal.hidden = true;
  document.body.classList.remove('modal-open');
  confirmAction = null;
}

function handleConfirmAccept() {
  if (typeof confirmAction === 'function') {
    confirmAction();
  }

  closeConfirmModal();
}

function formatStoredAt(storedAt) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(storedAt));
}

function renderFinalCardsHistory() {
  const storedCards = readFinalCards();

  if (storedCards.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        아직 저장된 최종 카드가 없습니다.
      </div>
    `;
    return;
  }

  historyList.innerHTML = storedCards
    .slice()
    .reverse()
    .map(
      (card) => `
        <article class="history-card">
          <div class="history-card__meta">
            <time class="history-card__time" datetime="${card.storedAt}">${formatStoredAt(card.storedAt)}</time>
            <div class="history-card__actions">
              <button class="history-card__delete" type="button" data-delete-final-card="${card.storedAt}">삭제</button>
            </div>
          </div>
          <h3>${card.name}</h3>
          <p>${card.description}</p>
        </article>
      `,
    )
    .join('');
}

function persistFinalWinner(card) {
  if (hasStoredFinalWinner) {
    return;
  }

  const storedCards = readFinalCards();
  storedCards.push({
    id: card.id,
    name: card.name,
    description: card.description,
    storedAt: new Date().toISOString(),
  });
  writeFinalCards(storedCards);
  renderFinalCardsHistory();
  hasStoredFinalWinner = true;
}

function advanceRoundIfNeeded() {
  if (activePool.length > 0) {
    return false;
  }

  if (selectedCards.length === 1) {
    currentRoundCards = [...selectedCards];
    currentPair = [];
    return true;
  }

  activePool = shuffle([...selectedCards]);
  currentRoundCards = [...activePool];
  selectedCards = [];
  currentPair = [];
  return true;
}

function renderPool() {
  const showingFinal = currentRoundCards.length === 1 && selectedCards.length === 1;
  const visibleCards = [...currentRoundCards].sort((left, right) => left.id - right.id);
  const activeIds = new Set(activePool.map((card) => card.id));
  const selectedIds = new Set(selectedCards.map((card) => card.id));

  poolGrid.innerHTML = visibleCards
    .map((card) => {
      const isAlive = activeIds.has(card.id);
      const isSelected = selectedIds.has(card.id);
      const stateClass = showingFinal ? 'selected' : isSelected ? 'selected' : isAlive ? '' : 'eliminated';

      return `
        <article class="pool-card ${stateClass}">
          ${card.image ? `<img class="pool-card__image" src="${card.image}" alt="${card.name}" />` : ''}
          <div class="number">${card.id}</div>
          <div class="name">${card.name}</div>
        </article>
      `;
    })
    .join('');
}

function renderBattle() {
  const currentRoundLabel = getRoundLabel(currentRoundCards.length);
  const roundTarget = getRoundTarget();
  progressText.textContent = `${currentRoundLabel} ${selectedCards.length} / ${roundTarget}`;

  if (currentRoundCards.length === 1 && selectedCards.length === 1) {
    persistFinalWinner(selectedCards[0]);
    battleTitle.textContent = 'Final Winner';
    centerNote.textContent = '';
    battleGrid.hidden = true;
    resultBanner.textContent = `${selectedCards[0].name} is the final winner.`;
    resultBanner.hidden = false;
    return;
  }

  if (activePool.length < 2) {
    centerNote.textContent = 'Not enough cards remain to continue.';
    return;
  }

  currentPair = shuffle(activePool).slice(0, 2);

  leftImage.src = currentPair[0].image || '';
  leftImage.alt = currentPair[0].name;
  leftTitle.textContent = currentPair[0].name;
  leftText.textContent = currentPair[0].description;
  rightImage.src = currentPair[1].image || '';
  rightImage.alt = currentPair[1].name;
  rightTitle.textContent = currentPair[1].name;
  rightText.textContent = currentPair[1].description;

  battleTitle.textContent = `${currentRoundLabel} Match`;
  centerNote.textContent = '';
  battleGrid.hidden = false;
  resultBanner.hidden = true;
  triggerBattleEntry();
}

function triggerBattleEntry() {
  battleCards.forEach((card) => {
    card.classList.remove('is-exiting', 'is-entering', 'is-losing', 'is-winning-left', 'is-winning-right');
    void card.offsetWidth;
    card.classList.add('is-entering');
  });
}

function chooseCard(index) {
  if (isTransitioning || (currentRoundCards.length === 1 && selectedCards.length === 1) || currentPair.length !== 2) {
    return;
  }

  isTransitioning = true;
  battleCards.forEach((card) => card.classList.remove('is-entering', 'is-exiting', 'is-losing', 'is-winning-left', 'is-winning-right'));

  if (index === 0) {
    leftCard.classList.add('is-winning-left');
    rightCard.classList.add('is-losing');
  } else {
    leftCard.classList.add('is-losing');
    rightCard.classList.add('is-winning-right');
  }

  const winner = currentPair[index];
  const loser = currentPair[index === 0 ? 1 : 0];

  window.setTimeout(() => {
    selectedCards.push(winner);
    activePool = activePool.filter((card) => card.id !== winner.id && card.id !== loser.id);
    advanceRoundIfNeeded();

    renderPool();
    renderBattle();
    isTransitioning = false;
  }, 1100);
}

function handleKeyboardSelection(event, index) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    chooseCard(index);
  }
}

leftCard.addEventListener('click', () => chooseCard(0));
rightCard.addEventListener('click', () => chooseCard(1));
leftCard.addEventListener('keydown', (event) => handleKeyboardSelection(event, 0));
rightCard.addEventListener('keydown', (event) => handleKeyboardSelection(event, 1));

menuToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('aria-controls');
    const submenu = document.getElementById(targetId);
    const isOpen = button.classList.toggle('is-open');

    button.setAttribute('aria-expanded', String(isOpen));
    submenu.classList.toggle('is-open', isOpen);
  });
});

cardSourceButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const cardSource = button.dataset.cardSource;

    if (!cardSource) {
      return;
    }

    try {
      await loadCards(cardSource);
    } catch (error) {
      console.error(error);
      centerNote.textContent = '카드 데이터를 불러오지 못했습니다.';
    }
  });
});

historyList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-final-card]');

  if (!deleteButton) {
    return;
  }

  openConfirmModal('이 카드를 정말 삭제하시겠습니까?', () => {
    removeFinalCard(deleteButton.dataset.deleteFinalCard);
  });
});

clearHistoryButton.addEventListener('click', () => {
  openConfirmModal('저장된 최종 카드를 모두 삭제하시겠습니까?', () => {
    clearFinalCards();
  });
});

cancelConfirmButton.addEventListener('click', () => {
  closeConfirmModal();
});

acceptConfirmButton.addEventListener('click', () => {
  handleConfirmAccept();
});

confirmModal.addEventListener('click', (event) => {
  if (event.target.closest('[data-close-confirm-modal]')) {
    closeConfirmModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (confirmModal.hidden) {
    return;
  }

  if (event.key === 'Escape') {
    closeConfirmModal();
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    handleConfirmAccept();
  }
});

async function initializeApp() {
  renderFinalCardsHistory();

  try {
    await loadCards(DEFAULT_CARD_SOURCE);
  } catch (error) {
    console.error(error);
    centerNote.textContent = '기본 카드 데이터를 불러오지 못했습니다.';
  }
}

initializeApp();
