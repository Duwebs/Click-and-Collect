const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const isDark = document.body.classList.contains('dark-mode');

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '5';
    overlay.style.pointerEvents = 'none';
    
    // Light -> Dark (Expand) ke liye Dark color, Dark -> Light (Shrink) ke liye Light color
    overlay.style.backgroundColor = isDark ? '#ffffff' : '#111827';
    
    // --- REVERSE LOGIC START ---
    // Agar Dark hai (Light pe jana hai), toh pura screen cover karke start karo (Shrink effect)
    // Agar Light hai (Dark pe jana hai), toh 0px se start karo (Expand effect)
    overlay.style.clipPath = isDark 
        ? `circle(150vmax at ${x}px ${y}px)` 
        : `circle(0px at ${x}px ${y}px)`;
    
    document.body.appendChild(overlay);

    // Forced Reflow
    void overlay.offsetWidth; 

    overlay.style.transition = 'clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Animation ka direction swap
    requestAnimationFrame(() => {
        overlay.style.clipPath = isDark 
            ? `circle(0px at ${x}px ${y}px)` 
            : `circle(150vmax at ${x}px ${y}px)`;
    });
    // --- REVERSE LOGIC END ---

    setTimeout(() => {
        document.body.classList.toggle('dark-mode');
        
        if(document.body.classList.contains('dark-mode')) {
            document.body.classList.add('bg-gray-900', 'text-white');
            document.body.classList.remove('bg-white', 'text-gray-900');
            document.getElementById('themeIcon').innerText = '🌙';
        } else {
            document.body.classList.add('bg-white', 'text-gray-900');
            document.body.classList.remove('bg-gray-900', 'text-white');
            document.getElementById('themeIcon').innerText = '☀️';
        }
    }, 170);

    setTimeout(() => {
        overlay.remove();
    }, 700);
});
