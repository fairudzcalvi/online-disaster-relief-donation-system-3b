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
        const appName = selectedPaymentMethod === 'grab_pay' ? 'GrabPay' : 'GCash';
        paymentApp.textContent = appName;
        paymentAppInstructions.textContent = appName;
    }
}

// Toast notification
function showToast(message, type = 'error') {
    let toast = document.getElementById('donateToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'donateToast';
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.15);transition:opacity 0.3s;max-width:90vw;text-align:center;';
        document.body.appendChild(toast);
    }
    toast.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
    toast.style.color = '#fff';
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 3500);
}

// Navigate to different steps
async function goToStep(stepNumber) {
    if (stepNumber === 2) {
        if (selectedAmount < 100) {
            showToast('Please select or enter a donation amount (minimum PHP 100)');
            return;
        }
        if (!selectedPaymentMethod) {
            showToast('Please select a payment method (GCash or GrabPay)');
            return;
        }
        document.getElementById('selectedAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    if (stepNumber === 3) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!firstName || !lastName || !email) {
            showToast('Please fill in all required fields');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address');
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
        document.getElementById('paymentMethodDisplay').textContent = selectedPaymentMethod === 'grab_pay' ? 'GrabPay' : 'GCash';
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

// Complete donation — redirect to PayMongo checkout
async function completeDonation() {
    const submitBtn = document.querySelector('[onclick="completeDonation()"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting to payment...';
    }

    try {
        const response = await fetch('api/auth/create_payment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorInfo)
        });

        const result = await response.json();

        if (result.status === 'success' && result.checkoutUrl) {
            // Store reference in sessionStorage so we can show it on return
            sessionStorage.setItem('donationReference', result.reference);
            sessionStorage.setItem('donationAmount', selectedAmount);
            // Redirect to PayMongo checkout (GCash/Maya)
            window.location.href = result.checkoutUrl;
        } else {
            showToast('Payment error: ' + (result.message || 'Please try again.'));
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Pay Now <i class="fas fa-arrow-right"></i>';
            }
        }
    } catch (e) {
        console.error('Payment error:', e);
        showToast('Network error. Please try again.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Pay Now <i class="fas fa-arrow-right"></i>';
        }
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

// Track uploaded receipt file
let uploadedReceiptFile = null;

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB');
        return;
    }
    
    uploadedReceiptFile = file;
    fileName.textContent = file.name;
    uploadedFile.classList.remove('hidden');
    uploadArea.style.display = 'none';
}

// Check for payment result on page load (after PayMongo redirect)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    if (paymentStatus === 'success') {
        const ref = urlParams.get('ref') || sessionStorage.getItem('donationReference') || 'REF-XXXX';
        const amt = parseFloat(urlParams.get('amt') || sessionStorage.getItem('donationAmount')) || 0;
        selectedAmount = amt;
        showSuccessModal(ref);
        sessionStorage.removeItem('donationReference');
        sessionStorage.removeItem('donationAmount');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed') {
        showToast('Payment was not completed. Please try again.', 'error');
        window.history.replaceState({}, '', 'donation-page.html');
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