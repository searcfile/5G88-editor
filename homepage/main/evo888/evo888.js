let skipAutoLoad = false;
let hiddenRow = null;
const MAX_FREE_GAME_ROWS = 10;   // maksimum 10 baris free game
let autoFreeGameOn = false;   // ✅ status AUTO (off default)
let autoAddScoreOn = false;
let isRestoringSelection = false;
let lastWinRowIndex = -1;
let manualWinAmount = 0;
const gameData = {
"TripleTwister": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"GreatChina": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"AmazingThailand": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"GoldRush": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Amazon": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"Victory": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Boyking": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Iceland": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"GoldenTour": 
{ bets: [1.25, 2.50, 5.00, 25.00],pecahan: {1.25: [30.00, 60.00, 100.00, 130.00],2.50: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"GodOfWealth": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"HalloweenFortune": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"FootBall": 
{ bets: [1.00, 1.50, 3.00, 5.00, 15.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],1.50: [60.00, 90.00, 110.00, 150.00],3.00: [90.00, 120.00, 150.00, 180.00],5.00: [120.00, 150.00, 180.00, 210.00],15.00: [100.00, 150.00, 200.00, 500.00]}},
"ZhaoCaiJinBao": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"Samurai": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"GreatBlue": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"SafariHeat": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"BigProsperity": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"Laura": 
{ bets: [1.50, 3.00, 7.50, 15.00, 30.00],pecahan: {1.50: [30.00, 50.00, 100.00, 130.00],3.00: [50.00, 80.00, 100.00, 150.00],7.50: [80.00, 100.00, 130.00, 180.00],15.00: [130.00, 150.00, 180.00, 300.00],30.00: [150.00, 180.00, 200.00, 500.00]}},
"HighWay": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"SilverBullets": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"PantherMoon": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"WaterMargin": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"GreatBlue": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"DolphinReef": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"BonusBears": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"FairyGarden": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}}
};
function updateAutoAddScoreButtonUI() {
  const btn = document.getElementById("autoAddScoreBtn");
  if (!btn) return;

  if (autoAddScoreOn) {
    btn.textContent = "AUTO ON";
    btn.style.background = "#22c55e";
    btn.style.borderColor = "#22c55e";
  } else {
    btn.textContent = "AUTO OFF";
    btn.style.background = "#555";
    btn.style.borderColor = "#555";
  }
}
  let jackpotInsertedMap = JSON.parse(localStorage.getItem("jackpotInsertedMap")) || {};
function saveCurrentSelectionOnly() {
  if (isRestoringSelection) return;

  const oldData = JSON.parse(localStorage.getItem("gameLogDataEvo888") || "{}");

  const game = document.getElementById("gameSelect")?.value || "";
  const bet = document.getElementById("betSelect")?.value || "";
  const pecahan = document.getElementById("pecahanSelect")?.value || "";

  const newData = {
    ...oldData,
    game,
    bet,
    pecahan
  };

  localStorage.setItem("gameLogDataEvo888", JSON.stringify(newData));
}
function initCustomSelect(selectId, withSearch = false, searchPlaceholder = "Search...") {
  const native = document.getElementById(selectId);
  if (!native) return null;

  if (native.dataset.csReady === "1") {
    return native._csApi || null;
  }
  native.dataset.csReady = "1";

  // sembunyikan select asli
  native.style.position = "absolute";
  native.style.left = "-9999px";
  native.style.width = "1px";
  native.style.height = "1px";
  native.style.opacity = "0";
  native.style.pointerEvents = "none";

  const wrap = document.createElement("div");
  wrap.className = `cs-wrap cs-wrap-${selectId}`;

  const display = document.createElement("div");
  display.className = "cs-display";
  display.tabIndex = 0;

  const label = document.createElement("span");
  label.className = "cs-label";

  const arrow = document.createElement("span");
  arrow.className = "cs-arrow";
  arrow.innerHTML = `
  <svg viewBox="64 64 896 896" aria-hidden="true">
    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
  </svg>
  `;

  display.appendChild(label);
  display.appendChild(arrow);

  const list = document.createElement("div");
  list.className = "cs-list";

  let searchInput = null;
  let itemsBox = document.createElement("div");
  itemsBox.className = "cs-items";

  if (withSearch) {
    const searchBox = document.createElement("div");
    searchBox.className = "cs-search";

    searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = searchPlaceholder;
    searchInput.autocomplete = "off";

    searchBox.appendChild(searchInput);
    list.appendChild(searchBox);
  }

  list.appendChild(itemsBox);

  native.parentNode.insertBefore(wrap, native.nextSibling);
  wrap.appendChild(display);
  wrap.appendChild(list);

  function getPlaceholderText() {
    const first = native.options[0];
    return first ? first.textContent : "-- Choose --";
  }

  function refresh() {
    itemsBox.innerHTML = "";

    const options = Array.from(native.options);
    const selectedOpt = native.options[native.selectedIndex];
    const hasValue =
      selectedOpt &&
      selectedOpt.value !== "" &&
      !selectedOpt.disabled;

    label.textContent = hasValue ? selectedOpt.textContent : getPlaceholderText();
    display.classList.toggle("placeholder", !hasValue);

    options.forEach((opt, index) => {
      const item = document.createElement("div");
      item.className = "cs-item";
      item.textContent = opt.textContent;
      item.dataset.value = opt.value;

      if (opt.disabled && opt.value === "") {
        item.classList.add("disabled");
      }

      if (index === native.selectedIndex && hasValue) {
        item.classList.add("active");
      }

      item.addEventListener("click", () => {
        if (opt.disabled) return;

        native.selectedIndex = index;
        native.value = opt.value;
        native.dispatchEvent(new Event("change", { bubbles: true }));
        close();
        refresh();
      });

      itemsBox.appendChild(item);
    });

    if (searchInput) {
      searchInput.value = "";
      applyFilter("");
    }
  }

  function applyFilter(q) {
    const query = String(q || "").trim().toLowerCase();
    const items = Array.from(itemsBox.querySelectorAll(".cs-item"));

    items.forEach(item => {
      const show = item.textContent.toLowerCase().includes(query);
      item.style.display = show ? "" : "none";
    });
  }

  function open() {
    document.querySelectorAll(".cs-wrap.open").forEach(w => {
      if (w !== wrap) w.classList.remove("open");
    });
    wrap.classList.add("open");

    if (searchInput) {
      searchInput.value = "";
      applyFilter("");
      setTimeout(() => searchInput.focus(), 0);
    }
  }

  function close() {
    wrap.classList.remove("open");
  }

  function toggle() {
    wrap.classList.contains("open") ? close() : open();
  }

  display.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  display.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape") {
      close();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      applyFilter(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  native.addEventListener("change", refresh);

  const observer = new MutationObserver(() => refresh());
  observer.observe(native, {
    childList: true,
    subtree: false,
    attributes: true
  });

  refresh();

  const api = { refresh, open, close, wrap, display, list };
  native._csApi = api;
  return api;
}
const gameCS = initCustomSelect("gameSelect", true, "Search game...");
const betCS = initCustomSelect("betSelect", false);
const winCS = initCustomSelect("pecahanSelect", false);

document.getElementById("gameSelect").addEventListener("change", function () {
  const game = this.value;
  const betSelect = document.getElementById("betSelect");

  resetSelectToPlaceholder("betSelect", "Select Bet", false);
  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);

  if (betCS) betCS.refresh();
  if (winCS) winCS.refresh();

  if (!game) {
    saveCurrentSelectionOnly();
    return;
  }

  jackpotInsertedMap[game] = false;

  if (gameData[game] && Array.isArray(gameData[game].bets)) {
    gameData[game].bets.forEach(bet => {
      const option = document.createElement("option");
      option.value = String(bet);
      option.textContent = Number(bet).toFixed(2);
      betSelect.appendChild(option);
    });

    // hanya auto pilih pertama kalau bukan sedang restore
    if (!isRestoringSelection && gameData[game].bets.length > 0) {
      betSelect.value = String(gameData[game].bets[0]);
      betSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  if (betCS) betCS.refresh();
  saveCurrentSelectionOnly();
});

document.getElementById("betSelect").addEventListener("change", function () {
  const game = document.getElementById("gameSelect").value;
  const rawBet = this.value;
  const bet = parseFloat(rawBet);
  const pecahanSelect = document.getElementById("pecahanSelect");

  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);

  if (!game || isNaN(bet)) {
    if (winCS) winCS.refresh();
    saveCurrentSelectionOnly();
    return;
  }

  const pecahanMap = gameData?.[game]?.pecahan || {};
  const pecahanList =
    pecahanMap[rawBet] ??
    pecahanMap[String(bet)] ??
    pecahanMap[bet.toFixed(2)];

  if (Array.isArray(pecahanList)) {
    pecahanList.forEach(p => {
      const option = document.createElement("option");
      option.value = String(p);
      option.textContent = Number(p).toFixed(2);
      pecahanSelect.appendChild(option);
    });

    // hanya auto pilih pertama kalau bukan sedang restore
    if (!isRestoringSelection && pecahanList.length > 0) {
      pecahanSelect.value = String(pecahanList[0]);
    }
  }

  if (winCS) winCS.refresh();
  saveCurrentSelectionOnly();
});
document.getElementById("pecahanSelect").addEventListener("change", function () {
  if (winCS) winCS.refresh();
  saveCurrentSelectionOnly();
});

 function setNow() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0'); // 24-hour
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  const formatted = `${mm}/${dd}/${yyyy} ${hours}:${minutes}:${seconds} ${ampm}`;
  document.getElementById("manualTime").value = formatted;
}
  function rnd(min, max, dec = 2){
    return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
  }

  let globalTime = null;

  function rnd(min, max, dec = 2){
    return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
  }
  function formatDateTimeLocal(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0'); // 24-hour format
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${mm}/${dd}/${yyyy} ${hours}:${minutes}:${seconds} ${ampm}`;
}
document.getElementById("manualTime").addEventListener("input", function () {
  let val = this.value.trim();

  // Pisahkan waktu: tanggal & waktu & AM/PM
  const dateTimeParts = val.split(" ");
  if (dateTimeParts.length < 2) return;

  const [datePart, timePartRaw] = dateTimeParts;
  let timePart = timePartRaw.replace(/AM|PM/i, "").trim();

  const [hhStr, mm, ss] = timePart.split(":");
  if (!hhStr || isNaN(hhStr)) return;

  const hh = parseInt(hhStr);
  if (isNaN(hh)) return;

  // Tentukan AM/PM berdasarkan jam
  let newAmpm = "";
  if (hh === 12 || hh >= 12) {
    newAmpm = "PM";
  } else {
    newAmpm = "AM";
  }

  this.value = `${datePart} ${timePart} ${newAmpm}`;
});

function deleteCents() {
  const badges = document.querySelectorAll(".badge");

  badges.forEach(badge => {
    let text = badge.textContent.trim();

    if (text.startsWith("Set Score:") || text.startsWith("Set score：") || text.startsWith("Set score:")) {
      const match = text.match(/-?\d+(\.\d+)?/);
      if (match) {
        const number = parseFloat(match[0]);
        const intPart = Math.floor(Math.abs(number));
        const newValue = `${number < 0 ? "-" : ""}${intPart}.00`;

        // Hanya ganti angka, bukan seluruh teks
        badge.textContent = text.replace(/-?\d+(\.\d+)?/, newValue);
      }
    }
  });
}
// update rupa button AUTO ikut status autoFreeGameOn
function updateAutoFreeGameButtonUI() {
  const autoBtn = document.getElementById('autoFreeGameBtn');
  if (!autoBtn) return;

  if (autoFreeGameOn) {
    autoBtn.textContent = 'AUTO ON';
    autoBtn.style.background = '#22c55e';   // hijau
    autoBtn.style.borderColor = '#22c55e';
  } else {
    autoBtn.textContent = 'AUTO OFF';
    autoBtn.style.background = '#555';
    autoBtn.style.borderColor = '#555';
  }
}
//  FREE GAME HELPERS
// =====================

// reset semua tanda Free game balik ke bet asal
function resetAllFreeGameMarks() {
  const betCells = document.querySelectorAll('#gameLog tbody tr.log-row td.bet-cell');
  betCells.forEach(cell => {
    const originalBet = cell.dataset.baseBet || cell.dataset.bet;
    if (originalBet !== undefined) {
      cell.textContent = originalBet;   // tulisan balik ke angka asal
      cell.dataset.bet = originalBet;   // nilai bet untuk kira-kira pun balik asal
    }
    cell.style.fontWeight = '';
    cell.style.color = '';
  });
}

// kira semula BeginMoney & EndMoney lepas set Free game
function recalcBalancesAfterFreeGame() {
  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  // jalan dari bawah ke atas
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];

    const win = parseFloat(row.children[3].textContent) || 0; // kolom Win
    const betCell = row.querySelector(".bet-cell");

    let bet = 0;
    if (betCell) {
      // kalau tulisan "Free game" → bet = 0
      if (betCell.textContent.trim().toLowerCase() === "free game") {
        bet = 0;
      } else {
        bet = parseFloat(betCell.dataset.bet || betCell.textContent) || 0;
      }
    }

    let begin;
    if (i === rows.length - 1) {
      // row paling bawah: pakai BeginMoney sedia ada
      begin = parseFloat(row.children[4].textContent) || 0;
    } else {
      // row atas: BeginMoney = EndMoney row di bawah
      const below = rows[i + 1];
      begin = parseFloat(below.children[5].textContent) || 0;
      row.children[4].textContent = begin.toFixed(2);
    }

    // normal: End = Begin - bet + win
    // Free game: bet = 0 → End = Begin + win
    const end = begin - bet + win;
    row.children[5].textContent = end.toFixed(2);
  }

  // update Set score ikut EndMoney paling atas
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
  if (setScoreRowTop && rows.length > 0) {
    const topEndMoney = parseFloat(rows[0].children[5].textContent) || 0;
    const scoreCell = setScoreRowTop.children[1];

    scoreCell.innerHTML = `<span class="badge">Set Score: ${(-Math.abs(topEndMoney)).toFixed(2)}</span>`;

    // kalau mahu, boleh juga isi BeginMoney & EndMoney di baris setscore:
    // setScoreRowTop.children[4].textContent = Math.abs(topEndMoney).toFixed(2);
    // setScoreRowTop.children[5].textContent = "0.00";
  }
}

// apply free game berdasarkan input
function applyFreeGame() {
  const input = document.getElementById('freeGameInput');
  if (!input) return;

  let count = parseInt(input.value, 10);
  if (isNaN(count) || count < 0) count = 0;
  if (count > MAX_FREE_GAME_ROWS) count = MAX_FREE_GAME_ROWS;

  // pulihkan semua dulu
  resetAllFreeGameMarks();
  if (count === 0) {
    recalcBalancesAfterFreeGame(); // tetap recalc supaya rapi
    return;
  }

  const rows = Array.from(document.querySelectorAll('#gameLog tbody tr.log-row'));
  const fromBottom = rows.slice().reverse(); // mula dari bawah

  let marked = 0;
  for (const row of fromBottom) {
    if (marked >= count) break;

    const betCell = row.querySelector('td.bet-cell');
    if (!betCell) continue;

    // UI Free game
    betCell.textContent = 'Free game';
    betCell.style.fontWeight = '700';
    betCell.style.color = '#dd4b39';

    // bet untuk kira-kira = 0
    betCell.dataset.bet = '0';

    marked++;
  }

  // lepas tanda Free game → kira semula BeginMoney & EndMoney
  recalcBalancesAfterFreeGame();
}

// tombol SET Free Game
document.getElementById('setFreeGameBtn').addEventListener('click', function () {
  applyFreeGame();
});

// tombol AUTO Free Game
const autoBtn = document.getElementById('autoFreeGameBtn');
autoBtn.addEventListener('click', () => {
  autoFreeGameOn = !autoFreeGameOn;   // toggle ON/OFF
  localStorage.setItem('autoFreeGameOnEvo888', autoFreeGameOn ? '1' : '0');
  updateAutoFreeGameButtonUI();
});
// ✅ tombol AUTO AddScore
document.getElementById("autoAddScoreBtn")?.addEventListener("click", () => {
  autoAddScoreOn = !autoAddScoreOn;
  localStorage.setItem("autoAddScoreOnEvo888", autoAddScoreOn ? "1" : "0");
  updateAutoAddScoreButtonUI();
});
 function generateLog() {
  const game = document.getElementById("gameSelect").value;
  const bet = parseFloat(document.getElementById("betSelect").value);
  const selectedPecahan = parseFloat(document.getElementById("pecahanSelect").value);
  const tbody = document.querySelector("#gameLog tbody");
  const manualTimeInput = document.getElementById('manualTime').value;
  console.log("⏱️ Manual Time Input:", manualTimeInput);
  const manualScore = parseFloat(document.getElementById("manualScore").value) || 0;

  let logs = [];
  let baseTime;

 const manualInput = manualTimeInput.trim();
if (manualInput) {
  const parts = manualInput.includes("T") ? manualInput.split("T") : manualInput.split(" ");
  if (parts.length >= 2) {
    const datePart = parts[0];
    const timePartRaw = parts.slice(1).join(" ");

    const [month, day, year] = datePart.split("/").map(Number);

    let timePart = timePartRaw.trim();
    let ampm = "";

    if (timePart.toUpperCase().includes("AM")) ampm = "AM";
    if (timePart.toUpperCase().includes("PM")) ampm = "PM";

    timePart = timePart.replace(/AM|PM/i, "").trim();
    let [hour, minute, second] = timePart.split(":").map(Number);

    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    baseTime = new Date(year, month - 1, day, hour, minute || 0, second || 0);
  } else {
    baseTime = new Date();
  }
} else {
  baseTime = new Date();
}
  if (!manualInput) {
  baseTime = new Date(baseTime.getTime() - (10 * 4 * 1000)); // ⏱️ Hanya mundur kalau auto
}
  let balance = rnd(3000, 4000) + manualScore;

  for (let i = 0; i < 10; i++) {
    const gap = Math.floor(Math.random() * 3) + 3;
    const beginMoney = balance;
    const win = Math.random() > 0.7 ? rnd(0, selectedPecahan) : 0.00;
    const endMoney = parseFloat((beginMoney - bet + win).toFixed(2));
    const formattedTime = formatDateTimeLocal(baseTime);

    logs.unshift({
      game,
      tableID: `<span class="table-id-highlight">0</span>`,
      bet: bet.toFixed(2),
      win: win.toFixed(2),
      beginMoney: beginMoney.toFixed(2),
      endMoney: endMoney.toFixed(2),
      dateTime: formattedTime
    });

    balance = endMoney;
    baseTime.setSeconds(baseTime.getSeconds() + gap);
  }

  const setScoreMoney = logs[0].endMoney;
  const dtParts = logs[0].dateTime.split(" ");
  const [month, day, year] = dtParts[0].split("/").map(Number);
  let [hour, minute, second] = dtParts[1].split(":").map(Number);
  const ampm = dtParts[2];

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const setScoreTime = new Date(year, month - 1, day, hour, minute, second);
  const randomOffset = [2, 3, 4, 6, 8, 9, 10, 13, 15, 18, 20, 21, 23, 24][Math.floor(Math.random() * 14)];
  setScoreTime.setSeconds(setScoreTime.getSeconds() + randomOffset);

  let rows = `
    <tr class="set-score-row">
      <td>-</td>
      <td class="setscore"><span class="badge">Set Score: ${(-Math.abs(parseFloat(setScoreMoney))).toFixed(2)}</span></td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td>${formatDateTimeLocal(setScoreTime)}</td>
    </tr>
  `;

logs.forEach(log => {
  rows += `
      <tr class="log-row">
        <td>${log.game}</td>
        <td>${log.tableID}</td>
        <td class="bet-cell" data-base-bet="${log.bet}" data-bet="${log.bet}">${log.bet}</td>
        <td class="win-cell" data-original-win="${log.win}">${log.win}</td>
        <td>${log.beginMoney}</td>
        <td>${log.endMoney}</td>
        <td>${log.dateTime}</td>
      </tr>
    `;
});

  tbody.innerHTML = rows;

  // ✅ kalau AUTO ON, random-kan jumlah Free game dulu
  if (autoFreeGameOn) {
    const randomCount = Math.floor(Math.random() * MAX_FREE_GAME_ROWS) + 1;
    document.getElementById('freeGameInput').value = randomCount;
  }

  // ✅ apply Free Game selepas table siap
  applyFreeGame();
  applyManualScoreAsTopEndMoneyIfOff();
  // ✅ Simpan ke localStorage setelah update tbody
  skipAutoLoad = true;
  setTimeout(() => {
    const freeGameCount = parseInt(document.getElementById('freeGameInput').value || '0', 10) || 0;
    const savedData = {
      game,
      bet,
      pecahan: selectedPecahan,
      manualTime: manualTimeInput,
      manualScore: manualScore,
      freeGame: freeGameCount,
      logs: tbody.innerHTML,
      lastWinRowIndex,
      manualWinAmount,
    };
    localStorage.setItem("gameLogDataEvo888", JSON.stringify(savedData));
  }, 50);
}

function addJackpot() {
  const currentGame = document.getElementById("gameSelect").value;
  const jackpotAmount = parseFloat(document.getElementById("manualJackpot").value);

  if (isNaN(jackpotAmount) || jackpotAmount < 0) {
    return;
  }

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  // ---- 1. Buang jackpot lama kalau ada (macam dulu) ----
  let rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  let jackpotRow = tbody.querySelector("tr.set-score-row.jackpot");

  if (jackpotRow) {
    const prevJackpotText = jackpotRow.children[1].textContent;
    const match = prevJackpotText.match(/JackPot：([\d.]+)/);
    if (match) {
      const oldJackpotValue = parseFloat(match[1]);

      const index = Array.from(tbody.children).indexOf(jackpotRow);
      const prevRow = tbody.children[index - 1];
      const oldWin = parseFloat(prevRow.children[3].textContent);

      const newWin = oldWin - oldJackpotValue;
      prevRow.children[3].textContent = newWin.toFixed(2);

      const betCellPrev = prevRow.children[2];
      const betPrev = parseFloat(betCellPrev.dataset.bet || betCellPrev.textContent);
      const beginMoneyPrev = parseFloat(prevRow.children[4].textContent);
      const newEndPrev = beginMoneyPrev - betPrev + newWin;
      prevRow.children[5].textContent = newEndPrev.toFixed(2);
    }

    jackpotRow.remove();
  }

if (typeof hiddenRow !== "undefined" && hiddenRow) {
  tbody.appendChild(hiddenRow);
  hiddenRow = null;
}

  // ---- 2. Cari pasangan 2 baris NORMAL (bukan Free game) ----
  rows = Array.from(tbody.querySelectorAll("tr.log-row"));

  // Kalau betul-betul tak cukup 2 baris log
  if (rows.length < 2) {
    showToast("Jackpot minimal perlukan 2 baris log.", "error");
    return;
  }

  // Senarai index yang valid untuk jackpot:
  // index i akan guna rows[i-1] (prev) & rows[i] (target)
  const candidateIndices = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const prevRow = rows[i - 1];

    const betCell = row.querySelector(".bet-cell");
    const prevBetCell = prevRow.querySelector(".bet-cell");

    const isFree = betCell && betCell.textContent.trim().toLowerCase() === "free game";
    const isPrevFree = prevBetCell && prevBetCell.textContent.trim().toLowerCase() === "free game";

    // Hanya ambil kalau DUA-DUA bukan free game
    if (!isFree && !isPrevFree) {
      candidateIndices.push(i);
    }
  }

  // Kalau tak ada sepasang baris normal → tak boleh buat jackpot
  if (candidateIndices.length === 0) {
    showToast("Jackpot hanya boleh dibuat di luar Free game.\nSila pastikan ada sekurang-kurangnya 2 baris normal untuk jackpot.", "info");
    return;
  }

  // Pilih salah satu index dari calon di atas
  const randomIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
  const targetRow = rows[randomIndex];
  const prevRow = rows[randomIndex - 1];

  // ---- 3. Update win & endMoney untuk prevRow (jackpot kena di sini) ----
  const oldWin = parseFloat(prevRow.children[3].textContent);
  const newWin = oldWin + jackpotAmount;
  prevRow.children[3].textContent = newWin.toFixed(2);

  const beginMoney = parseFloat(prevRow.children[4].textContent);
  const betCell = prevRow.children[2];
  const bet = parseFloat(betCell.dataset.bet || betCell.textContent);
  const newEnd = beginMoney - bet + newWin;
  prevRow.children[5].textContent = newEnd.toFixed(2);

  const dateTime = prevRow.children[6].textContent;
  const gameName = prevRow.children[0].textContent;

  // ---- 4. Sisipkan baris Jackpot di antara prevRow & targetRow ----
  const newJackpotRow = document.createElement("tr");
  newJackpotRow.classList.add("set-score-row", "jackpot");
  newJackpotRow.innerHTML = `
    <td>${gameName}</td>
    <td class="setscore">JackPot：${jackpotAmount.toFixed(2)}</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td>${dateTime}</td>
  `;
  targetRow.insertAdjacentElement("beforebegin", newJackpotRow);

  // ---- 5. Trim maksimum 11 baris (1 setscore + 10 log) macam biasa ----
  const allRows = Array.from(tbody.querySelectorAll("tr.log-row"));
  const specialRows = tbody.querySelectorAll("tr.set-score-row");

  while (allRows.length + specialRows.length > 11) {
    const lastRow = allRows.pop();
    if (lastRow) lastRow.remove();
  }

  const updatedRows = Array.from(tbody.querySelectorAll("tr.log-row"));
  for (let i = updatedRows.length - 1; i > 0; i--) {
    const current = updatedRows[i];
    const prev = updatedRows[i - 1];

    const curEnd = parseFloat(current.children[5].textContent);
    const prevBetCell = prev.children[2];
    const prevBet = parseFloat(prevBetCell.dataset.bet || prevBetCell.textContent);
    const prevWin = parseFloat(prev.children[3].textContent);

    prev.children[4].textContent = curEnd.toFixed(2);
    prev.children[5].textContent = (curEnd - prevBet + prevWin).toFixed(2);
  }

  if (updatedRows.length > 0) {
    const topEndMoney = parseFloat(updatedRows[0].children[5].textContent);
    const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
    if (setScoreRowTop) {
      const scoreCell = setScoreRowTop.children[1];
      scoreCell.textContent = `Set score：${(-Math.abs(topEndMoney)).toFixed(2)}`;
    }
  }

  jackpotInsertedMap[currentGame] = true;
  localStorage.setItem("jackpotInsertedMap", JSON.stringify(jackpotInsertedMap));

  // Re-apply Free game selepas struktur row berubah
  applyFreeGame();
}
function addManualSetScore() {
  const inputScore = parseFloat(document.getElementById("manualScoreInput").value);
  if (isNaN(inputScore)) return alert("❌ Nilai tidak sah");

  const tbody = document.querySelector("#gameLog tbody");

  // Cari baris manual (positif) dan negatif
  const existingManualRow = Array.from(tbody.querySelectorAll("tr.set-score-row"))
    .find(row => !row.classList.contains("jackpot") && !row.children[1].textContent.includes("-"));

  const setScoreNegatifRow = Array.from(tbody.querySelectorAll("tr.set-score-row:not(.jackpot)"))
    .find(row => row.children[1].textContent.includes("-"));

  if (!setScoreNegatifRow) return alert("❌ Baris set score negatif tidak ditemukan!");

  // Ambil waktu dari baris negatif dan parse manual
  const belowTimeText = setScoreNegatifRow.children[6].textContent.trim();
  const match = belowTimeText.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/);
  if (!match) return alert("❌ Format waktu di baris negatif tidak valid!");

  let [, month, day, year, hh, mm, ss, ampm] = match;
  month = parseInt(month, 10);
  day = parseInt(day, 10);
  year = parseInt(year, 10);
  hh = parseInt(hh, 10);
  mm = parseInt(mm, 10);
  ss = parseInt(ss, 10);

  // Konversi AM/PM ke 24 jam
  if (ampm === "PM" && hh < 12) hh += 12;
  if (ampm === "AM" && hh === 12) hh = 0;

  const baseDate = new Date(year, month - 1, day, hh, mm, ss);
  const randomSeconds = Math.floor(Math.random() * 29) + 2; // +2~15 detik
  const newTime = new Date(baseDate.getTime() + randomSeconds * 1000);
  const formatted = formatDateTimeLocal(newTime);

  // Update baris jika sudah ada
  if (existingManualRow) {
    existingManualRow.children[1].innerHTML = `<span class="badge">Set Score: ${inputScore.toFixed(2)}</span>`;
    existingManualRow.children[6].textContent = formatted;
  } else {
    const newRow = document.createElement("tr");
    newRow.classList.add("set-score-row");
    newRow.innerHTML = `
      <td>-</td>
      <td class="setscore"><span class="badge">Set Score: ${inputScore.toFixed(2)}</span></td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td>${formatted}</td>
    `;
    tbody.insertBefore(newRow, setScoreNegatifRow);
  }

  // Batasi max 11 baris
  const allRows = Array.from(tbody.querySelectorAll("tr"));
  if (allRows.length > 11) {
    const lastRow = allRows[allRows.length - 1];
    lastRow.remove();
  }

  document.getElementById("manualScoreInput").value = "";
}
function updateSelectPlaceholderColor(select) {
  if (!select) return;

  if (!select.value) {
    select.classList.add("placeholder-select");
    select.classList.remove("has-value");
  } else {
    select.classList.remove("placeholder-select");
    select.classList.add("has-value");
  }
}

["gameSelect", "betSelect", "pecahanSelect"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  updateSelectPlaceholderColor(el);
  el.addEventListener("change", function () {
    updateSelectPlaceholderColor(el);
  });
});
function resetSelectToPlaceholder(selectId, placeholderText, disable = false) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="" disabled selected hidden>${placeholderText}</option>`;
  select.value = "";
  select.disabled = disable;
}
function resetLog() {
  localStorage.removeItem("gameLogDataEvo888");
  localStorage.removeItem("jackpotInsertedMap");
  jackpotInsertedMap = {};

  const gameSelect = document.getElementById("gameSelect");
  const tbody = document.querySelector("#gameLog tbody");

  // reset game select + refresh custom select label
  if (gameSelect) {
    gameSelect.selectedIndex = 0;
    gameSelect.value = "";
    gameSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // reset dropdown lain ke placeholder asal
  resetSelectToPlaceholder("betSelect", "Select Bet", false);
  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);
  if (gameCS) gameCS.refresh();
  if (betCS) betCS.refresh();
  if (winCS) winCS.refresh();
  // reset semua input
  const idsToClear = [
    "manualTime",
    "manualScore",
    "manualJackpot",
    "manualScoreInput",
    "manualWinInput",
    "freeGameInput"
  ];

  idsToClear.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // kosongkan table
  if (tbody) tbody.innerHTML = "";

  // reset AUTO Free Game
  localStorage.removeItem("autoFreeGameOnEvo888");
  autoFreeGameOn = false;
  updateAutoFreeGameButtonUI();

  // reset AUTO AddScore
  localStorage.removeItem("autoAddScoreOnEvo888");
  autoAddScoreOn = true;
  updateAutoAddScoreButtonUI();

  // reset state lain
  lastWinRowIndex = null;
  manualWinAmount = 0;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedAuto = localStorage.getItem("autoFreeGameOnEvo888");
  autoFreeGameOn = (savedAuto === "1");
  updateAutoFreeGameButtonUI();

  const savedAutoAdd = localStorage.getItem("autoAddScoreOnEvo888");
  autoAddScoreOn = (savedAutoAdd !== "0");
  updateAutoAddScoreButtonUI();

  if (typeof skipAutoLoad !== "undefined" && skipAutoLoad) return;

  const saved = localStorage.getItem("gameLogDataEvo888");
  if (!saved) return;

  const data = JSON.parse(saved);

  const gameSelect = document.getElementById("gameSelect");
  const betSelect = document.getElementById("betSelect");
  const pecahanSelect = document.getElementById("pecahanSelect");
  const manualTimeInput = document.getElementById("manualTime");
  const manualScoreInput = document.getElementById("manualScore");
  const freeGameInput = document.getElementById("freeGameInput");
  const manualWinInput = document.getElementById("manualWinInput");
  const tbody = document.querySelector("#gameLog tbody");

  if (manualTimeInput) {
    manualTimeInput.value = data.manualTime || "";
  }

  if (manualScoreInput) {
    manualScoreInput.value = Number(data.manualScore) > 0 ? data.manualScore : "";
  }

  if (typeof data.lastWinRowIndex === "number") {
    lastWinRowIndex = data.lastWinRowIndex;
  }

  if (typeof data.manualWinAmount === "number") {
    manualWinAmount = data.manualWinAmount;
    if (manualWinInput) {
      manualWinInput.value = manualWinAmount > 0 ? manualWinAmount : "";
    }
  }

  if (freeGameInput && typeof data.freeGame !== "undefined") {
    freeGameInput.value = Number(data.freeGame) > 0 ? data.freeGame : "";
  }

  isRestoringSelection = true;

  if (gameSelect) {
    gameSelect.value = data.game || "";
    gameSelect.dispatchEvent(new Event("change", { bubbles: true }));
    if (typeof gameCS !== "undefined" && gameCS) gameCS.refresh();
  }

  if (betSelect && data.bet !== undefined && data.bet !== "") {
    betSelect.value = String(data.bet);
    betSelect.dispatchEvent(new Event("change", { bubbles: true }));
    if (typeof betCS !== "undefined" && betCS) betCS.refresh();
  }

  if (pecahanSelect && data.pecahan !== undefined && data.pecahan !== "") {
    pecahanSelect.value = String(data.pecahan);
    if (typeof winCS !== "undefined" && winCS) winCS.refresh();
  }

  isRestoringSelection = false;

  if (tbody) {
    tbody.innerHTML = data.logs || "";
  }

  applyFreeGame();
  saveCurrentSelectionOnly();
});
function showToast(message, type = "success") {
  const icons = {
    success: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M7 12l3 3 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
    error: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 9l6 6M15 9l-6 6" stroke-linecap="round"></path>
      </svg>`,
    info: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8h.01M11 11h2v5h-2" stroke-linecap="round"></path>
      </svg>`
  };

  const el = document.createElement("div");
  el.className = `toast ${type}`;            // << Kelas tentukan warna ikon
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  el.innerHTML = `
    <span class="icon">${icons[type] || icons.success}</span>
    <span class="msg" style="margin-left:6px;">${message}</span>
    <span class="close" aria-label="Close" title="Close">&times;</span>
  `;

  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));

  el.querySelector(".close").addEventListener("click", () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  });

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  }, 3500);
}
function recalcBalancesForLogRowsOnly(){
  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  // jalan dari bawah -> atas
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];

    const winCell = row.querySelector(".win-cell");
    const betCell = row.querySelector(".bet-cell");

    const win = parseFloat(winCell?.textContent || "0") || 0;

    // bet ambil dari dataset.bet, kalau Free game bet=0
    let bet = 0;
    if (betCell) {
      if (betCell.textContent.trim().toLowerCase() === "free game") bet = 0;
      else bet = parseFloat(betCell.dataset.bet || betCell.textContent || "0") || 0;
    }

    // BeginMoney
    let begin = 0;
    if (i === rows.length - 1) {
      // row paling bawah: guna begin sedia ada
      begin = parseFloat(row.children[4].textContent || "0") || 0;
    } else {
      // row atas: begin = end row bawah
      const belowEnd = parseFloat(rows[i + 1].children[5].textContent || "0") || 0;
      begin = belowEnd;
      row.children[4].textContent = begin.toFixed(2);
    }

    // EndMoney
    const end = begin - bet + win;
    row.children[5].textContent = end.toFixed(2);
  }

  // update Set Score ikut EndMoney paling atas
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
  if (setScoreRowTop && rows.length) {
    const topEndMoney = parseFloat(rows[0].children[5].textContent || "0") || 0;
    setScoreRowTop.children[1].innerHTML =
      `<span class="badge">Set Score: ${(-Math.abs(topEndMoney)).toFixed(2)}</span>`;
  }
}
// ✅ Kalau AUTO AddScore OFF → paksa EndMoney row paling atas ikut manualScore
function applyManualScoreAsTopEndMoneyIfOff() {
  if (autoAddScoreOn) return; // AUTO ON = guna cara biasa

  const desired = parseFloat(document.getElementById("manualScore")?.value || "0");
  if (!isFinite(desired)) return;

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  const topEnd = parseFloat(rows[0].children[5].textContent) || 0;
  const delta = desired - topEnd;

  // shift semua begin/end (randomness masih sama, cuma shift balance)
  for (const r of rows) {
    const b = parseFloat(r.children[4].textContent) || 0;
    const e = parseFloat(r.children[5].textContent) || 0;
    r.children[4].textContent = (b + delta).toFixed(2);
    r.children[5].textContent = (e + delta).toFixed(2);
  }

  // update Set score row ikut top end
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
  if (setScoreRowTop) {
    const newTopEnd = parseFloat(rows[0].children[5].textContent) || 0;
    setScoreRowTop.children[1].innerHTML =
      `<span class="badge">Set Score: ${(-Math.abs(newTopEnd)).toFixed(2)}</span>`;
    setScoreRowTop.children[4].textContent = "-";
    setScoreRowTop.children[5].textContent = "-";
  }
}
function setRandomWin() {
  const amount = parseFloat(document.getElementById("manualWinInput").value);
  if (isNaN(amount) || amount <= 0) {
    showToast("Please input amount!", "info");
    return;
  }

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (rows.length !== 10) {
    showToast("Pleass remove the Jackpot!", "info");
    return;
  }

  // ✅ restore win lama balik ke asal (200.00)
  if (lastWinRowIndex >= 0 && rows[lastWinRowIndex]) {
    const oldCell = rows[lastWinRowIndex].querySelector(".win-cell");
    if (oldCell && oldCell.dataset.originalWin !== undefined) {
      oldCell.textContent = parseFloat(oldCell.dataset.originalWin).toFixed(2);
    }
  }

  // ✅ pick row baru (elak pick sama)
  let pick;
  do {
    pick = Math.floor(Math.random() * rows.length);
  } while (pick === lastWinRowIndex && rows.length > 1);

  const winCell = rows[pick].querySelector(".win-cell");
  if (!winCell) return;

  // ✅ simpan originalWin SEKALI sahaja (jangan overwrite!)
  if (winCell.dataset.originalWin === undefined) {
    winCell.dataset.originalWin = winCell.textContent.trim();
  }

  // ✅ set win baru
  winCell.textContent = amount.toFixed(2);
  lastWinRowIndex = pick;

  // ✅ recalc balance
  recalcBalancesForLogRowsOnly();

  // ✅ SAVE supaya refresh tak hilang (KEY MEGA888!)
  setTimeout(() => {
    const saved = localStorage.getItem("gameLogDataEvo888");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      data.logs = tbody.innerHTML;
      data.lastWinRowIndex = lastWinRowIndex;
      data.manualWinAmount = amount;
      localStorage.setItem("gameLogDataEvo888", JSON.stringify(data));
    } catch (e) {}
  }, 50);

  showToast(`Win ${amount.toFixed(2)} Has change other rows`, "success");
}
function copyGameLogImage() {
  const gameLogTable = document.getElementById("gameLog");
  if (!gameLogTable) {
    showToast("Table #gameLog tidak ditemui", "error");
    return;
  }

  gameLogTable.classList.add("screenshot-mode");

  html2canvas(gameLogTable, { scale: 2, useCORS: true }).then(async (canvas) => {
    gameLogTable.classList.remove("screenshot-mode");

    try {
      // Cuba copy PNG terus ke clipboard
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error("Clipboard API tidak tersedia");

      await new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) return reject(new Error("Gagal buat blob"));
          try {
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            resolve();
          } catch (err) { reject(err); }
        }, "image/png");
      });

      showToast("Image copied to clipboard", "success");
      return;

    } catch (err) {
      // Fallback: hantar base64 ke parent
      const dataURL = canvas.toDataURL("image/png");
      window.parent.postMessage(
        { action: "copy-image-base64", base64: dataURL },
        "https://5g88-main.vercel.app/"
      );
      showToast("Image sent to parent (fallback)", "info");
      // (Opsional) console.error(err);
    }
  });
}
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    copyGameLogImage();
  }
});
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.remove("clicked");   // reset animasi
      void btn.offsetWidth;              // trick restart animasi
      btn.classList.add("clicked");
    });
  });
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
