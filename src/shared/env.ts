const TRUTHY_VALUES = ["1", "true", "yes"];

export function shouldUseMocks(rawValue = import.meta.env.VITE_USE_MOCKS): boolean {
  if (rawValue === undefined) {
    return true;
  }

  return TRUTHY_VALUES.includes(String(rawValue).toLowerCase());
}

export function chooseDataUrl(useMocks: boolean, liveUrl: string | undefined, mockUrl: string): string {
  if (useMocks || !liveUrl) {
    return mockUrl;
  }

  return liveUrl;
}
