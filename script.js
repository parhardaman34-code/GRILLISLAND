// ========================================================
// EMBER & IRON - INTERACTIVE WEBSITE LOGIC
// ========================================================

const MENU_ITEMS = [
  {
    id: 1,
    name: "Dry-Aged Bone-In Ribeye",
    category: "steaks",
    price: 64,
    tag: "Wood-Fired",
    desc: "22oz USDA Prime ribeye, sea salt, roasted bone marrow, charred leek oil.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Texas Smoked Beef Rib",
    category: "bbq",
    price: 48,
    tag: "Pitmaster Pick",
    desc: "Single mammoth dinosaur beef rib, coarse black pepper crust, 12h oak smoke.",
    img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Smoked Wagyu Smash Burger",
    category: "burgers",
    price: 24,
    tag: "Crowd Favorite",
    desc: "Double wagyu smash patties, smoked gouda, bone marrow aioli, brioche bun.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Heritage St. Louis Pork Ribs",
    category: "bbq",
    price: 36,
    tag: "Glazed",
    desc: "Full rack, apple cider spritz, smoked brown sugar glaze, pickled jalapenos.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Wood-Fired Filet Mignon",
    category: "steaks",
    price: 52,
    tag: "Tender Cut",
    desc: "8oz center cut tenderloin, black truffle emulsion, charred cipollini onions.",
    img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Charred Truffle Mac & Cheese",
    category: "sides",
    price: 16,
    tag: "Skillet Side",
    desc: "Aged gruyere, smoked sharp cheddar, black truffle crumb, cast iron blistered.",
    img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 7,
    name: "Cast-Iron Fire Broccolini",
    category: "sides",
    price: 14,
    tag: "Vegetarian",
    desc: "Charred over oak coals, garlic chili crunch, toasted pine nuts, lemon zest.",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 8,
    name: "Smoked Maple Old Fashioned",
    category: "drinks",
    price: 18,
    tag: "Signature Drink",
    desc: "Small batch bourbon, barrel-aged maple syrup, angostura, smoked cherrywood dome.",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80"
  }
];

// Tasting state
let tastingSelection = [];

// Initialize DOM elements
document.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  initTabs();
  initMobileMenu();
  initReservationForm();
  setDefaultDate();
});

// Render Menu Cards
function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const filtered = category === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === category);

  grid.innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}" class="menu-thumb" loading="lazy">
      <div class="menu-details">
        <div class="menu-details-top">
          <h4 class="menu-item-title">${item.name}</h4>
          <span class="menu-item-price">$${item.price}</span>
        </div>
        <p class="menu-item-desc">${item.desc}</p>
        <div class="menu-details-bottom">
          <span class="menu-tag">${item.tag}</span>
          <button class="add-tasting-btn" onclick="addToTasting('${item.name}', ${item.price})">
            + Add to Tasting
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category Tabs
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.category);
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
  });

  // Close when clicking nav link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('active');
    });
  });
}

// Set Default Date in Reservation Picker to Tomorrow
function setDefaultDate() {
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

// Add Item to Tasting Selection
window.addToTasting = function(name, price) {
  tastingSelection.push({ name, price });
  updateTastingBar();

  // Subtle alert feedback
  showToast(`Added "${name}" to your tasting list!`);
};

function updateTastingBar() {
  const bar = document.getElementById('tastingBar');
  const count = document.getElementById('tastingCount');
  const total = document.getElementById('tastingTotal');

  if (!bar || !count || !total) return;

  if (tastingSelection.length > 0) {
    bar.classList.add('visible');
    const sum = tastingSelection.reduce((acc, curr) => acc + curr.price, 0);
    count.textContent = `${tastingSelection.length} item${tastingSelection.length > 1 ? 's' : ''} in tasting`;
    total.textContent = `Est. $${sum}`;
  } else {
    bar.classList.remove('visible');
  }
}

// Toast notification
function showToast(message) {
  const existing = document.querySelector('.toast-banner');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-banner';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff5722;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

// Reservation Form Submission
function initReservationForm() {
  const form = document.getElementById('reserveForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value;
    const phone = document.getElementById('resPhone').value;
    const guests = document.getElementById('resGuests').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const seating = document.querySelector('input[name="seating"]:checked')?.value || 'Standard';

    // Show confirmation modal
    const modal = document.getElementById('confirmModal');
    const details = document.getElementById('modalDetails');
    const tastingItems = tastingSelection.map(i => i.name).join(', ') || 'No pre-selected tasting items';

    details.innerHTML = `
      <div><strong>Guest:</strong> ${name}</div>
      <div><strong>Contact:</strong> ${phone}</div>
      <div><strong>Party:</strong> ${guests}</div>
      <div><strong>Schedule:</strong> ${date} at ${time}</div>
      <div><strong>Seating:</strong> ${seating}</div>
      ${tastingSelection.length > 0 ? `<div><strong>Pre-Selected Cuts:</strong> ${tastingItems}</div>` : ''}
    `;

    modal.classList.add('active');
    form.reset();
    setDefaultDate();
  });
}

// Open modal from tasting bar
window.openReservationModal = function() {
  const reserveSection = document.getElementById('reserve');
  if (reserveSection) {
    reserveSection.scrollIntoView({ behavior: 'smooth' });
    const notes = document.getElementById('resNotes');
    if (notes && tastingSelection.length > 0) {
      notes.value = `Requested Tasting Menu: ${tastingSelection.map(i => i.name).join(', ')}`;
    }
  }
};

window.closeModal = function() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('active');
};

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('confirmModal');
  if (modal && e.target === modal) {
    modal.classList.remove('active');
  }
});
