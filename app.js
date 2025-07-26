
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

// Add Item Modal
function showAddItemModal() {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  modal.innerHTML = `
    <h2>Add New Item</h2>
    <form id="addItemForm">
      <input type="text" id="itemName" placeholder="Item Name" required><br>
      <input type="number" id="itemPrice" placeholder="Estimated Price" required><br>
      <input type="text" id="itemSource" placeholder="Source (e.g. AliExpress)"><br>
      <select id="itemPriority">
        <option value="low">Low</option>
        <option value="medium" selected>Medium</option>
        <option value="high">High</option>
      </select><br>
      <textarea id="itemNotes" placeholder="Notes"></textarea><br>
      <button type="submit" class="btn neon">Add</button>
      <button type="button" class="btn" id="closeModalBtn">Cancel</button>
    </form>
  `;
  overlay.style.display = '';
  document.getElementById('closeModalBtn').onclick = hideModal;
  document.getElementById('addItemForm').onsubmit = function(e) {
    e.preventDefault();
    addItem();
    hideModal();
  };
}

function hideModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

// Item storage and rendering
let items = [];
function addItem() {
  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const source = document.getElementById('itemSource').value;
  const priority = document.getElementById('itemPriority').value;
  const notes = document.getElementById('itemNotes').value;
  items.push({ name, price, source, priority, notes, status: 'planned' });
  renderItemList();
  updateMetrics();
}

function renderItemList() {
  const ul = document.getElementById('itemList');
  if (!ul) return;
  ul.innerHTML = items.length ? items.map((item, i) =>
    `<li class="glass item-row">
      <b>${item.name}</b> - ${item.price} (${item.priority})
      <button onclick="removeItem(${i})" class="btn">Remove</button>
    </li>`
  ).join('') : '<li>No items yet.</li>';
}

function removeItem(idx) {
  items.splice(idx, 1);
  renderItemList();
  updateMetrics();
}

function updateMetrics() {
  document.getElementById('totalItems').textContent = items.length;
  document.getElementById('boughtItems').textContent = items.filter(i => i.status === 'bought').length;
  document.getElementById('plannedItems').textContent = items.filter(i => i.status === 'planned').length;
}

// AliExpress API search (mocked)
function searchAliExpress(query) {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = 'Searching AliExpress for: ' + query + '...';
  // Example: fetch from a real API endpoint here
  setTimeout(() => {
    resultsDiv.innerHTML = `<div class='glass'>No real API call (demo only). Query: <b>${query}</b></div>`;
  }, 1000);
}

// CSS animation helper
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar('dashboard');
  showDashboard();
});
