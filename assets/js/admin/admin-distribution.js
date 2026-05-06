// data management

let distributions = [];
let filteredDistributions = [];
let editingDistributionId = null;
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? '../api/auth/' : '/api/auth/';
const getAuthHeaders = () => ({ 'Authorization': 'Bearer ' + (sessionStorage.getItem('adminToken') || '') });

// Initialization
document.addEventListener('DOMContentLoaded', async function() {
  await loadDistributions();
  setupEventListeners();
});

async function loadDistributions() {
  try {
    const response = await fetch(API_BASE + 'get_distributions.php', {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (data.status === 'success') {
      distributions = data.data;
    }
  } catch (e) {
    console.error('Failed to load distributions:', e);
  }
  filteredDistributions = [...distributions];
  renderTable();
  updateAllDisplays();
}

function initializeData() {
  filteredDistributions = [...distributions];
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
  // Search and filters
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
  document.getElementById('typeFilter').addEventListener('change', applyFilters);
  document.getElementById('dateFrom').addEventListener('change', applyFilters);
  document.getElementById('dateTo').addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Action buttons
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('newDistributionBtn').addEventListener('click', openNewDistributionModal);
  document.getElementById('saveDistributionBtn').addEventListener('click', saveDistribution);
  document.getElementById('refreshBtn').addEventListener('click', refreshData);
  
  // Distribution type change handler
  document.getElementById('distributionType').addEventListener('change', handleDistributionTypeChange);
  
  // Modal close handlers
  document.getElementById('distributionModal').addEventListener('click', function(e) {
    if (e.target === this) closeDistributionModal();
  });
  
  document.getElementById('detailsModal').addEventListener('click', function(e) {
    if (e.target === this) closeDetailsModal();
  });
}

// ==========================================
// DISTRIBUTION TYPE HANDLER
// ==========================================

function handleDistributionTypeChange() {
  const type = document.getElementById('distributionType').value;
  const monetarySection = document.getElementById('monetarySection');
  const itemsSection = document.getElementById('itemsSection');
  
  monetarySection.style.display = 'none';
  itemsSection.style.display = 'none';
  
  if (type === 'monetary') {
    monetarySection.style.display = 'block';
  } else if (type === 'in-kind') {
    itemsSection.style.display = 'block';
  } else if (type === 'mixed') {
    monetarySection.style.display = 'block';
    itemsSection.style.display = 'block';
  }
}


// Table Rendering


function renderTable() {
  const tbody = document.getElementById('distributionsTableBody');
  
  if (filteredDistributions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No distributions yet</td></tr>';
    return;
  }

  tbody.innerHTML = filteredDistributions.map(dist => `
    <tr>
      <td><strong>#DIST-${String(dist.id).padStart(4, '0')}</strong></td>
      <td>${escapeHtml(dist.location)}</td>
      <td>${formatDate(dist.date)}</td>
      <td>
        <i class="fa-solid fa-${getTypeIcon(dist.type)}"></i>
        ${capitalizeFirst(dist.type)}
      </td>
      <td><strong>${dist.beneficiaries}</strong></td>
      <td>${escapeHtml(dist.teamLeader)}</td>
      <td>
        <span class="status-badge ${dist.status}">
          ${capitalizeFirst(dist.status)}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view" onclick="viewDistributionDetails(${dist.id})" title="View Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${renderActionButtons(dist)}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderActionButtons(dist) {
  let buttons = '';
  
  if (dist.status === 'pending') {
    buttons += `
      <button class="btn-icon edit" onclick="editDistribution(${dist.id})" title="Edit">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="btn-icon" onclick="updateDistributionStatus(${dist.id}, 'ongoing')" title="Start Distribution">
        <i class="fa-solid fa-play"></i>
      </button>
      <button class="btn-icon delete" onclick="cancelDistribution(${dist.id})" title="Cancel">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
  } else if (dist.status === 'ongoing') {
    buttons += `
      <button class="btn-icon" onclick="updateDistributionStatus(${dist.id}, 'completed')" title="Mark Complete">
        <i class="fa-solid fa-check"></i>
      </button>
    `;
  }
  
  return buttons;
}

function getTypeIcon(type) {
  const icons = {
    'monetary': 'peso-sign',
    'in-kind': 'box',
    'mixed': 'boxes-stacked'
  };
  return icons[type] || 'question';
}

// ==========================================
// STATISTICS & DISPLAY UPDATES
// ==========================================

function updateStatistics() {
  const total = distributions.length;
  const ongoing = distributions.filter(d => d.status === 'ongoing').length;
  const completed = distributions.filter(d => d.status === 'completed').length;
  const beneficiaries = distributions.reduce((s, d) => s + (parseInt(d.beneficiaries) || 0), 0);

  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('totalDistributions', total);
  el('ongoingCount', ongoing);
  el('completedCount', completed);
  el('totalBeneficiaries', beneficiaries.toLocaleString());
}

function updateAllDisplays() {
  updateStatistics();
}

// ==========================================
// SAVE DISTRIBUTION
// ==========================================

async function saveDistribution() {
  const form = document.getElementById('distributionForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch(API_BASE + 'save_distribution.php', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    const result = await response.json();
    if (result.status === 'success') {
      showNotification(result.message, 'success');
      closeDistributionModal();
      await loadDistributions();
    } else {
      showNotification(result.message || 'Error saving distribution', 'error');
    }
  } catch (e) {
    showNotification('Network error. Please try again.', 'error');
  }
}

// ==========================================
// FILTERS
// ==========================================

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const statusFilter = document.getElementById('statusFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;

  filteredDistributions = distributions.filter(dist => {
    const matchesSearch = !searchTerm || 
      dist.location.toLowerCase().includes(searchTerm) ||
      dist.teamLeader.toLowerCase().includes(searchTerm) ||
      String(dist.id).includes(searchTerm);

    const matchesStatus = !statusFilter || dist.status === statusFilter;
    const matchesType = !typeFilter || dist.type === typeFilter;
    const matchesDateFrom = !dateFrom || dist.date >= dateFrom;
    const matchesDateTo = !dateTo || dist.date <= dateTo;

    return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
  });

  renderTable();
  updateStatistics();
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  applyFilters();
}

// ==========================================
// MODAL OPERATIONS - NEW/EDIT
// ==========================================

function openNewDistributionModal() {
  editingDistributionId = null;
  document.getElementById('modalTitle').textContent = 'New Distribution';
  document.getElementById('distributionForm').reset();
  document.getElementById('distributionId').value = '';
  document.getElementById('monetarySection').style.display = 'none';
  document.getElementById('itemsSection').style.display = 'none';
  document.getElementById('distributionModal').classList.add('active');
}

function closeDistributionModal() {
  document.getElementById('distributionModal').classList.remove('active');
  editingDistributionId = null;
}

function editDistribution(id) {
  const dist = distributions.find(d => d.id === id);
  if (!dist || dist.status !== 'pending') {
    showNotification('Only pending distributions can be edited', 'error');
    return;
  }

  editingDistributionId = id;
  document.getElementById('modalTitle').textContent = 'Edit Distribution';
  document.getElementById('distributionId').value = dist.id;
  document.getElementById('location').value = dist.location;
  document.getElementById('distributionDate').value = dist.date;
  document.getElementById('distributionType').value = dist.type;
  document.getElementById('beneficiaries').value = dist.beneficiaries;
  document.getElementById('teamLeader').value = dist.teamLeader;
  document.getElementById('teamMembers').value = dist.teamMembers || '';
  document.getElementById('notes').value = dist.notes || '';
  
  if (dist.type === 'monetary' || dist.type === 'mixed') {
    document.getElementById('monetaryAmount').value = dist.monetaryAmount || 0;
  }
  
  if (dist.type === 'in-kind' || dist.type === 'mixed') {
    document.getElementById('riceQty').value = dist.items?.rice || 0;
    document.getElementById('waterQty').value = dist.items?.water || 0;
    document.getElementById('cannedQty').value = dist.items?.canned || 0;
    document.getElementById('hygieneQty').value = dist.items?.hygiene || 0;
    document.getElementById('blanketsQty').value = dist.items?.blankets || 0;
  }
  
  handleDistributionTypeChange();
  document.getElementById('distributionModal').classList.add('active');
}

// ==========================================
// SAVE DISTRIBUTION
// ==========================================
// ==========================================
// STATUS MANAGEMENT
// ==========================================

async function updateDistributionStatus(id, newStatus) {
  const dist = distributions.find(d => d.id === id);
  if (!dist) return;

  const messages = {
    'ongoing': 'Start this distribution operation?',
    'completed': 'Mark this distribution as completed?'
  };

  showDistConfirm(messages[newStatus] || 'Update distribution status?', async () => {
    try {
      const response = await fetch(API_BASE + 'update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ type: 'distribution', id, status: newStatus })
      });
      const result = await response.json();
      if (result.status === 'success') {
        dist.status = newStatus;
        applyFilters();
        updateAllDisplays();
        showNotification(`Distribution marked as ${newStatus}!`, 'success');
      } else {
        showNotification(result.message || 'Error updating status', 'error');
      }
    } catch (e) {
      showNotification('Network error. Please try again.', 'error');
    }
  });
}

async function cancelDistribution(id) {
  const dist = distributions.find(d => d.id === id);
  if (!dist || dist.status !== 'pending') return;

  showDistConfirm('Cancel this distribution?', async () => {
    try {
      const response = await fetch(API_BASE + 'update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ type: 'distribution', id, status: 'cancelled' })
      });
      const result = await response.json();
      if (result.status === 'success') {
        dist.status = 'cancelled';
        applyFilters();
        updateAllDisplays();
        showNotification('Distribution cancelled successfully.', 'success');
      } else {
        showNotification(result.message || 'Error cancelling distribution', 'error');
      }
    } catch (e) {
      showNotification('Network error. Please try again.', 'error');
    }
  });
}

function showDistConfirm(message, onConfirm) {
  let modal = document.getElementById('distConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'distConfirmModal';
    modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:12px;width:100%;max-width:400px;padding:32px;text-align:center;">
        <p id="distConfirmMsg" style="font-size:16px;font-weight:600;margin-bottom:24px;color:var(--text-dark);"></p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="btn btn-outline" onclick="document.getElementById('distConfirmModal').style.display='none'">Cancel</button>
          <button id="distConfirmOk" class="btn btn-primary">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('distConfirmMsg').textContent = message;
  modal.style.display = 'flex';
  document.getElementById('distConfirmOk').onclick = () => {
    modal.style.display = 'none';
    onConfirm();
  };
}

// ==========================================
// VIEW DETAILS MODAL
// ==========================================

function viewDistributionDetails(id) {
  const dist = distributions.find(d => d.id === id);
  if (!dist) return;

  const modalBody = document.getElementById('detailsModalBody');
  const modalFooter = document.getElementById('detailsModalFooter');

  modalBody.innerHTML = generateDetailsHTML(dist);
  modalFooter.innerHTML = generateDetailsFooter(dist);

  document.getElementById('detailsModal').classList.add('active');
}

function generateDetailsHTML(dist) {
  let html = `
    <div class="detail-section">
      <h4><i class="fa-solid fa-info-circle"></i> Basic Information</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Reference ID</span>
          <span class="detail-value">#DIST-${String(dist.id).padStart(4, '0')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value">
            <span class="status-badge ${dist.status}">${capitalizeFirst(dist.status)}</span>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${escapeHtml(dist.location)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Distribution Date</span>
          <span class="detail-value">${formatDateLong(dist.date)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Type</span>
          <span class="detail-value">${capitalizeFirst(dist.type)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Beneficiaries</span>
          <span class="detail-value">${dist.beneficiaries.toLocaleString()} ${dist.beneficiaries === 1 ? 'person' : 'people'}</span>
        </div>
      </div>
    </div>
  `;

  // Monetary section
  if (dist.type === 'monetary' || dist.type === 'mixed') {
    const totalAmount = dist.monetaryAmount * dist.beneficiaries;
    html += `
      <div class="detail-section">
        <h4><i class="fa-solid fa-peso-sign"></i> Monetary Aid</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Amount per Beneficiary</span>
            <span class="detail-value">₱${(parseFloat(dist.monetaryAmount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Total Monetary Aid</span>
            <span class="detail-value" style="color: var(--primary-green); font-size: 18px;">
              ₱${(parseFloat(totalAmount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // Items section
  if (dist.type === 'in-kind' || dist.type === 'mixed') {
    const itemsList = generateItemsList(dist.items);
    html += `
      <div class="detail-section">
        <h4><i class="fa-solid fa-box"></i> Items Distributed</h4>
        <ul class="items-list">
          ${itemsList}
        </ul>
      </div>
    `;
  }

  // Team section
  html += `
    <div class="detail-section">
      <h4><i class="fa-solid fa-users"></i> Team Information</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Team Leader</span>
          <span class="detail-value">${escapeHtml(dist.teamLeader)}</span>
        </div>
        ${dist.teamMembers ? `
          <div class="detail-item">
            <span class="detail-label">Team Members</span>
            <span class="detail-value">${escapeHtml(dist.teamMembers)}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Notes section
  if (dist.notes) {
    html += `
      <div class="detail-section">
        <h4><i class="fa-solid fa-note-sticky"></i> Notes</h4>
        <p style="color: var(--text-light); line-height: 1.6;">${escapeHtml(dist.notes)}</p>
      </div>
    `;
  }

  // Timeline section
  html += `
    <div class="detail-section">
      <h4><i class="fa-solid fa-clock"></i> Timeline</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Created Date</span>
          <span class="detail-value">${formatDateLong(dist.createdDate)}</span>
        </div>
      </div>
    </div>
  `;

  return html;
}

function generateItemsList(items) {
  if (!items) return '<li>No items</li>';
  
  const itemLabels = {
    rice: 'Rice (sacks)',
    water: 'Bottled Water',
    canned: 'Canned Goods',
    hygiene: 'Hygiene Kits',
    blankets: 'Blankets'
  };

  let html = '';
  for (const [key, value] of Object.entries(items)) {
    if (value > 0) {
      html += `<li><span>${itemLabels[key]}</span><strong>${value.toLocaleString()}</strong></li>`;
    }
  }

  return html || '<li>No items</li>';
}

function generateDetailsFooter(dist) {
  if (dist.status === 'pending') {
    return `
      <button class="btn btn-outline" onclick="editDistribution(${dist.id}); closeDetailsModal();">
        <i class="fa-solid fa-pen"></i> Edit
      </button>
      <button class="btn btn-danger" onclick="cancelDistribution(${dist.id}); closeDetailsModal();">
        <i class="fa-solid fa-xmark"></i> Cancel
      </button>
      <button class="btn btn-primary" onclick="updateDistributionStatus(${dist.id}, 'ongoing'); closeDetailsModal();">
        <i class="fa-solid fa-play"></i> Start Distribution
      </button>
    `;
  } else if (dist.status === 'ongoing') {
    return `
      <button class="btn btn-outline" onclick="closeDetailsModal()">Close</button>
      <button class="btn btn-primary" onclick="updateDistributionStatus(${dist.id}, 'completed'); closeDetailsModal();">
        <i class="fa-solid fa-check"></i> Mark Complete
      </button>
    `;
  } else {
    return `<button class="btn btn-outline" onclick="closeDetailsModal()">Close</button>`;
  }
}

function closeDetailsModal() {
  document.getElementById('detailsModal').classList.remove('active');
}

// ==========================================
// EXPORT
// ==========================================

function exportToCSV() {
  if (filteredDistributions.length === 0) {
    showNotification('No distributions to export', 'error');
    return;
  }

  const headers = ['Reference', 'Location', 'Date', 'Type', 'Beneficiaries', 'Team Leader', 'Status'];
  
  const csvData = filteredDistributions.map(d => [
    `DIST-${String(d.id).padStart(4, '0')}`,
    d.location,
    d.date,
    d.type,
    d.beneficiaries,
    d.teamLeader,
    d.status
  ]);

  let csv = headers.join(',') + '\n';
  csvData.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `distributions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  showNotification('Distribution report exported successfully!', 'success');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function refreshData() {
  loadDistributions();
  showNotification('Data refreshed successfully!', 'success');
}

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
  let toast = document.getElementById('distToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'distToast';
    toast.style.cssText = 'position:fixed;top:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.15);transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  const colors = { success: '#27ae60', error: '#e74c3c', info: '#3498db' };
  toast.style.background = colors[type] || colors.info;
  toast.style.color = '#fff';
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}