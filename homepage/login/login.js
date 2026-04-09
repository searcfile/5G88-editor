let FP_PROMISE = null;

function initFingerprint(){
  if (FP_PROMISE) return FP_PROMISE;

  FP_PROMISE = (async () => {
    try{
      if (!window.FingerprintJS) return null;  // CDN tak load / blocked
      const fp  = await FingerprintJS.load();
      const res = await fp.get();
      return res?.visitorId || null;
    }catch(e){
      return null;
    }
  })();

  return FP_PROMISE;
}

// warm-up awal supaya masa klik login dah siap
document.addEventListener("DOMContentLoaded", () => {
  initFingerprint();
});
/* ====== Popup welcome ====== */
function closePopup(){ document.getElementById("popup").style.display="none"; }
window.addEventListener("click", (e) => {
  const overlay = document.getElementById("popup");
  if (e.target === overlay) overlay.style.display = "none";
});
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("popupBox")?.classList.add("zoom-in");
});

/* ====== Firebase Config ====== */
const firebaseConfig = {
  apiKey: "AIzaSyCZ9zUxDf3V9TvI3vOdgeZD7pLE4IuPrOE",
  authDomain: "logins-d615f.firebaseapp.com",
  databaseURL: "https://logins-d615f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "logins-d615f",
  storageBucket: "logins-d615f.appspot.com",
  messagingSenderId: "580872784703",
  appId: "1:580872784703:web:07957551c3214f3d32618a"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.database();
let turnstileVerifiedUser = false;
let turnstileVerifiedGoogle = false;

function onTurnstileSuccess(token){
  turnstileVerifiedUser = !!token;
  const btn = document.getElementById('btnUserpass');
  if (btn) btn.disabled = !turnstileVerifiedUser;
}

function onTurnstileExpired(){
  turnstileVerifiedUser = false;
  const btn = document.getElementById('btnUserpass');
  if (btn) btn.disabled = true;
}

function onTurnstileError(){
  turnstileVerifiedUser = false;
  const btn = document.getElementById('btnUserpass');
  if (btn) btn.disabled = true;
}

function onTurnstileGoogleSuccess(token){
  turnstileVerifiedGoogle = !!token;
  const btn = document.getElementById('googleLoginBtn');
  if (btn) btn.disabled = !turnstileVerifiedGoogle;
}

function onTurnstileGoogleExpired(){
  turnstileVerifiedGoogle = false;
  const btn = document.getElementById('googleLoginBtn');
  if (btn) btn.disabled = true;
}

function onTurnstileGoogleError(){
  turnstileVerifiedGoogle = false;
  const btn = document.getElementById('googleLoginBtn');
  if (btn) btn.disabled = true;
}
// ====== HANYA EMAIL DOMAIN INI YANG DIIJINKAN ======
const ALLOWED_GOOGLE_DOMAIN = 'b88gaming.page';

function isAllowedGoogleEmail(email){
  if (!email) return false;
  const parts = String(email).toLowerCase().split('@');
  const domain = parts[1] || '';
  return domain === ALLOWED_GOOGLE_DOMAIN;
}

function showUnsupportedDomainPopup(email){
  const msg = `
    <b>${email}</b> not supported!<br>
    Please contact admin 5G88 at Livechat/Telegram.<br>
  `;
  showBlockedPopup({ email, displayName: email.split('@')[0] }, msg);
}
  
let ANON_STATE = localStorage.getItem('anon.state') || 'unknown';
const sanitizeKey = (s) => String(s || '').replace(/[.$#[\]/]/g, "_");

function getOrCreateLocalGuest() {
  let uid = localStorage.getItem('guest.uid');
  if (!uid) {
    uid = 'g_' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    localStorage.setItem('guest.uid', uid);
  }
  if (!localStorage.getItem('guest.name')) {
    localStorage.setItem('guest.name', 'Guest-' + uid.slice(-5).toUpperCase());
  }
  return { uid, name: localStorage.getItem('guest.name') };
}

// --- Anonymous Auth + fallback lokal bila dinonaktifkan ---
async function ensureGuestAuth(){
  // kalau sudah tahu disabled, langsung pakai guest lokal (hindari call berulang & 400 di console)
  if (ANON_STATE === 'disabled') return getOrCreateLocalGuest();

  try{
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    if (!auth.currentUser) await auth.signInAnonymously();
    const u = auth.currentUser;
    if (u && u.isAnonymous){
      const code = (u.uid || '').slice(-5).toUpperCase();
      localStorage.setItem('guest.uid', u.uid);
      localStorage.setItem('guest.name', `Guest-${code}`);
      ANON_STATE = 'enabled';
      localStorage.setItem('anon.state','enabled');
      return { uid: u.uid, name: localStorage.getItem('guest.name') };
    }
  }catch(e){
    // project ini Anonymous Auth OFF → set flag dan pakai guest lokal
    if (e?.code === 'auth/admin-restricted-operation' || e?.code === 'auth/operation-not-allowed'){
      ANON_STATE = 'disabled';
      localStorage.setItem('anon.state','disabled');
      return getOrCreateLocalGuest();
    }
    // error lain → fallback juga
    return getOrCreateLocalGuest();
  }
  // jaga-jaga
  return getOrCreateLocalGuest();
}
/* ===== Helpers (dipakai lintas fitur, diletak di awal agar siap pakai) ===== */
const MAIN_PATH = "/main";
const LOGIN_PATH = "/login"; 
const toPseudoEmail = (uname) =>`${String(uname || '').trim().toLowerCase()}@5g88.local`;
function formatTimestamp(date){
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0');
  const hh=String(date.getHours()).padStart(2,'0'), mm=String(date.getMinutes()).padStart(2,'0'), ss=String(date.getSeconds()).padStart(2,'0');
  return `${y} - ${m} - ${d} ${hh}:${mm}:${ss}`;
}

/* ===== Forgot Password (final) ===== */
const PATH_RESET = 'password_reset_requests';
const USERNAME_INDEX = 'user_index/usernames';
// Elemen
const forgotOverlay = document.getElementById('forgotOverlay'); // gunakan class="blocked-overlay"
const forgotClose   = document.getElementById('forgotClose');
const forgotBtn     = document.getElementById('forgotBtn');
const fpCancel      = document.getElementById('fpCancel');
const fpRequest     = document.getElementById('fpRequest');
const fpUserInput   = document.getElementById('fpUsername');
const fpUserErr     = document.getElementById('fpUserErr');
const fpNote        = document.getElementById('fpNote');

// Utils
const _sanitizeUsername = (u)=> (u || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g,'');
function _clearFpErr(){ if(fpUserInput){ fpUserErr.style.display='none'; fpUserInput.classList.remove('invalid'); } }

// Open/close (pakai gaya "blocked")
function openForgot(){
  // tutup welcome kalau masih terbuka agar tidak dobel layer
  const welcome = document.getElementById('popup');
  if (welcome) welcome.style.display = 'none';

  if (forgotOverlay){
    if (forgotOverlay.classList.contains('blocked-overlay')) {
      forgotOverlay.classList.add('show');
    } else {
      // fallback jika belum ganti class di HTML
      forgotOverlay.style.display = 'flex';
    }
    forgotOverlay.removeAttribute('hidden');
    forgotOverlay.setAttribute('aria-hidden','false');
  }
  setTimeout(()=> fpUserInput?.focus(), 10);

  const esc = (e)=>{ if (e.key === 'Escape') closeForgot(); };
  document.addEventListener('keydown', esc, { once:true });
}
function closeForgot(){
  if (!forgotOverlay) return;
  if (forgotOverlay.classList.contains('blocked-overlay')){
    forgotOverlay.classList.remove('show');
  } else {
    forgotOverlay.style.display = 'none';
  }
  forgotOverlay.setAttribute('aria-hidden','true');
  forgotOverlay.setAttribute('hidden','');

  if (fpUserInput) fpUserInput.value = '';
  if (fpNote)      fpNote.value = '';
  _clearFpErr();
}

// Cek di RTDB dulu, Auth jadi fallback saja
async function usernameExists(uname){
  const u = _sanitizeUsername(uname);
  if (!u) return null;

  // 1) Cek index di RTDB (paling akurat & cepat)
  try{
    const snap = await db.ref(`${USERNAME_INDEX}/${u}`).once('value');
    const v = snap.val();
    if (v === true || v === 'true') return true;   // boolean true (atau string 'true')
  }catch(e){
    console.warn('index read failed:', e);
  }

  // 2) Fallback ke Auth; kalau tidak yakin → return null (jangan merah)
  try{
    const methods = await auth.fetchSignInMethodsForEmail(toPseudoEmail(u));
    return (Array.isArray(methods) && methods.includes('password')) ? true : null;
  }catch(e){
    console.warn('fetchSignInMethodsForEmail failed:', e?.code || e);
    return null; // unknown → jangan blok user
  }
}

// Event bindings
forgotBtn?.addEventListener('click', openForgot);
forgotClose?.addEventListener('click', closeForgot);
fpCancel?.addEventListener('click', closeForgot);
forgotOverlay?.addEventListener('click', (e)=>{ if (e.target === forgotOverlay) closeForgot(); });
fpUserInput?.addEventListener('input', _clearFpErr);

// Validasi on blur (render merah hanya jika yakin tidak ada)
fpUserInput?.addEventListener('blur', async () => {
  const u = _sanitizeUsername(fpUserInput.value);
  if (!u) return;
  const ok = await usernameExists(u); // true/false/null
  if (ok === false){
    fpUserErr.style.display = 'block';
    fpUserInput.classList.add('invalid');
  } else {
    _clearFpErr(); // ok===true atau null (unknown) → jangan merah
  }
});

// Submit request
fpRequest?.addEventListener('click', async () => {
  const u = _sanitizeUsername(fpUserInput.value);
  const note = (fpNote?.value || '').trim();
  if (!u){ fpUserInput?.focus(); return; }

  const ok = await usernameExists(u); // true/false/null
  if (ok === false){
    fpUserErr.style.display = 'block';
    fpUserInput.classList.add('invalid');
    return;
  }

  try{
    fpRequest.disabled = true;
    await db.ref(PATH_RESET).push({
      username: u,
      email: toPseudoEmail(u),
      note,
      createdAt: Date.now(),
      status: 'pending',
      verify: ok === true ? 'exists' : 'unknown',  // catat hasil verifikasi
      ua: navigator.userAgent
    });
    alert('Request successfully. New password will procces.');
    closeForgot();
  }catch(e){
    console.error(e);
    alert('Request error. Try again.');
  }finally{
    fpRequest.disabled = false;
  }
});

function showBlockedPopup(user, customSubHTML){
  const t = document.getElementById('blockedTitle');
  const s = document.getElementById('blockedSub') || document.querySelector('.blocked-sub');
  const infoEl = document.getElementById('blockedInfo');

  // Judul
  if (t) t.textContent = 'Access Denied';

  // Subteks:
  // - jika customSubHTML ada → pakai itu
  // - kalau tidak → pakai teks default "mistake/request access"
  if (s) {
    if (customSubHTML) {
      s.innerHTML = customSubHTML;
    } else {
      s.textContent = 'You need permission to access 5G88.';
    }
  }

  // Info user
  const email = user?.email || '';
  const name  = user?.displayName || user?.email?.split('@')?.[0] || '';
  if (infoEl){
    infoEl.innerHTML = `
      <div><strong>User:</strong> ${name || '—'}</div>
      <div><strong>Email:</strong> ${email || '—'}</div>
      <div style="margin-top:10px">If you believe this is a mistake, please contact admin to request access.</div>
    `;
  }

  // Tombol Telegram (biarkan seperti punyamu)
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn){
    contactBtn.textContent = 'Contact us on Telegram';
    contactBtn.href = 'https://t.me/Kiwi5G88';
    contactBtn.target = '_blank';
    contactBtn.rel = 'noopener';
    contactBtn.onclick = (e) => {
      e.preventDefault();
      const webLink = 'https://t.me/Kiwi5G88';
      const tgScheme = 'tg://resolve?domain=Kiwi5G88';
      const androidIntent =
        'intent://resolve?domain=Kiwi5G88#Intent;scheme=tg;package=org.telegram.messenger;'
        + 'S.browser_fallback_url=' + encodeURIComponent(webLink) + ';end';
      const ua = navigator.userAgent;
      if (/Android/i.test(ua)) { window.location.href = androidIntent; return; }
      if (/iPhone|iPad|iPod/i.test(ua)) {
        let done=false; const t=setTimeout(()=>{ if(!done){done=true; window.location.href=webLink;} },800);
        window.location.href = tgScheme;
        window.addEventListener('pagehide', ()=>{ done=true; clearTimeout(t); }, {once:true});
        return;
      }
      window.open(webLink,'_blank','noopener');
    };
  }

  // Tampilkan overlay
  const overlay = document.getElementById('blockedPopup');
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
  overlay.querySelector('.blocked-box')?.focus();
  const escHandler = (e)=>{ if(e.key==='Escape'){ hideBlockedPopup(); } };
  document.addEventListener('keydown', escHandler, { once:true });
}
function hideBlockedPopup(){
  const overlay = document.getElementById('blockedPopup');
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden','true');
}

function getFallbackDeviceId(){
  // fallback paling stabil: simpan localStorage per device
  let id = localStorage.getItem("fallbackDeviceId");
  if (!id){
    id = "fb_" + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    localStorage.setItem("fallbackDeviceId", id);
  }
  return id;
}

async function getVisitorId(){
  const fpId = await initFingerprint(); // dari preload
  if (fpId) return fpId;

  // kalau FingerprintJS blocked → jangan bagi "unknown"
  return getFallbackDeviceId();
}

function getBrowserName(){
  const ua = navigator.userAgent || "";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua)) return "Safari";
  return "Unknown";
}
async function deactivatePreviousGuest(){
  try{
    const oldGuestUid = localStorage.getItem("guest.uid");
    if (!oldGuestUid) return;

    const oldGuestKey = sanitizeKey(oldGuestUid);

    // tandakan guest lama offline
    await db.ref("users/" + oldGuestKey).update({
      online: false,
      lastSeen: Date.now()
    }).catch(()=>{});

    // optional fallback kalau kau ada simpan guest presence di node lain
    await db.ref("guest_online/" + oldGuestKey).update({
      online: false,
      lastSeen: Date.now()
    }).catch(()=>{});

  }catch(err){
    console.log("deactivatePreviousGuest error:", err);
  }

  try {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      await auth.signOut();
    }
  } catch(err){
    console.log("anonymous signOut error:", err);
  }

  try { localStorage.removeItem("guest.uid"); } catch {}
  try { localStorage.removeItem("guest.name"); } catch {}
}
async function finishLogin(userLike){
  const email = userLike.email;
  const name  = userLike.displayName || email.split('@')[0];
  const photo = userLike.photoURL || "";
  const emailKey = sanitizeKey(email.toLowerCase());

  // ✅ ambil device fingerprint + browser
const fpId = await initFingerprint();
const deviceId = fpId || getFallbackDeviceId();
const deviceSource = fpId ? "fingerprintjs" : "fallback";
const browser  = getBrowserName();
await deactivatePreviousGuest();
  
  db.ref("logins/blocked_users/" + emailKey).once("value").then(async snap=>{
    const isBlocked = snap.val();
    if (isBlocked === true){
      showBlockedPopup(userLike);
      auth.signOut().catch(()=>{});
      setLoading(false);
      return;
    }

    // ✅ simpan sekali deviceId
    db.ref("logins/" + emailKey).set({
      name,
      email,
      loginAt: formatTimestamp(new Date()),

      // ✅ NEW
      deviceId,
      deviceSource,
      browser,
      ua: navigator.userAgent || "",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    }).then(()=>{
      localStorage.setItem("gmailLogin", JSON.stringify({ name, email, photo }));

      // Optional: simpan deviceId juga dalam localStorage kalau kau nak guna di tempat lain
      localStorage.setItem("deviceId", deviceId);

      const q = new URLSearchParams({ name, email, photo }).toString();
      window.location.href = `${MAIN_PATH}?${q}`;
    }).catch(err=>{
      console.error("❌ Gagal simpan ke Firebase:", err);
      alert("Gagal simpan data login. Coba lagi.");
      setLoading(false);
    });
  });
}

function setLoading(state, which='both'){
  const btnG = document.getElementById('googleLoginBtn');
  const btnU = document.getElementById('btnUserpass');
  if (which==='google' || which==='both'){
    if (btnG){ btnG.disabled = !!state; btnG.textContent = state ? "Logging in..." : "Login with Google"; }
  }
  if (which==='userpass' || which==='both'){
    if (btnU){ btnU.disabled = !!state; btnU.textContent = state ? "Logging in..." : "Login"; }
  }
}

function signInWithGoogle(){
  if (!turnstileVerifiedGoogle){
    alert("Sila complete verification dulu.");
    return;
  }

  setLoading(true,'google');
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(res => {
      const user = res.user;
      if (!user || !user.email) throw new Error("User not found");

      // ✅ CEK DOMAIN
      if (!isAllowedGoogleEmail(user.email)) {
        // tampilkan popup blocked + pesan khusus
        showUnsupportedDomainPopup(user.email);

        // pastikan tidak lanjut menulis ke RTDB / redirect
        auth.signOut().catch(()=>{});
        setLoading(false,'google');
        return; // ⛔ stop flow di sini
      }

      // ✅ email domain diizinkan → lanjut flow normal
      finishLogin(user);
    })
    .catch(err => {
  console.error("❌ Login Google gagal:", err);
  alert("Login Google gagal. Coba lagi.");
  setLoading(false,'google');

  turnstileVerifiedGoogle = false;
  const btn = document.getElementById('googleLoginBtn');
  if (btn) btn.disabled = true;

  if (window.turnstile) {
    const widgetEl = document.querySelector('#form-google .cf-turnstile');
    if (widgetEl) turnstile.reset(widgetEl);
  }
});
}

// --- helper hash (taruh sekali saja, di luar fungsi kalau belum ada) ---
async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

// --- LOGIN VIA REALTIME DB ---
async function loginWithUsername(){
  const uname = String(document.getElementById('username').value || '').trim().toLowerCase();
  const pass  = String(document.getElementById('password').value || '');

  if (!uname || !pass){
    alert("Masukkan username dan password.");
    return;
  }

  if (!turnstileVerifiedUser){
    alert("Sila complete verification dulu.");
    return;
  }

  setLoading(true,'userpass');

  try{
    // 1️⃣ Ambil akun dari RTDB
    const snap = await db.ref(`logins/user_accounts/${uname}`).get();
    if (!snap.exists()) throw new Error("Akun tidak ditemukan.");
    const acc = snap.val();
    if (acc.active === false) throw new Error("Akun dinonaktifkan.");

    // 2️⃣ Hash password input dan cocokkan
    const inputHash = await sha256Hex(pass);
    if (inputHash !== acc.passwordHash) throw new Error("Password salah.");

    // 3️⃣ Wajib: sign-in anonymous supaya rules 'auth != null' lolos
    await ensureGuestAuth();

    // 4️⃣ Ambil pseudo-email untuk sistem login
    const pseudoEmail = `${uname}@5g88.local`;

    // 5️⃣ Simpan log & redirect
    await finishLogin({ email: pseudoEmail, displayName: uname, photoURL: "" });

 }catch(err){
  alert(err.message || "Login gagal. Coba lagi.");

  turnstileVerifiedUser = false;
  const btn = document.getElementById('btnUserpass');
  if (btn) btn.disabled = true;

  if (window.turnstile) {
    const widgetEl = document.querySelector('#form-userpass .cf-turnstile');
    if (widgetEl) turnstile.reset(widgetEl);
  }
}finally{
  setLoading(false,'userpass');
}
}
// Optional createAccount (tetap sama)
async function createAccount(){
  const uname = String(document.getElementById('username').value || '').trim();
  const pass  = String(document.getElementById('password').value || '');
  if (!uname || !pass){ alert("Masukkan username & password."); return; }
  const email = toPseudoEmail(uname);
  try{
    setLoading(true,'userpass');
    await auth.createUserWithEmailAndPassword(email, pass);
    finishLogin({ email, displayName: uname, photoURL:"" });
  }catch(e){
    console.error("Create user gagal:", e);
    alert(e?.message || "Gagal membuat akaun.");
    setLoading(false,'userpass');
  }
}

/* ===== Password eye ===== */
const EYE_SHOW = "M942.2 486.2C847.4 333.5 693.7 256 512 256S176.6 333.5 81.8 486.2a47.8 47.8 0 000 51.6C176.6 690.5 330.3 768 512 768s335.4-77.5 430.2-230.2a47.8 47.8 0 000-51.6zM512 704c-153.3 0-286.3-68.2-368-192 81.7-123.8 214.7-192 368-192s286.3 68.2 368 192c-81.7 123.8-214.7 192-368 192zm0-320a128 128 0 10128 128 128 128 0 00-128-128zm0 208a80 80 0 1180-80 80 80 0 01-80 80z";
const EYE_HIDE = "M149.3 126.2L120.4 155l145.7 145.7C207.1 345.6 157 409.6 124.5 469.8a43.42 43.42 0 000 41.4C214.6 679.9 350.5 784 512 784c63.5 0 123.8-16.1 177.8-44.7L847 896.5l28.8-28.8-726.5-741.5zM512 720c-136.8 0-252.1-72.2-334.3-188C224.6 447.3 289.2 390 367 357.3l52.8 52.8A127.2 127.2 0 00384 512c0 70.7 57.3 128 128 128 38 0 72.2-16.6 95.7-43l46.1 46.1A304.5 304.5 0 01512 720zm0-464c161.5 0 297.4 104.1 387.5 272.8a43.42 43.42 0 010 41.4 560.3 560.3 0 01-89.2 115.4l-45.3-45.3A503.7 503.7 0 00846.3 512C764.1 396.2 648.8 324 512 324c-48.3 0-94.8 9-137.6 25.6l-50.3-50.3A372.7 372.7 0 01512 256zm0 128c70.7 0 128 57.3 128 128 0 19.1-4.2 37.2-11.7 53.4l-41.9-41.9c.9-3.8 1.6-7.6 1.6-11.5 0-42.3-34.3-76.6-76.6-76.6-3.9 0-7.7.7-11.5 1.6L458 395.1A127.6 127.6 0 01512 384z";

function togglePassword(){
  const input = document.getElementById('password');
  const btn   = document.getElementById('eyeBtn');
  const path  = document.getElementById('eyePath');
  const isHidden = btn.dataset.state !== 'show';
  if (isHidden){
    input.type = 'text'; btn.dataset.state = 'show';
    btn.setAttribute('aria-pressed','true'); btn.setAttribute('aria-label','Hide password');
    path.setAttribute('d', EYE_HIDE);
  } else {
    input.type = 'password'; btn.dataset.state = 'hide';
    btn.setAttribute('aria-pressed','false'); btn.setAttribute('aria-label','Show password');
    path.setAttribute('d', EYE_SHOW);
  }
}
(function addHoldToPeek(){
  const input = document.getElementById('password');
  const btn   = document.getElementById('eyeBtn');
  let holding = false;
  btn.addEventListener('mousedown', ()=>{ holding=true; input.type='text'; });
  btn.addEventListener('mouseup',   ()=>{ if(holding){ holding=false; if(btn.dataset.state!=='show') input.type='password'; }});
  btn.addEventListener('mouseleave',()=>{ if(holding){ holding=false; if(btn.dataset.state!=='show') input.type='password'; }});
  btn.addEventListener('touchstart', ()=>{ input.type='text'; }, {passive:true});
  btn.addEventListener('touchend',   ()=>{ if(btn.dataset.state!=='show') input.type='password'; });
})();

/* ===== Misc ===== */
(function preventDoubleSubmit(){
  const form = document.getElementById('form-userpass');
  if (!form) return;
  let busy = false;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if (busy) return;
    busy = true;
    try { await loginWithUsername(); } finally { busy = false; }
  });
})();
const tabUser = document.getElementById('tab-userpass');
const tabGoo  = document.getElementById('tab-google');
const formUser= document.getElementById('form-userpass');
const formGoo = document.getElementById('form-google');
tabUser?.addEventListener('click', ()=>{ tabUser.classList.add('active'); tabGoo.classList.remove('active'); formUser.classList.add('active'); formGoo.classList.remove('active'); });
tabGoo?.addEventListener('click', ()=>{ tabGoo.classList.add('active'); tabUser.classList.remove('active'); formGoo.classList.add('active'); formUser.classList.remove('active'); });

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("googleLoginBtn")?.addEventListener("click", signInWithGoogle);
  document.getElementById('eyeBtn')?.addEventListener('click', togglePassword);

setTimeout(async () => {
  try{
    let gl = null;
    try { gl = JSON.parse(localStorage.getItem("gmailLogin") || "null"); } catch {}

    if (!gl?.email) {
      await ensureGuestAuth();
    }

    if (!lcLoaded && lcFrame) {
      lcFrame.src = LC_URL;
      lcFrame.addEventListener("load", async () => {
        lcLoaded = true;

        let gl2 = null;
        try { gl2 = JSON.parse(localStorage.getItem("gmailLogin") || "null"); } catch {}

        if (!gl2?.email) {
          await ensureGuestAuth();
        }

        postIdentityToChat();
        setTimeout(postIdentityToChat, 300);

        requestLivechatUnreadCount();
        setTimeout(requestLivechatUnreadCount, 500);
        setTimeout(requestLivechatUnreadCount, 1200);
      }, { once:true });
    } else {
      requestLivechatUnreadCount();
    }
  }catch(err){
    console.log("Livechat preload failed:", err);
  }
}, 600);
});
  // ====== CONFIG ======
  const LC_ICON_OPEN = "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z";
  const LC_ICON_CLOSE = "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z";
  const LC_URL = "https://5g88-main.vercel.app/main/livechat";   // URL app livechat kamu
  const LC_ORIGIN = new URL(LC_URL).origin;

  // ====== Elemen ======
const lcWrap   = document.getElementById("lcWrap");
const lcToggle = document.getElementById("lcToggle");
const lcPanel  = document.getElementById("lcPanel");
const lcFrame  = document.getElementById("lcFrame");
const lcBadge  = document.getElementById("lcBadge");
const lcIcon   = document.getElementById("lcIcon");
const lcIconPath = document.getElementById("lcIconPath");

let lcUnreadCount = 0;
let lcLoaded = false;
let lcPinnedOpen = false;     // buka sebab klik
let lcHovering = false;       // mouse sedang atas button/panel
let lcCloseTimer = null;

function updateLiveChatButton(isOpen){
  if (!lcToggle || !lcIcon || !lcIconPath) return;

  if (isOpen){
    lcIcon.setAttribute("viewBox", "0 0 1024 1024");
    lcIconPath.setAttribute("d", LC_ICON_CLOSE);
    lcToggle.setAttribute("aria-label", "Close live chat");
    lcToggle.setAttribute("aria-expanded", "true");
  } else {
    lcIcon.setAttribute("viewBox", "0 0 24 24");
    lcIconPath.setAttribute("d", LC_ICON_OPEN);
    lcToggle.setAttribute("aria-label", "Open live chat");
    lcToggle.setAttribute("aria-expanded", "false");
  }
}
function renderLivechatBadge(count){
  if (!lcBadge) return;

  const safeCount = Math.max(0, Number(count) || 0);
  lcUnreadCount = safeCount;

  try {
    localStorage.setItem("login.livechatUnreadCount", String(safeCount));
  } catch {}

  if (safeCount <= 0){
    lcBadge.textContent = "0";
    lcBadge.classList.remove("show");
    return;
  }

  lcBadge.textContent = safeCount > 99 ? "99+" : String(safeCount);
  lcBadge.classList.add("show");
}
async function openLiveChat() {
  if (!lcPanel || !lcToggle) return;

  lcPanel.classList.add("active");
  lcPanel.setAttribute("aria-hidden", "false");
  updateLiveChatButton(true);

  await ensureGuestAuth();

  if (!lcLoaded) {
    lcFrame.src = LC_URL;
    lcFrame.addEventListener("load", async () => {
      lcLoaded = true;
      await ensureGuestAuth();

      postIdentityToChat();
      setTimeout(postIdentityToChat, 300);

      requestLivechatUnreadCount();
      setTimeout(requestLivechatUnreadCount, 500);
      setTimeout(requestLivechatUnreadCount, 1200);
    }, { once: true });
  } else {
    postIdentityToChat();
    requestLivechatUnreadCount();
  }
}

function closeLiveChat() {
  if (!lcPanel || !lcToggle) return;

  lcPanel.classList.remove("active");
  lcPanel.setAttribute("aria-hidden", "true");
  updateLiveChatButton(false);
}

// ===== CREATE ACCOUNT POPUP =====
const createOverlay = document.getElementById('createOverlay');
const createBtn     = document.getElementById('createBtn');
const createClose   = document.getElementById('createClose');
const createCancel  = document.getElementById('createCancel');
const createNow     = document.getElementById('createNow');

function openCreate(){
  closeLiveChat();
  const welcome = document.getElementById('popup');
  if (welcome) welcome.style.display = 'none';

  if (createOverlay){
    createOverlay.classList.add('show');
    createOverlay.setAttribute('aria-hidden','false');
    // fokus ke dialog untuk aksesibilitas
    const box = createOverlay.querySelector('.blocked-box');
    box && box.focus();
  }
  const esc = (e)=>{ if (e.key === 'Escape') closeCreate(); };
  document.addEventListener('keydown', esc, { once:true });
}

function closeCreate(){
  if (!createOverlay) return;
  createOverlay.classList.remove('show');
  createOverlay.setAttribute('aria-hidden','true');
}

// Bind events
createBtn?.addEventListener('click', openCreate);
createClose?.addEventListener('click', closeCreate);
createCancel?.addEventListener('click', closeCreate);
// klik luar kotak untuk tutup
createOverlay?.addEventListener('click', (e)=>{ if (e.target === createOverlay) closeCreate(); });

// Create Now: tutup popup lalu buka livechat
createNow?.addEventListener('click', () => {
  closeCreate();
  // pastikan livechat terbuka
  openLiveChat();
});
  auth.onAuthStateChanged(() => {
  if (lcPanel?.classList.contains("active")) {
    postIdentityToChat();
  }
});


function getPrechatUser(){
  // 1) Sudah login normal (bukan anonymous)
  const cu = auth.currentUser;
  if (cu && !cu.isAnonymous) {
    return {
      name: cu.displayName || cu.email || 'User',
      email: cu.email || '',
      photo: cu.photoURL || '',
      uid: null,
      isGuest: false
    };
  }

  // 2) Cache Google di localStorage
  try {
    const gl = JSON.parse(localStorage.getItem("gmailLogin") || "{}");
    if (gl?.email) {
      return { name: gl.name || gl.email, email: gl.email, photo: gl.photo || "", uid: null, isGuest: false };
    }
  } catch {}

  // 3) Anonymous Auth (punya UID Firebase)
  if (cu && cu.isAnonymous){
    const code = (cu.uid || '').slice(-5).toUpperCase();
    return {
      name: localStorage.getItem('guest.name') || `Guest-${code}`,
      email: "",
      photo: "",
      uid: cu.uid,
      isGuest: true
    };
  }

  // 4) **Fallback PASTI**: pakai UID lokal per-device
  const g = getOrCreateLocalGuest();
  return { name: g.name, email: "", photo: "", uid: g.uid, isGuest: true };
}

  function postIdentityToChat(){
    if (!lcFrame?.contentWindow) return;
    const u = getPrechatUser();
    lcFrame.contentWindow.postMessage({ type: "user-login", user: u }, LC_ORIGIN);
  }
function requestLivechatUnreadCount(){
  if (!lcFrame?.contentWindow) return;

  const u = getPrechatUser();

  lcFrame.contentWindow.postMessage({
    type: "request-livechat-unread-count",
    user: u
  }, LC_ORIGIN);
}
lcToggle?.addEventListener("click", async (e) => {
  e.stopPropagation();

  const isOpen = lcPanel.classList.contains("active");

  if (isOpen && lcPinnedOpen) {
    lcPinnedOpen = false;
    closeLiveChat();
  } else {
    lcPinnedOpen = true;
    await openLiveChat();
  }
});
function isDesktopHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function scheduleCloseLiveChat() {
  clearTimeout(lcCloseTimer);

  lcCloseTimer = setTimeout(() => {
    if (!lcPinnedOpen && !lcHovering) {
      closeLiveChat();
    }
  }, 180);
}
lcToggle?.addEventListener("mouseenter", async () => {
  if (!isDesktopHover()) return;

  lcHovering = true;
  clearTimeout(lcCloseTimer);

  if (!lcPinnedOpen) {
    await openLiveChat();
  }
});

lcToggle?.addEventListener("mouseleave", () => {
  if (!isDesktopHover()) return;

  lcHovering = false;
  scheduleCloseLiveChat();
});

lcPanel?.addEventListener("mouseenter", () => {
  if (!isDesktopHover()) return;

  lcHovering = true;
  clearTimeout(lcCloseTimer);
});

lcPanel?.addEventListener("mouseleave", () => {
  if (!isDesktopHover()) return;

  lcHovering = false;
  scheduleCloseLiveChat();
});
document.addEventListener("click", (e) => {
  const target = e.target;

  if (!lcWrap) return;

  if (!lcWrap.contains(target)) {
    lcPinnedOpen = false;
    lcHovering = false;
    closeLiveChat();
  }
});
updateLiveChatButton(false);
try {
  const savedUnread = Number(localStorage.getItem("login.livechatUnreadCount") || 0);
  if (savedUnread > 0) {
    renderLivechatBadge(savedUnread);
  }
} catch {}
document.getElementById("username")?.addEventListener("blur", () => {
  if (lcPanel.classList.contains("active")) {
    postIdentityToChat();
  }
});

  // ====== Notifikasi dari iframe -> tampilkan dot merah ======
const livechatSound = document.getElementById("livechatSound");
let lastSoundTime = 0;

window.addEventListener("message", (e) => {
  if (e.origin !== LC_ORIGIN) return;
  const data = e.data || {};

  if (data.action === "livechat-unread-count") {
    renderLivechatBadge(data.count || 0);

    const now = Date.now();
    if ((Number(data.count) || 0) > 0 && livechatSound && now - lastSoundTime > 1500) {
      livechatSound.currentTime = 0;
      livechatSound.play().catch((err) => {
        console.log("Autoplay sound blocked:", err);
      });
      lastSoundTime = now;
    }
    return;
  }

  if (data.action === "show-livechat-notif") {
    renderLivechatBadge(Math.max(1, lcUnreadCount + 1));

    const now = Date.now();
    if (livechatSound && now - lastSoundTime > 1500) {
      livechatSound.currentTime = 0;
      livechatSound.play().catch((err) => {
        console.log("Autoplay sound blocked:", err);
      });
      lastSoundTime = now;
    }
    return;
  }

  if (data.action === "hide-livechat-notif") {
    const isManualOpen =
      lcPinnedOpen === true &&
      lcPanel &&
      lcPanel.classList.contains("active");

    if (isManualOpen) {
      renderLivechatBadge(0);
    }
    return;
  }
});
// ✅ LOGIN PAGE GUARD (letak paling bawah sekali)
(function loginPageGuard(){
  const path = location.pathname;
  if (!path.startsWith("/login")) return;

  let gl = null;
  try { gl = JSON.parse(localStorage.getItem("gmailLogin") || "null"); } catch {}

  if (gl?.email){
    try { localStorage.removeItem("guest.uid"); } catch {}
    try { localStorage.removeItem("guest.name"); } catch {}
    location.replace("/main");
  }
})();
(function () {
  const THEME_KEY = "siteTheme";

  function applyChildTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "light" ? "light-theme" : "dark-theme");
  }

  applyChildTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");

  window.addEventListener("message", function (e) {
    const allowedOrigins = [
      "https://5g88-main.vercel.app",
      "https://searcfile.github.io"
    ];
    if (!allowedOrigins.includes(e.origin)) return;

    const data = e.data || {};
    if (data.type === "theme-change") {
      const theme = data.theme === "dark" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, theme);
      applyChildTheme(theme);
    }
  });
})();
