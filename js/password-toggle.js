const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('loginPassword');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    this.classList.toggle('showing');
});