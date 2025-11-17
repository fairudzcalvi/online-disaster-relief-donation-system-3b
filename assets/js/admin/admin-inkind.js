let items = [];
let filteredItems = [];
let editingItemId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  filteredItems = [...items];
  renderTable();
  updateAllStats();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Search and filters
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
  document.getElementById('dateFrom').addEventListener('change', applyFilters);
  document.getElementById('dateTo').addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Action buttons
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('addItemBtn').addEventListener('click', openAddItemModal);
  document.getElementById('saveItemBtn').addEventListener('click', saveItem);
  document.getElementById('refreshBtn').addEventListener('click', refreshData);
  
  // Modal close handlers
  document.getElementById('itemModal').addEventListener('click', function(e) {
    if (e.target === this) closeItemModal();
  });
  
  document.getElementById('detailsModal').addEventListener('click', function(e) {
    if (e.target === this) closeDetailsModal();
  });
}

// Render items table
function renderTable() {
  const tbody = document.getElementById('itemsTableBody');
  
  if (filteredItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No items in inventory</td></tr>';
    return;
  }

  tbody.innerHTML = filteredItems.map(item => `
    <tr>
      <td>
        <div class="item-info">
          <div class="item-icon ${item.category}">
            <i class="fa-solid fa-${getCategoryIcon(item.category)}"></i>
          </div>
          <div class="item-details">
            <span class="item-name">${escapeHtml(item.name)}</span>
            <span class="item-category">${capitalizeFirst(item.category)}</span>
          </div>
        </div>
      </td>
      <td>${escapeHtml(item.donor)}</td>
      <td>${capitalizeFirst(item.category)}</td>
      <td><strong>${item.quantity}</strong> ${item.unit}</td>
      <td>${formatDate(item.dateReceived)}</td>
      <td>
        <span class="status-badge ${item.status}">
          ${capitalizeFirst(item.status)}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view" onclick="viewItemDetails(${item.id})" title="View Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${item.status === 'pending' || item.status === 'verified' ? `
            <button class="btn-icon edit" onclick="editItem(${item.id})" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
          ` : ''}
          ${item.status === 'pending' ? `
            <button class="btn-icon" onclick="verifyItem(${item.id})" title="Verify" style="color: var(--primary-green);">
              <i class="fa-solid fa-check"></i>
            </button>
          ` : ''}
          ${item.status === 'verified' ? `
            <button class="btn-icon" onclick="markStored(${item.id})" title="Mark as Stored" style="color: var(--primary-green);">
              <i class="fa-solid fa-warehouse"></i>
            </button>
          ` : ''}
          ${item.status === 'stored' ? `
            <button class="btn-icon" onclick="allocateItem(${item.id})" title="Allocate" style="color: var(--purple);">
              <i class="fa-solid fa-dolly"></i>
            </button>
          ` : ''}
          <button class="btn-icon delete" onclick="deleteItem(${item.id})" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Update all statistics
function updateAllStats() {
  updateInventorySummary();
}

// Update inventory summary
function updateInventorySummary() {
  const totalReceived = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAvailable = items
    .filter(i => i.status === 'stored')
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalAllocated = items
    .filter(i => i.status === 'allocated')
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalDistributed = items
    .filter(i => i.status === 'distributed')
    .reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById('totalReceived').textContent = totalReceived.toLocaleString();
  document.getElementById('totalAvailable').textContent = totalAvailable.toLocaleString();
  document.getElementById('totalAllocated').textContent = totalAllocated.toLocaleString();
  document.getElementById('totalDistributed').textContent = totalDistributed.toLocaleString();
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;

  filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm) ||
      item.donor.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm);

    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesDateFrom = !dateFrom || item.dateReceived >= dateFrom;
    const matchesDateTo = !dateTo || item.dateReceived <= dateTo;

    return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  renderTable();
  updateInventorySummary();
}

// Clear filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  applyFilters();
}

// Open add item modal
function openAddItemModal() {
  editingItemId = null;
  document.getElementById('modalTitle').textContent = 'Add New Item';
  document.getElementById('itemForm').reset();
  document.getElementById('itemId').value = '';
  document.getElementById('dateReceived').value = new Date().toISOString().split('T')[0];
  document.getElementById('itemModal').classList.add('active');
}

// Close item modal
function closeItemModal() {
  document.getElementById('itemModal').classList.remove('active');
  editingItemId = null;
}

// Edit item
function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.status === 'allocated' || item.status === 'distributed') {
    showNotification('Cannot edit items that are already allocated or distributed', 'error');
    return;
  }

  editingItemId = id;
  document.getElementById('modalTitle').textContent = 'Edit Item';
  document.getElementById('itemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('category').value = item.category;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('unit').value = item.unit;
  document.getElementById('donorName').value = item.donor;
  document.getElementById('dateReceived').value = item.dateReceived;
  document.getElementById('storageLocation').value = item.storageLocation || '';
  document.getElementById('expiryDate').value = item.expiryDate || '';
  document.getElementById('notes').value = item.notes || '';
  
  document.getElementById('itemModal').classList.add('active');
}

// Save item (add or update)
function saveItem() {
  const form = document.getElementById('itemForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const itemData = {
    name: document.getElementById('itemName').value.trim(),
    category: document.getElementById('category').value,
    quantity: parseInt(document.getElementById('quantity').value),
    unit: document.getElementById('unit').value,
    donor: document.getElementById('donorName').value.trim(),
    dateReceived: document.getElementById('dateReceived').value,
    storageLocation: document.getElementById('storageLocation').value.trim(),
    expiryDate: document.getElementById('expiryDate').value,
    notes: document.getElementById('notes').value.trim()
  };

  if (editingItemId) {
    // Update existing item
    const item = items.find(i => i.id === editingItemId);
    if (item) {
      Object.assign(item, itemData);
      showNotification(`Item "${item.name}" updated successfully!`, 'success');
    }
  } else {
    // Add new item
    const newItem = {
      id: Date.now(),
      ...itemData,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };
    items.push(newItem);
    showNotification(`Item "${newItem.name}" added successfully!`, 'success');
  }

  closeItemModal();
  applyFilters();
  updateAllStats();
}

// View item details
function viewItemDetails(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const modalBody = document.getElementById('detailsModalBody');
  const modalFooter = document.getElementById('detailsModalFooter');

  modalBody.innerHTML = `
    <div style="display: flex; align-items: center; gap: 20px; padding: 24px; background: var(--light-gray); border-radius: 12px; margin-bottom: 24px;">
      <div class="item-icon ${item.category}" style="width: 80px; height: 80px; font-size: 36px;">
        <i class="fa-solid fa-${getCategoryIcon(item.category)}"></i>
      </div>
      <div>
        <h3 style="font-size: 24px; margin-bottom: 8px;">${escapeHtml(item.name)}</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span class="status-badge ${item.status}">${capitalizeFirst(item.status)}</span>
          <span style="font-size: 14px; color: var(--text-light);">
            <i class="fa-solid fa-tag"></i> ${capitalizeFirst(item.category)}
          </span>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
      <div>
        <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Quantity</div>
        <div style="font-size: 24px; font-weight: 700; color: var(--primary-green);">${item.quantity} ${item.unit}</div>
      </div>
      <div>
        <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Donor</div>
        <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${escapeHtml(item.donor)}</div>
      </div>
      <div>
        <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Date Received</div>
        <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${formatDateLong(item.dateReceived)}</div>
      </div>
      ${item.storageLocation ? `
        <div>
          <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Storage Location</div>
          <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${escapeHtml(item.storageLocation)}</div>
        </div>
      ` : ''}
      ${item.expiryDate ? `
        <div>
          <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Expiry Date</div>
          <div style="font-size: 15px; font-weight: 600; color: ${new Date(item.expiryDate) < new Date() ? 'var(--danger-red)' : 'var(--text-dark)'};">
            ${formatDateLong(item.expiryDate)}
            ${new Date(item.expiryDate) < new Date() ? ' <i class="fa-solid fa-triangle-exclamation"></i>' : ''}
          </div>
        </div>
      ` : ''}
    </div>

    ${item.notes ? `
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 16px; margin-bottom: 12px; color: var(--text-dark);">
          <i class="fa-solid fa-note-sticky"></i> Notes
        </h4>
        <p style="color: var(--text-light); line-height: 1.6;">${escapeHtml(item.notes)}</p>
      </div>
    ` : ''}
  `;

  modalFooter.innerHTML = generateDetailsFooter(item);

  document.getElementById('detailsModal').classList.add('active');
}

// Generate details footer buttons
function generateDetailsFooter(item) {
  let buttons = '<button class="btn btn-outline" onclick="closeDetailsModal()">Close</button>';

  if (item.status === 'pending') {
    buttons = `
      <button class="btn btn-outline" onclick="closeDetailsModal()">Close</button>
      <button class="btn btn-primary" onclick="verifyItem(${item.id}); closeDetailsModal();">
        <i class="fa-solid fa-check"></i> Verify Item
      </button>
    `;
  } else if (item.status === 'verified') {
    buttons = `
      <button class="btn btn-outline" onclick="editItem(${item.id}); closeDetailsModal();">
        <i class="fa-solid fa-pen"></i> Edit
      </button>
      <button class="btn btn-primary" onclick="markStored(${item.id}); closeDetailsModal();">
        <i class="fa-solid fa-warehouse"></i> Mark as Stored
      </button>
    `;
  } else if (item.status === 'stored') {
    buttons = `
      <button class="btn btn-outline" onclick="closeDetailsModal()">Close</button>
      <button class="btn btn-primary" onclick="allocateItem(${item.id}); closeDetailsModal();">
        <i class="fa-solid fa-dolly"></i> Allocate for Distribution
      </button>
    `;
  }

  return buttons;
}

// Close details modal
function closeDetailsModal() {
  document.getElementById('detailsModal').classList.remove('active');
}

// Verify item
function verifyItem(id) {
  const item = items.find(i => i.id === id);
  if (item && item.status === 'pending') {
    item.status = 'verified';
    applyFilters();
    updateAllStats();
    showNotification(`Item "${item.name}" has been verified!`, 'success');
  }
}

// Mark as stored
function markStored(id) {
  const item = items.find(i => i.id === id);
  if (item && item.status === 'verified') {
    item.status = 'stored';
    applyFilters();
    updateAllStats();
    showNotification(`Item "${item.name}" marked as stored in inventory!`, 'success');
  }
}

// Allocate item
function allocateItem(id) {
  const item = items.find(i => i.id === id);
  if (item && item.status === 'stored') {
    if (confirm(`Allocate "${item.name}" (${item.quantity} ${item.unit}) for distribution?`)) {
      item.status = 'allocated';
      applyFilters();
      updateAllStats();
      showNotification(`Item "${item.name}" allocated for distribution!`, 'success');
    }
  }
}

// Delete item
function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.status === 'allocated' || item.status === 'distributed') {
    showNotification('Cannot delete items that are allocated or distributed', 'error');
    return;
  }

  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
    items = items.filter(i => i.id !== id);
    applyFilters();
    updateAllStats();
    showNotification('Item deleted successfully', 'success');
  }
}

// Export to CSV
function exportToCSV() {
  if (filteredItems.length === 0) {
    showNotification('No items to export', 'error');
    return;
  }

  const headers = ['Item Name', 'Category', 'Quantity', 'Unit', 'Donor', 'Date Received', 'Status', 'Storage Location', 'Expiry Date', 'Notes'];
  
  const csvData = filteredItems.map(item => [
    item.name,
    item.category,
    item.quantity,
    item.unit,
    item.donor,
    item.dateReceived,
    item.status,
    item.storageLocation || '',
    item.expiryDate || '',
    item.notes || ''
  ]);

  let csv = headers.join(',') + '\n';
  csvData.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  showNotification('Inventory exported successfully!', 'success');
}

// Refresh data
function refreshData() {
  applyFilters();
  updateAllStats();
  showNotification('Data refreshed successfully!', 'success');
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    food: 'apple-whole',
    water: 'bottle-water',
    clothing: 'shirt',
    hygiene: 'soap',
    medical: 'kit-medical',
    blankets: 'bed',
    miscellaneous: 'box'
  };
  return icons[category] || 'box';
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateLong(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  alert(message);
  // In production, replace with a proper notification library
}