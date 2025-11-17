// Donors data - starts empty, will be populated when donors register/donate
let donors = [];
let filteredDonors = [];

// Track which donor is being edited
let editingDonorId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  renderTable();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Search input
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  
  // Filter dropdowns
  document.getElementById('typeFilter').addEventListener('change', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
  
  // Clear filters button
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  
  // Add donor button
  document.getElementById('addDonorBtn').addEventListener('click', openAddDonorModal);
  
  // Save donor button
  document.getElementById('saveDonorBtn').addEventListener('click', saveDonor);
  
  // Close modals on outside click
  document.getElementById('donorModal').addEventListener('click', function(e) {
    if (e.target === this) closeDonorModal();
  });
  
  document.getElementById('profileModal').addEventListener('click', function(e) {
    if (e.target === this) closeProfileModal();
  });
}

// Render donors table
function renderTable() {
  const tbody = document.getElementById('donorsTableBody');
  
  if (filteredDonors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No donors yet</td></tr>';
    updateStats();
    return;
  }

  tbody.innerHTML = filteredDonors.map(donor => {
    const totalDonated = calculateTotalDonations(donor);
    const lastDonation = getLastDonationDate(donor);
    
    return `
      <tr>
        <td>
          <div class="donor-info">
            <div class="donor-avatar">${donor.name.charAt(0)}</div>
            <div class="donor-details">
              <span class="donor-name">${donor.name}</span>
              <span class="donor-type-badge">
                <i class="fa-solid fa-${donor.type === 'individual' ? 'user' : 'building'}"></i>
                ${capitalizeFirst(donor.type)}
              </span>
            </div>
          </div>
        </td>
        <td>${capitalizeFirst(donor.type)}</td>
        <td>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fa-solid fa-envelope"></i>
              <span>${donor.email}</span>
            </div>
            <div class="contact-item">
              <i class="fa-solid fa-phone"></i>
              <span>${donor.phone}</span>
            </div>
          </div>
        </td>
        <td>${donor.city || 'N/A'}</td>
        <td><strong>₱${totalDonated.toLocaleString()}</strong></td>
        <td>${lastDonation || 'No donations yet'}</td>
        <td>
          <span class="status-badge ${donor.status}">
            ${capitalizeFirst(donor.status)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon view" onclick="viewDonorProfile(${donor.id})" title="View Profile">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-icon edit" onclick="editDonor(${donor.id})" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
            ${donor.status !== 'blacklisted' ? `
              <button class="btn-icon delete" onclick="toggleDonorStatus(${donor.id})" title="${donor.status === 'active' ? 'Deactivate' : 'Activate'}">
                <i class="fa-solid fa-${donor.status === 'active' ? 'ban' : 'check'}"></i>
              </button>
            ` : ''}
            ${donor.status === 'active' ? `
              <button class="btn-icon delete" onclick="blacklistDonor(${donor.id})" title="Blacklist">
                <i class="fa-solid fa-user-slash"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateStats();
}

// Update statistics
function updateStats() {
  const totalDonors = filteredDonors.length;
  const individualCount = filteredDonors.filter(d => d.type === 'individual').length;
  const orgCount = filteredDonors.filter(d => d.type === 'organization').length;
  const activeCount = filteredDonors.filter(d => d.status === 'active').length;

  document.getElementById('totalDonors').textContent = totalDonors;
  document.getElementById('individualCount').textContent = individualCount;
  document.getElementById('orgCount').textContent = orgCount;
  document.getElementById('activeCount').textContent = activeCount;
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const typeFilter = document.getElementById('typeFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  filteredDonors = donors.filter(donor => {
    // Search filter
    const matchesSearch = !searchTerm || 
      donor.name.toLowerCase().includes(searchTerm) ||
      donor.email.toLowerCase().includes(searchTerm) ||
      donor.phone.includes(searchTerm);

    // Type filter
    const matchesType = !typeFilter || donor.type === typeFilter;

    // Status filter
    const matchesStatus = !statusFilter || donor.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  renderTable();
}

// Clear all filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('statusFilter').value = '';
  applyFilters();
}

// Open add donor modal
function openAddDonorModal() {
  editingDonorId = null;
  document.getElementById('modalTitle').textContent = 'Add New Donor';
  document.getElementById('donorForm').reset();
  document.getElementById('donorId').value = '';
  document.getElementById('donorModal').classList.add('active');
}

// Close donor modal
function closeDonorModal() {
  document.getElementById('donorModal').classList.remove('active');
  editingDonorId = null;
}

// Edit donor
function editDonor(id) {
  const donor = donors.find(d => d.id === id);
  if (!donor) return;

  editingDonorId = id;
  document.getElementById('modalTitle').textContent = 'Edit Donor';
  document.getElementById('donorId').value = donor.id;
  document.getElementById('donorType').value = donor.type;
  document.getElementById('donorName').value = donor.name;
  document.getElementById('donorEmail').value = donor.email;
  document.getElementById('donorPhone').value = donor.phone;
  document.getElementById('donorAddress').value = donor.address || '';
  document.getElementById('donorCity').value = donor.city || '';
  document.getElementById('donorNotes').value = donor.notes || '';
  
  document.getElementById('donorModal').classList.add('active');
}

// Save donor (add or update)
function saveDonor() {
  const form = document.getElementById('donorForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const donorData = {
    type: document.getElementById('donorType').value,
    name: document.getElementById('donorName').value,
    email: document.getElementById('donorEmail').value,
    phone: document.getElementById('donorPhone').value,
    address: document.getElementById('donorAddress').value,
    city: document.getElementById('donorCity').value,
    notes: document.getElementById('donorNotes').value,
  };

  if (editingDonorId) {
    // Update existing donor
    const donor = donors.find(d => d.id === editingDonorId);
    if (donor) {
      Object.assign(donor, donorData);
      showNotification(`Donor ${donor.name} updated successfully!`, 'success');
    }
  } else {
    // Add new donor
    const newDonor = {
      id: Date.now(),
      ...donorData,
      status: 'active',
      donations: [],
      registeredDate: new Date().toISOString().split('T')[0]
    };
    donors.push(newDonor);
    showNotification(`Donor ${newDonor.name} added successfully!`, 'success');
  }

  closeDonorModal();
  applyFilters();
}

// View donor profile
function viewDonorProfile(id) {
  const donor = donors.find(d => d.id === id);
  if (!donor) return;

  const totalDonated = calculateTotalDonations(donor);
  const monetaryCount = donor.donations ? donor.donations.filter(d => d.type === 'monetary').length : 0;
  const inKindCount = donor.donations ? donor.donations.filter(d => d.type === 'in-kind').length : 0;

  const modalBody = document.getElementById('profileModalBody');
  
  modalBody.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${donor.name.charAt(0)}</div>
      <div class="profile-info">
        <h3>${donor.name}</h3>
        <div class="profile-meta">
          <div class="profile-meta-item">
            <i class="fa-solid fa-${donor.type === 'individual' ? 'user' : 'building'}"></i>
            <span>${capitalizeFirst(donor.type)}</span>
          </div>
          <div class="profile-meta-item">
            <i class="fa-solid fa-calendar"></i>
            <span>Joined ${formatDate(donor.registeredDate)}</span>
          </div>
          <div class="profile-meta-item">
            <span class="status-badge ${donor.status}">${capitalizeFirst(donor.status)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h4><i class="fa-solid fa-address-card"></i> Contact Information</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">${donor.email}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone</span>
          <span class="info-value">${donor.phone}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Address</span>
          <span class="info-value">${donor.address || 'Not provided'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">City</span>
          <span class="info-value">${donor.city || 'Not provided'}</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h4><i class="fa-solid fa-chart-line"></i> Donation Summary</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Total Donated</span>
          <span class="info-value" style="color: var(--primary-green); font-weight: 700; font-size: 20px;">₱${totalDonated.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Donations</span>
          <span class="info-value">${donor.donations ? donor.donations.length : 0} donations</span>
        </div>
        <div class="info-item">
          <span class="info-label">Monetary Donations</span>
          <span class="info-value">${monetaryCount} donations</span>
        </div>
        <div class="info-item">
          <span class="info-label">In-Kind Donations</span>
          <span class="info-value">${inKindCount} donations</span>
        </div>
      </div>
    </div>

    ${donor.notes ? `
      <div class="profile-section">
        <h4><i class="fa-solid fa-note-sticky"></i> Admin Notes</h4>
        <p style="color: var(--text-light); font-style: italic;">${donor.notes}</p>
      </div>
    ` : ''}

    <div class="profile-section">
      <h4><i class="fa-solid fa-history"></i> Donation History</h4>
      ${donor.donations && donor.donations.length > 0 ? 
        donor.donations.map(donation => `
          <div class="donation-item">
            <div class="donation-header">
              <span class="donation-type">
                <i class="fa-solid fa-${donation.type === 'monetary' ? 'peso-sign' : 'box'}"></i>
                ${donation.type === 'monetary' ? 'Monetary Donation' : 'In-Kind Donation'}
              </span>
              <span class="donation-amount">
                ${donation.type === 'monetary' ? '₱' + donation.amount.toLocaleString() : donation.item + ' (x' + donation.quantity + ')'}
              </span>
            </div>
            <div class="donation-date">
              <i class="fa-solid fa-calendar"></i> ${formatDate(donation.date)} • 
              <span class="status-badge ${donation.status}">${capitalizeFirst(donation.status)}</span>
            </div>
          </div>
        `).join('')
        : '<p class="empty-state">No donation history yet</p>'
      }
    </div>
  `;

  document.getElementById('profileModal').classList.add('active');
}

// Close profile modal
function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

// Toggle donor status (active/inactive)
function toggleDonorStatus(id) {
  const donor = donors.find(d => d.id === id);
  if (!donor) return;

  const newStatus = donor.status === 'active' ? 'inactive' : 'active';
  const action = newStatus === 'active' ? 'activated' : 'deactivated';
  
  if (confirm(`Are you sure you want to ${action === 'activated' ? 'activate' : 'deactivate'} ${donor.name}?`)) {
    donor.status = newStatus;
    applyFilters();
    showNotification(`Donor ${donor.name} has been ${action}.`, 'success');
  }
}

// Blacklist donor
function blacklistDonor(id) {
  const donor = donors.find(d => d.id === id);
  if (!donor) return;

  if (confirm(`Are you sure you want to BLACKLIST ${donor.name}? This action should only be taken for fraudulent or problematic donors.`)) {
    donor.status = 'blacklisted';
    applyFilters();
    showNotification(`Donor ${donor.name} has been blacklisted.`, 'error');
  }
}

// Calculate total donations for a donor
function calculateTotalDonations(donor) {
  if (!donor.donations || donor.donations.length === 0) return 0;
  
  return donor.donations
    .filter(d => d.type === 'monetary')
    .reduce((sum, d) => sum + d.amount, 0);
}

// Get last donation date
function getLastDonationDate(donor) {
  if (!donor.donations || donor.donations.length === 0) return null;
  
  const sortedDonations = [...donor.donations].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return formatDate(sortedDonations[0].date);
}

// Export to CSV
function exportToCSV() {
  if (filteredDonors.length === 0) {
    showNotification('No donors to export', 'error');
    return;
  }

  const headers = ['Name', 'Type', 'Email', 'Phone', 'City', 'Total Donated', 'Status', 'Registered Date'];
  
  const csvData = filteredDonors.map(d => [
    d.name,
    d.type,
    d.email,
    d.phone,
    d.city || '',
    calculateTotalDonations(d),
    d.status,
    d.registeredDate
  ]);

  let csv = headers.join(',') + '\n';
  csvData.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donors_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showNotification('Donor list exported successfully!', 'success');
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

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show notification (simple implementation)
function showNotification(message, type = 'info') {
  alert(message);
  // In production, you would use a proper notification library like Toastify
}