// ================================
// DATA
// ================================

const categoryData = {
    fresh: ['🥐 Croissant', '🍞 Sourdough', '🥯 Bagel', '🧈 Butter', '🌾 Wheat', '🥜 Nut'],
    commission: ['💌 Letter', '🎂 Cake', '🍰 Pastry', '🎨 Custom', '✨ Special', '🌸 Seasonal'],
    adoptable: ['🎨 Canvas', '🌸 Spring', '🍂 Autumn', '🌙 Night', '☀️ Summer', '❄️ Winter'],
    about: ['📖 Story', '👨‍🍳 Chef', '🏠 Location', '💝 Mission', '🌍 Community', '📞 Contact']
};

const adoptableCards = [
    { id: 1, title: 'Canvas I', emoji: '🎨', desc: 'Modern Art', price: '50k', status: 'available' },
    { id: 2, title: 'Spring Blossom', emoji: '🌸', desc: 'Pastel Vibes', price: '45k', status: 'available' },
    { id: 3, title: 'Autumn Glow', emoji: '🍂', desc: 'Warm Tones', price: '48k', status: 'sold' },
    { id: 4, title: 'Night Dream', emoji: '🌙', desc: 'Dark Fantasy', price: '55k', status: 'available' },
    { id: 5, title: 'Summer Joy', emoji: '☀️', desc: 'Bright Energy', price: '50k', status: 'available' },
    { id: 6, title: 'Winter Peace', emoji: '❄️', desc: 'Serene Cold', price: '52k', status: 'available' },
    { id: 7, title: 'Ocean Wave', emoji: '🌊', desc: 'Calm Water', price: '48k', status: 'available' },
    { id: 8, title: 'Forest Walk', emoji: '🌲', desc: 'Nature Green', price: '50k', status: 'available' },
    { id: 9, title: 'Starlight', emoji: '⭐', desc: 'Galaxy Dream', price: '60k', status: 'sold' },
];

// ================================
// STATE
// ================================

let currentTab = 'fresh';
let categoryOffset = 0;
const MAX_CATEGORIES = 6;

// ================================
// AUDIO
// ================================

function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'curtain') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'tab') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch (e) {
        console.log('Audio not available');
    }
}

// ================================
// CATEGORY SYSTEM
// ================================

function renderCategories() {
    const track = document.getElementById('categoryTrack');
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    track.innerHTML = '';
    
    items.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'category-item';
        el.textContent = item;
        el.dataset.index = index;
        
        if (index < categoryOffset) {
            el.classList.add('collapsed');
        }
        
        el.addEventListener('click', () => {
            console.log('Selected:', item);
            playSound('curtain');
        });
        
        track.appendChild(el);
    });
    
    updateCategoryNav();
}

function shiftCategory(direction) {
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    if (direction === 'next' && categoryOffset < items.length - 1) {
        categoryOffset++;
        playSound('curtain');
    } else if (direction === 'prev' && categoryOffset > 0) {
        categoryOffset--;
        playSound('curtain');
    }
    
    renderCategories();
}

function updateCategoryNav() {
    const prevBtn = document.getElementById('catPrevBtn');
    const nextBtn = document.getElementById('catNextBtn');
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    prevBtn.disabled = categoryOffset === 0;
    nextBtn.disabled = categoryOffset >= items.length - 1;
}

// ================================
// TAB SWITCHING
// ================================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.nav-btn').classList.add('active');
    
    currentTab = tabName;
    categoryOffset = 0;
    
    playSound('tab');
    renderCategories();
    
    if (tabName === 'adoptable') {
        renderCards();
    }
}

// ================================
// CARD RENDERING
// ================================

function renderCards() {
    const grid = document.getElementById('cardGrid');
    grid.innerHTML = '';
    
    adoptableCards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
            <div class="card-image">${card.emoji}</div>
            <div class="card-content">
                <div>
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-desc">${card.desc}</p>
                </div>
                <div class="card-footer">
                    <span class="card-price">${card.price}</span>
                    <span class="card-status ${card.status === 'sold' ? 'sold' : ''}">${card.status === 'sold' ? 'SOLD' : 'AVAIL'}</span>
                </div>
            </div>
        `;
        
        el.addEventListener('click', () => openModal(card));
        grid.appendChild(el);
    });
}

// ================================
// MODAL
// ================================

function openModal(card) {
    const modal = document.getElementById('cardModal');
    document.getElementById('modalImage').textContent = card.emoji;
    document.getElementById('modalTitle').textContent = card.title;
    document.getElementById('modalDesc').textContent = card.desc;
    document.getElementById('modalPrice').textContent = `Price: ${card.price}`;
    document.getElementById('modalStatus').textContent = card.status === 'sold' ? '🔴 SOLD OUT' : '✅ AVAILABLE';
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('cardModal').classList.remove('active');
}

// ================================
// DARK MODE
// ================================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeBtn();
}

function updateDarkModeBtn() {
    const btn = document.getElementById('darkModeBtn');
    const isDark = document.body.classList.contains('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
}

function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeBtn();
}

// ================================
// EVENT LISTENERS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Init
    initDarkMode();
    renderCategories();
    
    // Tab buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // Category nav
    document.getElementById('catPrevBtn').addEventListener('click', () => shiftCategory('prev'));
    document.getElementById('catNextBtn').addEventListener('click', () => shiftCategory('next'));
    
    // Dark mode
    document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cardModal').addEventListener('click', (e) => {
        if (e.target.id === 'cardModal') closeModal();
    });
});
