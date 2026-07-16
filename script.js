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



// 1. Service Worker Register Karna (Offline Support ke liye)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js') // Aapki sw.js file ka naam
            .then(reg => console.log('Service Worker Registered!', reg))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    });
}

// 2. PWA Custom Install Prompt Logic
let deferredPrompt;
const pwaWrapper = document.getElementById('pwa-wrapper');
const pwaBottomSheet = document.getElementById('pwa-bottom-sheet');
const headerInstallBtn = document.getElementById('header-install-btn');
const actionInstallBtn = document.getElementById('action-install-btn');
const closeSheetBtn = document.getElementById('close-sheet-btn');
const androidAction = document.getElementById('android-action');
const iosAction = document.getElementById('ios-action');

// Device Detection (Android vs iOS)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// ⚡ YAHAN UPDATE KIYA HAI: 5 Second ke delay ke sath trigger hoga
window.addEventListener('beforeinstallprompt', (e) => {
    // Browser ke default prompt ko rokna
    e.preventDefault();
    deferredPrompt = e;

    // Agar app pehle se installed nahi hai, toh 5 second baad trigger karo
    if (!isInStandaloneMode) {
        setTimeout(() => {
            if (headerInstallBtn) headerInstallBtn.classList.remove('hidden');
            
            // Show custom PWA Sheet with animation
            showPWABottomSheet();
        }, 5000); // 5000 ms = 5 second. Agar 6 second chahiye toh yahan 6000 kar dena.
    }
});

// Show PWA Bottom Sheet Function
function showPWABottomSheet() {
    if (!pwaWrapper || !pwaBottomSheet) return;
    
    pwaWrapper.classList.remove('opacity-0', 'pointer-events-none');
    pwaWrapper.classList.add('opacity-100');
    
    // Slide Up Sheet
    setTimeout(() => {
        pwaBottomSheet.style.transform = 'translateY(0)';
    }, 50);

    // Platform ke hisaab se sahi action dikhao
    if (isIOS) {
        if (iosAction) iosAction.classList.remove('hidden');
        if (androidAction) androidAction.classList.add('hidden');
    } else {
        if (androidAction) androidAction.classList.remove('hidden');
        if (iosAction) iosAction.classList.add('hidden');
    }
}

// Close PWA Bottom Sheet Function
function closePWABottomSheet() {
    if (!pwaWrapper || !pwaBottomSheet) return;
    
    pwaBottomSheet.style.transform = 'translateY(100%)';
    setTimeout(() => {
        pwaWrapper.classList.remove('opacity-100');
        pwaWrapper.classList.add('opacity-0', 'pointer-events-none');
    }, 400);
}

// Header & Main Install Button Clicks
const triggerInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // Browser ka install dialog dikhao
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User ne PWA install kar liya!');
            if (headerInstallBtn) headerInstallBtn.classList.add('hidden');
            closePWABottomSheet();
        }
        deferredPrompt = null;
    });
};

if (headerInstallBtn) headerInstallBtn.addEventListener('click', showPWABottomSheet);
if (actionInstallBtn) actionInstallBtn.addEventListener('click', triggerInstall);
if (closeSheetBtn) closeSheetBtn.addEventListener('click', closePWABottomSheet);
document.getElementById('pwa-backdrop')?.addEventListener('click', closePWABottomSheet);
