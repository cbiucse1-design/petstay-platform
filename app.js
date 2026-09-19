const toast = document.getElementById('toast');
const modal = document.getElementById('booking-modal');
const petModal = document.getElementById('pet-modal');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function closeModal(element) {
  element.hidden = true;
  document.body.style.overflow = '';
}

function openModal(element) {
  element.hidden = false;
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.heart-button').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('saved');
    button.textContent = button.classList.contains('saved') ? '♥' : '♡';
    showToast(button.classList.contains('saved') ? 'Stay added to saved places' : 'Stay removed from saved places');
  });
});

document.querySelectorAll('.book-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById('modal-stay').textContent = button.dataset.stay;
    document.getElementById('modal-total').textContent = button.dataset.stay === 'Green Tail House' ? '৳ 4,000' : button.dataset.stay === 'The Little Woof' ? '৳ 3,320' : '৳ 5,100';
    openModal(modal);
  });
});

document.getElementById('modal-close').addEventListener('click', () => closeModal(modal));
document.getElementById('pet-modal-close').addEventListener('click', () => closeModal(petModal));
document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal(backdrop);
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal(modal);
    closeModal(petModal);
  }
});

document.getElementById('confirm-booking').addEventListener('click', () => {
  closeModal(modal);
  showToast('Great choice. Your booking request is ready to review.');
});
document.getElementById('add-pet-button').addEventListener('click', () => openModal(petModal));
document.getElementById('pet-form').addEventListener('submit', (event) => {
  event.preventDefault();
  closeModal(petModal);
  showToast('Pet profile saved. Welcome to the family!');
  event.target.reset();
});
document.getElementById('view-pets-button').addEventListener('click', () => showToast('Pet profiles are ready in your workspace.'));

const dashboardView = document.getElementById('dashboard');
const petView = document.getElementById('pet-view');

function showWorkspaceView(view) {
  const isPets = view === 'pets';
  dashboardView.hidden = isPets;
  petView.hidden = !isPets;
  document.getElementById('page-title').textContent = isPets ? 'My pets' : 'Overview';
}

document.getElementById('back-to-overview').addEventListener('click', () => {
  showWorkspaceView('dashboard');
  document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.toggle('active', navItem.dataset.view === 'dashboard'));
});

document.querySelectorAll('.pet-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pet-tab').forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.pet-tab-panel').forEach((panel) => { panel.hidden = panel.id !== tab.dataset.tab; });
  });
});

document.getElementById('contact-toggle').addEventListener('click', (event) => {
  const toggle = event.currentTarget;
  toggle.classList.toggle('active');
  toggle.setAttribute('aria-pressed', toggle.classList.contains('active'));
  showToast(toggle.classList.contains('active') ? 'Public contact is now allowed' : 'Public contact is now protected');
});
document.getElementById('download-qr').addEventListener('click', () => showToast('Your vector QR download is being prepared.'));
document.getElementById('order-tag').addEventListener('click', () => showToast('Physical tag ordering is ready for checkout.'));
document.getElementById('upload-record').addEventListener('click', () => showToast('Choose a vaccination card or medical document to upload.'));
document.getElementById('edit-pet-button').addEventListener('click', () => showToast('Pet profile editing is ready.'));

document.getElementById('search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('location-input').value.trim().toLowerCase();
  const cards = [...document.querySelectorAll('.stay-card')];
  const emptyState = document.getElementById('empty-search');
  const matches = cards.filter((card) => card.dataset.location.toLowerCase().includes(query) || !query);
  cards.forEach((card) => { card.style.display = matches.includes(card) ? '' : 'none'; });
  emptyState.classList.toggle('show', matches.length === 0);
  document.getElementById('stays').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(matches.length ? `${matches.length} stays found near ${query || 'you'}` : 'Try a nearby city to find more stays');
});

document.querySelector('.notification-button').addEventListener('click', () => showToast('You are all caught up.'));
document.querySelector('.avatar-button').addEventListener('click', () => showToast('Account menu coming right up.'));

document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-item[data-view]').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('page-title').textContent = item.textContent.trim().replace(/\d+$/, '').trim();
    document.querySelector('.sidebar').classList.remove('open');
    showWorkspaceView(item.dataset.view);
    if (item.dataset.view !== 'dashboard') showToast(`${item.textContent.trim().replace(/\d+$/, '').trim()} view is ready to explore.`);
  });
});
