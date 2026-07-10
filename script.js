let deferredPrompt;
const pwaSheet = document.getElementById('pwa-bottom-sheet');
const headerInstallBtn = document.getElementById('header-install-btn');
const closeSheetBtn = document.getElementById('close-sheet-btn');
const actionInstallBtn = document.getElementById('action-install-btn');
const androidAction = document.getElementById('android-action');
const iosAction = document.getElementById('ios-action');

// Device aur mode check karne ke liye
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

// 1. STEP 1: Service Worker ko actively register karna (Most Important!)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker Registered Successfully!', reg.scope))
      .catch(err => console.log('Service Worker Registration Failed:', err));
  });
}

// Helper functions for animation
function showBottomSheet() {
  if (pwaSheet && !isStandalone) {
    pwaSheet.classList.remove('hidden');
    setTimeout(() => {
      pwaSheet.classList.remove('translate-y-full');
    }, 10);
  }
}

function hideBottomSheet() {
  if (pwaSheet) {
    pwaSheet.classList.add('translate-y-full');
    setTimeout(() => {
      pwaSheet.classList.add('hidden');
    }, 500);
  }
}

// 2. STEP 2: Android/Chrome ke liye install prompt capture karna
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('⚡ Chrome PWA Prompt Ready!');
  e.preventDefault();
  deferredPrompt = e;

  // Buttons ko activate karo
  if (headerInstallBtn) headerInstallBtn.classList.remove('hidden');
  if (androidAction) androidAction.classList.remove('hidden');
  if (iosAction) iosAction.classList.add('hidden');
});

// 3. STEP 3: FALLBACK TIMEOUT (Taaki design 100% dikhe hi dikhe!)
window.addEventListener('DOMContentLoaded', () => {
  if (isStandalone) return; // Agar pehle se installed hai toh kuch mat karo

  if (isIOS) {
    if (headerInstallBtn) headerInstallBtn.classList.remove('hidden');
    if (iosAction) iosAction.classList.remove('hidden');
    if (androidAction) androidAction.classList.add('hidden');
  } else {
    // Agar Android hai aur beforeinstallprompt thoda late bhi ho, toh bhi action area dikhao
    if (androidAction) androidAction.classList.remove('hidden');
  }

  // 5 Second baad har haal mein card upar slide hoga!
  setTimeout(showBottomSheet, 5000);
});

// 4. STEP 4: Clicks aur Actions ko handle karna
if (headerInstallBtn) headerInstallBtn.addEventListener('click', showBottomSheet);
if (closeSheetBtn) closeSheetBtn.addEventListener('click', hideBottomSheet);

if (actionInstallBtn) {
  actionInstallBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      deferredPrompt = null;
      hideBottomSheet();
      if (headerInstallBtn) headerInstallBtn.classList.add('hidden');
    } else {
      // Fallback: Agar browser ne direct native prompt abhi nahi diya hai
      alert("Aapke browser mein direct install supported hai! Agar prompt nahi aaya, toh Chrome ke top-right 3-dots par click karke 'Add to Home screen' ya 'Install app' chunein.");
      hideBottomSheet();
    }
  });
}

// Hide everything when installed
window.addEventListener('appinstalled', () => {
  console.log('🎉 Click & Collect App Installed successfully!');
  hideBottomSheet();
  if (headerInstallBtn) headerInstallBtn.classList.add('hidden');
});
