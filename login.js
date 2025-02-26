// Array of users with page-specific credentials
const users = [
    { username: 'monica', password: '2025', expiry: new Date('2025-12-31'), pageTitle: 'book1Working' },
    { username: 'monica', password: '2025', expiry: new Date('2025-12-31'), pageTitle: 'Bonus' },
    { username: 'user1', password: 'pass1', expiry: new Date('2024-12-31'), pageTitle: 'Overlay Login Box' },
    { username: 'user2', password: 'pass2', expiry: new Date('2024-10-01'), pageTitle: 'Overlay Login Box' },
    { username: 'user3', password: 'pass3', expiry: new Date('2023-01-01'), pageTitle: 'Another Page Title' }
];

// Function to get user by username and pageTitle from the users array
function getUser(username, pageTitle) {
    return users.find(user => user.username === username && user.pageTitle === pageTitle);
}

// Function to check if the user is expired
function isUserExpired(user) {
    const currentDate = new Date();
    return currentDate > user.expiry;
}

// Get the current page title
const pageTitle = document.title;

// Load saved credentials if available
window.onload = function() {
    const savedUsername = localStorage.getItem('username_' + pageTitle);
    const savedPassword = localStorage.getItem('password_' + pageTitle);
    
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
    
    // Check if credentials are expired or changed
    if (savedUsername && savedPassword) {
        const user = getUser(savedUsername, pageTitle);
        if (!user || user.password !== savedPassword || isUserExpired(user)) {
            logout(); // Log out if user is expired or credentials are invalid
        }
    }
};

// Check local storage for authentication status for the current page
if (localStorage.getItem('authenticated_' + pageTitle) === 'true') {
    const savedUsername = localStorage.getItem('username_' + pageTitle);
    const user = getUser(savedUsername, pageTitle);
    
    // If the username is not found, the password has changed, or the user is expired, log out
    if (!user || user.password !== localStorage.getItem('password_' + pageTitle) || isUserExpired(user)) {
        logout(); // Log out if the credentials don't match or the user is expired
    } else {
        showProtectedContent(); // Show protected content
    }
}

// Function to handle the login process
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error message
    errorMessage.textContent = '';

    // Check if the username and password match any in the users array for the specific page
    const user = getUser(username, pageTitle);

    if (user && user.password === password) {
        // Check if the account has expired
        const currentDate = new Date();
        if (currentDate > user.expiry) {
            errorMessage.textContent = 'Your account has expired.';
        } else {
            localStorage.setItem('authenticated_' + pageTitle, 'true'); // Store authentication status with page title
            
            // Save credentials to local storage with page title
            localStorage.setItem('username_' + pageTitle, username);
            localStorage.setItem('password_' + pageTitle, password);

            showProtectedContent(); // Show protected content
        }
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
}

// Function to show protected content
function showProtectedContent() {
    document.getElementById('overlay').style.display = 'none'; // Hide the overlay
    document.getElementById('content').style.display = 'block'; // Show protected content
}

// Function to handle logout
function logout() {
    localStorage.removeItem('authenticated_' + pageTitle); // Remove authentication status for the current page
    document.getElementById('overlay').style.display = 'flex'; // Show the overlay again
    document.getElementById('content').style.display = 'none'; // Hide protected content

    // Clear input fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Clear the inputs from localStorage/sessionStorage to prevent them from being refilled
    localStorage.removeItem('username_' + pageTitle);
    localStorage.removeItem('password_' + pageTitle);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');

    // Clear error message
    document.getElementById('error-message').textContent = '';
}

// Add event listener for logout button
document.getElementById('logout-button').addEventListener('click', logout);

// Event listener for Enter key
document.getElementById('login-box').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login(); // Call login function when Enter is pressed
    }
});
