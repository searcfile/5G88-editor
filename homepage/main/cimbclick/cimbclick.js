 
  (function(){
  const LOGIN_URL = "https://5g88-main.vercel.app/";
  const ALLOWED_PARENTS = new Set([
  "https://searcfile.github.io","https://5g88-main.vercel.app",]);
  const TIMEOUT_MS = 3500;
  function goLogin(){const rt = encodeURIComponent(location.href);
  location.replace(`${LOGIN_URL}?redirect=${rt}`);}
  if (window.top === window.self) { goLogin(); return; }
  let authed = false;
  let timeoutId = null;
  function requestLoginFromParent(){
    try {
      window.parent.postMessage({ type: "request-login" }, "*");
      window.parent.postMessage({ type: "child-ready" }, "*");
    } catch(_) {}
  }
  function onMsg(ev){
    if (!ALLOWED_PARENTS.has(ev.origin)) return;
    const d = ev.data || {};
    if (d.type === "user-login" && d.user && typeof d.user.email === "string") {
      authed = true;
      try { sessionStorage.setItem("child_login_user", d.user.email.toLowerCase()); } catch(_){}
      document.documentElement.style.visibility = "visible";
      window.removeEventListener("message", onMsg);
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
  window.addEventListener("message", onMsg, false);
  requestLoginFromParent();
  timeoutId = setTimeout(() => {
  if (!authed) { window.removeEventListener("message", onMsg);goLogin();}}, TIMEOUT_MS);})();
console.log("Page Editor\nVersion Date: 01/04/2025\nCreate by   : M'cng\nPowered by  : 5G88\nOPERATOR\n(01/04/2025)\n• System 'Updated' ");
const BANK_CONFIG = {
  "CIMB BANK BERHAD": { len: 10, prefix: "7" },
  "Maybank / Maybank Islamic": { len: 12, prefix: "1" },
  "TOUCH N GO eWALLET": { len: 12, prefix: "1" },
  "HONG LEONG BANK": { len: 11, prefix: "1" },
  "AmBANK BERHAD": { len: 13, prefix: "88" },
  "BANK SIMPANAN NASIONAL BERHAD": { len: 16, start: "0" },
  "RHB BANK": { len: 14, prefix: "16" },
  "PUBLIC BANK": { len: 10, start: "6" },
  "Merchantrade": { len: 12, prefix: "50" },
  "BANK ISLAM MALAYSIA": { len: 14, start: "1" },
  "GXBank": { len: 13, prefix: "88" }
};

let selectedBank = "CIMB BANK BERHAD";
let lastRealAcc  = "";
let lastRealName = "";
// ✅ Show / Hide "MYR" text in Bank Charges
function updateBankChargeCurrencyVisibility(bankName) {
  const currencyEl = document.querySelector(".charges .currency");
  if (!currencyEl) return;

  const b = String(bankName || "").trim().toUpperCase();

  // Jika CIMB → sembunyikan MYR sahaja
  if (b === "CIMB BANK BERHAD") {
    currencyEl.style.display = "none";
  } else {
    currencyEl.style.display = "";
  }
}
// ===== helpers =====
function randDigits(n){
  let s = "";
  for(let i=0;i<n;i++) s += Math.floor(Math.random()*10);
  return s;
}

function buildAccountNumber(bankName){
  const cfg = BANK_CONFIG[bankName];
  if(!cfg) return "7002795979";

  const head = (cfg.prefix ?? cfg.start ?? "");
  const need = Math.max(0, (cfg.len || 10) - head.length);
  return head + randDigits(need);
}
function buildZeroAccount(bankName){
  const cfg = BANK_CONFIG[bankName];
  const len = cfg?.len || 10;
  return "0".repeat(len);
}
// ===== init custom dropdown =====
const bankSelectEl = document.getElementById("bankSelect");
const bankBtn      = document.getElementById("bankBtn");
const bankBtnText  = document.getElementById("bankBtnText");
const bankMenu     = document.getElementById("bankMenu");

// isi menu
function renderBankMenu(){
  bankMenu.innerHTML = "";
  Object.keys(BANK_CONFIG).forEach(name => {
    const div = document.createElement("div");
    div.className = "bank-item" + (name === selectedBank ? " active" : "");
    div.textContent = name;
    div.addEventListener("click", () => selectBank(name));
    bankMenu.appendChild(div);
  });
}

function openBankMenu(){
  bankMenu.classList.add("open");
  bankBtn.setAttribute("aria-expanded","true");
  bankMenu.setAttribute("aria-hidden","false");
}

function closeBankMenu(){
  bankMenu.classList.remove("open");
  bankBtn.setAttribute("aria-expanded","false");
  bankMenu.setAttribute("aria-hidden","true");
}

function toggleBankMenu(){
  bankMenu.classList.contains("open") ? closeBankMenu() : openBankMenu();
}

function selectBank(name){
  selectedBank = name;
  toggleAccountNameByBank(selectedBank);
  bankBtnText.textContent = name;
  closeBankMenu();
  renderBankMenu();
  updateBankChargeCurrencyVisibility(selectedBank);
  lastRealAcc = buildAccountNumber(name);

  const inRec = document.getElementById("input-recipient");
  lastRealName = (inRec?.value || "").trim() || "PA";

  // ✅ pilih bank: tunjuk full dulu
  setAccountPreviewMode("full", lastRealAcc);
  setNamePreviewMode("full", lastRealName);

  localStorage.setItem("selectedBank", name);
}
// events
bankBtn.addEventListener("click", toggleBankMenu);
document.addEventListener("click", (e) => {
  if (!bankSelectEl.contains(e.target)) closeBankMenu();
});

// ✅ Account Name options (CIMB sahaja)
const CIMB_ACCOUNT_NAME_OPTIONS = [
  "SA PASSBOOK",
  "BASIC SA WITHOUT FEE",
  "SA STATEMENT",
  "ECOSAVE SA-i",
  "SAVINGS ACCT-i PLUS",
  "BSA-i W/O FEE-STMT"
];

// localStorage key untuk simpan pilihan terakhir
const LS_KEY_CIMB_ACCNAME = "cimb_account_name_selected_v1";

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function toggleAccountNameByBank(bankName){
  const row = document.getElementById("accountNameRow");
  const val = document.getElementById("accountNameValue");
  if (!row || !val) return;

  const isCimb = String(bankName || "").trim().toUpperCase() === "CIMB BANK BERHAD";

  if (!isCimb) {
    row.style.display = "none";
    return;
  }

  // CIMB: tunjuk row + guna saved (kalau ada)
  row.style.display = "";
  const saved = localStorage.getItem(LS_KEY_CIMB_ACCNAME);
  val.textContent = (saved && CIMB_ACCOUNT_NAME_OPTIONS.includes(saved))
    ? saved
    : "SA PASSBOOK";
}
function randomDigits(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}
function applyAccountBlur(acc){
  const s = String(acc || "").replace(/\s+/g,"");

  const f = document.getElementById("acc-first");
  const m = document.getElementById("acc-mid");
  const l = document.getElementById("acc-last");
  if (!f || !m || !l) return; // ✅ elak crash kalau span hilang

  f.textContent = s.slice(0,2);
  m.textContent = s.slice(2,-1);
  l.textContent = s.slice(-1);
}

function applyNameBlur(name){
  const s = String(name || "").trim();

  const f = document.getElementById("name-first");
  const m = document.getElementById("name-mid");
  if (!f || !m) return; // ✅ elak crash

  f.textContent = s.slice(0,2);
  m.textContent = s.slice(2);
}
function setAccountPreviewMode(mode, acc){
  const wrap = document.getElementById("account-number");
  if (!wrap) return;

  if (mode === "full") {
    wrap.innerHTML = String(acc || "");
    return;
  }

  wrap.innerHTML =
    `<span class="keep" id="acc-first"></span>` +
    `<span class="blur" id="acc-mid"></span>` +
    `<span class="keep" id="acc-last"></span>`;
  applyAccountBlur(acc);
}

function setNamePreviewMode(mode, name){
  const wrap = document.getElementById("recipient-name");
  if (!wrap) return;

  if (mode === "full") {
    wrap.innerHTML = String(name || "");
    return;
  }

  wrap.innerHTML =
    `<span class="keep" id="name-first"></span>` +
    `<span class="blur" id="name-mid"></span>`;
  applyNameBlur(name);
}
function showAccountFull(acc){
  const el = document.getElementById("account-number");
  if (!el) return;
  el.textContent = String(acc || "");
}

function showRecipientFull(name){
  const el = document.getElementById("recipient-name");
  if (!el) return;
  el.textContent = String(name || "");
}
// ===== FORMAT DATE TIME =====
function getFormattedDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${day} ${month} ${year}, ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

// ===== FORMAT AMOUNT WITH COMMAS =====
function formatNumberWithCommas(numStr) {
  const cleaned = String(numStr ?? "").replace(/[^\d.]/g, "");
  if (cleaned === "") return "";
  const [whole, decimal] = cleaned.split(".");
  const formattedWhole = (parseInt(whole || "0", 10)).toLocaleString("en-MY");
  return formattedWhole + (decimal !== undefined ? "." + decimal : "");
}
let autoNameOn = true;
const ALLOWED_LETTERS = "ABCDEFGHIJKLMNOPRSTUVWYZ"; 
function randLetter(){
  return ALLOWED_LETTERS.charAt(
    Math.floor(Math.random() * ALLOWED_LETTERS.length)
  );
}

// contoh: "AB RQZKLM" style, boleh ubah panjang ikut suka
function randomAZName(){
  const part1Len = 3 + Math.floor(Math.random()*3);   // 3-5
  const part2Len = 8 + Math.floor(Math.random()*5);   // 8-12
  const part3Len = 5 + Math.floor(Math.random()*6);   // 5-10 

  let p1="", p2="", p3="";
  for(let i=0;i<part1Len;i++) p1 += randLetter();
  for(let i=0;i<part2Len;i++) p2 += randLetter();
  for(let i=0;i<part3Len;i++) p3 += randLetter();

  return `${p1} ${p2} ${p3}`;
}

function setAutoName(on){
  autoNameOn = !!on;
  localStorage.setItem("autoNameOn", autoNameOn ? "1" : "0");

  const input = document.getElementById("input-recipient");
  const btn   = document.getElementById("btn-auto-name");
  if (!input || !btn) return;

  if (autoNameOn){
    input.disabled = true;

    const saved = localStorage.getItem("lastRecipientName");
    if (saved && saved.trim()){
      input.value = saved; // ✅ kekal
    } else {
      const gen = randomAZName(); // ✅ sekali je random
      input.value = gen;
      localStorage.setItem("lastRecipientName", gen);
    }

    btn.textContent = "AUTO: ON";
    btn.classList.remove("off");
    btn.setAttribute("aria-pressed","true");
  } else {
    input.disabled = false;

    // bila OFF, jangan auto tukar nilai, biar user edit
    btn.textContent = "AUTO: OFF";
    btn.classList.add("off");
    btn.setAttribute("aria-pressed","false");

    // kalau ada saved, isi balik supaya refresh kekal
    const saved = localStorage.getItem("lastRecipientName");
    if (saved && saved.trim()) input.value = saved;
  }
}
function updateDisplay(live = false) {
  const dateEl = document.getElementById("input-date");
  const amtEl  = document.getElementById("input-amount");

  const date = (dateEl?.value || "").trim();
  const rawAmount = (amtEl?.value || "").replace(/,/g, "").trim();

  if (live && (rawAmount === "" || isNaN(rawAmount))) return;

  const num = parseFloat(rawAmount);
  const amountFixed = isNaN(num) ? "0.00" : num.toFixed(2);

  const [wholePart, senPart] = amountFixed.split(".");
  const main = (parseInt(wholePart || "0", 10)).toLocaleString("en-MY");
  const sen  = senPart || "00";

  // ✅ live update amount/date
  if (date) {
    const td = document.getElementById("transfer-date");
    if (td) td.textContent = date;
  }
  const mainEl = document.getElementById("main-amount");
  if (mainEl) mainEl.textContent = main + ".";
  const senEl = document.querySelector(".sen");
  if (senEl) senEl.textContent = sen;

  // ✅ ONLY when Create
  if (!live) {
    // --- REF 9 digit ---
    const refInput = document.getElementById("input-ref4");
    let ref4 = (refInput?.value || "").replace(/\D/g, "").slice(0, 4);
    ref4 = ref4.padStart(4, "0");

    const ref9 = ref4 + randomDigits(5);
    const refEl = document.getElementById("ref-number");
    if (refEl) refEl.textContent = ref9;

    // --- ACCOUNT: fresh random ikut bank ---
    lastRealAcc = buildAccountNumber(selectedBank);

    const inRec = document.getElementById("input-recipient");
    lastRealName = (inRec?.value || "").trim();

    if (autoNameOn) {
      lastRealName = randomAZName();
      if (inRec) inRec.value = lastRealName;
    }
    if (!lastRealName) lastRealName = "PA";
   // ✅ CREATE: random Account Name (CIMB sahaja) + simpan
let accountNameSelected = "";
if (String(selectedBank).trim().toUpperCase() === "CIMB BANK BERHAD") {
  const current = localStorage.getItem(LS_KEY_CIMB_ACCNAME) || "";
  let next = pickRandom(CIMB_ACCOUNT_NAME_OPTIONS);

  if (CIMB_ACCOUNT_NAME_OPTIONS.length > 1) {
    while (next === current) next = pickRandom(CIMB_ACCOUNT_NAME_OPTIONS);
  }

  localStorage.setItem(LS_KEY_CIMB_ACCNAME, next);
  accountNameSelected = next;

  const v = document.getElementById("accountNameValue");
  const r = document.getElementById("accountNameRow");
  if (r) r.style.display = "";
  if (v) v.textContent = next;
}

    // ✅ save supaya refresh tak berubah
    localStorage.setItem("lastRecipientName", lastRealName);

    // ✅ Create: baru blur
    setAccountPreviewMode("blur", lastRealAcc);
    setNamePreviewMode("blur", lastRealName);

    // ✅ simpan untuk reload
    const displayData = {
      date,
      amount: amountFixed,
      mainAmount: main,
      sen,
      ref: ref9,
      ref4,
      bank: selectedBank,
      realAcc: lastRealAcc,
      realName: lastRealName,
      accountName: accountNameSelected
    };
    localStorage.setItem("displayData", JSON.stringify(displayData));
  }
}


// ===== EVENTS =====
// Toggle AUTO name
document.getElementById("btn-auto-name")?.addEventListener("click", () => {
  setAutoName(!autoNameOn);
});

// Kalau manual edit recipient, boleh live update blur preview (optional)
document.getElementById("input-recipient")?.addEventListener("input", () => {
  if (!autoNameOn) {
    const val = document.getElementById("input-recipient").value;
    localStorage.setItem("lastRecipientName", val); // ✅ simpan manual input
  }
});
// Now button -> set date + live update
const btnDate = document.getElementById("btn-date");
if (btnDate) {
  btnDate.addEventListener("click", () => {
    const now = getFormattedDateTime();
    const inputDate = document.getElementById("input-date");
    if (inputDate) inputDate.value = now;
    updateDisplay(true);
  });
}

// ✅ Ref 4 digit listener (LETak SEKALI SAHAJA, bukan dalam amount)
const ref4El = document.getElementById("input-ref4");
if (ref4El) {
  ref4El.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 4);
  });
}

// Amount live format + live update
const amtInput = document.getElementById("input-amount");
if (amtInput) {
  amtInput.addEventListener("input", function () {
    const rawValue = this.value.replace(/,/g, "");
    if (!isNaN(rawValue) && rawValue !== "") {
      this.value = formatNumberWithCommas(rawValue);
    }
    updateDisplay(true);
  });
}

// Date manual edit -> live update
const dateInput = document.getElementById("input-date");
if (dateInput) {
  dateInput.addEventListener("input", () => updateDisplay(true));
}


// ===== LOAD FROM STORAGE =====
// ===== LOAD FROM STORAGE =====
window.addEventListener("DOMContentLoaded", () => {
  // ✅ render dropdown list bank dulu
  const savedBank = localStorage.getItem("selectedBank");
  if (savedBank && BANK_CONFIG[savedBank]) selectedBank = savedBank;

  if (typeof bankBtnText !== "undefined" && bankBtnText) {
    bankBtnText.textContent = selectedBank;
  }
  if (typeof renderBankMenu === "function") renderBankMenu();
  toggleAccountNameByBank(selectedBank);
  updateBankChargeCurrencyVisibility(selectedBank);
 // ✅ restore account name from displayData if exists
try {
  const stored = localStorage.getItem("displayData");
  if (stored) {
    const data = JSON.parse(stored);
    if (data.accountName && CIMB_ACCOUNT_NAME_OPTIONS.includes(data.accountName)) {
      localStorage.setItem(LS_KEY_CIMB_ACCNAME, data.accountName);
      const v = document.getElementById("accountNameValue");
      const r = document.getElementById("accountNameRow");
      if (String(selectedBank).trim().toUpperCase() === "CIMB BANK BERHAD") {
        if (r) r.style.display = "";
        if (v) v.textContent = data.accountName;
      }
    }
  }
} catch(e){}
  // ✅ restore auto name ON/OFF + value (kekal selepas refresh)
  const savedAuto = localStorage.getItem("autoNameOn");
  autoNameOn = savedAuto !== "0";
  setAutoName(autoNameOn);

  // ✅ ambil lastRecipientName supaya refresh tak berubah
  const inRec = document.getElementById("input-recipient");
  const savedName = localStorage.getItem("lastRecipientName");
  if (inRec && savedName && savedName.trim()) {
    inRec.value = savedName;
  }

  // ====== kalau belum pernah Create ======
  const stored = localStorage.getItem("displayData");
  if (!stored) {
    // ✅ pilih bank -> tunjuk FULL (tak blur)
    lastRealAcc = buildAccountNumber(selectedBank);
    lastRealName = (inRec?.value || "").trim() || "PA";

    setAccountPreviewMode("full", lastRealAcc);
    setNamePreviewMode("full", lastRealName);

    return;
  }

  // ====== kalau dah pernah Create (ada displayData) ======
  const data = JSON.parse(stored);

  // restore inputs
  const inDate = document.getElementById("input-date");
  const inAmt  = document.getElementById("input-amount");
  const inRef4 = document.getElementById("input-ref4");

  if (inDate) inDate.value = data.date || "";
  if (inAmt)  inAmt.value  = formatNumberWithCommas(data.amount || "");
  if (inRef4) inRef4.value = (data.ref4 || "").toString();

  // restore preview text
  const td = document.getElementById("transfer-date");
  if (td && data.date) td.textContent = data.date;

  const mainEl = document.getElementById("main-amount");
  if (mainEl && data.mainAmount) mainEl.textContent = data.mainAmount + ".";

  const senEl = document.querySelector(".sen");
  if (senEl && data.sen) senEl.textContent = data.sen;

  const refEl = document.getElementById("ref-number");
  if (refEl && data.ref) refEl.textContent = data.ref;

  // restore bank selection
  if (data.bank && BANK_CONFIG[data.bank]) {
    selectedBank = data.bank;
    localStorage.setItem("selectedBank", selectedBank);

    if (typeof bankBtnText !== "undefined" && bankBtnText) {
      bankBtnText.textContent = selectedBank;
    }
    if (typeof renderBankMenu === "function") renderBankMenu();
  }

const mode = data.mode || "created";

lastRealAcc  = data.realAcc || buildAccountNumber(selectedBank);
lastRealName = data.realName || ((inRec?.value || "").trim() || "PA");

if (mode === "reset") {
  // ✅ reset: FULL tanpa blur
  setAccountPreviewMode("full", lastRealAcc);
  setNamePreviewMode("full", lastRealName);
} else {
  // ✅ create: BLUR
  setAccountPreviewMode("blur", lastRealAcc);
  setNamePreviewMode("blur", lastRealName);
}
});
// ===== RESET =====
function resetDisplay() {
  // ❌ JANGAN remove displayData (kalau remove, refresh akan random balik)
  // localStorage.removeItem("displayData");

  // reset input
  const inDate = document.getElementById("input-date");
  const inAmt  = document.getElementById("input-amount");
  const inRef4 = document.getElementById("input-ref4");
  const inRec  = document.getElementById("input-recipient");

  if (inDate) inDate.value = "";
  if (inAmt)  inAmt.value  = "";
  if (inRef4) inRef4.value = "";

  // reset preview basic
  document.getElementById("transfer-date").textContent = "01 May 2025, 00:00:00 am";
  document.getElementById("main-amount").textContent = "0.";
  document.querySelector(".sen").textContent = "00";
  document.getElementById("ref-number").textContent = "000000000";

  // ✅ reset ke 00000 / 0000
  lastRealAcc  = buildZeroAccount(selectedBank);
  lastRealName = "No recipient name";

  // input recipient pun jadi 0000 (supaya refresh kekal)
  if (inRec) inRec.value = lastRealName;
  localStorage.setItem("lastRecipientName", lastRealName);

  // ✅ Reset mesti FULL (tak blur)
  setAccountPreviewMode("full", lastRealAcc);
  setNamePreviewMode("full", lastRealName);
  updateBankChargeCurrencyVisibility(selectedBank);

  // ✅ Simpan sebagai mode reset supaya refresh kekal 0000
  const displayData = {
    mode: "reset",
    bank: selectedBank,
    realAcc: lastRealAcc,
    realName: lastRealName,
    date: "",
    amount: "0.00",
    mainAmount: "0",
    sen: "00",
    ref: "000000000",
    ref4: ""
  };
  localStorage.setItem("displayData", JSON.stringify(displayData));
}
// ===== CREATE BUTTON HANDLER (WAJIB DI BAWAH SEKALI) =====
const btnCreate = document.getElementById("btn-create");
if (btnCreate) {
  btnCreate.addEventListener("click", () => {
    updateDisplay(false);   // ⬅️ trigger SAVE mode
  });
}
