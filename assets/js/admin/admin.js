

// INITIAL DATA STRUCTURES
let donations = [
  {
    id: 1,
    donor: { name: "Juan dela Cruz", email: "juan@email.com" },
    type: "monetary",
    amount: 5000,
    referenceNo: "DON-2024-001",
    date: "2024-11-15",
    status: "verified"
  },
  {
    id: 2,
    donor: { name: "Maria Santos", email: "maria@email.com" },
    type: "in-kind",
    item: "Rice Sacks",
    quantity: 50,
    referenceNo: "DON-2024-002",
    date: "2024-11-16",
    status: "pending"
  },
  {
    id: 3,
    donor: { name: "ABC Corporation", email: "contact@abc.com" },
    type: "monetary",
    amount: 25000,
    referenceNo: "DON-2024-003",
    date: "2024-11-17",
    status: "verified"
  }
];

let donors = [
  {
    id: 1,
    name: "Juan dela Cruz",
    type: "individual",
    email: "juan@email.com",
    phone: "09171234567",
    status: "active",
    donations: []
  },
  {
    id: 2,
    name: "Maria Santos",
    type: "individual",
    email: "maria@email.com",
    phone: "09187654321",
    status: "active",
    donations: []
  }
];

let distributions = [
  {
    id: 1,
    location: "Barangay San Roque, Quezon City",
    date: "2024-11-18",
    type: "mixed",
    beneficiaries: 150,
    status: "ongoing",
    monetaryAmount: 2000,
    items: { rice: 50, water: 100 }
  },
  {
    id: 2,
    location: "Barangay Marikina Heights",
    date: "2024-11-20",
    type: "monetary",
    beneficiaries: 200,
    status: "pending",
    monetaryAmount: 3000
  }
];

let inKindItems = [
  {
    id: 1,
    name: "Rice Sacks (25kg)",
    category: "food",
    quantity: 120,
    unit: "sacks",
    status: "stored",
    donor: "ABC Corporation",
    dateReceived: "2024-11-10"
  },
  {
    id: 2,
    name: "Bottled Water",
    category: "water",
    quantity: 500,
    unit: "bottles",
    status: "stored",
    donor: "XYZ Foundation",
    dateReceived: "2024-11-12"
  }
];

let organizations = [
  {
    id: 1,
    name: "ABC Corporation",
    type: "private",
    status: "active",
    contactPerson: "John Smith",
    email: "john@abc.com",
    phone: "02-1234567",
    contributions: [
      { type: "monetary", amount: 50000, date: "2024-11-01" }
    ]
  }
];

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function calculateDashboardStats() {
  // Monetary donations total
  const totalMonetary = donations
    .filter(d => d.type === "monetary" && d.status === "verified")
    .reduce((sum, d) => sum + d.amount, 0);

  // In-kind donations count
  const totalInKind = donations
    .filter(d => d.type === "in-kind")
    .length;

  // Active donors count
  const totalDonors = donors.filter(d => d.status === "active").length;

  // Total distributions
  const totalDistributions = distributions.length;

  return {
    totalMonetary,
    totalInKind,
    totalDonors,
    totalDistributions
  };
}

function updateDashboardStats() {
  const stats = calculateDashboardStats();

  // Update stat cards
  document.getElementById("totalMonetary").textContent = 
    `₱${stats.totalMonetary.toLocaleString()}`;
  
  document.getElementById("totalInKind").textContent = 
    `${stats.totalInKind} items`;
  
  document.getElementById("totalDonors").textContent = 
    stats.totalDonors;
  
  document.getElementById("totalDistributions").textContent = 
    stats.totalDistributions;

  // Mock percentage changes (in production, calculate from historical data)
  document.getElementById("monetaryChange").textContent = "12.5%";
  document.getElementById("inKindChange").textContent = "8.3%";
  document.getElementById("donorsChange").textContent = "15.2%";
  document.getElementById("distributionsChange").textContent = "3";
}

// ==========================================
// RECENT DONATIONS TABLE
// ==========================================

function renderRecentDonations() {
  const tbody = document.getElementById("donationsTableBody");
  
  // Get 5 most recent donations
  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recentDonations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No donations yet</td></tr>';
    return;
  }

  tbody.innerHTML = recentDonations.map(donation => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-green); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
            ${donation.donor.name.charAt(0)}
          </div>
          <div>
            <div style="font-weight: 600; font-size: 14px;">${donation.donor.name}</div>
            <div style="font-size: 12px; color: var(--text-light);">${donation.donor.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-${donation.type === 'monetary' ? 'peso-sign' : 'box'}"></i>
          ${donation.type === 'monetary' ? 'Monetary' : 'In-Kind'}
        </span>
      </td>
      <td>
        <strong>
          ${donation.type === 'monetary' 
            ? '₱' + donation.amount.toLocaleString() 
            : donation.item + ' (x' + donation.quantity + ')'}
        </strong>
      </td>
      <td>${formatDate(donation.date)}</td>
      <td>
        <span class="status-badge ${donation.status}">
          ${capitalizeFirst(donation.status)}
        </span>
      </td>
      <td>
        <button class="btn-icon view" onclick="viewDonationDetails(${donation.id})" title="View">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// DISTRIBUTION PROGRESS
// ==========================================

function renderDistributionProgress() {
  const container = document.getElementById("distributionProgress");
  
  const activeDistributions = distributions.filter(d => 
    d.status === "ongoing" || d.status === "pending"
  );

  if (activeDistributions.length === 0) {
    container.innerHTML = '<div class="empty-state">No active distributions</div>';
    return;
  }

  container.innerHTML = activeDistributions.map(dist => `
    <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
            ${dist.location}
          </div>
          <div style="font-size: 12px; color: var(--text-light);">
            <i class="fa-solid fa-calendar"></i> ${formatDate(dist.date)}
          </div>
        </div>
        <span class="status-badge ${dist.status}">
          ${capitalizeFirst(dist.status)}
        </span>
      </div>
      <div style="font-size: 13px; color: var(--text-light);">
        <i class="fa-solid fa-users"></i> ${dist.beneficiaries} beneficiaries
      </div>
    </div>
  `).join('');
}

// ==========================================
// QUICK ACTIONS
// ==========================================

function setupQuickActions() {
  document.getElementById("generateReportBtn").addEventListener("click", () => {
    window.location.href = "admin-reports.html";
  });

  document.getElementById("logDistributionBtn").addEventListener("click", () => {
    window.location.href = "admin-distribution.html";
  });

  document.getElementById("sendUpdatesBtn").addEventListener("click", () => {
    showNotification("Donor update notifications sent successfully!", "success");
  });

  document.getElementById("addOrganizationBtn").addEventListener("click", () => {
    window.location.href = "admin-organization.html";
  });
}

// ==========================================
// HEADER ACTIONS
// ==========================================

function setupHeaderActions() {
  document.getElementById("exportBtn").addEventListener("click", () => {
    exportDashboardReport();
  });

  document.getElementById("newCampaignBtn").addEventListener("click", () => {
    showNotification("Campaign creation feature coming soon!", "info");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      // Clear any session data
      sessionStorage.clear();
      localStorage.clear();
      
      // Redirect to login
      window.location.href = "index.html";
    }
  });

  document.getElementById("viewAllDonationsBtn").addEventListener("click", () => {
    window.location.href = "admin-donations.html";
  });
}

// ==========================================
// EXPORT DASHBOARD REPORT
// ==========================================

function exportDashboardReport() {
  const stats = calculateDashboardStats();
  const today = new Date().toISOString().split('T')[0];
  
  const reportData = [
    ['Dashboard Summary Report', ''],
    ['Generated on:', new Date().toLocaleString('en-PH')],
    ['', ''],
    ['Metric', 'Value'],
    ['Total Monetary Donations', '₱' + stats.totalMonetary.toLocaleString()],
    ['In-Kind Donations', stats.totalInKind],
    ['Active Donors', stats.totalDonors],
    ['Total Distributions', stats.totalDistributions],
    ['', ''],
    ['Recent Donations', ''],
    ['Donor', 'Type', 'Amount/Item', 'Date', 'Status']
  ];

  donations.slice(0, 10).forEach(d => {
    reportData.push([
      d.donor.name,
      d.type,
      d.type === 'monetary' ? '₱' + d.amount.toLocaleString() : `${d.item} (x${d.quantity})`,
      d.date,
      d.status
    ]);
  });

  let csv = reportData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard_report_${today}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  showNotification("Dashboard report exported successfully!", "success");
}

// ==========================================
// VIEW DONATION DETAILS (QUICK VIEW)
// ==========================================

function viewDonationDetails(id) {
  const donation = donations.find(d => d.id === id);
  if (!donation) return;

  const detailsHTML = `
    <strong>Reference:</strong> ${donation.referenceNo}<br>
    <strong>Donor:</strong> ${donation.donor.name}<br>
    <strong>Email:</strong> ${donation.donor.email}<br>
    <strong>Type:</strong> ${donation.type}<br>
    ${donation.type === 'monetary' 
      ? `<strong>Amount:</strong> ₱${donation.amount.toLocaleString()}`
      : `<strong>Item:</strong> ${donation.item} (x${donation.quantity})`
    }<br>
    <strong>Date:</strong> ${formatDate(donation.date)}<br>
    <strong>Status:</strong> ${capitalizeFirst(donation.status)}
  `;

  if (confirm(detailsHTML + '\n\nGo to full donations page?')) {
    window.location.href = 'admin-donations.html';
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

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

function showNotification(message, type = 'info') {
  // Simple alert for now - in production use a proper notification library
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  alert(`${icon} ${message}`);
}

// ==========================================
// NAVIGATION HIGHLIGHTING
// ==========================================

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'admin.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    }
  });
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin Dashboard Initialized');
  
  // Update all dashboard components
  updateDashboardStats();
  renderRecentDonations();
  renderDistributionProgress();
  
  // Setup event listeners
  setupQuickActions();
  setupHeaderActions();
  highlightCurrentPage();
  
  // Show welcome message
  const adminName = sessionStorage.getItem('adminName') || 'Admin';
  console.log(`Welcome back, ${adminName}!`);
});

// ==========================================
// DATA SYNC FUNCTIONS
// ==========================================
// These functions would sync data with other admin pages in production

function syncDataWithModules() {
  // In production, this would:
  // 1. Fetch latest data from API/database
  // 2. Update local data structures
  // 3. Refresh dashboard displays
  
  console.log('Syncing data across modules...');
  updateDashboardStats();
  renderRecentDonations();
  renderDistributionProgress();
}

// Auto-refresh every 5 minutes
setInterval(syncDataWithModules, 300000);

// ==========================================
// EXPORT FOR OTHER MODULES
// ==========================================
// Make data available to other admin pages if needed

window.adminDashboard = {
  donations,
  donors,
  distributions,
  inKindItems,
  organizations,
  calculateDashboardStats,
  syncDataWithModules
};