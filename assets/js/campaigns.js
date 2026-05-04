let campaignData = {};

// Load campaigns from API
async function loadCampaigns() {
    const grid = document.getElementById('campaignsGrid');

    try {
        const response = await fetch('api/auth/get_campaigns.php');
        const result = await response.json();

        if (result.status !== 'success' || !result.data.length) {
            grid.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;">No active campaigns at the moment.</p>';
            return;
        }

        // Store for modal use
        result.data.forEach(c => { campaignData[c.id] = c; });

        grid.innerHTML = result.data.map(c => {
            const progress = c.progress || 0;
            const badge = c.status === 'urgent' ? 'urgent' : 'active';
            const badgeLabel = c.status === 'urgent' ? 'Urgent' : 'Active';
            const orgInitials = c.organization.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            const raisedFmt = '₱' + Number(c.raised).toLocaleString('en-PH');
            const goalFmt  = '₱' + Number(c.goal).toLocaleString('en-PH');
            const daysLeft = c.daysLeft !== null ? `${c.daysLeft} days left` : 'Ongoing';

            return `
                <div class="campaign-card" data-campaign-id="${c.id}">
                    <div class="campaign-badge ${badge}">${badgeLabel}</div>
                    <div class="campaign-image">
                        ${c.image
                            ? `<img src="${c.image}" alt="${c.title}">`
                            : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--primary-green),var(--primary-blue));display:flex;align-items:center;justify-content:center;">
                                <i class="fas fa-hand-holding-heart" style="font-size:48px;color:white;opacity:0.7;"></i>
                               </div>`
                        }
                    </div>
                    <div class="campaign-content">
                        <div class="organization-info">
                            <div class="org-logo">${orgInitials}</div>
                            <div class="org-details">
                                <div class="org-name">${c.organization}</div>
                                <div class="org-verified">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Verified Organization</span>
                                </div>
                            </div>
                        </div>
                        <div class="campaign-category">
                            <i class="fas fa-tag"></i>
                            <span>${c.category}</span>
                        </div>
                        <h3 class="campaign-title">${c.title}</h3>
                        <p class="campaign-description">${c.description.substring(0, 120)}...</p>
                        <div class="campaign-progress">
                            <div class="progress-info">
                                <span class="progress-text">${raisedFmt} raised</span>
                                <span class="progress-goal">of ${goalFmt}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width:${Math.min(progress, 100)}%"></div>
                            </div>
                        </div>
                        <div class="campaign-meta">
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${c.donors || 0} donors</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${daysLeft}</span>
                            </div>
                        </div>
                        <div class="campaign-actions">
                            <button class="btn btn-primary btn-campaign donate-btn">Donate Now</button>
                            <button class="btn btn-outline btn-campaign view-details-btn">
                                <i class="fas fa-chart-line"></i> Transparency
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners after rendering
        document.querySelectorAll('.donate-btn').forEach(btn => {
            btn.addEventListener('click', () => { window.location.href = 'donation-page.html'; });
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.closest('.campaign-card').getAttribute('data-campaign-id');
                showCampaignDetails(id);
            });
        });

    } catch (e) {
        console.error('Failed to load campaigns:', e);
        grid.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;">Failed to load campaigns. Please try again.</p>';
    }
}

function showCampaignDetails(id) {
    const c = campaignData[id];
    if (!c) return;

    const raisedFmt = '₱' + Number(c.raised).toLocaleString('en-PH');
    const goalFmt   = '₱' + Number(c.goal).toLocaleString('en-PH');
    const orgInitials = c.organization.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('modalBody').innerHTML = `
        <div class="detail-section">
            <div class="organization-info" style="margin-bottom:24px;">
                <div class="org-logo">${orgInitials}</div>
                <div class="org-details">
                    <div class="org-name">${c.organization}</div>
                    <div class="org-verified"><i class="fas fa-check-circle"></i> Verified Organization</div>
                </div>
            </div>
            <h3>${c.title}</h3>
            <p style="color:var(--text-light);margin:12px 0 24px;">${c.description}</p>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Beneficiaries</div><div class="detail-value">${c.beneficiaries || '—'}</div></div>
                <div class="detail-item"><div class="detail-label">Location</div><div class="detail-value">${c.location || '—'}</div></div>
                <div class="detail-item"><div class="detail-label">Start Date</div><div class="detail-value">${c.startDate || '—'}</div></div>
                <div class="detail-item"><div class="detail-label">Days Remaining</div><div class="detail-value">${c.daysLeft !== null ? c.daysLeft + ' days' : 'Ongoing'}</div></div>
            </div>
        </div>
        <div class="detail-section transparency-section">
            <h3 style="margin-bottom:8px;">Financial Transparency</h3>
            <p style="font-size:14px;color:var(--text-light);margin-bottom:16px;">Track exactly how donations are being used</p>
            <div class="transparency-grid">
                <div class="transparency-card">
                    <i class="fas fa-bullseye"></i>
                    <div class="transparency-label">Goal</div>
                    <div class="transparency-value">${goalFmt}</div>
                </div>
                <div class="transparency-card">
                    <i class="fas fa-hand-holding-dollar"></i>
                    <div class="transparency-label">Raised</div>
                    <div class="transparency-value">${raisedFmt}</div>
                </div>
                <div class="transparency-card">
                    <i class="fas fa-percent"></i>
                    <div class="transparency-label">Progress</div>
                    <div class="transparency-value">${c.progress}%</div>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <button class="btn btn-primary btn-large" style="width:100%;" onclick="window.location.href='donation-page.html'">
                <i class="fas fa-heart"></i> Donate to This Campaign
            </button>
        </div>
    `;

    document.getElementById('modalTitle').textContent = c.category;
    document.getElementById('campaignModal').classList.add('active');
}

function closeModal() {
    document.getElementById('campaignModal').classList.remove('active');
}

document.getElementById('campaignModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// Navbar scroll
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Init
document.addEventListener('DOMContentLoaded', loadCampaigns);
