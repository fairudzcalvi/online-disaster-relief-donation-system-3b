// Campaign data
const campaignData = {
    1: {
        title: 'Typhoon Victims Emergency Relief',
        organization: 'Red Cross Philippines',
        category: 'Typhoon Relief',
        raised: '₱450,000',
        goal: '₱1,000,000',
        donors: 856,
        daysLeft: 12,
        description: 'Providing immediate assistance to families affected by recent typhoon in Visayas region. Our team is on the ground distributing food packages, clean water, medical supplies, and emergency shelter materials.',
        beneficiaries: '2,400 families',
        location: 'Eastern Visayas',
        startDate: 'Nov 10, 2025',
        breakdown: {
            foodWater: '45%',
            shelter: '30%',
            medical: '15%',
            admin: '10%'
        },
        timeline: [
            { date: 'Nov 10, 2025', event: 'Campaign launched - Initial assessment completed' },
            { date: 'Nov 12, 2025', event: 'First distribution: 500 food packages to affected families in Tacloban' },
            { date: 'Nov 15, 2025', event: 'Medical mission conducted - 800 individuals treated' },
            { date: 'Nov 18, 2025', event: 'Emergency shelter kits distributed to 300 families' },
            { date: 'Ongoing', event: 'Continuous relief operations and monitoring' }
        ],
        transparency: {
            allocated: '₱450,000',
            distributed: '₱320,000',
            pending: '₱130,000'
        }
    },
    2: {
        title: 'Flood Victims Recovery Support',
        organization: 'Caritas Philippines',
        category: 'Flood Relief',
        raised: '₱280,000',
        goal: '₱500,000',
        donors: 543,
        daysLeft: 25,
        description: 'Supporting families rebuild their homes and lives after devastating floods in Northern Luzon. Providing construction materials, livelihood support, and temporary housing assistance.',
        beneficiaries: '1,800 families',
        location: 'Cagayan Valley',
        startDate: 'Nov 5, 2025',
        breakdown: {
            reconstruction: '50%',
            livelihood: '25%',
            education: '15%',
            admin: '10%'
        },
        timeline: [
            { date: 'Nov 5, 2025', event: 'Campaign launched - Damage assessment conducted' },
            { date: 'Nov 8, 2025', event: 'Distribution of construction materials to 200 families' },
            { date: 'Nov 12, 2025', event: 'Livelihood starter kits distributed to 150 families' },
            { date: 'Nov 16, 2025', event: 'School supplies provided to 500 students' },
            { date: 'Ongoing', event: 'Home reconstruction monitoring and support' }
        ],
        transparency: {
            allocated: '₱280,000',
            distributed: '₱195,000',
            pending: '₱85,000'
        }
    },
    3: {
        title: 'Fire Incident Family Support',
        organization: 'Operation Blessing',
        category: 'Fire Relief',
        raised: '₱180,000',
        goal: '₱300,000',
        donors: 412,
        daysLeft: 18,
        description: 'Emergency support for 85 families who lost their homes in a residential fire. Providing temporary shelter, clothing, food, and essential household items.',
        beneficiaries: '85 families',
        location: 'Metro Manila',
        startDate: 'Nov 8, 2025',
        breakdown: {
            shelter: '40%',
            foodClothing: '35%',
            household: '15%',
            admin: '10%'
        },
        timeline: [
            { date: 'Nov 8, 2025', event: 'Campaign launched - Immediate emergency response' },
            { date: 'Nov 9, 2025', event: 'Temporary shelter established for 85 families' },
            { date: 'Nov 11, 2025', event: 'Hot meals and clothing distributed to all families' },
            { date: 'Nov 14, 2025', event: 'Household essentials kits given to 85 families' },
            { date: 'Ongoing', event: 'Continued support and relocation assistance' }
        ],
        transparency: {
            allocated: '₱180,000',
            distributed: '₱125,000',
            pending: '₱55,000'
        }
    }
};

// View details functionality
document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.campaign-card');
        const campaignId = card.getAttribute('data-campaign-id');
        showCampaignDetails(campaignId);
    });
});

function showCampaignDetails(id) {
    const campaign = campaignData[id];
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-section">
            <div class="organization-info" style="margin-bottom: 24px;">
                <div class="org-logo">${campaign.organization.substring(0, 2).toUpperCase()}</div>
                <div class="org-details">
                    <div class="org-name">${campaign.organization}</div>
                    <div class="org-verified">
                        <i class="fas fa-check-circle"></i>
                        <span>Verified Organization</span>
                    </div>
                </div>
            </div>

            <h3>${campaign.title}</h3>
            <p style="color: var(--text-light); margin-bottom: 24px;">${campaign.description}</p>

            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Beneficiaries</div>
                    <div class="detail-value">${campaign.beneficiaries}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${campaign.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Start Date</div>
                    <div class="detail-value">${campaign.startDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Days Remaining</div>
                    <div class="detail-value">${campaign.daysLeft} days</div>
                </div>
            </div>
        </div>

        <div class="detail-section transparency-section">
            <h3 style="margin-bottom: 8px;">Financial Transparency</h3>
            <p style="font-size: 14px; color: var(--text-light); margin-bottom: 16px;">Track exactly how donations are being used</p>
            
            <div class="transparency-grid">
                <div class="transparency-card">
                    <i class="fas fa-hand-holding-dollar"></i>
                    <div class="transparency-label">Total Raised</div>
                    <div class="transparency-value">${campaign.raised}</div>
                </div>
                <div class="transparency-card">
                    <i class="fas fa-check-circle"></i>
                    <div class="transparency-label">Distributed</div>
                    <div class="transparency-value">${campaign.transparency.distributed}</div>
                </div>
                <div class="transparency-card">
                    <i class="fas fa-clock"></i>
                    <div class="transparency-label">Pending</div>
                    <div class="transparency-value">${campaign.transparency.pending}</div>
                </div>
            </div>

            <div style="margin-top: 24px;">
                <h4 style="font-size: 16px; margin-bottom: 12px;">Fund Allocation Breakdown</h4>
                <div class="detail-grid">
                    ${Object.entries(campaign.breakdown).map(([key, value]) => `
                        <div class="detail-item">
                            <div class="detail-label">${formatBreakdownLabel(key)}</div>
                            <div class="detail-value">${value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>Distribution Timeline</h3>
            <p style="font-size: 14px; color: var(--text-light); margin-bottom: 24px;">Real-time updates on relief distribution and activities</p>
            
            <div class="distribution-timeline">
                ${campaign.timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-date">${item.date}</div>
                        <div class="timeline-content">${item.event}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="detail-section">
            <button class="btn btn-primary btn-large" style="width: 100%;" onclick="window.location.href='donation-page.html'">
                <i class="fas fa-heart"></i> Donate to This Campaign
            </button>
        </div>
    `;

    document.getElementById('modalTitle').textContent = campaign.category;
    document.getElementById('campaignModal').classList.add('active');
}

function formatBreakdownLabel(key) {
    const labels = {
        foodWater: 'Food & Water',
        shelter: 'Shelter Materials',
        medical: 'Medical Supplies',
        admin: 'Admin & Logistics',
        reconstruction: 'Reconstruction',
        livelihood: 'Livelihood Support',
        education: 'Education Support',
        foodClothing: 'Food & Clothing',
        household: 'Household Items'
    };
    return labels[key] || key;
}

function closeModal() {
    document.getElementById('campaignModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('campaignModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Donate button handlers
document.querySelectorAll('.donate-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        window.location.href = 'donation-page.html';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});