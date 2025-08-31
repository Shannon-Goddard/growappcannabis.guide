document.addEventListener('DOMContentLoaded', function() {
    const ageGate = document.getElementById('ageGate');
    const enterBtn = document.getElementById('enterBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    // Check if user already verified (24 hour session)
    const verified = sessionStorage.getItem('ageVerified');
    if (verified) {
        ageGate.classList.add('hidden');
        return;
    }
    
    enterBtn.addEventListener('click', function() {
        sessionStorage.setItem('ageVerified', 'true');
        ageGate.classList.add('hidden');
    });
    
    exitBtn.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
});