export function createEventDescriptor(partial = {}) {
  return {
    id: partial.id ?? 'custom',
    label: partial.label ?? 'Custom event',
    description: partial.description ?? '',
    serialNo: partial.serialNo ?? 0,
    mbootFlag: partial.mbootFlag ?? 0,
    maxPlayers: partial.maxPlayers ?? 0,
    gnameLabel: partial.gnameLabel ?? partial.gname ?? '',
    unameLabel: partial.unameLabel ?? partial.uname ?? '',
    gnameBytes: partial.gnameBytes ?? null,
    unameBytes: partial.unameBytes ?? null,
    payloadBytes: partial.payloadBytes ?? null,
    guideSteps: partial.guideSteps ?? [],
  };
}

export function identityFromEvent(event) {
  return {
    serialNo: event.serialNo & 0xffff,
    mbootFlag: event.mbootFlag ?? 0,
    maxPlayers: event.maxPlayers ?? 0,
    gnameBytes: event.gnameBytes,
    unameBytes: event.unameBytes,
  };
}
