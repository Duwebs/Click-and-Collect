// ================== COPY / RIGHT-CLICK BLOCK ==================

// Right click disable
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Copy, Cut disable
document.addEventListener('copy', function(e) {
  e.preventDefault();
});
document.addEventListener('cut', function(e) {
  e.preventDefault();
});

// Keyboard shortcuts block: Ctrl+C, Ctrl+U (view-source), Ctrl+S (save), F12,
// Ctrl+Shift+I / J / C (DevTools open shortcuts)
document.addEventListener('keydown', function(e) {
  const key = e.key.toUpperCase();
  
  if (e.key === 'F12') {
    e.preventDefault();
  }
  if (e.ctrlKey && key === 'U') {
    e.preventDefault();
  }
  if (e.ctrlKey && key === 'S') {
    e.preventDefault();
  }
  if (e.ctrlKey && key === 'C') {
    e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(key)) {
    e.preventDefault();
  }
});

// NOTE: Upar wale shortcuts sirf keyboard se rokte hain.
// Browser menu se (⋮ > More tools > Developer tools) koi bhi khol sakta hai —
// isko JS se rokna possible hi nahi hai.


// ================== LOADING SCREEN ==================
// HTML me ye add karna hoga (body ke sabse upar):
// <div id="page-loader"><img src="apni-image.png" alt="Loading..."></div>

// Jaise hi script chale, body pe "loading" class laga do (scroll rokne ke liye)
document.body.classList.add('loading');

// "load" event tab fire hota hai jab HTML + saari images + CSS + JS
// sab fully load ho chuke hote hain — isse pehle loader nahi hatega
window.addEventListener('load', function() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    document.body.classList.remove('loading');
    // Thodi der baad DOM se fully hata do (optional, memory clean karne ke liye)
    setTimeout(() => loader.remove(), 600);
  }
});