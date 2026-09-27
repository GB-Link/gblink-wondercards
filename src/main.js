import {
  connect,
  disconnect,
  isConnected,
  onAdapterDisconnect,
} from './link/gblink.js';
import {
  runSession,
  setFirmwareWireLog,
  cancelSession,
} from './link/wireless-mode.js';
import {
  EVENT_GROUPS,
  EVENT_PRESETS,
  eventOptionLabel,
  findPreset,
  identityFromEvent,
} from './events/index.js';

const eventSelect = document.getElementById('event-select');
const statusText = document.getElementById('status-text');
const statusIndicator = document.getElementById('status-indicator');
const instructionBox = document.getElementById('instruction-box');
const instructionLabel = document.getElementById('instruction-label');
const instructionText = document.getElementById('instruction-text');
const stepper = document.getElementById('stepper');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const logEl = document.getElementById('log');
const logPanel = document.getElementById('log-panel');
const copyLogBtn = document.getElementById('copy-log-btn');
const resultBanner = document.getElementById('result-banner');
const resultTitle = document.getElementById('result-title');
const resultDetail = document.getElementById('result-detail');

let currentEvent = EVENT_PRESETS[0];
let busy = false;
let phase = 'idle';

const PHASE_CONFIG = {
  idle: {
    step: 0,
    kind: '',
    indicator: 'idle',
    instructionType: 'default',
    instruction: 'Choose an event, then connect the GB-Link adapter.',
  },
  connecting: {
    step: 0,
    kind: 'busy',
    indicator: 'active',
    instructionType: 'default',
    instruction: 'Approve the browser permission prompt.',
  },
  connected: {
    step: 2,
    kind: 'ok',
    indicator: 'success',
    instructionType: 'default',
    instruction:
      'Stay on the Emerald main menu, then open Mystery Gift → Wireless Communication.',
  },
  session: {
    step: 3,
    kind: 'busy',
    indicator: 'active',
    instructionType: 'default',
    instruction:
      'On Emerald, search for the wireless distribution and accept it. Keep this page open.',
  },
  complete: {
    step: 4,
    kind: 'ok',
    indicator: 'success',
    instructionType: 'success',
    instructionLabel: 'Complete',
    instruction:
      'Pick another event in the list to send a second card. On the GBA, return to Mystery Gift → Wireless Communication.',
  },
  error: {
    step: -1,
    kind: 'err',
    indicator: 'error',
    instructionType: 'error',
    instructionLabel: 'Error',
    instruction: 'Check the log, then try again.',
  },
};

function playingOn(event = currentEvent) {
  return event?.game === 'frlg' ? 'FireRed or LeafGreen' : 'Emerald';
}

function openMysteryGift(event = currentEvent) {
  if (event?.game === 'frlg') {
    return 'On FireRed or LeafGreen, from the title screen open Mystery Gift → Wireless Communication.';
  }
  return 'Stay on the Emerald main menu, then open Mystery Gift → Wireless Communication.';
}

function log(message) {
  const now = new Date();
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  logEl.textContent += `[${now.toLocaleTimeString()}.${ms}] ${message}\n`;
  logPanel.hidden = false;
  logEl.scrollTop = logEl.scrollHeight;
}

function updateStepper(activeStep) {
  const stepEls = stepper.querySelectorAll('.stepper-step');
  const lineEls = stepper.querySelectorAll('.stepper-line');
  const last = stepEls.length - 1;

  stepEls.forEach((el, i) => {
    if (activeStep < 0) {
      el.removeAttribute('data-state');
    } else if (i < activeStep) {
      el.dataset.state = 'done';
    } else if (i === activeStep) {
      el.dataset.state = i === last ? 'complete' : 'active';
    } else {
      el.removeAttribute('data-state');
    }
  });

  lineEls.forEach((el, i) => {
    if (activeStep > i) el.dataset.state = 'done';
    else el.removeAttribute('data-state');
  });
}

function setStatus(text, kind = '') {
  statusText.textContent = text;
  statusText.className = `status${kind ? ` ${kind}` : ''}`;
}

function applyPhase(next, { status, instruction } = {}) {
  phase = next;
  const cfg = PHASE_CONFIG[next] ?? PHASE_CONFIG.idle;
  setStatus(status ?? cfg.instruction, cfg.kind);
  statusIndicator.dataset.type = cfg.indicator;
  instructionLabel.textContent = cfg.instructionLabel ?? 'Next step';
  instructionText.textContent = instruction ?? cfg.instruction;
  instructionBox.dataset.type = cfg.instructionType;
  document.body.dataset.phase = next;
  updateStepper(cfg.step);
}

function hideResult() {
  resultBanner.hidden = true;
}

function showResult(ok, title, detail) {
  resultBanner.hidden = false;
  resultBanner.className = ok ? 'result' : 'result fail';
  resultTitle.textContent = title;
  resultDetail.textContent = detail;
  resultBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function refreshButtons() {
  const connected = isConnected();
  connectBtn.disabled = busy || connected;
  disconnectBtn.disabled = busy || !connected;
}

async function startSession() {
  if (busy || !isConnected()) return;
  const payloadBytes = currentEvent.payloadBytes;
  if (!payloadBytes?.length) {
    applyPhase('error', { status: 'No payload for this event.' });
    return;
  }
  busy = true;
  const consoleName = playingOn();
  applyPhase('session', {
    status: `Waiting for ${consoleName} to take the Mystery Gift…`,
    instruction: `On ${consoleName}, search for the wireless distribution and accept it. Keep this page open.`,
  });
  hideResult();
  refreshButtons();
  try {
    await runSession({
      identity: identityFromEvent(currentEvent),
      payloadBytes,
      readyMessage: `Armed — open Mystery Gift → Wireless on ${consoleName} now (adapter must already be connected)`,
      onStatus: (message) => {
        log(message);
        if (phase !== 'session') return;
        if (message === 'Event delivered' || message === 'Delivery complete') {
          setStatus(message, 'ok');
        } else {
          setStatus(message, 'busy');
        }
      },
    });
    const name = eventOptionLabel(currentEvent);
    applyPhase('complete', { status: 'Delivery complete.' });
    showResult(
      true,
      'Wonder Card delivered',
      `${name} is saved on the GBA. Open Mystery Gift → Wonder Cards to view it. To send another card, choose it above, then open Wireless Communication again.`,
    );
    log(`${name} delivered`);
  } catch (err) {
    const msg = err.message ?? String(err);
    applyPhase('error', { status: msg });
    showResult(false, 'Not sent', msg);
    log(msg);
  } finally {
    busy = false;
    refreshButtons();
  }
}

function eventIdFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('event') || params.get('id') || '';
  } catch {
    return '';
  }
}

function applyEventSelection(id) {
  const preset = findPreset(id) ?? EVENT_PRESETS[0];
  if (!preset) return null;
  eventSelect.value = preset.id;
  currentEvent = { ...preset };
  return preset;
}

function populateEventSelect() {
  eventSelect.innerHTML = '';
  for (const group of EVENT_GROUPS) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    for (const preset of group.events) {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.dataset.id = preset.id;
      opt.textContent = eventOptionLabel(preset);
      optgroup.appendChild(opt);
    }
    eventSelect.appendChild(optgroup);
  }
  const requested = eventIdFromQuery();
  const selected = applyEventSelection(requested);
  if (requested && !findPreset(requested)) {
    log(`Unknown event id “${requested}”; using ${selected?.id ?? 'default'}`);
  } else if (requested && selected) {
    log(`Selected ${selected.label} from URL`);
  }
}

eventSelect.addEventListener('change', () => {
  const preset = applyEventSelection(eventSelect.value);
  if (!preset) return;
  log(`Selected ${preset.label}`);
  if (!busy && phase === 'idle') {
    instructionText.textContent = preset.game === 'frlg'
      ? 'Connect, then on FireRed or LeafGreen open Mystery Gift → Wireless Communication from the title screen.'
      : PHASE_CONFIG.idle.instruction;
  }
  if (isConnected() && !busy) queueMicrotask(() => startSession());
});

connectBtn.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  applyPhase('connecting', { status: 'Waiting for adapter permission…' });
  refreshButtons();
  try {
    await connect({
      linkMode: 'wireless',
      cableOverride: 2,
      onProgress: (message) => {
        log(message);
        setStatus(message, 'busy');
      },
    });
    await setFirmwareWireLog(true);
    hideResult();
    const where = openMysteryGift();
    applyPhase('connected', {
      status: `Armed. ${where}`,
      instruction: where,
    });
    log(`Adapter ready — ${where}`);
  } catch (err) {
    const msg = err.message ?? String(err);
    applyPhase('error', { status: msg });
    log(msg);
    try { await disconnect(); } catch { }
  } finally {
    busy = false;
    refreshButtons();
    if (isConnected()) queueMicrotask(() => startSession());
  }
});

disconnectBtn.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  refreshButtons();
  try {
    await cancelSession();
    await disconnect();
    hideResult();
    applyPhase('idle', { status: 'Disconnected.' });
    log('Disconnected');
  } catch (err) {
    const msg = err.message ?? String(err);
    applyPhase('error', { status: msg });
    log(msg);
  } finally {
    busy = false;
    refreshButtons();
  }
});

copyLogBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(logEl.textContent);
    copyLogBtn.textContent = 'Copied';
    setTimeout(() => { copyLogBtn.textContent = 'Copy'; }, 1200);
  } catch {
  }
});

onAdapterDisconnect(() => {
  log('Adapter disconnected');
  hideResult();
  applyPhase('idle', { status: 'Disconnected.' });
  refreshButtons();
});

function init() {
  if (!navigator.usb && !navigator.serial) {
    applyPhase('error', { status: 'Use Chrome, Edge, or Firefox.' });
    connectBtn.disabled = true;
    return;
  }
  populateEventSelect();
  applyPhase('idle');
  refreshButtons();
}

init();
