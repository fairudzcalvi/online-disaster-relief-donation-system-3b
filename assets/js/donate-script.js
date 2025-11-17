// Global state
let selectedAmount = 0;
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
        // Remove selected class from all buttons
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Clear custom amount
        document.getElementById('customAmount').value = '';
        
        // Set selected amount
        selectedAmount = parseInt(this.dataset.amount);
    });
});

// Custom amount input
document.getElementById('customAmount').addEventListener('input', function() {
    // Remove selected class from preset amounts
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    
    // Set selected amount
    selectedAmount = parseFloat(this.value) || 0;
});

// Navigate to different steps
function goToStep(stepNumber) {
    // Validate current step before proceeding
    if (stepNumber === 2) {
        if (selectedAmount < 100) {
            alert('Please select or enter a donation amount (minimum PHP 100)');
            return;
        }
        // Update amount display
        document.getElementById('selectedAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    if (stepNumber === 3) {
        // Validate donor info
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Store donor info
        donorInfo = {
            firstName,
            lastName,
            email,
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            anonymous: document.getElementById('anonymous').checked
        };
        
        // Update final amount and donor name
        document.getElementById('finalAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        document.getElementById('donorName').textContent = donorInfo.anonymous ? 
            'Anonymous Donor' : 
            `${donorInfo.firstName} ${donorInfo.lastName}`;
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
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Payment method selection
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const qrSection = document.getElementById('qrSection');
        const paymentApp = document.getElementById('paymentApp');
        const qrAmount = document.getElementById('qrAmount');
        
        // Show QR section
        qrSection.classList.remove('hidden');
        
        // Update payment app name
        paymentApp.textContent = this.value === 'gcash' ? 'GCash' : 'Maya';
        
        // Update amount in instructions
        qrAmount.textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        
        // Scroll to QR section
        qrSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const receiptFile = document.getElementById('receiptFile');
const uploadedFile = document.getElementById('uploadedFile');
const fileName = document.getElementById('fileName');

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

function handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    // Show uploaded file
    fileName.textContent = file.name;
    uploadedFile.classList.remove('hidden');
    uploadArea.style.display = 'none';
}

// Complete donation
function completeDonation() {
    // Check if payment method is selected
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    // Check if receipt is uploaded
    if (!receiptFile.files.length) {
        alert('Please upload your payment receipt');
        return;
    }
    
    // Generate reference number
    const referenceNumber = 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Show success modal
    document.getElementById('successAmount').textContent = `PHP ${selectedAmount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    document.getElementById('referenceNumber').textContent = referenceNumber;
    document.getElementById('successModal').classList.remove('hidden');
    
    // Here you would normally send the data to your server
    console.log('Donation submitted:', {
        amount: selectedAmount,
        donor: donorInfo,
        paymentMethod: paymentMethod.value,
        receipt: receiptFile.files[0].name,
        reference: referenceNumber,
        timestamp: new Date().toISOString()
    });
}