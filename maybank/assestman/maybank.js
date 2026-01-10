/* ==========================
   LOGIN GUARD (iframe only)
   ========================== */
(function () {
  const LOGIN_URL = "https://5g88-login.vercel.app/";
  const ALLOWED_PARENTS = new Set([
    "https://searcfile.github.io",
    "https://5g88-main.vercel.app",
  ]);
  const TIMEOUT_MS = 3500;

  function goLogin() {
    const rt = encodeURIComponent(location.href);
    location.replace(`${LOGIN_URL}?redirect=${rt}`);
  }

  // If opened directly (not in iframe) -> go login
  if (window.top === window.self) {
    goLogin();
    return;
  }

  let authed = false;
  let timeoutId = null;

  function requestLoginFromParent() {
    try {
      window.parent.postMessage({ type: "request-login" }, "*");
      window.parent.postMessage({ type: "child-ready" }, "*");
    } catch (_) {}
  }

  function onMsg(ev) {
    if (!ALLOWED_PARENTS.has(ev.origin)) return;
    const d = ev.data || {};
    if (d.type === "user-login" && d.user && typeof d.user.email === "string") {
      authed = true;
      try {
        sessionStorage.setItem("child_login_user", d.user.email.toLowerCase());
      } catch (_) {}

      document.documentElement.style.visibility = "visible";
      window.removeEventListener("message", onMsg);
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  window.addEventListener("message", onMsg, false);
  requestLoginFromParent();

  timeoutId = setTimeout(() => {
    if (!authed) {
      window.removeEventListener("message", onMsg);
      goLogin();
    }
  }, TIMEOUT_MS);
})();

/* ==========================
   LOCK DEVTOOLS SHORTCUTS
   ========================== */


console.log(
  "Page Editor\nVersion Date: 01/04/2025\nCreate by   : M'cng\nPowered by  : 5G88\nOPERATOR\n(01/04/2025)\n• System 'Updated' "
);

/* =======================
   STATE: save / load
   ======================= */
let counter = 0;
const STORE_KEY = "maybankEditor.v1";

function $(id) {
  return document.getElementById(id);
}

function readUIState() {
  return {
    counter,
    inRef: $("inRef")?.value || "",
    inDate: $("inDate")?.value || "",
    dd: $("dd")?.value || "",
    mm: $("mm")?.value || "",
    yyyy: $("yyyy")?.value || "",
    hh: $("hh")?.value || "",
    ii: $("ii")?.value || "",
    ss: $("ss")?.value || "",
    inAmount: $("inAmount")?.value || "",
    refDisp: $("ref")?.textContent || "",
    dateDisp: $("date")?.textContent || "",
    amtDisp: $("amount")?.textContent || "",
  };
}

function writeUIState(s) {
  if (!s) return;
  counter = Number(s.counter) || 0;

  if ($("inRef")) $("inRef").value = s.inRef ?? "";
  if ($("inDate")) $("inDate").value = s.inDate ?? "01 Jun 2024 00:00:00";
  if ($("dd")) $("dd").value = s.dd ?? "01";
  if ($("mm")) $("mm").value = s.mm ?? "Jun";
  if ($("yyyy")) $("yyyy").value = s.yyyy ?? "2024";
  if ($("hh")) $("hh").value = s.hh ?? "00";
  if ($("ii")) $("ii").value = s.ii ?? "00";
  if ($("ss")) $("ss").value = s.ss ?? "00";
  if ($("inAmount")) $("inAmount").value = s.inAmount ?? "RM1,000.00";

  if ($("ref")) $("ref").textContent = s.refDisp ?? "0123080820";
  if ($("date")) $("date").textContent = s.dateDisp ?? "01 Jun 2024 00:00:00";
  if ($("amount")) $("amount").textContent = s.amtDisp ?? "RM1,000.00";

  applyDateModeVisibility();
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(readUIState()));
  } catch (e) {}
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s === "object") writeUIState(s);
  } catch (e) {}
}

function applyDateModeVisibility() {
  const v1 = $("inDate");
  const v2 = $("inDate2");
  if (!v1 || !v2) return;

  if (counter === 0) {
    v1.style.visibility = "visible";
    v2.style.visibility = "hidden";
  } else {
    v1.style.visibility = "hidden";
    v2.style.visibility = "visible";
  }
}

/* =======================
   CORE FUNCTIONS
   ======================= */
function change() {
  const inDate = $("inDate").value;
  $("date").textContent = inDate;
}

function change2() {
  const day = $("dd").value;
  const month = $("mm").value;
  const year = $("yyyy").value;
  const hour = $("hh").value;
  const min = $("ii").value;
  const sec = $("ss").value;

  $("date").textContent = `${day} ${month} ${year} ${hour}:${min}:${sec}`;
}

function liveUpdateAmount() {
  const v = $("inAmount")?.value || "";
  $("amount").textContent = v;
}

function liveUpdateDate() {
  if (counter === 0) {
    const v = $("inDate")?.value || "";
    $("date").textContent = v;
  } else {
    change2();
  }
}

function mutate() {
  counter = counter === 0 ? 1 : 0;
  applyDateModeVisibility();
  saveState();
  liveUpdateDate();
}

function generate(mustTen) {
  if (mustTen.length !== 0 && mustTen.length < 10) {
    let lessNum = 10 - mustTen.length;
    for (let x = lessNum; x > 0; x--) mustTen += Math.floor(Math.random() * 9);
    return mustTen;
  }
  return mustTen;
}

function create() {
  const inRef = $("inRef").value;
  const genRef = generate(inRef);
  $("ref").textContent = genRef;

  if (counter === 0) change();
  else change2();

  const inAmount = $("inAmount").value;
  $("amount").textContent = inAmount;

  saveState();
}

function reset() {
  $("inRef").value = "";
  $("inDate").value = "01 Jun 2024 00:00:00";
  $("inAmount").value = "RM1,000.00";

  $("ref").textContent = "0123080820";
  $("date").textContent = "01 Jun 2024 00:00:00";
  $("amount").textContent = "RM1,000.00";

  $("dd").value = "01";
  $("mm").value = "Jun";
  $("yyyy").value = "2024";
  $("hh").value = "00";
  $("ii").value = "00";
  $("ss").value = "00";

  counter = 0;
  applyDateModeVisibility();

  localStorage.removeItem(STORE_KEY);
}

function hideEditor8s() {
  const ed = $("editor");
  ed.style.display = "none";
  setTimeout(() => {
    ed.style.display = "inline";
  }, 8000);
}

function now() {
  const now = new Date();

  let nDay = now.getDate();
  let nMonth = now.getMonth() + 1;
  const nYear = now.getFullYear();
  let nHour = now.getHours();
  let nMin = now.getMinutes();
  let nSec = now.getSeconds();

  nMonth = nMonth.toString().padStart(2, "0");

  const map = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
  };
  const mmm = map[nMonth] || "Jan";

  const dd = String(nDay).padStart(2, "0");
  const hh = String(nHour).padStart(2, "0");
  const ii = String(nMin).padStart(2, "0");
  const ss = String(nSec).padStart(2, "0");

  $("dd").value = dd;
  $("mm").value = mmm;
  $("yyyy").value = String(nYear);
  $("hh").value = hh;
  $("ii").value = ii;
  $("ss").value = ss;

  $("inDate").value = `${dd} ${mmm} ${nYear} ${hh}:${ii}:${ss}`;

  saveState();
  liveUpdateDate();
}

/* =======================
   INIT + EVENTS
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  // Load saved state first
  loadState();

  // Live once after load
  liveUpdateDate();
  liveUpdateAmount();

  // Wire inputs
  ["inRef", "inDate", "dd", "mm", "yyyy", "hh", "ii", "ss", "inAmount"].forEach((id) => {
    const el = $(id);
    if (!el) return;

    el.addEventListener("input", saveState);
    el.addEventListener("change", saveState);

    if (id === "inAmount") {
      el.addEventListener("input", liveUpdateAmount);
      el.addEventListener("change", liveUpdateAmount);
    }

    if (id === "inDate" || ["dd", "mm", "yyyy", "hh", "ii", "ss"].includes(id)) {
      el.addEventListener("input", liveUpdateDate);
      el.addEventListener("change", liveUpdateDate);
    }
  });

  // Wire buttons
  $("btnNow")?.addEventListener("click", now);
  $("btnCreate")?.addEventListener("click", create);
  $("btnHide")?.addEventListener("click", hideEditor8s);
  $("btnReset")?.addEventListener("click", reset);
  $("btnChangeMode")?.addEventListener("click", mutate);
});
