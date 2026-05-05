
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/css/admin/admin.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <i class="fa-solid fa-hand-holding-heart"></i>
      </div>
      <h2 class="brand-name">Admin Dashboard</h2>
    </div>

    <nav class="side-nav">
      <ul>
        <li><a href="admin.php" class="nav-link active"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
        <li><a href="admin-donations.php" class="nav-link"><i class="fa-solid fa-hand-holding-dollar"></i> Donations</a></li>
        <li><a href="admin-campaigns.php" class="nav-link"><i class="fa-solid fa-bullhorn"></i> Campaigns</a></li>
        <li><a href="admin-distribution.php" class="nav-link"><i class="fa-solid fa-truck"></i> Distribution</a></li>
        <li><a href="admin-inkind.php" class="nav-link"><i class="fa-solid fa-box"></i> In-Kind Donations</a></li>
        <li><a href="admin-reports.php" class="nav-link"><i class="fa-solid fa-chart-column"></i> Reports</a></li>
        <li><a href="admin-organization.php" class="nav-link"><i class="fa-solid fa-building"></i> Organizations</a></li>
        <li><a href="admin-settings.php" class="nav-link"><i class="fa-solid fa-gear"></i> Settings</a></li>
    </ul>
    </nav>
  </aside>

  <!-- Main Content -->
  <main>
    <header>
      <div>
        <h1>Dashboard Overview</h1>
        <p class="header-subtitle">Monitor and manage disaster relief operations</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" id="exportBtn">
          <i class="fa-solid fa-download"></i> Export Report
        </button>
        <button class="btn btn-primary" id="newCampaignBtn">
          <i class="fa-solid fa-plus"></i> New Campaign
        </button>
        <button class="btn btn-outline" id="logoutBtn">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </header>

    
    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa-solid fa-peso-sign"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Monetary Donations</div>
          <div class="stat-value" id="totalMonetary">₱0</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa-solid fa-box"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">In-Kind Donations</div>
          <div class="stat-value" id="totalInKind">0 items</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon yellow">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Donors</div>
          <div class="stat-value" id="totalDonors">0</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon red">
          <i class="fa-solid fa-truck-ramp-box"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Distributions Made</div>
          <div class="stat-value" id="totalDistributions">0</div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </section>

    
    <div class="content-grid">
     
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Donations</h3>
          <button class="btn btn-outline btn-small" id="viewAllDonationsBtn">View All</button>
        </div>
        <div class="table-wrapper">
          <table id="donationsTable">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Type</th>
                <th>Amount/Item</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="donationsTableBody">
              <tr>
                <td colspan="6" class="empty-state">No donations yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

     
      <div class="sidebar-content">
       
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <button class="action-btn" id="generateReportBtn">
                <i class="fa-solid fa-file-lines"></i>
                <span>Generate Transparency Report</span>
              </button>
              <button class="action-btn" id="logDistributionBtn">
                <i class="fa-solid fa-truck"></i>
                <span>Log Distribution</span>
              </button>
              <button class="action-btn" id="sendUpdatesBtn">
                <i class="fa-solid fa-bell"></i>
                <span>Send Donor Updates</span>
              </button>
              <button class="action-btn" id="addOrganizationBtn">
                <i class="fa-solid fa-user-plus"></i>
                <span>Add New Organization</span>
              </button>
            </div>
          </div>
        </div>

       
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Distribution Progress</h3>
          </div>
          <div class="card-body" id="distributionProgress">
            <div class="empty-state">No active distributions</div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- Donation Detail Modal -->
  <div class="modal" id="donationDetailModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;">
    <div class="modal-content" style="background:#fff;border-radius:12px;width:100%;max-width:480px;padding:0;overflow:hidden;">
      <div class="modal-header" style="padding:20px 24px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;font-size:18px;">Donation Details</h3>
        <button onclick="closeDonationModal()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-light);">&times;</button>
      </div>
      <div class="modal-body" style="padding:24px;" id="donationDetailBody"></div>
      <div class="modal-footer" style="padding:16px 24px;border-top:1px solid var(--border-color);display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn btn-outline" onclick="closeDonationModal()">Close</button>
        <button class="btn btn-primary" onclick="window.location.href='admin-donations.php'">View All Donations</button>
      </div>
    </div>
  </div>

  <script src="../assets/js/admin/admin.js"></script>
</body>
</html>