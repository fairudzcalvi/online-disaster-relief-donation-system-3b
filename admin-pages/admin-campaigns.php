
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campaigns Management | Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/css/admin/admin-donations.css">
  <link rel="stylesheet" href="../assets/css/admin/admin-campaigns.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon"><i class="fa-solid fa-hand-holding-heart"></i></div>
      <h2 class="brand-name">Admin Dashboard</h2>
    </div>
    <nav class="side-nav">
      <ul>
        <li><a href="admin.php" class="nav-link"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
        <li><a href="admin-donations.php" class="nav-link"><i class="fa-solid fa-hand-holding-dollar"></i> Donations</a></li>
        <li><a href="admin-campaigns.php" class="nav-link active"><i class="fa-solid fa-bullhorn"></i> Campaigns</a></li>
        <li><a href="admin-distribution.php" class="nav-link"><i class="fa-solid fa-truck"></i> Distribution</a></li>
        <li><a href="admin-inkind.php" class="nav-link"><i class="fa-solid fa-box"></i> In-Kind Donations</a></li>
        <li><a href="admin-reports.php" class="nav-link"><i class="fa-solid fa-chart-column"></i> Reports</a></li>
        <li><a href="admin-organization.php" class="nav-link"><i class="fa-solid fa-building"></i> Organizations</a></li>
      </ul>
    </nav>
  </aside>

  <main>
    <header>
      <div class="header-top">
        <div>
          <h1>Campaigns Management</h1>
          <p class="header-subtitle">Create and manage active relief campaigns</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="newCampaignBtn">
            <i class="fa-solid fa-plus"></i> New Campaign
          </button>
        </div>
      </div>
    </header>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Organization</th>
              <th>Category</th>
              <th>Goal</th>
              <th>Raised</th>
              <th>Status</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="campaignsTableBody">
            <tr><td colspan="8" class="empty-state">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Add/Edit Campaign Modal -->
  <div class="modal" id="campaignModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" id="modalTitle">New Campaign</h3>
        <button class="close-btn" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="campaignForm" method="POST" action="../api/auth/save_campaign.php">
          <input type="hidden" id="campaignId" name="campaignId">

          <div class="form-group">
            <label>Campaign Title <span class="required">*</span></label>
            <input type="text" id="title" name="title" required placeholder="e.g., Typhoon Relief Fund">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Organization <span class="required">*</span></label>
              <select id="organization" name="organization" required>
                <option value="">Select organization</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category <span class="required">*</span></label>
              <select id="category" name="category" required>
                <option value="">Select category</option>
                <option value="Typhoon Relief">Typhoon Relief</option>
                <option value="Flood Relief">Flood Relief</option>
                <option value="Fire Relief">Fire Relief</option>
                <option value="Earthquake Relief">Earthquake Relief</option>
                <option value="General Relief">General Relief</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Description <span class="required">*</span></label>
            <textarea id="description" name="description" rows="4" required placeholder="Describe the campaign and its goals..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Goal Amount (PHP) <span class="required">*</span></label>
              <input type="number" id="goal" name="goal" required min="0" step="1000" placeholder="1000000">
            </div>
            <div class="form-group">
              <label>Amount Raised (PHP)</label>
              <input type="number" id="raised" name="raised" min="0" step="100" value="0">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Beneficiaries</label>
              <input type="text" id="beneficiaries" name="beneficiaries" placeholder="e.g., 2,400 families">
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" id="location" name="location" placeholder="e.g., Eastern Visayas">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Start Date <span class="required">*</span></label>
              <input type="date" id="startDate" name="startDate" required>
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input type="date" id="endDate" name="endDate">
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="status" name="status">
              <option value="active">Active</option>
              <option value="urgent">Urgent</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-save"></i> Save Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="../assets/js/admin/admin-campaigns.js"></script>
</body>
</html>
