

async function getUser() {
    try {
        const res = await fetch('/api/auth/me', {
            credentials: 'include' // send HttpOnly JWT cookie
        });

        if (!res.ok) {
            return null;
        }

        const user = await res.json();
        return user;
    } catch (err) {
        console.error('Auth check failed', err);
        return null;
    }
}