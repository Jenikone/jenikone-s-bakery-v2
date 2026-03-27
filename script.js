// ================================
// SAMPLE DATA
// ================================

const categoryData = {
    fresh: ['🥐 Croissant', '🍞 Sourdough', '🥯 Bagel', '🧈 Butter Roll', '🌾 Wheat', '🥜 Nut Bread'],
    commission: ['💌 Love Letter', '🎂 Cake Design', '🍰 Pastry Art', '🎨 Custom', '✨ Special', '🌸 Seasonal'],
    adoptable: ['🎨 Canvas', '🌸 Spring', '🍂 Autumn', '🌙 Night', '☀️ Summer', '❄️ Winter'],
    about: ['📖 Story', '👨‍🍳 Chef', '🏠 Location', '💝 Mission', '🌍 Community', '📞 Contact']
};

const adoptableCards = [
    { id: 1, title: 'Canvas I', emoji: '🎨', desc: 'Modern Artwork', price: '50k', status: 'available' },
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
// STATE MANAGEMENT
// ================================

let currentTab = 'fresh';
let curtainOffset = 0;
const MAX_CATEGORIES = 6;

// ================================
// AUDIO (Web Audio API)
// ================================

function playSound(soundType) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (soundType === 'curtain') {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (soundType === 'tab') {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
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
// CURTAIN SYSTEM
// ================================

function renderCurtain() {
    const track = document.getElementById('curtainTrack');
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    track.innerHTML = '';
    
    items.forEach((item, index) => {
        const curtainItem = document.createElement('div');
        curtainItem.className = 'curtain-item';
        curtainItem.textContent = item;
        curtainItem.dataset.index = index;
        
        // Add collapsed class to previous items when offset increases
        if (index < curtainOffset) {
            curtainItem.classList.add('collapsed');
        }
        
        curtainItem.addEventListener('click', () => {
            console.log('Category selected:', item);
            playSound('curtain');
        });
        
        track.appendChild(curtainItem);
    });
    
    updateCurtainNav();
}

function shiftCurtain(direction) {
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    if (direction === 'next' && curtainOffset < items.length - 1) {
        curtainOffset++;
        playSound('curtain');
    } else if (direction === 'prev' && curtainOffset > 0) {
        curtainOffset--;
        playSound('curtain');
    }
    
    renderCurtain();
}

function updateCurtainNav() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const items = categoryData[currentTab].slice(0, MAX_CATEGORIES);
    
    prevBtn.disabled = curtainOffset === 0;
    nextBtn.disabled = curtainOffset >= items.length - 1;
}

// ================================
// TAB SWITCHING
// ================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reset curtain
    currentTab = tabName;
    curtainOffset = 0;
    
    playSound('tab');
    renderCurtain();
    
    // Render cards only if adoptable tab
    if (tabName === 'adoptable') {
        renderCards();
    }
}

// ================================
// CARD RENDERING
// ================================

function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';
    
    adoptableCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.innerHTML = `
            <div class="card-image">
                <span>${card.emoji}</span>
            </div>
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
        
        cardEl.addEventListener('click', () => {
            openModal(card);
        });
        
        cardGrid.appendChild(cardEl);
    });
}

// ================================
// MODAL FUNCTIONS
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
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
}

// ================================
// EVENT LISTENERS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Tab buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.closest('.nav-btn').dataset.tab);
        });
    });
    
    // Curtain navigation
    document.getElementById('prevBtn').addEventListener('click', () => {
        shiftCurtain('prev');
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        shiftCurtain('next');
    });
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('cardModal').addEventListener('click', (e) => {
        if (e.target.id === 'cardModal') {
            closeModal();
        }
    });
    
    // Initialize
    renderCurtain();
});
