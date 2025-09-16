// ======= STATE/DOM =======
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
function supportsNotificationTriggers() {
  return typeof window !== "undefined" && "TimestampTrigger" in window;
}

// ======= RENDER =======
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
    node.querySelector(".prefs").textContent = `Maks sovetid: ${child.maxMinutes} min`;

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
      times.textContent = "";
      const a = document.createTextNode(
        `Sovnet kl. ${fmtTime(child.napStartTs)} • Skal vekkes kl. `
      );
      const b = document.createElement("span");
      b.className = "wake-time";
      b.textContent = fmtTime(child.wakeAtTs);
      times.append(a, b);

      if (remaining > 0) {
        status.innerHTML = `⏳ Tid igjen: <strong>${fmtDur(remaining)}</strong>`;
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
        times.textContent = `${fmtRange(last.start, last.end)} – sovet ${fmtDurShort(last.durMs)}`;
      }
    }

    startBtn.addEventListener("click", () => startNap(child.id, Date.now(), null));
    manualBtn.addEventListener("click", () => openManualDialog(child.id));
    stopBtn.addEventListener("click", () => stopNap(child.id));
    editBtn.addEventListener("click", () => editChild(child.id));
    deleteBtn.addEventListener("click", () => deleteChild(child.id));
    el.list.appendChild(node);
  });
}

// ======= CRUD =======
function addChild(name, maxMinutes) {
  state.children.push({
    id: uid(),
    name: name.trim(),
    maxMinutes: Number(maxMinutes),
    napStartTs: null,
    wakeAtTs: null,
    logs: [],
    qstashId: null,
    qstashGcId: null,
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
  const c = state.children.find((x) => x.id === id);
  // try canceling scheduled pushes before deletion
  if (c?.qstashId) cancelServerPush(c.qstashId).catch(() => {});
  if (c?.qstashGcId) cancelServerPush(c.qstashGcId).catch(() => {});
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

// ======= NAP FLOW =======
async function startNap(id, startTs, overrideMinutes) {
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

  // server push (notification when app is closed)
  try {
    const { messageId, gcMessageId } = await scheduleServerPush(wakeAt, `wake-${c.id}`);
    c.qstashId = messageId;
    c.qstashGcId = gcMessageId;
    saveChildren();
  } catch (e) {
    console.warn("Unable to schedule QStash:", e);
  }
}

async function stopNap(id) {
  const c = state.children.find((x) => x.id === id);
  if (!c) return;
  if (c.napStartTs) {
    const end = Date.now();
    const durMs = end - c.napStartTs;
    c.logs = c.logs || [];
    c.logs.unshift({ start: c.napStartTs, end, durMs });
  }
  // cancel any scheduled server push to avoid late notifications
  try {
    if (c.qstashId) await cancelServerPush(c.qstashId);
    if (c.qstashGcId) await cancelServerPush(c.qstashGcId);
  } catch (e) {
    console.warn("Unable to cancel QStash:", e);
  }

  c.napStartTs = null;
  c.wakeAtTs = null;
  c.qstashId = null;
  c.qstashGcId = null;
  saveChildren();
  render();
}

// ======= TICK =======
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

// ======= LOCAL ALARM/NOTIF =======
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

async function scheduleWakeCheck(child) {
  const ts = child.wakeAtTs;
  if (!ts) return;
  try {
    if (supportsNotificationTriggers() && state.notifPermission && "serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("Tid for oppvåkning", {
        body: `${child.name} skal vekkes nå`,
        tag: `wake-${child.id}`,
        icon: "icons/icon-192.png",
        vibrate: [200, 100, 200],
        showTrigger: new TimestampTrigger(ts),
      });
      return;
    }
  } catch (err) {
    console.warn("Trigger failed, falling back:", err);
  }
  const delay = Math.max(0, ts - Date.now());
  setTimeout(() => triggerAlarm(child), delay);
}

// ======= FORM/UI =======
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
    el.enableNotifBtn.textContent = supportsNotificationTriggers()
      ? "Varsler på ✅ (planlegger lokalt)"
      : "Varsler på ✅";
    el.enableNotifBtn.disabled = true;
  }
});

// install prompt
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

// ======= SW UPDATES (banner + force reload) =======
const updateUI = { waitingSW: null };
function showBanner() { el.updateBanner?.classList.add("show"); }
function hideBanner() { el.updateBanner?.classList.remove("show"); }

async function forceUpdate() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) { location.reload(); return; }

  await reg.update();

  const skip = (w) => { w.postMessage("SKIP_WAITING"); hideBanner(); };

  if (reg.waiting) { skip(reg.waiting); return; }

  if (reg.installing) {
    reg.installing.addEventListener("statechange", function onsc() {
      if (this.state === "installed") {
        this.removeEventListener("statechange", onsc);
        if (reg.waiting) { skip(reg.waiting); }
        else { location.reload(); }
      }
    });
    return;
  }

  location.reload();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener("statechange", () => {
        if (nw.state === "installed" && navigator.serviceWorker.controller) {
          updateUI.waitingSW = reg.waiting || nw;
          showBanner();
        }
      });
    });

    if (reg.waiting) {
      updateUI.waitingSW = reg.waiting;
      showBanner();
    }
  });

  el.reloadBtn?.addEventListener("click", forceUpdate);
  document.getElementById("checkUpdateBtn")?.addEventListener("click", forceUpdate);

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

// ======= MANUAL DIALOG =======
function openManualDialog(childId) {
  el.manualChildId.value = childId;
  el.manualStartTime.value = "";
  el.manualOverride.value = "";
  if (el.manualDialog?.showModal) {
    el.manualDialog.showModal();
    requestAnimationFrame(() => {
      el.manualStartTime?.focus({ preventScroll: true });
    });
  } else {
    alert("Dialog støttes ikke i denne nettleseren.");
  }
}
el.manualSave?.addEventListener("click", (e) => {
  e.preventDefault();
  const id = el.manualChildId.value;
  const ts = parseTimeToTimestamp(el.manualStartTime.value);
  if (!ts) {
    alert("Ugyldig starttid");
    return;
  }
  const overrideMin = el.manualOverride.value ? Number(el.manualOverride.value) : null;
  startNap(id, ts, overrideMin);
  el.manualDialog.close();
});
document.getElementById("manualCancel")?.addEventListener("click", () => el.manualDialog.close());
document.getElementById("manualCloseX")?.addEventListener("click", (e) => {
  e.preventDefault();
  el.manualDialog.close();
});
el.manualDialog?.addEventListener("click", (e) => {
  if (e.target === el.manualDialog) el.manualDialog.close();
});
el.manualDialog?.addEventListener("cancel", () => el.manualDialog.close());

render();

// ======= SERVER: QSTASH INTEGRATION =======
async function getPushSubscription() {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const key = window.VAPID_PUBLIC;
    if (!key) throw new Error("VAPID public key mangler");
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
  }
  return sub;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

// schedule push at wakeAtTs and a GC-cancel a few hours later
async function scheduleServerPush(wakeAtTs, tag, gcAfterMs = 3 * 60 * 60 * 1000) {
  const sub = await getPushSubscription();
  const res = await fetch("/.netlify/functions/schedule", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      subscription: sub,
      wakeAtIso: new Date(wakeAtTs).toISOString(),
      tag,
      gcAfterMs,
    }),
  });
  if (!res.ok) throw new Error("schedule failed");
  return await res.json();
}

// cancel scheduled message (used when stopping)
async function cancelServerPush(messageId) {
  const res = await fetch("/.netlify/functions/cancel", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messageId }),
  });
  if (!res.ok) throw new Error("cancel failed");
}
