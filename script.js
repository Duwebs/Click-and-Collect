const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const isDark = document.body.classList.contains('dark-mode');

    // Naya ripple element
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.top = '0'; ripple.style.left = '0';
    ripple.style.width = '100vw'; ripple.style.height = '100vh';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999'; // Upar rahega
    
    // YAHAN CHANGE: Ripple ka color wahi rakho jo next theme ka background hai
    ripple.style.backgroundColor = isDark ? '#ffffff' : '#111827';
    document.body.appendChild(ripple);

    if (!isDark) {
        // LIGHT TO DARK
        ripple.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        requestAnimationFrame(() => {
            ripple.style.transition = 'clip-path 0.6s ease-in-out';
            ripple.style.clipPath = `circle(150% at ${x}px ${y}px)`;
        });
    } else {
        // DARK TO LIGHT
        ripple.style.clipPath = `circle(150% at ${x}px ${y}px)`;
        requestAnimationFrame(() => {
            ripple.style.transition = 'clip-path 0.6s ease-in-out';
            ripple.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        });
    }

    // Theme Switch: Animation ke middle mein (300ms)
    setTimeout(() => {
        document.body.classList.toggle('dark-mode');
        document.getElementById('themeIcon').innerText = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    }, 300);

    setTimeout(() => ripple.remove(), 700);
});
