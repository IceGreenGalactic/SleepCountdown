export const uid = () => Math.random().toString(36).slice(2, 10);

export const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const fmtDur = (ms) => {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const hr = Math.floor(m / 60);
  const min = m % 60;
  return hr > 0 ? `${hr}t ${min}m ${sec}s` : `${min}m ${sec}s`;
};

export const fmtRange = (startTs, endTs) => {
  return `${fmtTime(startTs)}–${fmtTime(endTs)}`;
};

export const fmtDurShort = (ms) => {
  let s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  return h ? `${h}t ${m}m` : `${m}m`;
};

export const parseTimeToTimestamp = (hhmm) => {
  if (!hhmm) return null;
  const [hh, mm] = hhmm.split(':').map(Number);
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
};

export const saveChildren = (children) => {
  localStorage.setItem('children.v1', JSON.stringify(children));
};

export const loadChildren = () => {
  try {
    const raw = localStorage.getItem('children.v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
