

// Topbar rendering with transparent SVG icons
function renderTopbar(active = 'dashboard') {
  const navs = [
    { id: 'dashboard', label: 'Dashboard', icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="11" width="7" height="10" rx="2" fill="none" stroke="currentColor" opacity="0.7"/><rect x="14" y="3" width="7" height="18" rx="2" fill="none" stroke="currentColor" opacity="0.7"/></svg>` },
    { id: 'items', label: 'My Items', icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" opacity="0.7"/><path d="M16 3v4M8 3v4" stroke="currentColor" opacity="0.7"/></svg>` },
    { id: 'search', label: 'Search', icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" opacity="0.7"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" opacity="0.7"/></svg>` },
    { id: 'settings', label: 'Settings', icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" opacity="0.7"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.2.63.2 1.31 0 1.94z" fill="none" stroke="currentColor" opacity="0.7"/></svg>` }
  ];
  const navLinks = document.getElementById('nav-links');
  navLinks.innerHTML = navs.map(nav =>
    `<a href="#" class="nav-link${active === nav.id ? ' active' : ''}" data-nav="${nav.id}">${nav.icon}<span class="nav-label">${nav.label}</span></a>`
  ).join('');
  // Add click listeners
  navLinks.querySelectorAll('a[data-nav]').forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      navigate(a.getAttribute('data-nav'));
    };
  });
}

function hideAllPages() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('items').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('settings').style.display = 'none';
}

function navigate(page) {
  hideAllPages();
  renderTopbar(page);
  if (page === 'dashboard') showDashboard();
  if (page === 'items') showItems();
  if (page === 'search') showSearch();
  if (page === 'settings') showSettings();
}

// Dashboard rendering
function showDashboard() {
  const el = document.getElementById('dashboard');
  el.style.display = '';
  // Bento grid for planned items
  const planned = items.filter(i => i.status === 'planned');
  let bento = '';
  if (planned.length) {
    bento = `<div class="bento-grid animate-slide-in">` +
      planned.slice(0, 6).map((item, i) =>
        `<div class="bento-card glass">
          <div class="bento-title">${item.name}</div>
          <div class="bento-price">${item.price ? '$'+item.price : ''}</div>
          <div class="bento-meta">${item.source ? 'Source: '+item.source : ''}</div>
          <div class="bento-notes">${item.notes ? item.notes : ''}</div>
          <div class="bento-actions">
            <button onclick="editItem(${items.indexOf(item)})" class="btn">Edit</button>
            <button onclick="markBought(${items.indexOf(item)})" class="btn">Bought</button>
          </div>
        </div>`
      ).join('') + `</div>`;
  } else {
    bento = `<div class="bento-empty">No planned items. Add some!</div>`;
  }
  el.innerHTML = `
    <div class="glass metric-card animate-slide-in">
      <h2>Welcome to Spenda Dashboard!</h2>
      <div style="margin: 1em 0;">
        <button class="btn neon" id="addItemBtn">Add Item</button>
      </div>
      <div class="metrics-row">
        <div class="metric-card glass glow-blue">Total Items<br><span id="totalItems">0</span></div>
        <div class="metric-card glass glow-green">Bought<br><span id="boughtItems">0</span></div>
        <div class="metric-card glass glow-orange">Planned<br><span id="plannedItems">0</span></div>
      </div>
      <h3 style="margin-top:2em;margin-bottom:0.5em;font-size:1.15em;font-weight:600;">Planned Items</h3>
      ${bento}
    </div>
  `;
  document.getElementById('addItemBtn').onclick = showAddItemModal;
  updateMetrics();
}

// Items page rendering
function showItems() {
  const el = document.getElementById('items');
  el.style.display = '';
  el.innerHTML = `
    <div class="glass animate-slide-in">
      <h2>My Items</h2>
      <button class="btn neon" id="addItemBtn2">Add Item</button>
      <ul id="itemList"></ul>
    </div>
  `;
  document.getElementById('addItemBtn2').onclick = showAddItemModal;
  renderItemList();
}

// Search page rendering
function showSearch() {
  const el = document.getElementById('search');
  el.style.display = '';
  el.innerHTML = `
    <div class="glass animate-slide-in">
      <h2>Search Products</h2>
      <form id="searchForm">
        <input type="text" id="searchInput" placeholder="Search for products..." class="search-input" />
        <button type="submit" class="btn neon">Search</button>
      </form>
      <div id="searchResults"></div>
    </div>
  `;
  document.getElementById('searchForm').onsubmit = function(e) {
    e.preventDefault();
    searchAliExpress(document.getElementById('searchInput').value);
  };
}

// Settings page rendering
function showSettings() {
  const el = document.getElementById('settings');
  el.style.display = '';
  el.innerHTML = `
    <div class="glass animate-slide-in">
      <h2>Settings</h2>
      <div>
        <label><input type="checkbox" id="notifEmail" checked> Email Notifications</label><br>
        <label><input type="checkbox" id="notifPush"> Push Notifications</label><br>
        <label><input type="checkbox" id="notifPrice"> Price Drop Alerts</label><br>
        <label><input type="checkbox" id="notifWeekly" checked> Weekly Reports</label><br>
      </div>
      <div style="margin-top:1em;">
        <label>Currency: <select id="currencySel"><option>NAD</option><option>USD</option><option>EUR</option></select></label>
      </div>
    </div>
  `;
}


// --- Item Management with localStorage, edit, bought ---
let items = JSON.parse(localStorage.getItem('spenda_items') || '[]');
let editIndex = null;

function saveItems() {
  localStorage.setItem('spenda_items', JSON.stringify(items));
}

function showAddItemModal(editIdx = null) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const isEdit = editIdx !== null;
  const item = isEdit ? items[editIdx] : { name: '', price: '', source: '', priority: 'medium', notes: '', status: 'planned' };
  modal.innerHTML = `
    <h2>${isEdit ? 'Edit Item' : 'Add New Item'}</h2>
    <form id="addItemForm">
      <input type="text" id="itemName" placeholder="Item Name" value="${item.name || ''}" required><br>
      <input type="number" id="itemPrice" placeholder="Estimated Price" value="${item.price || ''}" required><br>
      <input type="text" id="itemSource" placeholder="Source (e.g. AliExpress)" value="${item.source || ''}"><br>
      <select id="itemPriority">
        <option value="low" ${item.priority==='low'?'selected':''}>Low</option>
        <option value="medium" ${item.priority==='medium'?'selected':''}>Medium</option>
        <option value="high" ${item.priority==='high'?'selected':''}>High</option>
      </select><br>
      <textarea id="itemNotes" placeholder="Notes">${item.notes||''}</textarea><br>
      <button type="submit" class="btn neon">${isEdit ? 'Save' : 'Add'}</button>
      <button type="button" class="btn" id="closeModalBtn">Cancel</button>
    </form>
  `;
  overlay.style.display = '';
  document.getElementById('closeModalBtn').onclick = hideModal;
  document.getElementById('addItemForm').onsubmit = function(e) {
    e.preventDefault();
    if (isEdit) saveEditItem(editIdx);
    else addItem();
    hideModal();
  };
}

function hideModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

function addItem() {
  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const source = document.getElementById('itemSource').value;
  const priority = document.getElementById('itemPriority').value;
  const notes = document.getElementById('itemNotes').value;
  items.push({ name, price, source, priority, notes, status: 'planned' });
  saveItems();
  renderItemList();
  updateMetrics();
}

function saveEditItem(idx) {
  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const source = document.getElementById('itemSource').value;
  const priority = document.getElementById('itemPriority').value;
  const notes = document.getElementById('itemNotes').value;
  items[idx] = { ...items[idx], name, price, source, priority, notes };
  saveItems();
  renderItemList();
  updateMetrics();
}

function renderItemList() {
  const ul = document.getElementById('itemList');
  if (!ul) return;
  ul.innerHTML = items.length ? items.map((item, i) =>
    `<li class="glass item-row">
      <div>
        <b>${item.name}</b> - ${item.price} (${item.priority})
        <span style="font-size:0.9em;color:#aaa;">${item.status==='bought'?'✔️ Bought':''}</span>
        <div style="font-size:0.9em;color:#aaa;">${item.source ? 'Source: '+item.source : ''}</div>
        <div style="font-size:0.9em;color:#aaa;">${item.notes ? 'Notes: '+item.notes : ''}</div>
      </div>
      <div>
        <button onclick="editItem(${i})" class="btn">Edit</button>
        <button onclick="markBought(${i})" class="btn">${item.status==='bought'?'Unmark':'Bought'}</button>
        <button onclick="removeItem(${i})" class="btn">Remove</button>
      </div>
    </li>`
  ).join('') : '<li>No items yet.</li>';
}

function editItem(idx) {
  showAddItemModal(idx);
}

function markBought(idx) {
  items[idx].status = items[idx].status === 'bought' ? 'planned' : 'bought';
  saveItems();
  renderItemList();
  updateMetrics();
}

function removeItem(idx) {
  items.splice(idx, 1);
  saveItems();
  renderItemList();
  updateMetrics();
}

function updateMetrics() {
  document.getElementById('totalItems').textContent = items.length;
  document.getElementById('boughtItems').textContent = items.filter(i => i.status === 'bought').length;
  document.getElementById('plannedItems').textContent = items.filter(i => i.status === 'planned').length;
}



// Real API search: AliExpress DataHub (RapidAPI) for itemId, DummyJSON fallback for text
async function searchAliExpress(query) {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = 'Searching for: ' + query + '...';

  // If query looks like an AliExpress itemId (all digits, 10+ chars), use DataHub
  if (/^\d{10,}$/.test(query.trim())) {
    // Calls backend proxy for security
    const url = `/api/aliexpress?itemId=${query.trim()}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (data.data && data.data.item && data.data.item.title) {
        const item = data.data.item;
        resultsDiv.innerHTML = `
          <div class="glass item-row" style="align-items:flex-start;">
            <div style="flex:1;">
              <b>${item.title}</b><br>
              <span style="font-size:0.95em;color:#aaa;">${item.sellerName || ''}</span><br>
              <span style="font-size:1.1em;color:var(--primary);">${item.salePrice || ''}</span>
              <div style="font-size:0.9em;color:#aaa;">${item.description || ''}</div>
              <a href="${item.detailUrl}" target="_blank" style="color:var(--primary);font-size:0.95em;">View on AliExpress</a>
            </div>
            <img src="${item.imageUrl || ''}" alt="${item.title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-left:1em;">
          </div>
        `;
      } else {
        resultsDiv.innerHTML = '<div class="glass">No product found for this itemId.</div>';
      }
    } catch (error) {
      resultsDiv.innerHTML = '<div class="glass">API error. Try again later.</div>';
    }
    return;
  }

  // Otherwise, fallback to DummyJSON demo search
  fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`)
    .then(r => r.json())
    .then(data => {
      if (!data.products || !data.products.length) {
        resultsDiv.innerHTML = '<div class="glass">No results found.</div>';
        return;
      }
      resultsDiv.innerHTML = data.products.map(prod =>
        `<div class="glass item-row" style="align-items:flex-start;">
          <div style="flex:1;">
            <b>${prod.title}</b><br>
            <span style="font-size:0.95em;color:#aaa;">${prod.brand}</span><br>
            <span style="font-size:1.1em;color:var(--primary);">$${prod.price}</span>
            <div style="font-size:0.9em;color:#aaa;">${prod.description}</div>
          </div>
          <img src="${prod.thumbnail}" alt="${prod.title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-left:1em;">
        </div>`
      ).join('');
    })
    .catch(() => {
      resultsDiv.innerHTML = '<div class="glass">API error. Try again later.</div>';
    });
}

// CSS animation helper
document.addEventListener('DOMContentLoaded', () => {
  renderTopbar('dashboard');
  showDashboard();

  // Burger menu logic for topbar (optional for mobile nav)
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('sidebar-overlay');

  function openMenu() {
    navLinks.classList.add('nav-open');
    overlay.classList.add('show');
    burger.classList.add('open');
  }
  function closeMenu() {
    navLinks.classList.remove('nav-open');
    overlay.classList.remove('show');
    burger.classList.remove('open');
  }

  burger.onclick = function() {
    if (navLinks.classList.contains('nav-open')) closeMenu();
    else openMenu();
  };
  overlay.onclick = closeMenu;

  // Hide menu on nav click (mobile)
  navLinks.addEventListener('click', e => {
    if (window.innerWidth <= 900 && e.target.classList.contains('nav-link')) closeMenu();
  });

  // Responsive: close menu on resize if needed
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
