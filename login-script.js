// Check if user is already logged in
window.onload = function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
};

// Switch between login and signup forms
function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    clearMessages();
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    clearMessages();
}

// Show message (error or success)
function showMessage(message, type, formId) {
    clearMessages();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById(formId);
    form.insertBefore(messageDiv, form.querySelector('form'));
}

function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error', 'signupForm');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters!', 'error', 'signupForm');
        return;
    }

    // Get existing users from localStorage
    let users = localStorage.getItem('diaryUsers');
    users = users ? JSON.parse(users) : [];

    // Check if email already exists
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        showMessage('Email already registered! Please login.', 'error', 'signupForm');
        return;
    }

    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password, // Note: In real app, NEVER store plain passwords!
        createdAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('diaryUsers', JSON.stringify(users));

    // Show success message
    showMessage('Account created successfully! Redirecting...', 'success', 'signupForm');

    // Auto login after signup
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    }, 1500);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Get users from localStorage
    let users = localStorage.getItem('diaryUsers');
    users = users ? JSON.parse(users) : [];

    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showMessage('Invalid email or password!', 'error', 'loginForm');
        return;
    }

    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Show success and redirect
    showMessage('Login successful! Redirecting...', 'success', 'loginForm');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}