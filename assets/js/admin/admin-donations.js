// Donations data - In production, this would come from a database/API
// Will be populated when donors submit donations through the donation form
let donations = [];

let filteredDonations = [];

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
  document.getElementById('dateFrom').addEventListener('change', applyFilters);
  document.getElementById('dateTo').addEventListener('change', applyFilters);
  
  // Clear filters button
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', function() {
    applyFilters();
    showNotification('Data refreshed successfully!', 'success');
  });
  
  // Close modal on outside click
  document.getElementById('detailsModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
}

// Render donations table
function renderTable() {
  const tbody = document.getElementById('donationsTableBody');
  
  if (filteredDonations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No donations found</td></tr>';
    updateStats();
    return;
  }

  tbody.innerHTML = filteredDonations.map(donation => `
    <tr>
      <td>
        <div class="donor-info">
          <div class="donor-avatar">${donation.donor.name.charAt(0)}</div>
          <div class="donor-details">
            <span class="donor-name">${donation.donor.name}</span>
            <span class="donor-email">${donation.donor.email}</span>
          </div>
        </div>
      </td>
      <td>
        ${donation.type === 'monetary' 
          ? '<i class="fa-solid fa-peso-sign"></i> Monetary' 
          : '<i class="fa-solid fa-box"></i> In-Kind'}
      </td>
      <td>
        ${donation.type === 'monetary' 
          ? '₱' + donation.amount.toLocaleString() 
          : donation.item + ' (x' + donation.quantity + ')'}
      </td>
      <td><code>${donation.referenceNo}</code></td>
      <td>${formatDate(donation.date)}</td>
      <td>
        <span class="status-badge ${donation.status}">
          ${capitalizeFirst(donation.status)}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view" onclick="viewDetails(${donation.id})" title="View Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${donation.status === 'pending' ? `
            <button class="btn-icon approve" onclick="approveDonation(${donation.id})" title="Approve">
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn-icon reject" onclick="rejectDonation(${donation.id})" title="Reject">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
          ${donation.status === 'verified' ? `
            <button class="btn-icon approve" onclick="markReceived(${donation.id})" title="Mark as Received">
              <i class="fa-solid fa-check-double"></i>
            </button>
          ` : ''}
          ${donation.status === 'received' ? `
            <button class="btn-icon approve" onclick="markDistributed(${donation.id})" title="Mark as Distributed">
              <i class="fa-solid fa-truck"></i>
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  updateStats();
}

// Update statistics
function updateStats() {
  const totalCount = filteredDonations.length;
  const totalAmount = filteredDonations
    .filter(d => d.type === 'monetary')
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = filteredDonations.filter(d => d.status === 'pending').length;
  const verifiedCount = filteredDonations.filter(d => d.status === 'verified').length;

  document.getElementById('totalCount').textContent = totalCount;
  document.getElementById('totalAmount').textContent = '₱' + totalAmount.toLocaleString();
  document.getElementById('pendingCount').textContent = pendingCount;
  document.getElementById('verifiedCount').textContent = verifiedCount;
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const typeFilter = document.getElementById('typeFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;

  filteredDonations = donations.filter(donation => {
    // Search filter
    const matchesSearch = !searchTerm || 
      donation.donor.name.toLowerCase().includes(searchTerm) ||
      donation.donor.email.toLowerCase().includes(searchTerm) ||
      donation.referenceNo.toLowerCase().includes(searchTerm);

    // Type filter
    const matchesType = !typeFilter || donation.type === typeFilter;

    // Status filter
    const matchesStatus = !statusFilter || donation.status === statusFilter;

    // Date filters
    const matchesDateFrom = !dateFrom || donation.date >= dateFrom;
    const matchesDateTo = !dateTo || donation.date <= dateTo;

    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  renderTable();
}

// Clear all filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('typeFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  applyFilters();
}

// View donation details
function viewDetails(id) {
  const donation = donations.find(d => d.id === id);
  if (!donation) return;

  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');

  modalBody.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Donor Name:</span>
      <span class="detail-value">${donation.donor.name}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email:</span>
      <span class="detail-value">${donation.donor.email}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Type:</span>
      <span class="detail-value">${donation.type === 'monetary' ? 'Monetary' : 'In-Kind'}</span>
    </div>
    ${donation.type === 'monetary' ? `
      <div class="detail-row">
        <span class="detail-label">Amount:</span>
        <span class="detail-value">₱${donation.amount.toLocaleString()}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Payment Method:</span>
        <span class="detail-value">${donation.paymentMethod}</span>
      </div>
    ` : `
      <div class="detail-row">
        <span class="detail-label">Item:</span>
        <span class="detail-value">${donation.item}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Quantity:</span>
        <span class="detail-value">${donation.quantity}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Delivery Method:</span>
        <span class="detail-value">${donation.deliveryMethod}</span>
      </div>
    `}
    <div class="detail-row">
      <span class="detail-label">Reference No.:</span>
      <span class="detail-value">${donation.referenceNo}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date:</span>
      <span class="detail-value">${formatDateLong(donation.date)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="detail-value">
        <span class="status-badge ${donation.status}">
          ${capitalizeFirst(donation.status)}
        </span>
      </span>
    </div>
    ${donation.notes ? `
      <div class="detail-row">
        <span class="detail-label">Notes:</span>
        <span class="detail-value">${donation.notes}</span>
      </div>
    ` : ''}
    ${donation.proof ? `
      <div style="margin-top: 20px;">
        <strong>Proof of ${donation.type === 'monetary' ? 'Payment' : 'Delivery'}:</strong>
        <img src="${donation.proof}" alt="Proof" class="proof-image">
      </div>
    ` : ''}
  `;

  modalFooter.innerHTML = `
    ${donation.status === 'pending' ? `
      <button class="btn btn-danger" onclick="rejectDonation(${id}); closeModal();">
        <i class="fa-solid fa-xmark"></i> Reject
      </button>
      <button class="btn btn-primary" onclick="approveDonation(${id}); closeModal();">
        <i class="fa-solid fa-check"></i> Approve & Verify
      </button>
    ` : donation.status === 'verified' ? `
      <button class="btn btn-primary" onclick="markReceived(${id}); closeModal();">
        <i class="fa-solid fa-check-double"></i> Mark as Received
      </button>
    ` : donation.status === 'received' ? `
      <button class="btn btn-primary" onclick="markDistributed(${id}); closeModal();">
        <i class="fa-solid fa-truck"></i> Mark as Distributed
      </button>
    ` : `
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
    `}
  `;

  document.getElementById('detailsModal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('detailsModal').classList.remove('active');
}

// Approve donation
function approveDonation(id) {
  const donation = donations.find(d => d.id === id);
  if (donation) {
    donation.status = 'verified';
    applyFilters();
    showNotification(`Donation ${donation.referenceNo} has been verified!`, 'success');
  }
}

// Reject donation
function rejectDonation(id) {
  if (confirm('Are you sure you want to reject this donation?')) {
    const donation = donations.find(d => d.id === id);
    if (donation) {
      donation.status = 'rejected';
      applyFilters();
      showNotification(`Donation ${donation.referenceNo} has been rejected.`, 'error');
    }
  }
}

// Mark as received
function markReceived(id) {
  const donation = donations.find(d => d.id === id);
  if (donation) {
    donation.status = 'received';
    applyFilters();
    showNotification(`Donation ${donation.referenceNo} marked as received!`, 'success');
  }
}

// Mark as distributed
function markDistributed(id) {
  const donation = donations.find(d => d.id === id);
  if (donation) {
    donation.status = 'distributed';
    applyFilters();
    showNotification(`Donation ${donation.referenceNo} marked as distributed!`, 'success');
  }
}

// Export to CSV
function exportToCSV() {
  const headers = ['Donor Name', 'Email', 'Type', 'Amount/Item', 'Quantity', 'Reference No', 'Date', 'Status', 'Payment/Delivery Method', 'Notes'];
  
  const csvData = filteredDonations.map(d => [
    d.donor.name,
    d.donor.email,
    d.type,
    d.type === 'monetary' ? d.amount : d.item,
    d.type === 'monetary' ? '' : d.quantity,
    d.referenceNo,
    d.date,
    d.status,
    d.type === 'monetary' ? d.paymentMethod : d.deliveryMethod,
    d.notes || ''
  ]);

  let csv = headers.join(',') + '\n';
  csvData.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showNotification('CSV exported successfully!', 'success');
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateLong(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
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