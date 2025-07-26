
// Sidebar rendering with highlight
function renderSidebar(active = 'dashboard') {
  const sidebar = document.getElementById('sidebar');
  const navs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'items', label: 'My Items', icon: '📦' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];
  sidebar.innerHTML = `<nav class="sidebar glass"><ul>${navs.map(nav =>
    `<li><a href="#" class="${active === nav.id ? 'active' : ''}" data-nav="${nav.id}">${nav.icon} ${nav.label}</a></li>`
  ).join('')}</ul></nav>`;
  // Add click listeners
  sidebar.querySelectorAll('a[data-nav]').forEach(a => {
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
  renderSidebar(page);
  if (page === 'dashboard') showDashboard();
  if (page === 'items') showItems();
  if (page === 'search') showSearch();
  if (page === 'settings') showSettings();
}

// Dashboard rendering
function showDashboard() {
  const el = document.getElementById('dashboard');
  el.style.display = '';
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


// Real API search (DummyJSON for demo)
function searchAliExpress(query) {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = 'Searching for: ' + query + '...';
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
  renderSidebar('dashboard');
  showDashboard();
});
