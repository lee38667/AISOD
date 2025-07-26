
// Currency formatting for Namibian Dollars (NAD)
function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N$0.00';
  return `N$${parseFloat(amount).toFixed(2)}`;
}

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
          <div class="bento-price">${item.price ? formatCurrency(item.price) : ''}</div>
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
      <h2>Spenda Analytics Dashboard</h2>
      <div style="margin: 1em 0;">
        <button class="btn neon" id="addItemBtn">Add Item</button>
      </div>
      
      <!-- Primary Metrics -->
      <div class="metrics-row">
        <div class="metric-card glass glow-blue">Total Items<br><span id="totalItems">0</span></div>
        <div class="metric-card glass glow-green">Bought<br><span id="boughtItems">0</span></div>
        <div class="metric-card glass glow-orange">Planned<br><span id="plannedItems">0</span></div>
        <div class="metric-card glass glow-purple">Total Value<br><span id="totalValue">N$0.00</span></div>
      </div>
      
      <!-- Financial Analytics -->
      <div class="analytics-section">
        <h3>💰 Financial Overview</h3>
        <div class="metrics-row">
          <div class="metric-card glass">
            <div class="metric-label">Money Spent</div>
            <div class="metric-value" id="moneySpent">N$0.00</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">Money Planned</div>
            <div class="metric-value" id="moneyPlanned">N$0.00</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">Average Item Price</div>
            <div class="metric-value" id="avgPrice">N$0.00</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">Most Expensive</div>
            <div class="metric-value" id="mostExpensive">-</div>
          </div>
        </div>
      </div>
      
      <!-- Shopping Analytics -->
      <div class="analytics-section">
        <h3>📊 Shopping Insights</h3>
        <div class="metrics-row">
          <div class="metric-card glass">
            <div class="metric-label">Completion Rate</div>
            <div class="metric-value" id="completionRate">0%</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">High Priority Items</div>
            <div class="metric-value" id="highPriorityCount">0</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">Top Source</div>
            <div class="metric-value" id="topSource">-</div>
          </div>
          <div class="metric-card glass">
            <div class="metric-label">Recent Activity</div>
            <div class="metric-value" id="recentActivity">0 items</div>
          </div>
        </div>
      </div>
      
      <!-- Priority Breakdown -->
      <div class="analytics-section">
        <h3>🎯 Priority Breakdown</h3>
        <div class="priority-chart" id="priorityChart">
          <div class="priority-bar">
            <div class="priority-label">High Priority</div>
            <div class="priority-progress">
              <div class="priority-fill high" id="highPriorityBar" style="width: 0%"></div>
              <span class="priority-count" id="highPriorityText">0</span>
            </div>
          </div>
          <div class="priority-bar">
            <div class="priority-label">Medium Priority</div>
            <div class="priority-progress">
              <div class="priority-fill medium" id="mediumPriorityBar" style="width: 0%"></div>
              <span class="priority-count" id="mediumPriorityText">0</span>
            </div>
          </div>
          <div class="priority-bar">
            <div class="priority-label">Low Priority</div>
            <div class="priority-progress">
              <div class="priority-fill low" id="lowPriorityBar" style="width: 0%"></div>
              <span class="priority-count" id="lowPriorityText">0</span>
            </div>
          </div>
        </div>
      </div>
      
      <h3 style="margin-top:2em;margin-bottom:0.5em;font-size:1.15em;font-weight:600;">📋 Planned Items</h3>
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
      <input type="number" id="itemPrice" placeholder="Estimated Price (NAD)" value="${item.price || ''}" required><br>
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

// Add item from search results to planning list
function addFromSearch(sourceType, index, title, price, url, store) {
  // Clean up price string and extract numeric value
  const cleanPrice = price.replace(/[^\d.-]/g, '');
  const numericPrice = parseFloat(cleanPrice) || 0;
  
  // Create new item object
  const newItem = {
    name: title,
    price: numericPrice,
    source: url || store,
    priority: 'medium', // default priority
    notes: url ? `Found via search - ${url}` : 'Found via search',
    status: 'planned'
  };
  
  // Add to items array
  items.push(newItem);
  saveItems();
  
  // Show success message
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Added!';
  button.style.backgroundColor = 'var(--success)';
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = '';
    button.disabled = false;
  }, 2000);
  
  // Update metrics if dashboard is visible
  if (document.getElementById('dashboard').style.display !== 'none') {
    updateMetrics();
  }
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
        <b>${item.name}</b> - ${formatCurrency(item.price)} (${item.priority})
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
  // Basic counts
  const totalItems = items.length;
  const boughtItems = items.filter(i => i.status === 'bought');
  const plannedItems = items.filter(i => i.status === 'planned');
  
  // Update basic metrics
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('boughtItems').textContent = boughtItems.length;
  document.getElementById('plannedItems').textContent = plannedItems.length;
  
  // Financial calculations
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const moneySpent = boughtItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const moneyPlanned = plannedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;
  const mostExpensiveItem = items.reduce((max, item) => 
    (item.price || 0) > (max.price || 0) ? item : max, {});
  
  // Update financial metrics
  document.getElementById('totalValue').textContent = formatCurrency(totalValue);
  document.getElementById('moneySpent').textContent = formatCurrency(moneySpent);
  document.getElementById('moneyPlanned').textContent = formatCurrency(moneyPlanned);
  document.getElementById('avgPrice').textContent = formatCurrency(avgPrice);
  document.getElementById('mostExpensive').textContent = mostExpensiveItem.name ? 
    `${mostExpensiveItem.name} (${formatCurrency(mostExpensiveItem.price)})` : '-';
  
  // Shopping insights
  const completionRate = totalItems > 0 ? (boughtItems.length / totalItems * 100) : 0;
  const highPriorityItems = items.filter(i => i.priority === 'high');
  const sourceCounts = {};
  items.forEach(item => {
    if (item.source) {
      const source = item.source.includes('http') ? 'Online Store' : item.source;
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    }
  });
  const topSource = Object.keys(sourceCounts).reduce((a, b) => 
    sourceCounts[a] > sourceCounts[b] ? a : b, '-');
  
  // Update shopping insights
  document.getElementById('completionRate').textContent = `${completionRate.toFixed(1)}%`;
  document.getElementById('highPriorityCount').textContent = highPriorityItems.length;
  document.getElementById('topSource').textContent = topSource === '-' ? 'None' : topSource;
  document.getElementById('recentActivity').textContent = `${plannedItems.length} planned`;
  
  // Priority breakdown
  const priorities = {
    high: items.filter(i => i.priority === 'high').length,
    medium: items.filter(i => i.priority === 'medium').length,
    low: items.filter(i => i.priority === 'low').length
  };
  
  const maxPriority = Math.max(priorities.high, priorities.medium, priorities.low, 1);
  
  // Update priority chart
  if (document.getElementById('highPriorityBar')) {
    document.getElementById('highPriorityBar').style.width = `${(priorities.high / maxPriority) * 100}%`;
    document.getElementById('highPriorityText').textContent = priorities.high;
    
    document.getElementById('mediumPriorityBar').style.width = `${(priorities.medium / maxPriority) * 100}%`;
    document.getElementById('mediumPriorityText').textContent = priorities.medium;
    
    document.getElementById('lowPriorityBar').style.width = `${(priorities.low / maxPriority) * 100}%`;
    document.getElementById('lowPriorityText').textContent = priorities.low;
  }
}



// Real API search: AliExpress DataHub (RapidAPI) for search queries
async function searchAliExpress(query) {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = 'Searching for: ' + query + '...';

  try {
    // Call backend proxy for security
    const url = `/api/aliexpress?q=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    
    if (data.result && data.result.resultList && data.result.resultList.length > 0) {
      resultsDiv.innerHTML = data.result.resultList.map((item, index) =>
        `<div class="glass item-row" style="align-items:flex-start;">
          <div style="flex:1;">
            <b>${item.item.title}</b><br>
            <span style="font-size:0.95em;color:#aaa;">${item.item.store || ''}</span><br>
            <span style="font-size:1.1em;color:var(--primary);">${item.item.sku.def.promotionPrice || item.item.sku.def.price}</span>
            <div style="font-size:0.9em;color:#aaa;">Rating: ${item.item.evaluate ? item.item.evaluate.starRating : 'N/A'}</div>
            <div style="margin-top:0.5em;">
              <a href="${item.item.itemDetailUrl}" target="_blank" style="color:var(--primary);font-size:0.95em;">View on AliExpress</a>
              <button onclick="addFromSearch('aliexpress', ${index}, '${item.item.title.replace(/'/g, "\\'")}', '${item.item.sku.def.promotionPrice || item.item.sku.def.price}', '${item.item.itemDetailUrl}', '${item.item.store || 'AliExpress'}')" class="btn" style="margin-left:1em;font-size:0.85em;">Add to Planning</button>
            </div>
          </div>
          <img src="${item.item.imageUrl}" alt="${item.item.title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-left:1em;">
        </div>`
      ).join('');
    } else {
      resultsDiv.innerHTML = '<div class="glass">No products found.</div>';
    }
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to DummyJSON demo search
    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        if (!data.products || !data.products.length) {
          resultsDiv.innerHTML = '<div class="glass">No results found.</div>';
          return;
        }
        resultsDiv.innerHTML = data.products.map((prod, index) => {
          const nadPrice = prod.price * 18; // Convert USD to NAD (approximate rate)
          return `<div class="glass item-row" style="align-items:flex-start;">
            <div style="flex:1;">
              <b>${prod.title}</b><br>
              <span style="font-size:0.95em;color:#aaa;">${prod.brand}</span><br>
              <span style="font-size:1.1em;color:var(--primary);">${formatCurrency(nadPrice)}</span>
              <div style="font-size:0.9em;color:#aaa;">${prod.description}</div>
              <div style="margin-top:0.5em;">
                <button onclick="addFromSearch('dummy', ${index}, '${prod.title.replace(/'/g, "\\'")}', '${nadPrice}', '', '${prod.brand || 'DummyJSON'}')" class="btn" style="font-size:0.85em;">Add to Planning</button>
              </div>
            </div>
            <img src="${prod.thumbnail}" alt="${prod.title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-left:1em;">
          </div>`;
        }).join('');
      })
      .catch(() => {
        resultsDiv.innerHTML = '<div class="glass">API error. Try again later.</div>';
      });
  }
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
