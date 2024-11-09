export const handleApiError = (error, auth, router) => {
    if (error.response) {
        const { status, data } = error.response;
        const message = data || 'An unexpected error occurred.';

        alert(message);

        if (status === 401) {
            auth.logout();
            router.push('/fourwheels/login');
        }
    } else {
        console.error('Network error or no response from server:', error);
        alert('An unexpected network error occurred.');
    }
};