
// ==========================================
// DATA MANAGEMENT
// ==========================================

let organizations = [];
let filteredOrganizations = [];
let editingOrgId = null;
let currentViewingOrgId = null;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
  await loadOrganizations();
  setupEventListeners();
});

async function loadOrganizations() {
  try {
    const response = await fetch('../api/auth/get_organizations.php', {
      headers: { 'Authorization': 'Bearer ' + (sessionStorage.getItem('adminToken') || '') }
    });
    const data = await response.json();
    if (data.status === 'success') {
      organizations = data.data;
    }
  } catch (e) {
    console.error('Failed to load organizations:', e);
  }
  filteredOrganizations = [...organizations];
  renderTable();
  updateStatistics();
}

function initializeData() {
  filteredOrganizations = [...organizations];
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
  // Search and filters
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('typeFilter').addEventListener('change', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Action buttons
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('newOrgBtn').addEventListener('click', openNewOrgModal);
  document.getElementById('refreshBtn').addEventListener('click', refreshData);

  // Save org form submit
  document.getElementById('orgForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveOrganization();
  });
  
  // Modal close handlers
  document.getElementById('orgModal').addEventListener('click', function(e) {
    if (e.target === this) closeOrgModal();
  });
  
  document.getElementById('profileModal').addEventListener('click', function(e) {
    if (e.target === this) closeProfileModal();
  });
}

// ==========================================
// TABLE RENDERING
// ==========================================

function renderTable() {
  const tbody = document.getElementById('orgsTableBody');
  if (!tbody) return;

  if (filteredOrganizations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No organizations found</td></tr>';
    return;
  }

  tbody.innerHTML = filteredOrganizations.map(org => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:8px;background:var(--trust-blue);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">
            ${getOrgInitials(org.name)}
          </div>
          <div>
            <div style="font-weight:600;font-size:14px;">${escapeHtml(org.name)}</div>
            <div style="font-size:12px;color:var(--text-light);">${formatOrgType(org.type)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(org.contactPerson)}${org.position ? '<br><small style="color:var(--text-light);">' + escapeHtml(org.position) + '</small>' : ''}</td>
      <td>${escapeHtml(org.email)}<br><small>${escapeHtml(org.phone)}</small></td>
      <td><i class="fa-solid fa-${getTypeIcon(org.type)}"></i> ${formatOrgType(org.type)}</td>
      <td>${formatContributions(org.contributions)}</td>
      <td>
        <span class="status-badge ${org.status}">${capitalizeFirst(org.status)}</span>
        <div class="action-buttons" style="margin-top:6px;">
          <button class="btn-icon view" onclick="viewOrgProfile(${org.id})" title="View Profile">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-icon edit" onclick="editOrganization(${org.id})" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// HELPER FUNCTIONS FOR DISPLAY
// ==========================================

function getOrgInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getTypeIcon(type) {
  const icons = {
    'ngo': 'hand-holding-heart',
    'private': 'building',
    'government': 'landmark',
    'church': 'church',
    'school': 'school',
    'civic': 'users'
  };
  return icons[type] || 'building';
}

function formatOrgType(type) {
  const types = {
    'ngo': 'NGO',
    'private': 'Private Company',
    'government': 'Government',
    'church': 'Church',
    'school': 'School',
    'civic': 'Civic Group'
  };
  return types[type] || type;
}

function formatContributions(contributions) {
  if (!contributions || contributions.length === 0) {
    return '<span style="color: var(--text-light);">No contributions yet</span>';
  }
  
  const monetary = contributions.filter(c => c.type === 'monetary')
    .reduce((sum, c) => sum + c.amount, 0);
  const inKind = contributions.filter(c => c.type === 'in-kind').length;
  
  let html = [];
  if (monetary > 0) {
    html.push(`<strong>₱${monetary.toLocaleString()}</strong>`);
  }
  if (inKind > 0) {
    html.push(`${inKind} in-kind`);
  }
  
  return html.join(' + ') || '<span style="color: var(--text-light);">No contributions</span>';
}

// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {
  const total = organizations.length;
  const active = organizations.filter(o => o.status === 'active').length;
  const inactive = organizations.filter(o => o.status === 'inactive').length;

  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('totalOrgs', total);
  el('activeOrgs', active);
  el('inactiveOrgs', inactive);
}

// ==========================================
// FILTERS
// ==========================================

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const typeFilter = document.getElementById('typeFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  filteredOrganizations = organizations.filter(org => {
    const matchesSearch = !searchTerm || 
      org.name.toLowerCase().includes(searchTerm) ||
      org.contactPerson.toLowerCase().includes(searchTerm) ||
      org.email.toLowerCase().includes(searchTerm);

    const matchesType = !typeFilter || org.type === typeFilter;
    const matchesStatus = !statusFilter || org.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  renderTable();
  updateStatistics();
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('statusFilter').value = '';
  applyFilters();
}

// ==========================================
// MODAL OPERATIONS - NEW/EDIT
// ==========================================

function openNewOrgModal() {
  editingOrgId = null;
  document.getElementById('modalTitle').textContent = 'Add New Organization';
  document.getElementById('orgForm').reset();
  document.getElementById('orgId').value = '';
  document.getElementById('orgStatus').value = 'pending';
  document.getElementById('orgModal').classList.add('active');
}

function closeOrgModal() {
  document.getElementById('orgModal').classList.remove('active');
  editingOrgId = null;
}

function editOrganization(id) {
  const org = organizations.find(o => o.id === id);
  if (!org) return;

  editingOrgId = id;
  document.getElementById('modalTitle').textContent = 'Edit Organization';
  document.getElementById('orgId').value = org.id;
  document.getElementById('orgName').value = org.name;
  document.getElementById('orgType').value = org.type;
  document.getElementById('orgStatus').value = org.status;
  document.getElementById('contactPerson').value = org.contactPerson;
  document.getElementById('position').value = org.position || '';
  document.getElementById('email').value = org.email;
  document.getElementById('phone').value = org.phone;
  document.getElementById('address').value = org.address || '';
  document.getElementById('website').value = org.website || '';
  document.getElementById('notes').value = org.notes || '';
  
  document.getElementById('orgModal').classList.add('active');
}

// ==========================================
// SAVE ORGANIZATION
// ==========================================

async function saveOrganization() {
  const form = document.getElementById('orgForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  // Ensure hidden orgId is included
  formData.set('orgId', document.getElementById('orgId').value || '');

  try {
    const response = await fetch('../api/auth/save_organizations.php', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + (sessionStorage.getItem('adminToken') || '') },
      body: formData
    });
    const result = await response.json();
    if (result.status === 'success') {
      showNotification(result.message, 'success');
      closeOrgModal();
      await loadOrganizations();
    } else {
      showNotification(result.message || 'Error saving organization', 'error');
    }
  } catch (e) {
    showNotification('Network error. Please try again.', 'error');
  }
}

// ==========================================
// VIEW PROFILE
// ==========================================

function viewOrgProfile(id) {
  const org = organizations.find(o => o.id === id);
  if (!org) return;

  currentViewingOrgId = id;
  const modalBody = document.getElementById('profileModalBody');

  modalBody.innerHTML = generateProfileHTML(org);
  document.getElementById('profileModal').classList.add('active');
}

function generateProfileHTML(org) {
  const monetaryContributions = (org.contributions || [])
    .filter(c => c.type === 'monetary')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const inKindCount = (org.contributions || [])
    .filter(c => c.type === 'in-kind').length;

  return `
    <div class="profile-header">
      <div class="profile-icon">${getOrgInitials(org.name)}</div>
      <div class="profile-info">
        <h3>${escapeHtml(org.name)}</h3>
        <div class="profile-meta">
          <div class="profile-meta-item">
            <i class="fa-solid fa-${getTypeIcon(org.type)}"></i>
            <span>${formatOrgType(org.type)}</span>
          </div>
          <div class="profile-meta-item">
            <i class="fa-solid fa-calendar"></i>
            <span>Registered ${formatDate(org.registeredDate)}</span>
          </div>
          <div class="profile-meta-item">
            <span class="status-badge ${org.status}">${capitalizeFirst(org.status)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h4><i class="fa-solid fa-address-card"></i> Contact Information</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Contact Person</span>
          <span class="detail-value">${escapeHtml(org.contactPerson)}</span>
        </div>
        ${org.position ? `
          <div class="detail-item">
            <span class="detail-label">Position</span>
            <span class="detail-value">${escapeHtml(org.position)}</span>
          </div>
        ` : ''}
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${escapeHtml(org.email)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${escapeHtml(org.phone)}</span>
        </div>
        ${org.address ? `
          <div class="detail-item">
            <span class="detail-label">Address</span>
            <span class="detail-value">${escapeHtml(org.address)}</span>
          </div>
        ` : ''}
        ${org.website ? `
          <div class="detail-item">
            <span class="detail-label">Website</span>
            <span class="detail-value">
              <a href="${escapeHtml(org.website)}" target="_blank" style="color: var(--trust-blue);">
                ${escapeHtml(org.website)}
              </a>
            </span>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="detail-section">
      <h4><i class="fa-solid fa-chart-line"></i> Contribution Summary</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Total Monetary</span>
          <span class="detail-value" style="color: var(--primary-green); font-weight: 700; font-size: 20px;">
            ₱${monetaryContributions.toLocaleString()}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">In-Kind Donations</span>
          <span class="detail-value">${inKindCount} items</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Total Contributions</span>
          <span class="detail-value">${(org.contributions || []).length} records</span>
        </div>
      </div>
    </div>

    ${org.contributions && org.contributions.length > 0 ? `
      <div class="detail-section">
        <h4><i class="fa-solid fa-history"></i> Contribution History</h4>
        <ul class="contributions-list">
          ${org.contributions.map(c => `
            <li>
              <div>
                <div class="contribution-type">
                  <i class="fa-solid fa-${c.type === 'monetary' ? 'peso-sign' : 'box'}"></i>
                  ${c.type === 'monetary' ? 'Monetary Contribution' : 'In-Kind Donation'}
                </div>
                <div style="font-size: 12px; color: var(--text-light); margin-top: 4px;">
                  ${formatDate(c.date)}
                </div>
              </div>
              <div class="contribution-amount">
                ${c.type === 'monetary' ? '₱' + c.amount.toLocaleString() : c.item}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${org.notes ? `
      <div class="detail-section">
        <h4><i class="fa-solid fa-note-sticky"></i> Admin Notes</h4>
        <p style="color: var(--text-light); line-height: 1.6;">${escapeHtml(org.notes)}</p>
      </div>
    ` : ''}
  `;
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
  currentViewingOrgId = null;
}

function editOrgFromProfile() {
  if (currentViewingOrgId) {
    closeProfileModal();
    editOrganization(currentViewingOrgId);
  }
}

// ==========================================
// EXPORT
// ==========================================

function exportToCSV() {
  if (filteredOrganizations.length === 0) {
    showNotification('No organizations to export', 'error');
    return;
  }

  const headers = ['Organization Name', 'Type', 'Contact Person', 'Email', 'Phone', 'Status', 'Registered Date'];
  
  const csvData = filteredOrganizations.map(o => [
    o.name,
    formatOrgType(o.type),
    o.contactPerson,
    o.email,
    o.phone,
    o.status,
    o.registeredDate
  ]);

  let csv = headers.join(',') + '\n';
  csvData.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `organizations_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  showNotification('Organizations list exported successfully!', 'success');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function refreshData() {
  loadOrganizations();
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

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  alert(message);
  // In production, replace with a proper notification library
}