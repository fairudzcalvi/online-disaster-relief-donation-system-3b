

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
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

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

  document.getElementById("monetaryChange") && (document.getElementById("monetaryChange").textContent = "");
  document.getElementById("inKindChange") && (document.getElementById("inKindChange").textContent = "");
  document.getElementById("donorsChange") && (document.getElementById("donorsChange").textContent = "");
  document.getElementById("distributionsChange") && (document.getElementById("distributionsChange").textContent = "");
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
    window.location.href = "admin-reports.php";
  });

  document.getElementById("logDistributionBtn").addEventListener("click", () => {
    window.location.href = "admin-distribution.php";
  });

  document.getElementById("sendUpdatesBtn").addEventListener("click", () => {
    showNotification("Donor update notifications sent successfully!", "success");
  });

  document.getElementById("addOrganizationBtn").addEventListener("click", () => {
    window.location.href = "admin-organization.php";
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
    window.location.href = "admin-campaigns.php";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    document.getElementById('logoutModal').style.display = 'flex';
  });

  document.getElementById("viewAllDonationsBtn").addEventListener("click", () => {
    window.location.href = "admin-donations.php";
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

  const isMonetary = donation.type === 'monetary';
  const statusColor = donation.status === 'verified' ? '#27ae60' : donation.status === 'failed' ? '#e74c3c' : '#f39c12';

  document.getElementById('donationDetailBody').innerHTML = `
    <div style="display:grid;gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Reference</span>
        <strong>${donation.referenceNo || donation.Reference_Number || '—'}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Donor</span>
        <strong>${donation.donor?.name || (donation.Donor_FirstName + ' ' + donation.Donor_LastName) || '—'}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Email</span>
        <span>${donation.donor?.email || donation.Donor_Email || '—'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Type</span>
        <span>${isMonetary ? 'Monetary' : 'In-Kind'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">${isMonetary ? 'Amount' : 'Item'}</span>
        <strong>${isMonetary 
          ? '₱' + Number(donation.amount || donation.Donation_Amount || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})
          : (donation.item || '—') + (donation.quantity ? ' (x' + donation.quantity + ')' : '')
        }</strong>
      </div>
      ${isMonetary ? `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Payment Method</span>
        <span>${donation.Payment_Method || donation.paymentMethod || '—'}</span>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Date</span>
        <span>${formatDate(donation.date || donation.Donation_Date)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:var(--text-light);">Status</span>
        <span style="padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;background:${statusColor}20;color:${statusColor};">
          ${capitalizeFirst(donation.status || donation.Status)}
        </span>
      </div>
      ${donation.Donor_Message || donation.message ? `
      <div style="border-top:1px solid var(--border-color);padding-top:14px;">
        <div style="font-size:13px;color:var(--text-light);margin-bottom:6px;">Message</div>
        <div style="font-size:14px;font-style:italic;">"${donation.Donor_Message || donation.message}"</div>
      </div>` : ''}
    </div>
  `;

  const modal = document.getElementById('donationDetailModal');
  modal.style.display = 'flex';
}

function closeDonationModal() {
  document.getElementById('donationDetailModal').style.display = 'none';
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

document.addEventListener('DOMContentLoaded', async function() {
  console.log('Admin Dashboard Initialized');

  await syncDataWithModules();

  setupQuickActions();
  setupHeaderActions();
  highlightCurrentPage();

  // Close donation modal on backdrop click
  document.getElementById('donationDetailModal').addEventListener('click', function(e) {
    if (e.target === this) closeDonationModal();
  });

  const adminName = sessionStorage.getItem('adminName') || 'Admin';
  console.log(`Welcome back, ${adminName}!`);
});

// ==========================================
// DATA SYNC FUNCTIONS
// ==========================================

async function syncDataWithModules() {
  try {
    const token = sessionStorage.getItem('adminToken') || '';
    const headers = { 'Authorization': 'Bearer ' + token };

    const [donRes, distRes] = await Promise.all([
      fetch('../api/auth/get_donations.php', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('../api/auth/get_distributions.php', { headers }).then(r => r.json()).catch(() => ({ data: [] }))
    ]);

    donations = donRes.data || [];
    distributions = distRes.data || [];
  } catch (e) {
    console.error('Failed to sync data:', e);
  }

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

function confirmLogout() {
  fetch('../api/auth/logout.php', { method: 'POST' }).finally(() => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "admin_logIn.html";
  });
}

function closeLogoutModal() {
  document.getElementById('logoutModal').style.display = 'none';
}
