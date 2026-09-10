import { useState, useEffect } from "react";
import { loadChildren, saveChildren, parseTimeToTimestamp } from "./helpers";
import AppBar from "./components/AppBar";
import ChildForm from "./components/ChildForm";
import ChildList from "./components/ChildList";
import ManualDialog from "./components/ManualDialog";
import UpdateBanner from "./components/UpdateBanner";
import FAQSection from "./components/FAQSection";
import { Container, MainContent, Card, Footer } from "./App.styled";

function App() {
  const [children, setChildren] = useState(() => loadChildren());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" &&
      Notification.permission === "granted",
  );
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [manualDialogChildId, setManualDialogChildId] = useState(null);
  const [updateUI, setUpdateUI] = useState({ waitingSW: null });

  // Persist children to localStorage
  useEffect(() => {
    saveChildren(children);
  }, [children]);

  // Timer tick for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setChildren((prev) => {
        let anyChanged = false;
        const updated = prev.map((c) => {
          if (c.napStartTs && c.wakeAtTs && !c._alarmDone) {
            const remaining = c.wakeAtTs - Date.now();
            if (remaining <= 0) {
              triggerAlarm(c);
              return { ...c, _alarmDone: true };
            }
            anyChanged = true;
          }
          return c;
        });
        return anyChanged ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled, notifPermission]);

  // Service Worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setUpdateUI({ waitingSW: reg.waiting || newWorker });
                setUpdateAvailable(true);
              }
            });
          });
          if (reg.waiting) {
            setUpdateUI({ waitingSW: reg.waiting });
            setUpdateAvailable(true);
          }
        })
        .catch(() => {
          // SW registration failed
        });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store event for later use if needed
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const triggerAlarm = (child) => {
    if (soundEnabled) {
      try {
        const audio = document.getElementById("alarmAudio");
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      } catch {}
    }

    if (notifPermission && navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification("Tid for oppvåkning", {
          body: `${child.name} skal vekkes nå`,
          icon: "/icons/icon-192.png",
          vibrate: [200, 100, 200],
          tag: `wake-${child.id}`,
        });
      });
    }
  };

  const addChild = (name, maxMinutes) => {
    const newChild = {
      id: Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      maxMinutes: Number(maxMinutes),
      napStartTs: null,
      wakeAtTs: null,
      logs: [],
    };
    setChildren((prev) => [...prev, newChild]);
    setEditingId(null);
  };

  const updateChild = (id, name, maxMinutes) => {
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, name: name.trim(), maxMinutes: Number(maxMinutes) }
          : c,
      ),
    );
    setEditingId(null);
  };

  const deleteChild = (id) => {
    if (confirm("Slette barnet?")) {
      setChildren((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const startNap = (id, startTs, overrideMinutes) => {
    setChildren((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const start = startTs ?? Date.now();
          const minutes =
            overrideMinutes != null ? overrideMinutes : c.maxMinutes;
          const wakeAt = start + minutes * 60000;
          return {
            ...c,
            napStartTs: start,
            wakeAtTs: wakeAt,
            _alarmDone: false,
          };
        }
        return c;
      }),
    );
  };

  const stopNap = (id) => {
    setChildren((prev) =>
      prev.map((c) => {
        if (c.id === id && c.napStartTs) {
          const end = Date.now();
          const durMs = end - c.napStartTs;
          const logs = c.logs || [];
          return {
            ...c,
            napStartTs: null,
            wakeAtTs: null,
            logs: [{ start: c.napStartTs, end, durMs }, ...logs],
            _alarmDone: false,
          };
        }
        return c;
      }),
    );
  };

  const handleEnableSound = async () => {
    try {
      const audio = document.getElementById("alarmAudio");
      if (audio) {
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        setSoundEnabled(true);
      }
    } catch {
      alert("Kunne ikke aktivere lyd. Prøv igjen etter et klikk/trykk.");
    }
  };

  const handleEnableNotif = async () => {
    if (typeof Notification === "undefined") {
      alert("Varsler støttes ikke i denne nettleseren.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifPermission(true);
    }
  };

  const handleUpdate = () => {
    if (updateUI.waitingSW) {
      updateUI.waitingSW.postMessage("SKIP_WAITING");
    }
  };

  const childToEdit = editingId
    ? children.find((c) => c.id === editingId)
    : null;

  return (
    <Container>
      <AppBar
        soundEnabled={soundEnabled}
        onEnableSound={handleEnableSound}
        onEnableNotif={handleEnableNotif}
      />
      <MainContent>
        <Card>
          <ChildForm
            onSubmit={(name, minutes) => {
              if (editingId) {
                updateChild(editingId, name, minutes);
              } else {
                addChild(name, minutes);
              }
            }}
            onCancel={() => setEditingId(null)}
            initialName={childToEdit?.name || ""}
            initialMinutes={childToEdit?.maxMinutes || ""}
            isEditing={!!editingId}
          />
        </Card>

        <Card>
          <h2>Barne-liste</h2>
          <ChildList
            children={children}
            onEdit={(id) => setEditingId(id)}
            onDelete={deleteChild}
            onStart={(id) => startNap(id, Date.now(), null)}
            onStop={stopNap}
            onManual={(id) => setManualDialogChildId(id)}
          />
        </Card>

        {updateAvailable && (
          <UpdateBanner
            onUpdate={handleUpdate}
            onDismiss={() => setUpdateAvailable(false)}
          />
        )}

        <Card>
          <FAQSection />
        </Card>
      </MainContent>

      <ManualDialog
        isOpen={!!manualDialogChildId}
        childName={
          children.find((c) => c.id === manualDialogChildId)?.name || ""
        }
        onSubmit={(startTime, overrideMinutes) => {
          const ts = parseTimeToTimestamp(startTime);
          if (ts) {
            startNap(manualDialogChildId, ts, overrideMinutes);
            setManualDialogChildId(null);
          } else {
            alert("Ugyldig starttid");
          }
        }}
        onClose={() => setManualDialogChildId(null)}
      />

      <Footer>
        <small>© Kristine Tyrholm – Sovetid PWA demo</small>
      </Footer>
    </Container>
  );
}

export default App;
