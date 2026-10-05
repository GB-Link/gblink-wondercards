import { isTransportAvailable } from './link/gblink.js';
import { Distribution, FirmwareError } from './link/distribution.js';
import { describeGameCode, describeRom, isJapanese } from './link/mystery-gift.js';
import {
  EVENT_GROUPS,
  EVENT_PRESETS,
  customWondercardEvents,
  eventGames,
  eventLanguages,
  eventOptionLabel,
  findPreset,
  gamesPhrase,
} from './events/index.js';
import { WC3_GAMES, Wc3Error, payloadForGame, wc3Event, wc3FileName, wc3FromPayload } from './events/wc3.js';
import { SAVE_BYTES, describeSave } from './link/save.js';

const LAUNCHER_URL = 'https://launcher.gblink.io';

const eventSelect = document.getElementById('event-select');
const statusText = document.getElementById('status-text');
const statusIndicator = document.getElementById('status-indicator');
const instructionBox = document.getElementById('instruction-box');
const instructionLabel = document.getElementById('instruction-label');
const instructionText = document.getElementById('instruction-text');
const descriptionText = document.getElementById('description-text');
const stepper = document.getElementById('stepper');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const logEl = document.getElementById('log');
const logPanel = document.getElementById('log-panel');
const copyLogBtn = document.getElementById('copy-log-btn');
const resultBanner = document.getElementById('result-banner');
const resultTitle = document.getElementById('result-title');
const resultDetail = document.getElementById('result-detail');
const decisionBox = document.getElementById('decision');
const decisionTitle = document.getElementById('decision-title');
const decisionDetail = document.getElementById('decision-detail');
const decisionSend = document.getElementById('decision-send');
const decisionSkip = document.getElementById('decision-skip');
const wc3Export = document.getElementById('wc3-export');
const wc3Game = document.getElementById('wc3-game');
const wc3Download = document.getElementById('wc3-download');
const wc3Open = document.getElementById('wc3-open');
const wc3File = document.getElementById('wc3-file');
const wc3Note = document.getElementById('wc3-note');
const wc3Own = document.getElementById('wc3-own');
const savBox = document.getElementById('sav-box');
const savOpen = document.getElementById('sav-open');
const savFile = document.getElementById('sav-file');
const savName = document.getElementById('sav-name');
const savNote = document.getElementById('sav-note');
const backupsBox = document.getElementById('backups');
const backupsList = document.getElementById('backups-list');
const progressBox = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

let currentEvent = EVENT_PRESETS[0];
let fileEvent = null;   // the card of a .wc3 opened on the page
let restoreFile = null; // the .sav chosen to restore, { bytes, name }
const backups = [];     // saves backed up while the page is open, newest first: { bytes, name, whole, time }
let linkBackup = null;  // the entry for the backup in this link
let checkedGame = null; // the game the Game Boy Advance linked last reported
let wholeSave = false;  // the save in this link came over whole
let busy = false;
let phase = 'idle';

const distribution = new Distribution({ log });

const PHASE_CONFIG = {
  idle: { step: 0, kind: '', indicator: 'idle', instructionType: 'default' },
  connecting: { step: 0, kind: 'busy', indicator: 'active', instructionType: 'default' },
  ready: { step: 2, kind: 'ok', indicator: 'success', instructionType: 'default' },
  linking: { step: 3, kind: 'busy', indicator: 'active', instructionType: 'default' },
  deciding: { step: 3, kind: 'busy', indicator: 'active', instructionType: 'default' },
  complete: {
    step: 4,
    kind: 'ok',
    indicator: 'success',
    instructionType: 'success',
    instructionLabel: 'Complete',
  },
  error: {
    step: -1,
    kind: 'err',
    indicator: 'error',
    instructionType: 'error',
    instructionLabel: 'Error',
  },
};

// Mystery Gift is on the main menu in every game; name the ones the event runs on.
function whereToOpen(event = currentEvent) {
  const games = eventGames(event);
  return `On ${gamesPhrase(games)}, choose Mystery Gift on the main menu, then Wireless Communication.`;
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

function setInstruction(text, link = null) {
  instructionText.textContent = text;
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.text;
    instructionText.append(' ', a);
  }
}

function applyPhase(next, { status, instruction, link } = {}) {
  phase = next;
  const cfg = PHASE_CONFIG[next] ?? PHASE_CONFIG.idle;
  setStatus(status ?? statusText.textContent, cfg.kind);
  statusIndicator.dataset.type = cfg.indicator;
  instructionLabel.textContent = cfg.instructionLabel ?? 'Next step';
  if (instruction !== undefined) setInstruction(instruction, link);
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
  const connected = distribution.connected;
  connectBtn.disabled = busy || connected;
  disconnectBtn.disabled = busy || !connected;
}

function playerLabel(player) {
  if (!player) return 'the Game Boy Advance';
  const name = player.name || 'the Game Boy Advance';
  return player.version ? `${name} (${player.version})` : name;
}

distribution.onStatus = ({ stage, player, detail, event }) => {
  const label = eventOptionLabel(event ?? currentEvent);
  switch (stage) {
    case 'open':
      // A result stays on screen until the next Game Boy Advance joins.
      if (resultBanner.hidden) applyPhase('ready', { status: `Ready to send ${label}.`, instruction: whereToOpen() });
      break;
    case 'joining':
      wholeSave = false;
      linkBackup = null;
      progressBox.hidden = true;
      hideResult();
      applyPhase('linking', { status: 'A Game Boy Advance is joining…', instruction: 'Keep this page open.' });
      log('A Game Boy Advance asked to join');
      break;
    case 'linked':
      applyPhase('linking', { status: `Linked with ${playerLabel(player)}.` });
      log(`Linked with ${playerLabel(player)}`);
      break;
    case 'checking':
      applyPhase('linking', { status: 'Checking the Wonder Card on the Game Boy Advance…' });
      break;
    case 'checked':
      checkedGame = detail;
      if (detail?.gameCode) log(`The Game Boy Advance is running ${describeRom(detail)}`);
      break;
    case 'asking':
      applyPhase('linking', {
        status: 'The Game Boy Advance already has a different Wonder Card.',
        instruction: 'Answer on the Game Boy Advance whether to throw it away and receive the new one.',
      });
      log('The Game Boy Advance is asking whether to replace its Wonder Card');
      break;
    case 'sending':
      applyPhase('linking', { status: `Sending ${label}…`, instruction: 'Keep this page open.' });
      log(`Sending ${label}`);
      break;
    case 'backing-up':
      if (detail?.save) {
        keepBackup(detail.save, saveFileName({ game: checkedGame, player }), detail.summary?.sound);
        wholeSave = true;
        log('The whole save is in');
      }
      showProgress(detail?.done ?? 0, detail?.total ?? 128);
      applyPhase('linking', {
        status: `Backing up the save: ${detail?.done ?? 0} of ${detail?.total ?? 128} KB`,
        instruction: 'Keep this page open; the Game Boy Advance shows “Communicating” until it is done.',
      });
      break;
    case 'restoring':
      showProgress(detail?.done ?? 0, detail?.total ?? 18);
      applyPhase('linking', {
        status: `Restoring the save: ${detail?.done ?? 0} of ${detail?.total ?? 18} sectors written`,
        instruction: 'Keep this page open and the Game Boy Advance on; it saves when the restore is done.',
      });
      break;
    case 'closing':
      progressBox.hidden = true;
      applyPhase('linking', { status: 'Finishing the link…' });
      break;
    default:
      break;
  }
};

distribution.onDecision = (request) => {
  if (!request) {
    decisionBox.hidden = true;
    return;
  }
  const { reasons, game, event } = request;
  const connected = describeGameCode(game.gameCode);
  const lines = [];
  if (reasons.includes('same-card')) {
    decisionTitle.textContent = 'This Game Boy Advance already has this Wonder Card, or one for the same event.';
    lines.push('Send it again to replace the card on the Game Boy Advance with this one.');
  } else {
    decisionTitle.textContent = `This card is for ${gamesPhrase(eventGames(event))}.`;
  }
  if (reasons.includes('other-game')) {
    lines.push(`The Game Boy Advance is running ${connected}. The card may not work there.`);
  }
  decisionDetail.textContent = lines.join(' ');
  decisionBox.hidden = false;
  applyPhase('deciding', {
    status: 'Waiting for your choice…',
    instruction: 'The Game Boy Advance waits on "Communicating" until you choose.',
  });
  decisionBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

function answer(send) {
  decisionBox.hidden = true;
  log(send ? 'Sending anyway' : 'Not sending');
  applyPhase('linking', { status: send ? 'Sending anyway…' : 'Telling the Game Boy Advance…' });
  distribution.decide(send);
}

decisionSend.addEventListener('click', () => answer(true));
decisionSkip.addEventListener('click', () => answer(false));

distribution.onResult = (result) => {
  decisionBox.hidden = true;
  progressBox.hidden = true;
  const name = eventOptionLabel(result.event ?? currentEvent);
  const next = `To send another card, choose it above. ${whereToOpen()}`;
  const again = `To try again, ${whereToOpen().replace(/^On/, 'on')}`;
  switch (result.outcome) {
    case 'backed-up': {
      const game = describeRom(result.game);
      const whole = result.summary.sound;
      keepBackup(result.save, saveFileName(result), whole);
      applyPhase('complete', { status: 'Save backed up.', instruction: 'Download the .sav file below.' });
      showResult(whole, whole ? 'Save backed up' : 'Save backed up, but not whole',
        whole ? `The whole save of ${game} is here. Download the .sav file below.`
          : `The save of ${game} came over, but neither of its two copies is whole. Download the .sav file, and back it up again.`);
      log(`Backed up the save of ${game}`);
      break;
    }
    case 'restored':
      applyPhase('complete', { status: 'Save restored.', instruction: 'Let the game finish saving; Continue then loads it.' });
      showResult(true, 'Save restored', `${result.event?.saveName ?? 'The .sav'} is on ${describeRom(result.game)}. Let the game finish saving before turning it off.`);
      log(`Restored ${result.event?.saveName ?? 'the .sav'}`);
      break;
    case 'restore-failed': {
      const detail = result.reason === 'unsound'
        ? 'The .sav has no whole copy of a game in it. Nothing on the cartridge changed.'
        : 'The cartridge could not take the save, so the game saved nothing. The cartridge keeps the save it had.';
      applyPhase('ready', { status: 'Not restored.', instruction: again });
      showResult(false, 'Not restored', detail);
      log(`Not restored: ${detail}`);
      break;
    }
    case 'sent':
      applyPhase('complete', { status: 'Wonder Card delivered.', instruction: next });
      showResult(true, 'Wonder Card delivered', `${name} is on the Game Boy Advance. Wait for it to finish saving before turning it off.`);
      log(`${name} delivered`);
      break;
    case 'had-card':
      applyPhase('ready', { status: 'Not sent: the Game Boy Advance already had this card.', instruction: next });
      showResult(false, 'Not sent', 'The Game Boy Advance already had this Wonder Card.');
      log('Not sent: the Game Boy Advance already had this card');
      break;
    case 'kept-card':
      applyPhase('ready', { status: 'Not sent: the old Wonder Card was kept.', instruction: next });
      showResult(false, 'Not sent', 'The Wonder Card already on the Game Boy Advance was kept.');
      log('Not sent: the old Wonder Card was kept');
      break;
    case 'declined':
      applyPhase('ready', { status: 'Not sent.', instruction: next });
      showResult(false, 'Not sent', `${name} was not sent.`);
      log('Not sent');
      break;
    case 'cant-accept':
      applyPhase('ready', { status: 'The Game Boy Advance could not accept a Wonder Card.', instruction: next });
      showResult(false, 'Not sent', 'The Game Boy Advance could not accept a Wonder Card.');
      log('The Game Boy Advance could not accept a Wonder Card');
      break;
    case 'unsupported': {
      const event = result.event ?? currentEvent;
      if (event.kind) {
        const detail = `The save ${event.kind === 'backup' ? 'backup' : 'restore'} does not run on ${describeRom(result.game)}.`;
        applyPhase('ready', { status: detail, instruction: next });
        showResult(false, 'Not done', detail);
        log(detail);
        break;
      }
      const languages = eventLanguages(event);
      const japanese = isJapanese(result.game);
      let why = `${name} only runs on ${gamesPhrase(eventGames(event))}.`;
      if (japanese && !languages.japanese) why = `${name} has no Wonder Card for the Japanese games, which lay theirs out differently.`;
      if (!japanese && !languages.international) why = `${name} is a Japanese Wonder Card: it only goes to the Japanese games.`;
      const detail = `${why} The Game Boy Advance is running ${describeRom(result.game)}.`;
      applyPhase('ready', { status: 'Not sent: this card does not run on this game.', instruction: next });
      showResult(false, 'Not sent', detail);
      log(`Not sent: ${detail}`);
      break;
    }
    default: {
      const kind = (result.event ?? currentEvent)?.kind;
      const what = kind === 'backup' ? 'the backup was done' : kind === 'restore' ? 'the restore was done' : 'the card was delivered';
      let detail = result.outcome === 'lost'
        ? `The link to the Game Boy Advance dropped before ${what}.`
        : result.message ?? 'The link to the Game Boy Advance failed.';
      if (kind === 'restore') detail += ' Choose Mystery Gift again to go on from where it stopped; until it is done, the cartridge keeps the save it had.';
      if (kind === 'backup' && wholeSave) {
        applyPhase('complete', { status: 'Save backed up.', instruction: 'Download the .sav file below.' });
        showResult(true, 'Save backed up', 'The whole save came over before the link dropped. Download the .sav file below; the cartridge’s save is as it was.');
        log('The whole save came over before the link dropped');
        break;
      }
      if (kind === 'backup') detail += ' Choose Mystery Gift again to go on from where it stopped, while this page stays open.';
      applyPhase('error', { status: detail, instruction: again });
      showResult(false, 'Not sent', detail);
      log(detail);
      break;
    }
  }
};

distribution.onAdapter = ({ gbaReady, resetLoop }) => {
  if (resetLoop) {
    setStatus('The Game Boy Advance keeps restarting the adapter.', 'err');
    setInstruction('Use a Game Boy Color link cable and check that it is plugged in firmly at both ends.');
    log('The Game Boy Advance keeps restarting the adapter: check the link cable');
  } else if (gbaReady && phase === 'ready') {
    log('The Game Boy Advance found the adapter');
  }
};

distribution.onDisconnect = () => {
  decisionBox.hidden = true;
  progressBox.hidden = true;
  log('Adapter disconnected');
  applyPhase('idle', { status: 'Adapter disconnected.', instruction: 'Connect the GB-Link adapter to continue.' });
  refreshButtons();
};

function eventIdFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('event') || params.get('id') || '';
  } catch {
    return '';
  }
}

// The event as it goes out: a restore carries the chosen .sav.
function withSave(event) {
  return event.kind === 'restore' && restoreFile ? { ...event, save: restoreFile.bytes, saveName: restoreFile.name } : event;
}

// The .sav a backup came to: game, player and day.
function saveFileName(result) {
  const game = describeGameCode(result.game.gameCode).replace(/ \(.*\)$/, '');
  const player = (result.player?.name || 'save').replace(/[^\p{L}\p{N}_-]+/gu, '');
  return `${game}-${player}-${new Date().toISOString().slice(0, 10)}.sav`;
}

function showProgress(done, total) {
  const percent = Math.round(Math.max(0, Math.min(1, total ? done / total : 0)) * 100);
  progressBox.hidden = false;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(percent));
  progressLabel.textContent = `${percent}%`;
}

// A backup the link brought in: the whole save arrives before the exchange ends, and
// the end may still mark it whole or not, so one link keeps one entry.
function keepBackup(bytes, name, whole) {
  if (!linkBackup) {
    linkBackup = { bytes, name, whole, time: new Date() };
    backups.unshift(linkBackup);
  } else {
    Object.assign(linkBackup, { bytes, name, whole: whole ?? linkBackup.whole });
  }
  renderBackups();
}

function renderBackups() {
  backupsBox.hidden = !backups.length;
  backupsList.replaceChildren(...backups.map((backup) => {
    const item = document.createElement('li');
    const copy = document.createElement('div');
    copy.className = 'backup-copy';
    const name = document.createElement('p');
    name.className = 'backup-name';
    name.textContent = backup.name;
    const meta = document.createElement('p');
    meta.className = 'backup-meta';
    const time = backup.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.textContent = backup.whole === false ? `${time} · neither copy is whole` : time;
    copy.append(name, meta);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = 'Download';
    button.addEventListener('click', () => downloadSave(backup));
    item.append(copy, button);
    return item;
  }));
}

function downloadSave(backup) {
  const url = URL.createObjectURL(new Blob([backup.bytes], { type: 'application/octet-stream' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = backup.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  log(`Downloaded ${backup.name}`);
}

// A .sav chosen for the restore: 128 KB of flash (a 16-byte emulator footer is
// dropped), with at least one whole copy of the game.
async function openSav(file) {
  if (!file) return;
  let bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length === SAVE_BYTES + 16) bytes = bytes.subarray(0, SAVE_BYTES);
  restoreFile = null;
  let problem = null;
  if (bytes.length !== SAVE_BYTES) problem = `${file.name} is not a FireRed, LeafGreen or Emerald save: those are 128 KB.`;
  else if (!describeSave(bytes).sound) problem = `${file.name} has no whole copy of a game in it.`;
  else restoreFile = { bytes: bytes.slice(), name: file.name };
  savNote.textContent = problem ?? '';
  savNote.hidden = !problem;
  savName.textContent = restoreFile ? restoreFile.name : 'to restore';
  log(problem ?? `Chose ${file.name} to restore`);
  currentEvent = withSave(currentEvent);
  distribution.setEvent(currentEvent);
}

function applyEventSelection(id) {
  const preset = (fileEvent && id === fileEvent.id ? fileEvent : findPreset(id)) ?? EVENT_PRESETS[0];
  if (!preset) return null;
  eventSelect.value = preset.id;
  currentEvent = withSave(preset);
  savBox.hidden = preset.kind !== 'restore';
  descriptionText.textContent = preset.description;
  renderExport(preset);
  return preset;
}

// The games a GB-Link Team card can be downloaded for, as a .wc3 for emulators and save editors.
function renderExport(event) {
  const games = customWondercardEvents.includes(event)
    ? WC3_GAMES.filter((game) => payloadForGame(event.variants, event.roms, game))
    : [];
  wc3Export.hidden = !games.length;
  if (!games.length) return;
  const previous = wc3Game.value;
  wc3Game.replaceChildren(...games.map((game) => new Option(game.name, game.name)));
  if (games.some((game) => game.name === previous)) wc3Game.value = previous;
}

function downloadWc3() {
  const game = WC3_GAMES.find((candidate) => candidate.name === wc3Game.value);
  const payload = game && payloadForGame(currentEvent.variants, currentEvent.roms, game);
  if (!payload) return;
  const url = URL.createObjectURL(new Blob([wc3FromPayload(payload, game.japanese)], { type: 'application/octet-stream' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = wc3FileName(`${eventOptionLabel(currentEvent)} (${game.name})`);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  log(`Downloaded ${link.download}`);
}

// A .wc3 someone opened or dropped: listed under its own group and chosen.
async function openWc3(file) {
  if (!file) return;
  wc3Note.hidden = true;
  let event;
  try {
    event = wc3Event(new Uint8Array(await file.arrayBuffer()), file.name);
  } catch (error) {
    wc3Note.textContent = error instanceof Wc3Error ? error.message : `${file.name} could not be read.`;
    wc3Note.hidden = false;
    wc3Own.open = true;                 // a dropped file's note shows even when the section is folded
    log(`${file.name}: ${wc3Note.textContent}`);
    return;
  }
  fileEvent = event;
  let group = eventSelect.querySelector('optgroup[data-file]');
  if (!group) {
    group = document.createElement('optgroup');
    group.label = 'Your .wc3 file';
    group.dataset.file = '';
    eventSelect.appendChild(group);
  }
  group.replaceChildren(new Option(eventOptionLabel(event), event.id));
  chooseEvent(event.id);
}

function populateEventSelect() {
  eventSelect.innerHTML = '';
  for (const group of EVENT_GROUPS) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    for (const preset of group.events) {
      const opt = document.createElement('option');
      opt.value = preset.id;
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

eventSelect.addEventListener('change', () => chooseEvent(eventSelect.value));

function chooseEvent(id) {
  const preset = applyEventSelection(id);
  if (!preset) return;
  wc3Note.hidden = true;
  log(`Selected ${eventOptionLabel(preset)}`);
  distribution.setEvent(currentEvent);
  if (phase === 'idle') {
    setInstruction(`Connect the GB-Link adapter. ${whereToOpen(preset)}`);
  } else if (phase === 'ready' || phase === 'complete') {
    applyPhase('ready', { status: `Ready to send ${eventOptionLabel(preset)}.`, instruction: whereToOpen(preset) });
  }
}

wc3Download.addEventListener('click', downloadWc3);
wc3Open.addEventListener('click', () => wc3File.click());
wc3File.addEventListener('change', () => {
  openWc3(wc3File.files[0]);
  wc3File.value = '';
});

// A file dropped anywhere on the page is opened as a .wc3 instead of replacing the page.
function dragsFiles(event) {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}
window.addEventListener('dragover', (event) => {
  if (!dragsFiles(event)) return;
  event.preventDefault();
  document.body.dataset.dropping = '';
});
window.addEventListener('dragleave', (event) => {
  if (!event.relatedTarget) delete document.body.dataset.dropping;
});
window.addEventListener('drop', (event) => {
  if (!dragsFiles(event)) return;
  event.preventDefault();
  delete document.body.dataset.dropping;
  openWc3(event.dataTransfer.files[0]);
});

savOpen.addEventListener('click', () => savFile.click());
savFile.addEventListener('change', () => {
  openSav(savFile.files?.[0]);
  savFile.value = '';
});

connectBtn.addEventListener('click', async () => {
  if (busy) return;
  if (currentEvent.kind === 'restore' && !restoreFile) {
    applyPhase('error', { status: 'Choose the .sav file to restore first.', instruction: 'Use “Choose the .sav file” above.' });
    return;
  }
  busy = true;
  hideResult();
  applyPhase('connecting', { status: 'Waiting for adapter permission…', instruction: 'Approve the browser permission prompt.' });
  refreshButtons();
  try {
    await distribution.connect(currentEvent, (message) => {
      log(message);
      setStatus(message, 'busy');
    });
    log(`Adapter ready (firmware ${distribution.firmware})`);
  } catch (err) {
    if (err instanceof FirmwareError) {
      applyPhase('error', {
        status: err.message,
        instruction: 'Update the adapter in the GB-Link launcher, then connect again.',
        link: { href: LAUNCHER_URL, text: 'Open the launcher' },
      });
    } else {
      const msg = err?.name === 'NotFoundError' ? 'No adapter was chosen.' : err.message ?? String(err);
      applyPhase('error', { status: msg, instruction: 'Check the adapter, then connect again.' });
    }
    log(statusText.textContent);
  } finally {
    busy = false;
    refreshButtons();
  }
});

disconnectBtn.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  refreshButtons();
  decisionBox.hidden = true;
  try {
    await distribution.disconnect();
    hideResult();
    applyPhase('idle', { status: 'Disconnected.', instruction: `Connect the GB-Link adapter. ${whereToOpen()}` });
    log('Disconnected');
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

function init() {
  if (!isTransportAvailable()) {
    applyPhase('error', { status: 'Use Chrome, Edge, or Firefox.', instruction: 'This browser cannot reach USB devices.' });
    connectBtn.disabled = true;
    return;
  }
  populateEventSelect();
  applyPhase('idle', {
    status: 'Choose an event, then connect.',
    instruction: `Connect the GB-Link adapter. ${whereToOpen()}`,
  });
  refreshButtons();
}

init();
