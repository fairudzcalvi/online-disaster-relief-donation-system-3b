const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginContainer = document.getElementById('loginContainer');
const signupContainer = document.getElementById('signupContainer');
const successModal = document.getElementById('successModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

const API_BASE_URL = 'http://localhost/online-disaster-relief-donation-system-3b/backend/api';

const API_ENDPOINTS = {
    LOGIN: API_BASE_URL + '/auth/login.php',
    REGISTER: API_BASE_URL + '/auth/register.php'
};
function showSignup(e) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
    clearAllErrors();
    loginForm.reset();
}

function showLogin(e) {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    clearAllErrors();
    signupForm.reset();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateLoginForm() {
    clearAllErrors();
    let isValid = true;

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email) {
        showError('loginEmailError', 'Email or username is required');
        isValid = false;
    }

    if (!password) {
        showError('loginPasswordError', 'Password is required');
        isValid = false;
    }

    return isValid;
}

function validateSignupForm() {
    clearAllErrors();
    let isValid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const donorType = document.getElementById('donorType').value;
    const termsAccepted = document.getElementById('termsConditions').checked;

    if (!fullName) {
        showError('fullNameError', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 3) {
        showError('fullNameError', 'Full name must be at least 3 characters');
        isValid = false;
    }

    if (!email) {
        showError('signupEmailError', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!password) {
        showError('signupPasswordError', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('signupPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('confirmPasswordError', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    if (!donorType) {
        showError('donorTypeError', 'Please select a donor type');
        isValid = false;
    }

    if (!termsAccepted) {
        showError('termsError', 'You must accept the Terms and Conditions');
        isValid = false;
    }

    return isValid;
}

function showSuccessModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    successModal.classList.remove('hidden');
}

function closeModal() {
    successModal.classList.add('hidden');
}

function simulateLoading(button, callback) {
    button.classList.add('loading');
    button.disabled = true;

    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
        if (callback) callback();
    }, 1500);
}

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (validateLoginForm()) {
        const submitButton = loginForm.querySelector('.btn-primary');
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const result = await response.json();
            
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.data.user));
                localStorage.setItem('token', result.data.token);
    
                showSuccessModal(
                    'Login Successful!',
                    `Welcome back, ${result.data.user.full_name}!`
                );
                
                loginForm.reset();
                
            
                
            } else {
                alert('Login failed: ' + result.message);
            }
            
        } catch (error) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            alert('Connection error: ' + error.message);
            console.error('Error:', error);
        }
    }
});


signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (validateSignupForm()) {
        const submitButton = signupForm.querySelector('.btn-primary');
        
        const formData = {
            full_name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            username: document.getElementById('signupEmail').value.split('@')[0],
            password: document.getElementById('signupPassword').value,
            donor_type: document.getElementById('donorType').value
        };
        
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            if (result.success) {
                showSuccessModal(
                    'Account Created Successfully!',
                    `Welcome, ${result.data.full_name}! You can now login with your credentials.`
                );
                
                signupForm.reset();
                
    
                setTimeout(() => {
                    closeModal();
                    showLogin(new Event('click'));
                }, 3000);
                
            } else {
                alert('Registration failed: ' + result.message);
            }
            
        } catch (error) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            alert('Connection error: ' + error.message);
            console.error('Error:', error);
        }
    }
});

document.getElementById('loginEmail').addEventListener('input', function() {
    clearError('loginEmailError');
});

document.getElementById('loginPassword').addEventListener('input', function() {
    clearError('loginPasswordError');
});

document.getElementById('fullName').addEventListener('input', function() {
    clearError('fullNameError');
});

document.getElementById('signupEmail').addEventListener('input', function() {
    clearError('signupEmailError');
});

document.getElementById('signupPassword').addEventListener('input', function() {
    clearError('signupPasswordError');
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    clearError('confirmPasswordError');
});

document.getElementById('donorType').addEventListener('change', function() {
    clearError('donorTypeError');
});

document.getElementById('termsConditions').addEventListener('change', function() {
    clearError('termsError');
});

successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

