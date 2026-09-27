import { auroraTicket } from './aurora-ticket.js';
import { blisyMysteryEvent } from './blisy-mystery-event.js';
import { jpajWondercardEvents } from './jpaj-events.js';
import { jpajFrlgWondercardEvents } from './jpaj-frlg-events.js';
import { goppierWondercardEvents } from './goppier-events.js';
import { customWondercardEvents } from './custom-events.js';
import { createEventDescriptor } from './descriptor.js';
import {
  buildWonderDistributorGname,
  buildWonderDistributorUname,
  defaultWonderDistributorIdentity,
} from './rfu-identity.js';

export { createEventDescriptor, identityFromEvent } from './descriptor.js';
export { auroraTicket } from './aurora-ticket.js';
export { jpajWondercardEvents } from './jpaj-events.js';
export { jpajFrlgWondercardEvents } from './jpaj-frlg-events.js';
export { JPAJ_WONDERCARDS } from './jpaj-wondercards.js';
export { JPAJ_FRLG_WONDERCARDS } from './jpaj-frlg-wondercards.js';
export { goppierWondercardEvents } from './goppier-events.js';
export { GOPPIER_WONDERCARDS } from './goppier-wondercards.js';
export { customWondercardEvents } from './custom-events.js';
export { CUSTOM_WONDERCARDS } from './custom-wondercards.js';
export {
  BLISY_TICKET_PAYLOAD,
  BLISY_WONDERCARD_BYTES,
  BLISY_SCRIPT_BYTES,
  BLISY_PAYLOAD_SOURCE,
} from './blisy-payload.js';
export {
  AURORA_TICKET_PAYLOAD,
  AURORA_WONDERCARD_BYTES,
  AURORA_SCRIPT_BYTES,
  AURORA_PAYLOAD_SOURCE,
} from './aurora-payload.js';
export {
  buildWonderDistributorGname,
  buildWonderDistributorUname,
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

export const EVENT_GROUPS = [
  {
    label: 'Pokémon Emerald',
    events: [auroraTicket, blisyMysteryEvent, ...jpajWondercardEvents],
  },
  {
    label: 'FireRed / LeafGreen',
    events: [...jpajFrlgWondercardEvents],
  },
  {
    label: 'Project Wonder (Goppier)',
    events: [...goppierWondercardEvents],
  },
  {
    label: 'Custom',
    events: [...customWondercardEvents],
  },
];

export const EVENT_PRESETS = EVENT_GROUPS.flatMap((group) => group.events);

export function eventOptionLabel(event) {
  return String(event?.label ?? '')
    .replace(/\s*\((Emerald|FireRed\/LeafGreen)\)\s*$/i, '')
    .trim();
}

export function customEventFromPayload(payloadBytes, opts = {}) {
  const base = defaultWonderDistributorIdentity();
  return createEventDescriptor({
    id: 'custom-payload',
    label: opts.label ?? opts.filename ?? 'Custom payload',
    description: opts.description ?? `Raw payload (${payloadBytes.length} bytes)`,
    serialNo: opts.serialNo ?? auroraTicket.serialNo,
    mbootFlag: opts.mbootFlag ?? 0,
    maxPlayers: opts.maxPlayers ?? 0,
    gnameLabel: opts.gnameLabel ?? auroraTicket.gnameLabel,
    unameLabel: opts.unameLabel ?? auroraTicket.unameLabel,
    gnameBytes: opts.gnameBytes ?? base.gnameBytes,
    unameBytes: opts.unameBytes ?? base.unameBytes,
    payloadBytes,
    guideSteps: opts.guideSteps ?? auroraTicket.guideSteps,
  });
}

export function findPreset(id) {
  const key = String(id ?? '').trim().toLowerCase();
  if (!key) return null;
  return EVENT_PRESETS.find((e) => e.id.toLowerCase() === key) ?? null;
}
