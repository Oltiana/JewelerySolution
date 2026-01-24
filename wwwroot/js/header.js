 function getCookie(name) {
    const value = `; ${document.cookie}`;
    console.log('cookies', value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];           // get payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    try {
        return JSON.parse(atob(base64));            // decode to object
    } catch {
        return null;
    }
}
 
 fetch('/header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header-container').innerHTML = html;

        const token = getCookie('access_token');
        const decodedToken = parseJwt(token);

        const userOptions = document.querySelector('#user-options');
        const loginLink = document.querySelector('#login-link');
        const adminLink = document.querySelector('#admin-link');

        console.log('decodedToken', decodedToken);

        if (decodedToken) {
            if (decodedToken.role !== 'Admin') {
              adminLink.style.display = 'none';
            }

            if (loginLink) {
              loginLink.style.display = 'none';
            }
        } else {
            if (userOptions) {
            userOptions.style.display = 'none';
         }
        }

                // Add logout functionality
                const logoutLink = document.getElementById('logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', async function(e) {
                        e.preventDefault();
                        await fetch('/api/auth/logout', {
                            method: 'POST',
                            credentials: 'include' // send JWT cookie
                        });
                        window.location.href = 'login.html'; // redirect after logout
                    });
                }
            });