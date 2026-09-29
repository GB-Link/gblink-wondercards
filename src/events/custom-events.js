import { createEventDescriptor, eventGames, mysteryGiftStep } from './descriptor.js';
import { CUSTOM_WONDERCARDS } from './custom-wondercards.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

function guideFor(card) {
  return [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    mysteryGiftStep(eventGames({ roms: card.roms, variants: card.payloads })),
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
  ];
}

export const customWondercardEvents = CUSTOM_WONDERCARDS.map((card) => createEventDescriptor({
  id: card.id,
  label: card.label,
  description: card.description,
  serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
  mbootFlag: 0,
  maxPlayers: 0,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
  gnameBytes: identity.gnameBytes,
  unameBytes: identity.unameBytes,
  payloadBytes: Object.values(card.payloads)[0][0],
  variants: card.payloads,
  roms: card.roms,
  game: null,
  guideSteps: guideFor(card),
}));
