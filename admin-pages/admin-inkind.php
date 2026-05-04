 <?php
require_once '../api/config/database.php';

try {
    // Get PDO connection
    $pdo = getDBConnection();  // Make sure this returns a PDO instance

    // Prepare and execute SQL
    $sql = "SELECT SUM(Item_Amount) AS total FROM in_kind_donations";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch result
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}



    $sl = "SELECT SUM(Item_Amount) AS toal FROM in_kind_donations WHERE Item_Status ='pending'";
    $stt = $pdo->prepare($sl);
    $stt->execute();

    // Fetch result
    $rw = $stt->fetch(PDO::FETCH_ASSOC);

    $slss = "SELECT SUM(Item_Amount) AS tosal FROM in_kind_donations WHERE Item_Status ='allocated'";
    $sttss = $pdo->prepare($slss);
    $sttss->execute();

    // Fetch result
    $rwss = $sttss->fetch(PDO::FETCH_ASSOC);

    $slg = "SELECT SUM(Item_Amount) AS topal FROM in_kind_donations WHERE Item_Status ='distributed'";
    $sttg = $pdo->prepare($slg);
    $sttg->execute();

    // Fetch result
    $rwgg = $sttg->fetch(PDO::FETCH_ASSOC);


  ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>In-Kind Donations | Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/css/admin/admin-inkind.css">
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
        <li><a href="admin-inkind.php" class="nav-link active"><i class="fa-solid fa-box"></i> In-Kind Donations</a></li>
        <li><a href="admin-reports.php" class="nav-link" ><i class="fa-solid fa-chart-column"></i> Reports</a></li>
        <li><a href="admin-organization.php" class="nav-link"><i class="fa-solid fa-building"></i> Organizations</a></li>
        <li><a href="admin-settings.php" class="nav-link"><i class="fa-solid fa-gear"></i> Settings</a></li>
</ul>
    </nav>
  </aside>

  <!-- Main Content -->
  <main>
    <header>
      <div class="header-top">
        <div>
          <h1>In-Kind Donations Inventory</h1>
          <p class="header-subtitle">Manage physical goods and relief supplies</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" id="exportBtn">
            <i class="fa-solid fa-download"></i> Export Inventory
          </button>
          <button class="btn btn-primary" id="addItemBtn">
            <i class="fa-solid fa-plus"></i> Add Item
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <i class="fa-solid fa-search"></i>
          <input type="search" id="searchInput" placeholder="Search by item, donor, or description...">
        </div>
        
        <div class="filter-group">
          <label>Category:</label>
          <select id="categoryFilter">
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
            <option value="clothing">Clothing</option>
            <option value="hygiene">Hygiene</option>
            <option value="medical">Medical Supplies</option>
            <option value="blankets">Blankets</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Status:</label>
          <select id="statusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="stored">Stored</option>
            <option value="allocated">Allocated</option>
            <option value="distributed">Distributed</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Date From:</label>
          <input type="date" id="dateFrom">
        </div>
        
        <div class="filter-group">
          <label>To:</label>
          <input type="date" id="dateTo">
        </div>

        <button class="btn btn-outline btn-small" id="clearFiltersBtn">
          <i class="fa-solid fa-xmark"></i> Clear
        </button>
      </div>
    </header>

    <!-- Inventory Summary -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa-solid fa-boxes-stacked"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Items Received</div>
          <div class="stat-value" id="totalReceived"><?php echo $row['total']; ?></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa-solid fa-warehouse"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Available in Storage</div>
          <div class="stat-value" id="totalAvailable"><?php echo $rw['toal']; ?></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">
          <i class="fa-solid fa-dolly"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Allocated</div>
          <div class="stat-value" id="totalAllocated"><?php echo $rwss['tosal']; ?></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fa-solid fa-truck-ramp-box"></i>
        </div>
        <div class="stat-content">
          <div class="stat-label">Distributed</div>
          <div class="stat-value" id="totalDistributed"><?php echo $rwgg['topal']; ?></div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Inventory Items</h3>
        <button class="btn btn-outline btn-small" id="refreshBtn">
          <i class="fa-solid fa-rotate"></i> Refresh
        </button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Donor</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Date Received</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="itemsTableBody">
            <tr>
              <td colspan="7" class="empty-state">No items in inventory</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <!-- Add/Edit Item Modal -->
  <div class="modal" id="itemModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" id="modalTitle">Add New Item</h3>
        <button class="close-btn" onclick="closeItemModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form method="post" id="itemForm" action="../api/auth/save_item.php">
          <input type="hidden" id="itemId">
          
          <div class="form-group">
            <label for="itemName">Item Description <span class="required">*</span></label>
            <input type="text" id="itemName" name="itemName" required placeholder="e.g., Rice Sacks, Bottled Water">
          </div>

          <div class="form-group">
            <label for="category">Category <span class="required">*</span></label>
            <select id="category" name="category" required>
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="water">Water</option>
              <option value="clothing">Clothing</option>
              <option value="hygiene">Hygiene</option>
              <option value="medical">Medical Supplies</option>
              <option value="blankets">Blankets</option>
              <option value="miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="quantity">Quantity <span class="required">*</span></label>
              <input type="number" id="quantity" name="quantity" required min="1" placeholder="0">
            </div>

            <div class="form-group">
              <label for="unit">Unit <span class="required">*</span></label>
              <select id="unit" name="unit" required>
                <option value="pieces">Pieces</option>
                <option value="packs">Packs</option>
                <option value="boxes">Boxes</option>
                <option value="sacks">Sacks</option>
                <option value="bottles">Bottles</option>
                <option value="kits">Kits</option>
                <option value="sets">Sets</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="donorName">Donor Name <span class="required">*</span></label>
            <input type="text" id="donorName" name="donorName" required placeholder="Name of donor">
          </div>

          <div class="form-group">
            <label for="dateReceived">Date Received <span class="required">*</span></label>
            <input type="date" id="dateReceived" name="dateReceived" required>
          </div>

          <div class="form-group">
            <label for="storageLocation">Storage Location</label>
            <input type="text" id="storageLocation" name="storageLocation" placeholder="Warehouse A, Shelf 3">
          </div>

          <div class="form-group">
            <label for="expiryDate">Expiry Date (if applicable)</label>
            <input type="date" id="expiryDate" name="expiryDate">
          </div>

          <div class="form-group">
            <label for="notes">Notes / Special Instructions</label>
            <textarea id="notes" name="notes"  rows="3" placeholder="Brand, condition, special handling notes..."></textarea>
          </div>
          <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeItemModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveItemBtn" name="saveItemBtn">
          <i class="fa-solid fa-save"></i> Save Item
        </button>
      </div>
        </form>
      </div>
      
    </div>
  </div>

  <!-- Item Details Modal -->
  <div class="modal" id="detailsModal">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title">Item Details</h3>
        <button class="close-btn" onclick="closeDetailsModal()">&times;</button>
      </div>
      <div class="modal-body" id="detailsModalBody">
        <!-- Will be populated by JavaScript -->
      </div>
      <div class="modal-footer" id="detailsModalFooter">
        <!-- Will be populated by JavaScript -->
      </div>
    </div>
  </div>

  <script src="../assets/js/admin/admin-inkind.js"></script>
</body>
</html>