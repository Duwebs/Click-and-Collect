console.log(
  "%c🚀 Developed by: Durgesh %c| ✉️ openmailon@gmail.com",
  "color: #4fd1c5; font-size: 13px; font-weight: bold; background: #0f172a; padding: 8px 12px; border-radius: 4px 0 0 4px;",
  "color: #fff; font-size: 12px; background: #1e293b; padding: 8px 12px; border-radius: 0 4px 4px 0;"
);




// Device aur Mode Detect Karne Ke Liye Global Checkers
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

let deferredPrompt;

// Saare HTML Elements ko Sahi se Select Kiya (Bug Fixed)
const pwaWrapper = document.getElementById('pwa-wrapper');
const pwaBackdrop = document.getElementById('pwa-backdrop');
const pwaBottomSheet = document.getElementById('pwa-bottom-sheet');
const closeSheetBtn = document.getElementById('close-sheet-btn');
const actionInstallBtn = document.getElementById('action-install-btn');
const headerInstallBtn = document.getElementById('header-install-btn');
const androidAction = document.getElementById('android-action'); // FIXED: getElementById lagaya
const iosAction = document.getElementById('ios-action');

// ==========================================
// 1. SERVICE WORKER REGISTRATION ⚙️
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker Registered Successfully!', reg.scope))
      .catch(err => console.log('Service Worker Registration Failed:', err));
  });
}

// ==========================================
// 2. PREMIUM ANIMATION FUNCTIONS 🚀
// ==========================================
function showBottomSheet() {
  if (pwaWrapper && !isStandalone) {
    pwaWrapper.classList.remove('opacity-0', 'pointer-events-none');
    pwaBackdrop.classList.remove('opacity-0');
    pwaBackdrop.classList.add('opacity-100');
    pwaBottomSheet.classList.remove('translate-y-full');
    pwaBottomSheet.classList.add('translate-y-0');
  }
}

function hideBottomSheet() {
  if (pwaWrapper) {
    pwaBackdrop.classList.remove('opacity-100');
    pwaBackdrop.classList.add('opacity-0');
    pwaBottomSheet.classList.remove('translate-y-0');
    pwaBottomSheet.classList.add('translate-y-full');
    setTimeout(() => {
        pwaWrapper.classList.add('opacity-0', 'pointer-events-none');
    }, 500); // Animation khatam hone ka wait karega
  }
}

// ==========================================
// 3. ANDROID / CHROME PROMPT CAPTURE 🤖
// ==========================================
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('⚡ Chrome PWA Prompt Ready!');
  e.preventDefault();
  deferredPrompt = e;

  // Sahi buttons ko active karo aur galat wale chupao
  if (headerInstallBtn) headerInstallBtn.classList.remove('hidden');
  if (androidAction) androidAction.classList.remove('hidden');
  if (iosAction) iosAction.classList.add('hidden');
});

// ==========================================
// 4. FALLBACK & DIRECT LOAD SYSTEM 📱
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  if (isStandalone) return; // Agar app mode me khula hai toh popup mat dikhao

  if (isIOS) {
    if (headerInstallBtn) headerInstallBtn.classList.remove('hidden');
    if (iosAction) iosAction.classList.remove('hidden');
    if (androidAction) androidAction.classList.add('hidden');
  } else {
    if (androidAction) androidAction.classList.remove('hidden');
  }

  // 🔥 Fallback: App khulne ke 5 second baad har haal mein premium sheet upar slide hogi!
  setTimeout(showBottomSheet, 5000);
});

// ==========================================
// 5. CLICKS & INSTALLATION ACTIONS 🛒
// ==========================================
if (headerInstallBtn) headerInstallBtn.addEventListener('click', showBottomSheet);
if (closeSheetBtn) closeSheetBtn.addEventListener('click', hideBottomSheet);
if (pwaBackdrop) pwaBackdrop.addEventListener('click', hideBottomSheet);

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
      // Premium custom notification/fallback logic bina irritating alert box ke
      hideBottomSheet();
      console.log("Direct prompt not supported or already triggered.");
    }
  });
}

// App successfully install hone ke baad sab saaf kar do
window.addEventListener('appinstalled', () => {
  console.log('🎉 Click & Collect App Installed successfully!');
  hideBottomSheet();
  if (headerInstallBtn) headerInstallBtn.classList.add('hidden');
});
