const excludedPages = [
    "https://www.computercourse.pk",
];

const currentUrl = window.location.href;

if (excludedPages.includes(currentUrl)) {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Array of users with page-specific credentials
const users = [
    { username: 'guest', password: '1234', expiry: new Date('2099-12-31'), pageTitle: 'Home' },
    { username: 'user1', password: 'pass1', expiry: new Date('2024-12-31'), pageTitle: 'Dashboard' },
    { username: 'user2', password: 'pass2', expiry: new Date('2024-10-01'), pageTitle: 'Reports' },
    { username: 'user3', password: 'pass3', expiry: new Date('2023-01-01'), pageTitle: 'Settings' }
];

// Function to get user by username and password from the users array
function getUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Function to check if the user is expired
function isUserExpired(user) {
    const currentDate = new Date();
    return currentDate > user.expiry;
}

// Function to check if the user is authorized for the current page
function isUserAuthorizedForPage(user) {
    const currentPageTitle = document.title; // Get the current page title
    return user.pageTitle === currentPageTitle; // Check if the user is authorized for this page
}

window.onload = function() {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }

    if (savedUsername && savedPassword) {
        const user = getUser(savedUsername, savedPassword);
        if (user && isUserExpired(user)) {
            logout(); // Log out if user is expired
        }
    }
};

if (localStorage.getItem('authenticated') === 'true') {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const user = getUser(savedUsername, savedPassword);
    if (user && isUserExpired(user)) {
        logout(); // Log out if user is expired
    } else if (user && isUserAuthorizedForPage(user)) {
        showProtectedContent();
    } else {
        logout(); // Log out if user is not authorized for the current page
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    const user = getUser(username, password);

    if (user) {
        if (isUserExpired(user)) {
            errorMessage.textContent = 'Your account has expired.';
        } else if (!isUserAuthorizedForPage(user)) {
            errorMessage.textContent = 'You are not authorized to access this page.';
        } else {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            showProtectedContent();
        }
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
}

function showProtectedContent() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.body.classList.remove('no-scroll'); // Enable scrolling
}

function logout() {
    localStorage.removeItem('authenticated');
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('content').style.display = 'none';
    document.body.classList.add('no-scroll'); // Disable scrolling

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    document.getElementById('error-message').textContent = '';
}

document.getElementById('logout-button').addEventListener('click', logout);

document.getElementById('login-box').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login(); // Call login function when Enter is pressed
    }
});
