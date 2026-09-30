import { createEventDescriptor } from './descriptor.js';
import { YOUPILEOUF_FRA_TICKET_PAYLOAD } from './youpileouf-fra-payload.js';
import { YOUPILEOUF_GER_TICKET_PAYLOAD } from './youpileouf-ger-payload.js';
import {
  buildWonderDistributorGname,
  buildWonderDistributorUname,
  LANGUAGE_FRENCH,
  LANGUAGE_GERMAN,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
  VERSION_EMERALD,
} from './rfu-identity.js';

function identityFor(language) {
  return {
    serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
    mbootFlag: 0,
    maxPlayers: 0,
    gnameBytes: buildWonderDistributorGname({ language, version: VERSION_EMERALD }),
    unameBytes: buildWonderDistributorUname('DISTRIB'),
  };
}

function guide(password, menuName) {
  return [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    `On Emerald, unlock Mystery Gift at any Poké Mart counter with ${password}, then choose ${menuName} → Wireless Communication on the main menu.`,
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
    'Save, then use Mystery Event from the menu as the card instructs.',
  ];
}

const shared = {
  mbootFlag: 0,
  maxPlayers: 0,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
};

export const youpileoufMysteryEventFra = createEventDescriptor({
  ...shared,
  id: 'youpileouf-mystery-event-fra',
  label: 'Youpileouf Emerald Mystery Event (FRA)',
  description: 'Unlocks Mystery Event on French Emerald, the option the game uses to read e-Reader cards. The deliveryman asks you to save; after that, Mystery Event is on the main menu.',
  ...identityFor(LANGUAGE_FRENCH),
  payloadBytes: YOUPILEOUF_FRA_TICKET_PAYLOAD,
  guideSteps: guide('RELIE TOUS TES AMIS', 'Cadeau Myst.'),
});

export const youpileoufMysteryEventGer = createEventDescriptor({
  ...shared,
  id: 'youpileouf-mystery-event-ger',
  label: 'Youpileouf Emerald Mystery Event (GER)',
  description: 'Unlocks Mystery Event on German Emerald, the option the game uses to read e-Reader cards. The deliveryman asks you to save; after that, Mystery Event is on the main menu.',
  ...identityFor(LANGUAGE_GERMAN),
  payloadBytes: YOUPILEOUF_GER_TICKET_PAYLOAD,
  guideSteps: guide('VERBINDUNG MIT ALLEN', 'Geheimgeschenk'),
});
