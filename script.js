const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('bg-gray-900');
    body.classList.toggle('text-white');
    body.classList.toggle('bg-white');
    body.classList.toggle('text-gray-900');
    
    // Icon badalne ke liye
    if (body.classList.contains('bg-gray-900')) {
        themeIcon.innerText = '🌙';
    } else {
        themeIcon.innerText = '☀️';
    }
});
