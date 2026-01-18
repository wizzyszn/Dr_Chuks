import './style.css'
import { products } from './products.js'
import { TextPressure } from './textPressure.js'

// --- 1. Product Grid Rendering & Filtering ---
const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('#filters button');

function createProductCard(product) {
  const specsHtml = Object.entries(product.specs).map(([key, value]) => `
    <div class="glass px-2 py-1 rounded text-xs text-gray-300 capitalize">
      ${key}: <span class="text-primary font-bold">${value}</span>
    </div>
  `).join('');

  return `
    <div class="glass-card rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div class="relative h-64 overflow-hidden">
        <img src="${product.image}" alt="${product.name} Gadget Store" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
           <div class="flex flex-wrap gap-2 justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             ${specsHtml}
           </div>
        </div>

        ${product.badge ? `
          <div class="absolute top-4 left-4 bg-primary text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
            ${product.badge}
          </div>
        ` : ''}
      </div>
      
      <div class="p-6">
        <div class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">${product.brand}</div>
        <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">${product.name}</h3>
        <div class="flex justify-between items-center">
          <span class="text-lg text-white font-medium">${product.price}</span>
          <button class="bg-white/10 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(category = 'all') {
  productGrid.innerHTML = products
    .filter(p => category === 'all' || p.category === category)
    .map(createProductCard)
    .join('');
}

// Initial render
renderProducts();

// Filter Event Listeners
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterButtons.forEach(b => {
       b.classList.remove('bg-white/10', 'text-white', 'shadow-lg');
       b.classList.add('text-gray-400');
    });
    btn.classList.add('bg-white/10', 'text-white', 'shadow-lg');
    btn.classList.remove('text-gray-400');

    // Filter
    const filter = btn.dataset.filter;
    // Simple fade out/in effect
    productGrid.style.opacity = '0';
    setTimeout(() => {
      renderProducts(filter);
      productGrid.style.opacity = '1';
    }, 200);
  });
});


// --- 2. Countdown Timer ---
const dealDate = new Date();
dealDate.setHours(dealDate.getHours() + 4); // Ends in 4 hours
dealDate.setMinutes(dealDate.getMinutes() + 15);

function updateCountdown() {
  const now = new Date();
  const diff = dealDate - now;

  if (diff <= 0) return;

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
  document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();


// --- 3. Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
    navbar.classList.remove('glass'); // switch to stronger background
  } else {
    navbar.classList.remove('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
    navbar.classList.add('glass');
  }
});

// --- 4. Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// --- 4. Footer Text Animation ---
const footerText = new TextPressure('footer-logo-text', {
  text: 'DR CHUKS',
  flex: true,
  alpha: false,
  stroke: false,
  width: true,
  weight: true,
  italic: true,
  textColor: '#FFFFFF',
  minFontSize: 100, // Increased font size
  scale: true // Enable scaling to fill container
});

