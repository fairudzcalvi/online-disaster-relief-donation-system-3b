// Global state
let selectedAmount = 0;
let selectedPaymentMethod = '';
let paymentIntentId = '';
let donorInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    anonymous: false
};

// Amount selection
document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('customAmount').value = '';
        selectedAmount = parseInt(this.dataset.amount);
        updateQRCode();
    });
});

// Custom amount input
document.getElementById('customAmount').addEventListener('input', function() {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    selectedAmount = parseFloat(this.value) || 0;
    updateQRCode();
});

// Payment method selection
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedPaymentMethod = this.value;
        updateQRCode();
    });
});

// Update QR code section based on amount and payment method
function updateQRCode() {
    const qrAmount = document.getElementById('qrAmount');
    const paymentApp = document.getElementById('paymentApp');
    const paymentAppInstructions = document.getElementById('paymentAppInstructions');
    
    if (qrAmount && selectedAmount > 0) {
        qrAmount.textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    if (paymentApp && paymentAppInstructions && selectedPaymentMethod) {
        const appName = selectedPaymentMethod === 'gcash' ? 'GCash' : 'Maya';
        paymentApp.textContent = appName;
        paymentAppInstructions.textContent = appName;
    }
}

// Navigate to different steps
async function goToStep(stepNumber) {
    if (stepNumber === 2) {
        if (selectedAmount < 100) {
            alert('Please select or enter a donation amount (minimum PHP 100)');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Please select a payment method (GCash or Maya)');
            return;
        }
        document.getElementById('selectedAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    if (stepNumber === 3) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        donorInfo = {
            firstName,
            lastName,
            email,
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            anonymous: document.getElementById('anonymous').checked,
            paymentMethod: selectedPaymentMethod,
            amount: selectedAmount
        };
        
        // Update payment page summary
        document.getElementById('finalAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        document.getElementById('paymentMethodDisplay').textContent = selectedPaymentMethod === 'gcash' ? 'GCash' : 'Maya';
        document.getElementById('donorName').textContent = donorInfo.anonymous ? 
            'Anonymous Donor' : 
            `${donorInfo.firstName} ${donorInfo.lastName}`;
        
        updateQRCode();
    }
    
    // Hide all steps
    document.querySelectorAll('.donate-step').forEach(step => step.classList.add('hidden'));
    
    // Show target step
    if (stepNumber === 1) {
        document.getElementById('stepAmount').classList.remove('hidden');
    } else if (stepNumber === 2) {
        document.getElementById('stepInfo').classList.remove('hidden');
    } else if (stepNumber === 3) {
        document.getElementById('stepPayment').classList.remove('hidden');
    }
    
    // Update progress indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Payment intent stub — no PayMongo integration, proceed directly
async function createPaymentIntent(donorData) {
    return { data: { id: 'local-' + Date.now() } };
}

async function processPayment() {
    // Handled by completeDonation()
}

// Complete donation — submit to backend with optional receipt
async function completeDonation() {
    const submitBtn = document.querySelector('[onclick="completeDonation()"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

    try {
        const payload = { ...donorInfo };

        const response = await fetch('api/auth/save_donation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            showSuccessModal(result.reference);
        } else {
            alert('Submission failed: ' + (result.message || 'Please try again.'));
        }
    } catch (e) {
        console.error('Donation submission error:', e);
        alert('Network error. Please try again.');
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Donation ❤'; }
    }
}

// File upload handling (for manual receipt upload fallback)
const uploadArea = document.getElementById('uploadArea');
const receiptFile = document.getElementById('receiptFile');
const uploadedFile = document.getElementById('uploadedFile');
const fileName = document.getElementById('fileName');

if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        receiptFile.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-green)';
        uploadArea.style.background = 'rgba(39, 174, 96, 0.05)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    receiptFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    fileName.textContent = file.name;
    uploadedFile.classList.remove('hidden');
    uploadArea.style.display = 'none';
}

// Check for payment success on page load
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
        showSuccessModal();
    }
});

function showSuccessModal(referenceNumber) {
    if (!referenceNumber) {
        referenceNumber = 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    document.getElementById('successAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    document.getElementById('referenceNumber').textContent = referenceNumber;
    document.getElementById('successModal').classList.remove('hidden');
}

// Initialize QR code on page load
document.addEventListener('DOMContentLoaded', function() {
    updateQRCode();
});