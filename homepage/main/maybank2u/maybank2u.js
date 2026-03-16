 // ============================
    //  FULL RECEIPT BUILDER v1
    // ============================
    const LS_KEY = "receipt.builder.v1";
const BANK_CONFIG = {
  "CIMB BANK BERHAD": { len: 10, prefix: "7" },
  "Maybank / Maybank Islamic":{ len: 12, prefix: "1" },
  "TOUCH N GO eWALLET":{ len: 12, prefix: "1" },
  "HONG LEONG BANK": { len: 11, prefix: "1" },
  "AmBANK BERHAD": { len: 13, prefix: "88" },
  "BANK SIMPANAN NASIONAL BERHAD": { len: 16, start: "0" },
  "RHB BANK":{ len: 14, prefix: "16" },
  "PUBLIC BANK":{ len: 10, start: "6" },
  "Merchantrade":{ len: 12, start: "5" },
  "BANK ISLAM MALAYSIA":{ len: 14, start: "1" },
  "GXBANK": { len: 13, prefix: "88" }
};
    const DEFAULT_STATE = {
      bank: "Please Select",
      effectiveDate: "-------",
      amount: 100.00,
      amountText: "1000.00",
      refPrefix4: "8292",
      referenceId10: "-------",
      holderName: "-------",
      autoName: false,
      completedText: "-------",
      created: false,
      // store generated accounts per bank
      accountsByBank: {
        "CIMB BANK BERHAD": []
      },
      selectedAccountByBank: {}
    };

    // Elements
    const rowTxnType = document.getElementById("rowTxnType");
    const rowTransferMode = document.getElementById("rowTransferMode");
    const bankSelect   = document.getElementById("bankSelect");
    const dateInput    = document.getElementById("dateInput");
    const refPrefix    = document.getElementById("refPrefix");
    const amountInput  = document.getElementById("amountInput");
    const createBtn    = document.getElementById("createBtn");
    const resetBtn     = document.getElementById("resetBtn");

    const bankValue    = document.getElementById("bankValue");
    const dateValue    = document.getElementById("dateValue");
    const refValue     = document.getElementById("refValue");
    const accountNumber= document.getElementById("accountNumber");

    const holderNameTitle = document.getElementById("holderNameTitle");
    const topAmount    = document.getElementById("topAmount");
    const bottomAmount = document.getElementById("bottomAmount");
    const holderInput = document.getElementById("holderInput");
    const autoNameBtn = document.getElementById("autoNameBtn");
    const completedInput = document.getElementById("completedInput");
    const completedTextEl = document.getElementById("completedText");

    // Helpers
function rm(n){
  const v = Number(n || 0);
  return "RM " + format2(v); // ✅ akan jadi 1,000.00
}
    function formatMoneyInput(raw){
  raw = String(raw || "").replace(/,/g, "").trim();
  if(raw === "") return "";

  // keep digits + one dot
  raw = raw.replace(/[^\d.]/g, "");
  const parts = raw.split(".");
  const intPart = parts[0] || "0";
  const decPart = (parts[1] || "").slice(0, 2);

  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // kalau user sedang taip decimal
  if(parts.length > 1) return intFormatted + "." + decPart;

  return intFormatted;
}

function normalizeMoney(raw){
  const s = String(raw || "").replace(/,/g, "").trim();
  const v = Number(s);
  return isNaN(v) ? 0 : v;
}

function format2(v){
  return Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

   function formatToday(){
  const d = new Date();
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `Today ${String(d.getDate()).padStart(2,"0")} ${m[d.getMonth()]} ${d.getFullYear()}`;
}
    function formatCompletedNow(){
  const d = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const dayName = days[d.getDay()];
  const dd = String(d.getDate()).padStart(2,"0");
  const monthName = months[d.getMonth()];
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  const ss = String(d.getSeconds()).padStart(2,"0");

  return `${dayName} ${dd} ${monthName} ${yyyy} at ${hh}:${mm}:${ss}`;
}
    function onlyDigits(str){ return String(str || "").replace(/\D/g, ""); }

    function randomDigits(len){
      let out = "";
      for(let i=0;i<len;i++) out += Math.floor(Math.random()*10);
      return out;
    }

    function makeReferenceId(prefix4){
      const p = onlyDigits(prefix4).slice(0,4).padEnd(4, "0");
      return p + randomDigits(6);
    }
function getBankCfg(bank){
  return BANK_CONFIG[bank] || { len: 10, prefix: "" };
}

function makeAccountDigits(bank){
  const cfg = getBankCfg(bank);
  const len = cfg.len || 10;

  // ✅ prefix boleh 1-4 digit (atau lebih), akan kekal di depan
  let prefix = (cfg.prefix ?? cfg.start ?? "").toString().replace(/\D/g, "");
  if(prefix.length === 0){
    prefix = String(Math.floor(Math.random() * 9) + 1); // fallback 1-9
  }

  // kalau prefix lebih panjang dari len, potong
  if(prefix.length > len) prefix = prefix.slice(0, len);

  const remaining = Math.max(0, len - prefix.length);
  return prefix + randomDigits(remaining);
}

function genAccountsForBank(bank, count = 10){
  const cfg = getBankCfg(bank);
  const expectedLen = cfg.len || 10;

  const set = new Set();
  while(set.size < count){
    const acc = makeAccountDigits(bank);
    if(String(acc).length === expectedLen) set.add(acc);
  }
  return Array.from(set);
}
    function randLetter(){
  return String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
}

function randomWord(min=3, max=8){
  const len = Math.floor(Math.random() * (max - min + 1)) + min;
  let w = "";
  for(let i=0;i<len;i++) w += randLetter();
  return w;
}

function randomHolderName(){
  // contoh: 3-5 perkataan huruf besar semua
  const parts = Math.floor(Math.random()*3) + 3; // 3..5
  const arr = [];
  for(let i=0;i<parts;i++) arr.push(randomWord());
  return arr.join(" ");
}

    function saveState(s){
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    }

    function loadState(){
      try{
        const raw = localStorage.getItem(LS_KEY);
        if(!raw) return structuredClone(DEFAULT_STATE);
        const parsed = JSON.parse(raw);

        // merge with defaults to avoid missing keys
        return {
          ...structuredClone(DEFAULT_STATE),
          ...parsed,
          accountsByBank: { ...(structuredClone(DEFAULT_STATE).accountsByBank), ...(parsed.accountsByBank || {}) },
          selectedAccountByBank: { ...(parsed.selectedAccountByBank || {}) }
        };
      }catch(e){
        return structuredClone(DEFAULT_STATE);
      }
    }

    function setHolderMasked(isMasked, fullName){
      const name = fullName || "";
      if(!isMasked){
        holderNameTitle.textContent = name;
        return;
      }
      // show first 2 letters, rest blur
      const first2 = name.trim().slice(0,2) || "Ch";
      const rest   = name.trim().slice(2) || "";

      holderNameTitle.innerHTML =
        `<span class="maskWrap">
          <span class="maskFirst">${escapeHtml(first2)}</span>
          <span class="maskBlur">${escapeHtml(rest)}</span>
        </span>`;
    }

    function escapeHtml(s){
      return String(s)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }
function maskAccountFront2Back1(acc){
  const s = String(acc || "").trim();
  if(!s) return { head:"", mid:"", tail:"" };

  const head = s.slice(0, 2);      // 2 digit depan
  const tail = s.slice(-1);        // 1 digit belakang
  const mid  = s.slice(2, -1);     // yang tengah blur
  return { head, mid, tail };
}
function setAccountMasked(isMasked, acc){
  if(!isMasked){
    accountNumber.textContent = acc;
    return;
  }

  const m = maskAccountFront2Back1(acc);
  accountNumber.innerHTML =
    `<span class="maskWrap">
      <span class="maskFirst mono">${escapeHtml(m.head)}</span>
      <span class="maskBlur mono">${escapeHtml(m.mid)}</span>
      <span class="maskFirst mono">${escapeHtml(m.tail)}</span>
    </span>`;
}
function ensureAccountsForBank(state, bank){
  state.accountsByBank ||= {};
  state.selectedAccountByBank ||= {};

  const cfg = getBankCfg(bank);
  const expectedLen = cfg.len || 10;

  const list = state.accountsByBank[bank] || [];
  const badLen = list.some(a => String(a).length !== expectedLen);

  if(list.length !== 10 || badLen){
    state.accountsByBank[bank] = genAccountsForBank(bank, 10);
  }

  if(!state.selectedAccountByBank[bank]){
    state.selectedAccountByBank[bank] = state.accountsByBank[bank][0];
  }

  return state;
}

    function render(state){
      // Inputs
      bankSelect.value = state.bank;
      dateInput.value  = state.effectiveDate;
      refPrefix.value  = state.refPrefix4;
      amountInput.value = (state.amountText != null ? state.amountText : format2(state.amount));
      completedInput.value = state.completedText || "";
      
      holderInput.value = state.holderName || "";
      autoNameBtn.classList.toggle("on", !!state.autoName);
      autoNameBtn.textContent = state.autoName ? "Auto: ON" : "Auto: OFF";
      autoNameBtn.setAttribute("aria-pressed", state.autoName ? "true" : "false");

      // Receipt values
      bankValue.textContent = state.bank;
      dateValue.textContent = state.effectiveDate;

      topAmount.textContent = rm(state.amount);
      bottomAmount.textContent = rm(state.amount);

      refValue.textContent = state.referenceId10;
      completedTextEl.textContent = `Completed on ${state.completedText || ""}`;
      const isMaybank = state.bank === "Maybank / Maybank Islamic";

      // hide untuk Maybank sahaja
      if (rowTxnType) rowTxnType.style.display = isMaybank ? "none" : "";
      if (rowTransferMode) rowTransferMode.style.display = isMaybank ? "none" : "";

      // account number (from bank)
      state = ensureAccountsForBank(state, state.bank);
      const acc = state.selectedAccountByBank[state.bank];
      setAccountMasked(!!state.created, acc);

      // holder name mask only after Create
      setHolderMasked(!!state.created, state.holderName);

      saveState(state);
      return state;
    }

function initBanks(){
  const banks = Object.keys(BANK_CONFIG);

  // hidden select options
  bankSelect.innerHTML = banks
    .map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`)
    .join("");

  // custom UI elements
  const wrapEl  = document.getElementById("bankCSelect");
  const btnEl   = document.getElementById("bankCBtn");
  const labelEl = document.getElementById("bankCLabel");
  const menuEl  = document.getElementById("bankCMenu");

  function renderMenu(active){
    menuEl.innerHTML = "";
    banks.forEach(b => {
      const item = document.createElement("div");
      item.className = "cselect-item" + (b === active ? " active" : "");
      item.textContent = b;
      item.addEventListener("click", () => {
        bankSelect.value = b;
        bankSelect.dispatchEvent(new Event("change", { bubbles:true }));
        closeMenu();
      });
      menuEl.appendChild(item);
    });
  }

  function openMenu(){
    wrapEl.classList.add("open");
    btnEl.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    wrapEl.classList.remove("open");
    btnEl.setAttribute("aria-expanded","false");
  }

  btnEl.addEventListener("click", (e) => {
    e.preventDefault();
    wrapEl.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if(!wrapEl.contains(e.target)) closeMenu();
  });

  // sync label bila select berubah (render() akan set bankSelect.value)
  bankSelect.addEventListener("change", () => {
    labelEl.textContent = bankSelect.value || banks[0] || "Select bank";
    renderMenu(bankSelect.value);
  });

  // init label/menu
  labelEl.textContent = bankSelect.value || banks[0] || "Select bank";
  renderMenu(bankSelect.value || banks[0] || "");
}

// Live update amount/date/bank (but "mask name" only after Create)
function attachLiveHandlers(){

  bankSelect.addEventListener("change", () => {
    state.bank = bankSelect.value;

    // regenerate accounts when bank changed
    state = ensureAccountsForBank(state, state.bank);

    // pick random 1
    const list = state.accountsByBank[state.bank] || [];
    state.selectedAccountByBank[state.bank] = list[Math.floor(Math.random() * list.length)] || "";

    state.created = false; // switch bank -> uncreated view
    state = render(state);
  });

  dateInput.addEventListener("input", () => {
    state.effectiveDate = dateInput.value.trim() || DEFAULT_STATE.effectiveDate;
    state = render(state);
  });

  // ✅ Amount: auto comma on typing, keep editable
  amountInput.addEventListener("input", () => {
    const formatted = formatMoneyInput(amountInput.value);
    amountInput.value = formatted;

    state.amountText = formatted;
    state.amount = Math.max(0, normalizeMoney(formatted));

    // update receipt amounts without full render
    topAmount.textContent = rm(state.amount);
    bottomAmount.textContent = rm(state.amount);

    saveState(state);
  });

  // ✅ Amount: on blur, force 2 decimals + comma
  amountInput.addEventListener("blur", () => {
    state.amount = Math.max(0, normalizeMoney(amountInput.value));
    state.amountText = format2(state.amount);
    amountInput.value = state.amountText;

    topAmount.textContent = rm(state.amount);
    bottomAmount.textContent = rm(state.amount);

    saveState(state);
  });

  holderInput.addEventListener("input", () => {
    state.holderName = holderInput.value;
    state = render(state);
  });

  autoNameBtn.addEventListener("click", () => {
    state.autoName = !state.autoName;
    state = render(state);
  });

  completedInput.addEventListener("input", () => {
    state.completedText = completedInput.value.trim() || DEFAULT_STATE.completedText;
    state = render(state);
  });

  document.getElementById("nowBtn").addEventListener("click", () => {
    state.effectiveDate = formatToday();
    state.completedText = formatCompletedNow();
    state = render(state);
  });

  refPrefix.addEventListener("input", () => {
    const d = onlyDigits(refPrefix.value).slice(0,4);
    refPrefix.value = d;
    state.refPrefix4 = d || DEFAULT_STATE.refPrefix4;
    saveState(state);
  });

  createBtn.addEventListener("click", () => {
    // Build referenceId10
    state.referenceId10 = makeReferenceId(state.refPrefix4);

    // Ensure accounts exist
    state = ensureAccountsForBank(state, state.bank);

    // pick random account
    const list = state.accountsByBank[state.bank] || [];
    if(list.length){
      state.selectedAccountByBank[state.bank] = list[Math.floor(Math.random() * list.length)];
    }

    // auto name (if ON)
    if(state.autoName){
      state.holderName = randomHolderName();
      holderInput.value = state.holderName;
    }

    // ✅ sync + force format amount on create
    state.amount = Math.max(0, normalizeMoney(amountInput.value));
    state.amountText = format2(state.amount);
    amountInput.value = state.amountText;

    // completed now every create
    state.completedText = completedInput.value.trim() || state.completedText;

    state.created = true;
    state = render(state);
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(LS_KEY);
    state = structuredClone(DEFAULT_STATE);
    state = ensureAccountsForBank(state, state.bank);
    state = render(state);
  });
}

    // Boot
initBanks();
let state = loadState();

// ✅ penting: set value & trigger change supaya custom dropdown label/menu ikut state
bankSelect.value = state.bank;
bankSelect.dispatchEvent(new Event("change", { bubbles:true }));

state = ensureAccountsForBank(state, state.bank);
state = render(state);
attachLiveHandlers();
