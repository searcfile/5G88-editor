let selectedBotId = localStorage.getItem("selectedBotId") || "";
let selectedBotName = "";

const API_BASE = "/api";

const $ = (id) => document.getElementById(id);

window.openCreateBot = () => $("botModal").classList.add("show");
window.closeCreateBot = () => $("botModal").classList.remove("show");

document.querySelectorAll(".nav").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav").forEach((n) => n.classList.remove("active"));
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    $(btn.dataset.page).classList.add("active");
    $("pageTitle").textContent = btn.textContent.replace(/[^\w\s]/g, "").trim();
  });
});

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "API error");
  }

  return data;
}

window.createBot = async function () {
  const token = $("botToken").value.trim();

  if (!token) {
    alert("Masukkan token bot dulu bro");
    return;
  }

  try {
    const data = await api("/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    $("botToken").value = "";
    closeCreateBot();

    selectedBotId = data.botId;
    localStorage.setItem("selectedBotId", selectedBotId);

    await loadAll();
    alert("Bot berjaya dibuat ✅");
  } catch (err) {
    alert(err.message);
  }
};

window.selectBot = async function (botId) {
  selectedBotId = botId;
  localStorage.setItem("selectedBotId", botId);
  await loadAll();
};

window.deleteBot = async function (botId) {
  if (!confirm("Delete bot ini bro?")) return;

  try {
    await api(`/bots/${botId}`, { method: "DELETE" });

    if (selectedBotId === botId) {
      selectedBotId = "";
      localStorage.removeItem("selectedBotId");
    }

    await loadAll();
  } catch (err) {
    alert(err.message);
  }
};

window.setWebhook = async function (botId) {
  try {
    const data = await api(`/bots/${botId}/webhook`, { method: "POST" });
    alert(`Webhook set ✅\n${data.webhookUrl}`);
  } catch (err) {
    alert(err.message);
  }
};

window.saveSettings = async function () {
  if (!selectedBotId) return alert("Pilih bot dulu bro");

  const payload = {
    mainBannerUrl: $("mainBannerUrl").value.trim(),
    welcomeText: $("welcomeText").value,
    aboutText: $("aboutText").value,
    registerUrl: $("registerUrl").value.trim(),
    telegramSupport: $("telegramSupport").value.trim(),
    whatsappUrl: $("whatsappUrl").value.trim()
  };

  try {
    await api(`/bots/${selectedBotId}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Settings saved ✅");
  } catch (err) {
    alert(err.message);
  }
};

window.uploadImage = async function () {
  if (!$("uploadFile").files[0]) return alert("Pilih gambar dulu bro");

  const form = new FormData();
  form.append("image", $("uploadFile").files[0]);

  try {
    const data = await api("/upload", {
      method: "POST",
      body: form
    });

    $("uploadResult").innerHTML = `
      Uploaded ✅<br>
      <input value="${data.url}" readonly onclick="this.select()" />
    `;

    if (selectedBotId) {
      $("mainBannerUrl").value = data.url;
    }
  } catch (err) {
    alert(err.message);
  }
};

window.addPromo = async function () {
  if (!selectedBotId) return alert("Pilih bot dulu bro");

  const payload = {
    title: $("promoTitle").value.trim(),
    imageUrl: $("promoImageUrl").value.trim(),
    caption: $("promoCaption").value.trim()
  };

  if (!payload.title) return alert("Isi promo title dulu bro");

  try {
    await api(`/bots/${selectedBotId}/promos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    $("promoTitle").value = "";
    $("promoImageUrl").value = "";
    $("promoCaption").value = "";

    await loadPromos();
  } catch (err) {
    alert(err.message);
  }
};

window.deletePromo = async function (promoId) {
  if (!confirm("Delete promo ini bro?")) return;

  try {
    await api(`/bots/${selectedBotId}/promos/${promoId}`, { method: "DELETE" });
    await loadPromos();
  } catch (err) {
    alert(err.message);
  }
};

window.addButton = async function () {
  if (!selectedBotId) return alert("Pilih bot dulu bro");

  const payload = {
    text: $("btnText").value.trim(),
    url: $("btnUrl").value.trim(),
    callbackData: $("btnCallback").value.trim()
  };

  if (!payload.text) return alert("Isi button text dulu bro");

  try {
    await api(`/bots/${selectedBotId}/buttons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    $("btnText").value = "";
    $("btnUrl").value = "";
    $("btnCallback").value = "";

    await loadButtons();
  } catch (err) {
    alert(err.message);
  }
};

window.deleteButton = async function (buttonId) {
  if (!confirm("Delete button ini bro?")) return;

  try {
    await api(`/bots/${selectedBotId}/buttons/${buttonId}`, { method: "DELETE" });
    await loadButtons();
  } catch (err) {
    alert(err.message);
  }
};

async function loadBots() {
  const data = await api("/bots");
  const bots = data.bots || [];

  $("statBots").textContent = bots.length;

  if (!selectedBotId && bots[0]) {
    selectedBotId = bots[0].id;
    localStorage.setItem("selectedBotId", selectedBotId);
  }

  const selected = bots.find((b) => b.id === selectedBotId);
  selectedBotName = selected ? selected.botUsername || selected.botName : "";
  $("activeBotLabel").textContent = selectedBotName ? `Active Bot: ${selectedBotName}` : "No bot selected";

  $("botList").innerHTML = bots.map((bot) => `
    <div class="bot-card">
      <h3>${bot.botUsername || bot.botName || "Unnamed Bot"}</h3>
      <p>${bot.botName || ""}</p>
      <div class="row">
        <button class="primary" onclick="selectBot('${bot.id}')">Open</button>
        <button class="success" onclick="setWebhook('${bot.id}')">Set Webhook</button>
        <button class="danger" onclick="deleteBot('${bot.id}')">Delete</button>
      </div>
    </div>
  `).join("");

  return bots;
}

async function loadSettings() {
  if (!selectedBotId) return;

  const data = await api(`/bots/${selectedBotId}/settings`);
  const s = data.settings || {};

  $("mainBannerUrl").value = s.mainBannerUrl || "";
  $("welcomeText").value = s.welcomeText || $("welcomeText").value;
  $("aboutText").value = s.aboutText || $("aboutText").value;
  $("registerUrl").value = s.registerUrl || "";
  $("telegramSupport").value = s.telegramSupport || "";
  $("whatsappUrl").value = s.whatsappUrl || "";
}

async function loadPromos() {
  if (!selectedBotId) {
    $("promoList").innerHTML = "";
    $("statPromos").textContent = "0";
    return;
  }

  const data = await api(`/bots/${selectedBotId}/promos`);
  const promos = data.promos || [];
  $("statPromos").textContent = promos.length;

  $("promoList").innerHTML = promos.map((p) => `
    <div class="item">
      <h3>${p.title}</h3>
      <p>${p.caption || ""}</p>
      ${p.imageUrl ? `<p>${p.imageUrl}</p>` : ""}
      <button class="danger" onclick="deletePromo('${p.id}')">Delete</button>
    </div>
  `).join("");
}

async function loadButtons() {
  if (!selectedBotId) {
    $("buttonList").innerHTML = "";
    return;
  }

  const data = await api(`/bots/${selectedBotId}/buttons`);
  const buttons = data.buttons || [];

  $("buttonList").innerHTML = buttons.map((b) => `
    <div class="item">
      <h3>${b.text}</h3>
      <p>${b.url || b.callbackData || ""}</p>
      <button class="danger" onclick="deleteButton('${b.id}')">Delete</button>
    </div>
  `).join("");
}

async function loadUsers() {
  if (!selectedBotId) {
    $("userList").innerHTML = "";
    $("statUsers").textContent = "0";
    return;
  }

  const data = await api(`/bots/${selectedBotId}/users`);
  const users = data.users || [];
  $("statUsers").textContent = users.length;

  $("userList").innerHTML = users.map((u) => `
    <div class="item">
      <h3>@${u.username || "no_username"}</h3>
      <p>${u.firstName || ""} ${u.lastName || ""}</p>
      <p>Chat ID: ${u.chatId}</p>
    </div>
  `).join("");
}

async function loadAll() {
  try {
    await loadBots();

    if (selectedBotId) {
      await Promise.all([
        loadSettings(),
        loadPromos(),
        loadButtons(),
        loadUsers()
      ]);
    }
  } catch (err) {
    console.error(err);
  }
}

loadAll();
