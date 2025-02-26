    const excludedPages = [
        "https://www.computercourse.pk",
    ];

    const currentUrl = window.location.href;

    if (excludedPages.includes(currentUrl)) {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }

    const users = [
        { username: 'monica', password: '2025', expiry: new Date('2025-12-31') },
        { username: 'guest', password: '1234', expiry: new Date('2099-12-31') },
        { username: 'user1', password: 'pass1', expiry: new Date('2024-12-31') },
        { username: 'user2', password: 'pass2', expiry: new Date('2024-10-01') },
        { username: 'user3', password: 'pass3', expiry: new Date('2023-01-01') }
    ];

    // Function to get user by username and password from the users array
    function getUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
    }

    function isUserExpired(user) {
        const currentDate = new Date();
        return currentDate > user.expiry;
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
            const user = getUser(savedUsername);
            if (user && isUserExpired(user)) {
                logout(); // Log out if user is expired
            }
        }
    };

    if (localStorage.getItem('authenticated') === 'true') {
        const savedUsername = localStorage.getItem('username');
        const user = getUser(savedUsername);
        if (user && isUserExpired(user)) {
            logout(); // Log out if user is expired
        } else {
            showProtectedContent();
        }
    }

    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        errorMessage.textContent = '';

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            const currentDate = new Date();
            if (currentDate > user.expiry) {
                errorMessage.textContent = 'Your account has expired.';
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


