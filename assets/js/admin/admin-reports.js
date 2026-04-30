// Reports history data
let reportsHistory = [];
let currentPreviewReport = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  renderReportsHistory();
  setDefaultDates();
});

// Setup event listeners
function setupEventListeners() {
  // Form submission
  document.getElementById('reportForm').addEventListener('submit', handleFormSubmit);
  
  // Refresh history button
  document.getElementById('refreshHistoryBtn').addEventListener('click', renderReportsHistory);
  
  // Modal close
  document.getElementById('previewModal').addEventListener('click', function(e) {
    if (e.target === this) closePreviewModal();
  });
}

// Set default dates (current month)
function setDefaultDates() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  document.getElementById('dateFrom').value = formatDateInput(firstDay);
  document.getElementById('dateTo').value = formatDateInput(today);
}

// Format date for input field
function formatDateInput(date) {
  return date.toISOString().split('T')[0];
}

// Select category (visual feedback)
function selectCategory(category) {
  const reportType = document.getElementById('reportType');
  
  // Map categories to report types
  const categoryMap = {
    'monetary': 'monetary-donations',
    'inkind': 'inkind-donations',
    'donors': 'donor-contributions',
    'distribution': 'distribution-history',
    'inventory': 'inventory-balance',
    'transparency': 'transparency-summary',
    'summary': 'monthly-summary',
    'custom': ''
  };
  
  if (categoryMap[category]) {
    reportType.value = categoryMap[category];
  }
  
  // Scroll to form
  document.querySelector('.report-generation').scrollIntoView({ behavior: 'smooth' });
  
  showNotification(`Selected ${category.charAt(0).toUpperCase() + category.slice(1)} Report`, 'info');
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = {
    reportType: document.getElementById('reportType').value,
    exportFormat: document.getElementById('exportFormat').value,
    dateFrom: document.getElementById('dateFrom').value,
    dateTo: document.getElementById('dateTo').value,
    filterLocation: document.getElementById('filterLocation').value.trim(),
    filterDonor: document.getElementById('filterDonor').value.trim(),
    includeCharts: document.getElementById('includeCharts').checked,
    includeDocumentation: document.getElementById('includeDocumentation').checked
  };
  
  generateReport(formData);
}

// Generate report
function generateReport(formData) {
  // Show loading
  showNotification('Generating report...', 'info');
  
  // Simulate report generation
  setTimeout(() => {
    const reportName = getReportName(formData.reportType);
    const period = `${formatDate(formData.dateFrom)} - ${formatDate(formData.dateTo)}`;
    
    const newReport = {
      id: Date.now(),
      name: reportName,
      type: formData.reportType,
      period: period,
      dateGenerated: new Date().toISOString(),
      generatedBy: 'Admin',
      format: formData.exportFormat,
      filters: {
        location: formData.filterLocation,
        donor: formData.filterDonor
      },
      options: {
        includeCharts: formData.includeCharts,
        includeDocumentation: formData.includeDocumentation
      }
    };
    
    // Add to history
    reportsHistory.unshift(newReport);
    
    // Render updated history
    renderReportsHistory();
    
    // Show success and download
    showNotification(`Report "${reportName}" generated successfully!`, 'success');
    
    // Simulate download
    downloadReport(newReport);
    
  }, 2000);
}

// Get report name from type
function getReportName(type) {
  const names = {
    'monetary-donations': 'Monetary Donations Summary',
    'inkind-donations': 'In-Kind Donations Summary',
    'donor-contributions': 'Donor Contributions Report',
    'distribution-history': 'Distribution History Report',
    'inventory-balance': 'Inventory Balance Report',
    'transparency-summary': 'Transparency Summary Report',
    'monthly-summary': 'Monthly Summary Report',
    'quarterly-summary': 'Quarterly Summary Report',
    'annual-summary': 'Annual Summary Report'
  };
  return names[type] || 'Custom Report';
}

// Generate quick report
function generateQuickReport(type) {
  showNotification('Generating quick report...', 'info');
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const reportData = {
    reportType: type,
    exportFormat: 'pdf',
    dateFrom: formatDateInput(firstDay),
    dateTo: formatDateInput(today),
    filterLocation: '',
    filterDonor: '',
    includeCharts: true,
    includeDocumentation: false
  };
  
  setTimeout(() => {
    const reportName = getQuickReportName(type);
    const newReport = {
      id: Date.now(),
      name: reportName,
      type: type,
      period: `${formatDate(reportData.dateFrom)} - ${formatDate(reportData.dateTo)}`,
      dateGenerated: new Date().toISOString(),
      generatedBy: 'Admin',
      format: 'pdf',
      filters: {},
      options: { includeCharts: true }
    };
    
    reportsHistory.unshift(newReport);
    renderReportsHistory();
    
    showNotification(`Quick report "${reportName}" generated!`, 'success');
    downloadReport(newReport);
  }, 1500);
}

// Get quick report name
function getQuickReportName(type) {
  const names = {
    'monthly-donations': 'Monthly Donations Report',
    'inventory-status': 'Inventory Status Report',
    'top-donors': 'Top Donors Report',
    'distribution-summary': 'Distribution Summary Report'
  };
  return names[type] || 'Quick Report';
}

// Render reports history table
function renderReportsHistory() {
  const tbody = document.getElementById('reportsHistoryBody');
  
  if (reportsHistory.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No reports generated yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = reportsHistory.map(report => `
    <tr>
      <td><strong>${escapeHtml(report.name)}</strong></td>
      <td>${capitalizeFirst(report.type.replace(/-/g, ' '))}</td>
      <td>${report.period}</td>
      <td>${formatDateTime(report.dateGenerated)}</td>
      <td>${report.generatedBy}</td>
      <td><span class="format-badge ${report.format}">${report.format.toUpperCase()}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view" onclick="viewReport(${report.id})" title="View">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-icon download" onclick="downloadReportById(${report.id})" title="Download">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="btn-icon" onclick="regenerateReport(${report.id})" title="Regenerate" style="color: var(--warning-yellow);">
            <i class="fa-solid fa-rotate"></i>
          </button>
          <button class="btn-icon delete" onclick="deleteReport(${report.id})" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// View report
function viewReport(id) {
  const report = reportsHistory.find(r => r.id === id);
  if (!report) return;
  
  currentPreviewReport = report;
  
  const modalBody = document.getElementById('previewModalBody');
  
  modalBody.innerHTML = `
    <div style="padding: 20px; background: var(--light-gray); border-radius: 8px; margin-bottom: 24px;">
      <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--text-dark);">${escapeHtml(report.name)}</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Period</div>
          <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${report.period}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Format</div>
          <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${report.format.toUpperCase()}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Generated</div>
          <div style="font-size: 15px; font-weight: 600; color: var(--text-dark);">${formatDateTime(report.dateGenerated)}</div>
        </div>
      </div>
    </div>

    <div style="padding: 32px; background: var(--white); border: 1px solid var(--border-color); border-radius: 8px;">
      <h4 style="text-align: center; color: var(--text-light); font-size: 48px; margin: 40px 0;">
        <i class="fa-solid fa-file-lines"></i>
      </h4>
      <p style="text-align: center; color: var(--text-light); font-size: 16px;">
        Report preview available after download
      </p>
      <p style="text-align: center; color: var(--text-light); font-size: 13px; margin-top: 8px;">
        Click "Download" to view the complete report
      </p>
    </div>

    ${report.filters.location || report.filters.donor ? `
      <div style="margin-top: 24px; padding: 16px; background: var(--light-gray); border-radius: 8px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Applied Filters</h4>
        ${report.filters.location ? `<p style="font-size: 13px; margin-bottom: 6px;"><strong>Location:</strong> ${escapeHtml(report.filters.location)}</p>` : ''}
        ${report.filters.donor ? `<p style="font-size: 13px;"><strong>Donor:</strong> ${escapeHtml(report.filters.donor)}</p>` : ''}
      </div>
    ` : ''}
  `;
  
  document.getElementById('previewModal').classList.add('active');
}

// Close preview modal
function closePreviewModal() {
  document.getElementById('previewModal').classList.remove('active');
  currentPreviewReport = null;
}

// Download previewed report
function downloadPreviewedReport() {
  if (currentPreviewReport) {
    downloadReport(currentPreviewReport);
    closePreviewModal();
  }
}

// Download report by ID
function downloadReportById(id) {
  const report = reportsHistory.find(r => r.id === id);
  if (report) {
    downloadReport(report);
  }
}

// Download report (simulate)
function downloadReport(report) {
  const filename = `${report.name.replace(/\s+/g, '_')}_${Date.now()}.${report.format}`;
  
  console.log('Downloading report:', filename);
  
  // In production, this would trigger actual file download
  showNotification(`Downloading ${filename}...`, 'success');
  
  // Simulate download
  const link = document.createElement('a');
  link.download = filename;
  link.href = '#';
  link.click();
}

// Regenerate report
function regenerateReport(id) {
  const report = reportsHistory.find(r => r.id === id);
  if (!report) return;
  
  if (confirm(`Regenerate report "${report.name}"?`)) {
    showNotification('Regenerating report...', 'info');
    
    setTimeout(() => {
      const updatedReport = {
        ...report,
        id: Date.now(),
        dateGenerated: new Date().toISOString()
      };
      
      reportsHistory.unshift(updatedReport);
      renderReportsHistory();
      
      showNotification('Report regenerated successfully!', 'success');
      downloadReport(updatedReport);
    }, 1500);
  }
}

// Delete report
function deleteReport(id) {
  const report = reportsHistory.find(r => r.id === id);
  if (!report) return;
  
  if (confirm(`Delete report "${report.name}"?`)) {
    reportsHistory = reportsHistory.filter(r => r.id !== id);
    renderReportsHistory();
    showNotification('Report deleted successfully', 'success');
  }
}

// Reset form
function resetForm() {
  document.getElementById('reportForm').reset();
  setDefaultDates();
  showNotification('Form reset', 'info');
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

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
  // Simple alert for now
  // In production, use a proper notification library
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  if (type === 'success') {
    alert('✓ ' + message);
  } else if (type === 'error') {
    alert('✗ ' + message);
  }
}