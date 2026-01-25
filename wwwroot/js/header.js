
 fetch('/header.html')
            .then(response => response.text())
            .then(async (html) => {
                document.getElementById('header-container').innerHTML = html;

        const user = await getUser();
        console.log('user', user);

        const userOptions = document.querySelector('#user-options');
        const loginLink = document.querySelector('#login-link');
        const adminLink = document.querySelector('#admin-link');
        const navbarNav = document.querySelectorAll('ul.navbar-nav');

        if (user) {
            if (user.role !== 'Admin') {
              adminLink.style.display = 'none';
            }

            if (loginLink) {
              loginLink.style.display = 'none';
            }
        } else {
            if (userOptions) {
            userOptions.style.display = 'none';
         }

         if (navbarNav.length) {
             [...navbarNav].forEach((el) => {  
                 el.style.setProperty("margin-left", "auto", "important");
                 el.style.setProperty("margin-right", "0", "important");
             })
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