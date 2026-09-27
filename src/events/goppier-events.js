import { createEventDescriptor } from './descriptor.js';
import { GOPPIER_WONDERCARDS } from './goppier-wondercards.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

const GUIDE = [
  'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
  'Select this event, click Connect, and wait for “Armed”.',
  'On Emerald: Mystery Gift → Wireless Communication from the main menu.',
  'On FireRed/LeafGreen: unlock Mystery Gift, then Wireless Communication from the title screen. Emerald-only events will not save on FR/LG.',
  'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
];

export const goppierWondercardEvents = GOPPIER_WONDERCARDS.map((card) =>
  createEventDescriptor({
    id: card.id,
    label: card.label,
    description:
      `${card.blurb} Payload ${card.payload.length} bytes from ${card.source}.`,
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
