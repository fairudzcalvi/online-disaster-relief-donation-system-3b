let campaigns = [];
const token = sessionStorage.getItem('adminToken') || '';
const headers = { 'Authorization': 'Bearer ' + token };
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? '../api/auth/' : '/api/auth/';

document.addEventListener('DOMContentLoaded', () => {
    loadCampaigns();
    document.getElementById('newCampaignBtn').addEventListener('click', openNewModal);
    document.getElementById('campaignForm').addEventListener('submit', saveCampaign);
    document.getElementById('campaignModal').addEventListener('click', e => {
        if (e.target === document.getElementById('campaignModal')) closeModal();
    });
});

async function loadCampaigns() {
    const tbody = document.getElementById('campaignsTableBody');
    try {
        const res = await fetch(API_BASE + 'get_campaigns.php', { headers });
        const result = await res.json();

        if (result.status !== 'success' || !result.data.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No campaigns yet</td></tr>';
            return;
        }

        campaigns = result.data;
        tbody.innerHTML = campaigns.map(c => `
            <tr>
                <td><strong>${c.title}</strong></td>
                <td>${c.organization}</td>
                <td>${c.category}</td>
                <td>₱${Number(c.goal).toLocaleString('en-PH')}</td>
                <td>₱${Number(c.raised).toLocaleString('en-PH')} <small>(${c.progress}%)</small></td>
                <td><span class="status-badge ${c.status}">${capitalize(c.status)}</span></td>
                <td>${c.endDate || '—'}</td>
                <td>
                    <button class="btn-icon view" onclick="openEditModal(${c.id})" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteCampaign(${c.id})" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Failed to load campaigns</td></tr>';
        console.error(e);
    }
}

function openNewModal() {
    document.getElementById('modalTitle').textContent = 'New Campaign';
    document.getElementById('campaignForm').reset();
    document.getElementById('campaignId').value = '';
    document.getElementById('campaignModal').classList.add('active');
}

function openEditModal(id) {
    const c = campaigns.find(x => x.id == id);
    if (!c) return;
    document.getElementById('modalTitle').textContent = 'Edit Campaign';
    document.getElementById('campaignId').value = c.id;
    document.getElementById('title').value = c.title;
    document.getElementById('organization').value = c.organization;
    document.getElementById('category').value = c.category;
    document.getElementById('description').value = c.description;
    document.getElementById('goal').value = c.goal;
    document.getElementById('raised').value = c.raised;
    document.getElementById('beneficiaries').value = c.beneficiaries || '';
    document.getElementById('location').value = c.location || '';
    document.getElementById('startDate').value = c.startDate || '';
    document.getElementById('endDate').value = c.endDate || '';
    document.getElementById('status').value = c.status;
    document.getElementById('campaignModal').classList.add('active');
}

async function saveCampaign(e) {
    e.preventDefault();
    const form = document.getElementById('campaignForm');
    const formData = new FormData(form);

    try {
        const res = await fetch(API_BASE + 'save_campaign.php', {
            method: 'POST',
            headers,
            body: formData
        });
        const result = await res.json();
        if (result.status === 'success') {
            closeModal();
            loadCampaigns();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        alert('Network error. Please try again.');
        console.error(e);
    }
}

async function deleteCampaign(id) {
    if (!confirm('Delete this campaign?')) return;
    try {
        const formData = new FormData();
        formData.append('campaignId', id);
        formData.append('status', 'cancelled');
        const res = await fetch(API_BASE + 'save_campaign.php', {
            method: 'POST',
            headers,
            body: formData
        });
        const result = await res.json();
        if (result.status === 'success') loadCampaigns();
        else alert('Error: ' + result.message);
    } catch (e) {
        alert('Network error.');
    }
}

function closeModal() {
    document.getElementById('campaignModal').classList.remove('active');
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
