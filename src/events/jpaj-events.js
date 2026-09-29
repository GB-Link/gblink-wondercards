import { createEventDescriptor, mysteryGiftStep } from './descriptor.js';
import { JPAJ_WONDERCARDS } from './jpaj-wondercards.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

const GUIDE = [
  'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
  'Select this event, click Connect, and wait for “Armed”.',
  mysteryGiftStep({ games: ['emerald'] }),
  'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
];

export const jpajWondercardEvents = JPAJ_WONDERCARDS.map((card) =>
  createEventDescriptor({
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
    payloadBytes: card.payload,
    guideSteps: GUIDE,
  }),
);
