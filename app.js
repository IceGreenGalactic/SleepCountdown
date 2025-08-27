const STORAGE_KEY = "children.v1";

const el = {
  list: document.getElementById("list"),
  form: document.getElementById("childForm"),
  name: document.getElementById("name"),
  maxMinutes: document.getElementById("maxMinutes"),
  childId: document.getElementById("childId"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  enableSoundBtn: document.getElementById("enableSoundBtn"),
  enableNotifBtn: document.getElementById("enableNotifBtn"),
  installBtn: document.getElementById("installBtn"),
  alarm: document.getElementById("alarmAudio"),
  tpl: document.getElementById("childRowTpl"),
  updateBanner: document.getElementById("updateBanner"),
  reloadBtn: document.getElementById("reloadBtn"),
  dismissUpdateBtn: document.getElementById("dismissUpdateBtn"),
  manualDialog: document.getElementById("manualDialog"),
  manualForm: document.getElementById("manualForm"),
  manualChildId: document.getElementById("manualChildId"),
  manualStartTime: document.getElementById("manualStartTime"),
  manualOverride: document.getElementById("manualOverride"),
  manualSave: document.getElementById("manualSave"),
};

let state = {
  children: loadChildren(),
  soundEnabled: false,
  notifPermission:
    typeof Notification !== "undefined" &&
    Notification.permission === "granted",
};

function loadChildren() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveChildren() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.children));
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDur(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const hr = Math.floor(m / 60);
  const min = m % 60;
  return hr > 0 ? `${hr}t ${min}m ${sec}s` : `${min}m ${sec}s`;
}
function fmtRange(startTs, endTs) {
  return `${fmtTime(startTs)}–${fmtTime(endTs)}`;
}
function fmtDurShort(ms) {
  let s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  return h ? `${h}t ${m}m` : `${m}m`;
}
function parseTimeToTimestamp(hhmm) {
  if (!hhmm) return null;
  const [hh, mm] = hhmm.split(":").map(Number);
  const now = new Date();
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hh,
    mm,
    0,
    0
  );
  const ts = d.getTime();
  return ts > Date.now() ? ts - 24 * 60 * 60 * 1000 : ts;
}

function render() {
  el.list.innerHTML = "";
  if (state.children.length === 0) {
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = "Ingen barn enda. Legg inn navn og maks sovetid over.";
    el.list.appendChild(p);
    return;
  }

  state.children.sort((a, b) => a.name.localeCompare(b.name, "no"));

  state.children.forEach((child) => {
    const node = el.tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = child.id;

    node.querySelector(".name").textContent = child.name;
    node.querySelector(
      ".prefs"
    ).textContent = `Maks sovetid: ${child.maxMinutes} min`;

    const status = node.querySelector(".status");
    const times = node.querySelector(".times");
    const startBtn = node.querySelector(".startBtn");
    const manualBtn = node.querySelector(".manualBtn");
    const stopBtn = node.querySelector(".stopBtn");
    const editBtn = node.querySelector(".editBtn");
    const deleteBtn = node.querySelector(".deleteBtn");

    if (child.napStartTs && child.wakeAtTs) {
      startBtn.hidden = true;
      stopBtn.hidden = false;
      manualBtn.hidden = true;
      const now = Date.now();
      const remaining = child.wakeAtTs - now;
      const startTxt = `Sovnet kl. ${fmtTime(child.napStartTs)}`;
      const wakeTxt = `Skal vekkes kl. ${fmtTime(child.wakeAtTs)}`;
      times.textContent = `${startTxt} • ${wakeTxt}`;
      if (remaining > 0) {
        status.innerHTML = `⏳ Tid igjen: <strong>${fmtDur(
          remaining
        )}</strong>`;
        if (remaining <= 60_000) node.classList.add("due");
      } else {
        status.innerHTML = `⏰ Tiden er ute!`;
        node.classList.add("overdue");
      }
    } else {
      startBtn.hidden = false;
      stopBtn.hidden = true;
      manualBtn.hidden = false;
      status.textContent = "Klar til lur.";
      times.textContent = "";
      if (child.logs?.length) {
        const last = child.logs[0];
        times.textContent = `${fmtRange(
          last.start,
          last.end
        )} – sovet ${fmtDurShort(last.durMs)}`;
      }
    }

    startBtn.addEventListener("click", () =>
      startNap(child.id, Date.now(), null)
    );
    manualBtn.addEventListener("click", () => openManualDialog(child.id));
    stopBtn.addEventListener("click", () => stopNap(child.id));
    editBtn.addEventListener("click", () => editChild(child.id));
    deleteBtn.addEventListener("click", () => deleteChild(child.id));

    el.list.appendChild(node);
  });
}

function addChild(name, maxMinutes) {
  state.children.push({
    id: uid(),
    name: name.trim(),
    maxMinutes: Number(maxMinutes),
    napStartTs: null,
    wakeAtTs: null,
    logs: [],
  });
  saveChildren();
  render();
}
function updateChild(id, name, maxMinutes) {
  const c = state.children.find((x) => x.id === id);
  if (!c) return;
  c.name = name.trim();
  c.maxMinutes = Number(maxMinutes);
  saveChildren();
  render();
}
function deleteChild(id) {
  if (!confirm("Slette barnet?")) return;
  state.children = state.children.filter((x) => x.id !== id);
  saveChildren();
  render();
}
function editChild(id) {
  const c = state.children.find((x) => x.id === id);
  if (!c) return;
  el.childId.value = c.id;
  el.name.value = c.name;
  el.maxMinutes.value = c.maxMinutes;
  el.cancelEditBtn.hidden = false;
  el.name.focus();
  el.name.select();
}

function startNap(id, startTs, overrideMinutes) {
  const c = state.children.find((x) => x.id === id);
  if (!c) return;
  const start = startTs ?? Date.now();
  const minutes = overrideMinutes != null ? overrideMinutes : c.maxMinutes;
  const wakeAt = start + minutes * 60_000;
  c.napStartTs = start;
  c.wakeAtTs = wakeAt;
  saveChildren();
  render();
  scheduleWakeCheck(c);
}
function stopNap(id) {
  const c = state.children.find((x) => x.id === id);
  if (!c) return;
  if (c.napStartTs) {
    const end = Date.now();
    const durMs = end - c.napStartTs;
    c.logs = c.logs || [];
    c.logs.unshift({ start: c.napStartTs, end, durMs });
  }
  c.napStartTs = null;
  c.wakeAtTs = null;
  saveChildren();
  render();
}

function tick() {
  let anyChanged = false;
  state.children.forEach((c) => {
    if (c.napStartTs && c.wakeAtTs) {
      const remaining = c.wakeAtTs - Date.now();
      if (remaining <= 0 && !c._alarmDone) {
        triggerAlarm(c);
        c._alarmDone = true;
      }
      anyChanged = true;
    }
  });
  if (anyChanged) render();
}
setInterval(tick, 1000);

function triggerAlarm(child) {
  if (state.soundEnabled) {
    try {
      el.alarm.currentTime = 0;
      el.alarm.play();
    } catch {}
  }
  if (state.notifPermission && navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification("Tid for oppvåkning", {
        body: `${child.name} skal vekkes nå`,
        icon: "icons/icon-192.png",
        vibrate: [200, 100, 200],
        tag: `wake-${child.id}`,
      });
    });
  }
}
function scheduleWakeCheck(child) {
  const delay = Math.max(0, child.wakeAtTs - Date.now());
  setTimeout(() => triggerAlarm(child), delay);
}

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = el.childId.value;
  const name = el.name.value;
  const max = el.maxMinutes.value;
  if (!name || !max) return;
  if (id) updateChild(id, name, max);
  else addChild(name, max);
  el.form.reset();
  el.childId.value = "";
  el.cancelEditBtn.hidden = true;
});
el.cancelEditBtn.addEventListener("click", () => {
  el.form.reset();
  el.childId.value = "";
  el.cancelEditBtn.hidden = true;
});

el.enableSoundBtn.addEventListener("click", async () => {
  try {
    await el.alarm.play();
    el.alarm.pause();
    el.alarm.currentTime = 0;
    state.soundEnabled = true;
    el.enableSoundBtn.textContent = "Lyd aktivert ✅";
    el.enableSoundBtn.disabled = true;
  } catch {
    alert("Kunne ikke aktivere lyd. Prøv igjen etter et klikk/trykk.");
  }
});

el.enableNotifBtn.addEventListener("click", async () => {
  if (typeof Notification === "undefined")
    return alert("Varsler støttes ikke i denne nettleseren.");
  const perm = await Notification.requestPermission();
  state.notifPermission = perm === "granted";
  if (state.notifPermission) {
    el.enableNotifBtn.textContent = "Varsler på ✅";
    el.enableNotifBtn.disabled = true;
  }
});

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  el.installBtn.hidden = false;
});
el.installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  el.installBtn.hidden = true;
});

const updateUI = { waitingSW: null };
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          updateUI.waitingSW = reg.waiting || newWorker;
          if (el.updateBanner) el.updateBanner.style.display = "block";
        }
      });
    });
    if (reg.waiting) {
      updateUI.waitingSW = reg.waiting;
      if (el.updateBanner) el.updateBanner.style.display = "block";
    }
  });
  el.reloadBtn?.addEventListener("click", () => {
    if (updateUI.waitingSW) updateUI.waitingSW.postMessage("SKIP_WAITING");
  });
  el.dismissUpdateBtn?.addEventListener("click", () => {
    if (el.updateBanner) el.updateBanner.style.display = "none";
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

function openManualDialog(childId) {
  el.manualChildId.value = childId;
  el.manualStartTime.value = "";
  el.manualOverride.value = "";
  if (el.manualDialog?.showModal) el.manualDialog.showModal();
  else alert("Dialog støttes ikke i denne nettleseren.");
}
el.manualSave?.addEventListener("click", (e) => {
  e.preventDefault();
  const id = el.manualChildId.value;
  const ts = parseTimeToTimestamp(el.manualStartTime.value);
  if (!ts) {
    alert("Ugyldig starttid");
    return;
  }
  const overrideMin = el.manualOverride.value
    ? Number(el.manualOverride.value)
    : null;
  startNap(id, ts, overrideMin);
  el.manualDialog.close();
});
const closeX = document.getElementById("manualCloseX");

closeX?.addEventListener("click", (e) => {
  e.preventDefault();
  el.manualDialog.close();
});

el.manualDialog?.addEventListener("click", (e) => {
  if (e.target === el.manualDialog) {
    el.manualDialog.close();
  }
});

el.manualDialog?.addEventListener("cancel", (e) => {
  el.manualDialog.close();
});

render();
