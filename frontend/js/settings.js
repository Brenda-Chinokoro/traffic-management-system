// JavaScript for the settings page

document.addEventListener('DOMContentLoaded', function() {
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const saveSystemConfigBtn = document.getElementById('save-system-config-btn');
    const profileUpdateMessage = document.getElementById('profile-update-message');
    const configSaveMessage = document.getElementById('config-save-message');

    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', function() {
            // Simulate updating user profile
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword && newPassword !== confirmPassword) {
                profileUpdateMessage.className = 'alert-error';
                profileUpdateMessage.textContent = 'New passwords do not match.';
                return;
            }

            // In a real application, you would send this data to a server
            console.log('Updating profile:', { username, email, newPassword });
            profileUpdateMessage.className = 'alert-success';
            profileUpdateMessage.textContent = 'Profile updated successfully!';
            setTimeout(() => {
                profileUpdateMessage.className = '';
                profileUpdateMessage.textContent = '';
            }, 3000);
        });
    }

    if (saveSystemConfigBtn) {
        saveSystemConfigBtn.addEventListener('click', function() {
            // Simulate saving system configuration
            const timezone = document.getElementById('timezone').value;
            const dataRetention = document.getElementById('data-retention').value;

            // In a real application, you would send this data to a server
            console.log('Saving system config:', { timezone, dataRetention });
            configSaveMessage.className = 'alert-success';
            configSaveMessage.textContent = 'System configuration saved!';
            setTimeout(() => {
                configSaveMessage.className = '';
                configSaveMessage.textContent = '';
            }, 3000);
        });
    }
});