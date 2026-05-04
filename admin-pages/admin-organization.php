  <?php
require_once '../api/config/database.php';
$db = getDBConnection();
try {
    // Get PDO connection  // Make sure this returns a PDO instance

    // Prepare and execute SQL
    $sql = "SELECT COUNT(Organization_ID) AS total FROM organization";
    $stmt = $db->prepare($sql);
    $stmt->execute();

    // Fetch result
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}

    $query = "SELECT COUNT(Organization_ID) AS total_active
              FROM organization
              WHERE Organization_Status = 1";
    
    $stmts = $db->prepare($query);
    $stmts->execute();

    $result = $stmts->fetch(PDO::FETCH_ASSOC);

    $querys = "SELECT COUNT(Organization_ID) AS total_inactive
              FROM organization
              WHERE Organization_Status = 0";
    
    $stmtss = $db->prepare($querys);
    $stmtss->execute();

    $resultss = $stmtss->fetch(PDO::FETCH_ASSOC);




?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Organizations Management | Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/css/admin/admin-organizations.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <i class="fa-solid fa-hand-holding-heart"></i>
      </div>
      <h2 class="brand-name">Admin Dashboard</h2>
    </div>

    <nav class="side-nav">
      <ul>
        <li><a href="admin.php" class="nav-link"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
        <li><a href="admin-donations.php" class="nav-link"><i class="fa-solid fa-hand-holding-dollar"></i> Donations</a></li>
        <li><a href="admin-campaigns.php" class="nav-link"><i class="fa-solid fa-bullhorn"></i> Campaigns</a></li>
        <li><a href="admin-distribution.php" class="nav-link"><i class="fa-solid fa-truck"></i> Distribution</a></li>
        <li><a href="admin-inkind.php" class="nav-link"><i class="fa-solid fa-box"></i> In-Kind Donations</a></li>
        <li><a href="admin-reports.php" class="nav-link"><i class="fa-solid fa-chart-column"></i> Reports</a></li>
        <li><a href="admin-organization.php" class="nav-link active"><i class="fa-solid fa-building"></i> Organizations</a></li>
        <li><a href="admin-settings.php" class="nav-link"><i class="fa-solid fa-gear"></i> Settings</a></li>

      </ul>
    </nav>
  </aside>

  <!-- Main Content -->
  <main>
    <header>
      <div class="header-top">
        <div>
          <h1>Organizations Management</h1>
          <p class="header-subtitle">Manage partner organizations and their contributions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" id="exportBtn">
            <i class="fa-solid fa-download"></i> Export List
          </button>
          <button class="btn btn-primary" id="newOrgBtn">
            <i class="fa-solid fa-plus"></i> Add Organization
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <i class="fa-solid fa-search"></i>
          <input type="search" id="searchInput" placeholder="Search by name or contact person...">
        </div>
        
        <div class="filter-group">
          <label>Type:</label>
          <select id="typeFilter">
            <option value="">All Types</option>
            <option value="ngo">NGO</option>
            <option value="private">Private Company</option>
            <option value="government">Government Agency</option>
            <option value="church">Church/Religious</option>
            <option value="school">School/University</option>
            <option value="civic">Civic Group</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Status:</label>
          <select id="statusFilter">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button class="btn btn-outline btn-small" id="clearFiltersBtn">
          <i class="fa-solid fa-xmark"></i> Clear
        </button>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa-solid fa-building"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Organizations</div>
          <div class="stat-value" id="totalOrgs"><?php echo $row['total']; ?></div>
          <div class="stat-change">
            <span id="orgsInfo">Registered partners</span>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Organizations</div>
          <div class="stat-value" id="activeOrgs"><?php echo $result['total_active'] ?></div>
          <div class="stat-change">
            <span id="activeInfo">Currently engaged</span>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Inactive Organization</div>
          <div class="stat-value" id="inactiveOrgs"><?php echo $resultss['total_inactive'] ?></div>
          <div class="stat-change">
            <span id="pendingInfo">Awaiting updates</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Organizations Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Partner Organizations</h3>
        <button class="btn btn-outline btn-small" id="refreshBtn">
          <i class="fa-solid fa-rotate"></i> Refresh
        </button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Contact Person</th>
              <th>Email / Phone</th>
              <th>Type</th>
              <th>Contributions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="orgsTableBody">
            <?php
            
            ?>
          </tbody>


        </table>
      </div>
    </div>

    
  </main>

  <!-- Add/Edit Organization Modal -->
  <div class="modal" id="orgModal">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title" id="modalTitle">Add New Organization</h3>
        <button class="close-btn" onclick="closeOrgModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form method="POST" id="orgForm" action="../api/auth/save_organizations.php">
          <input type="hidden" id="orgId">
          
          <div class="form-section">
            <h4 class="form-section-title">Basic Information</h4>
            
            <div class="form-group">
              <label for="orgName">Organization Name <span class="required">*</span></label>
              <input type="text" id="orgName" name="orgName" required placeholder="Official organization name">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="orgType">Organization Type <span class="required">*</span></label>
                <select id="orgType" name="orgType" required>
                  <option value="">Select type</option>
                  <option value="ngo">NGO / Non-Profit</option>
                  <option value="private">Private Company</option>
                  <option value="government">Government Agency</option>
                  <option value="church">Church / Religious Group</option>
                  <option value="school">School / University</option>
                  <option value="civic">Civic Group</option>
                </select>
              </div>

              <div class="form-group">
                <label for="orgStatus">Status <span class="required">*</span></label>
                <select id="orgStatus"  name="orgStatus" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="form-section-title">Contact Information</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="contactPerson">Contact Person <span class="required">*</span></label>
                <input type="text" id="contactPerson" name="contactPerson" required placeholder="Representative name">
              </div>

              <div class="form-group">
                <label for="position">Position / Title</label>
                <input type="text" id="position" name="position" placeholder="e.g., Program Director">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address <span class="required">*</span></label>
                <input type="email" id="email" name="email" required placeholder="email@organization.org">
              </div>

              <div class="form-group">
                <label for="phone">Phone Number <span class="required">*</span></label>
                <input type="tel" id="phone" name="phone" required placeholder="+63 XXX XXX XXXX">
              </div>
            </div>

            <div class="form-group">
              <label for="address">Office Address</label>
              <textarea id="address" name="address" rows="2" value="Complete office address"></textarea>
            </div>
          </div>

          <div class="form-section">
            <h4 class="form-section-title">Additional Information</h4>
            
            <div class="form-group">
              <label for="website">Website</label>
              <input type="url" id="website" name="website" value="https://organization.org">
            </div>

            <div class="form-group">
              <label for="notes">Admin Notes</label>
              <textarea id="notes" name="notes" rows="3" value="Internal notes about this organization..."></textarea>
            </div>
          </div>
          </div>
          
        <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeOrgModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveOrgBtn" name="saveOrgBtn">
          <i class="fa-solid fa-save"></i> Save Organization
        </button>
      </div>
        </form>
      
    </div>
  </div>

  <!-- Organization Profile Modal -->
  <div class="modal" id="profileModal">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title">Organization Profile</h3>
        <button class="close-btn" onclick="closeProfileModal()">&times;</button>
      </div>
      <div class="modal-body" id="profileModalBody">
        <!-- Will be populated by JavaScript -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeProfileModal()">Close</button>
        <button class="btn btn-primary" onclick="editOrgFromProfile()">
          <i class="fa-solid fa-pen"></i> Edit Organization
        </button>
      </div>
    </div>
  </div>

  <script src="../assets/js/admin/admin-organizations.js"></script>
</body>
</html>