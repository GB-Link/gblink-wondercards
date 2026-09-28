import { createEventDescriptor } from './descriptor.js';
import { CUSTOM_WONDERCARDS } from './custom-wondercards.js';
import {
  defaultWonderDistributorIdentity,
  frlgWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
  VERSION_EMERALD,
} from './rfu-identity.js';

const identities = {
  frlg: frlgWonderDistributorIdentity(),
  emerald: defaultWonderDistributorIdentity(VERSION_EMERALD),
};

function guideFor(card) {
  const emerald = card.game === 'emerald';
  return [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    emerald
      ? 'On English Emerald, unlock Mystery Gift at a Pokémon Center, then stay on the main menu and choose Mystery Gift → Wireless Communication.'
      : 'On English FireRed or LeafGreen, unlock Mystery Gift at a Pokémon Center, then choose Mystery Gift → Wireless Communication from the title screen.',
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
    card.effect
      || (emerald
        ? 'Hold R to speed up the overworld, battles, and text. Let go of R to play at normal speed. After a reset, talk to the delivery person again.'
        : 'Hold R to speed up the overworld and text. Let go of R to play at normal speed. After a reset, talk to the delivery person again.'),
  ];
}

export const customWondercardEvents = CUSTOM_WONDERCARDS.map((card) => {
  const identity = identities[card.game] ?? identities.frlg;
  return createEventDescriptor({
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
    guideSteps: guideFor(card),
    game: card.game ?? 'frlg',
    hook: card.hook ?? null,
  });
});
