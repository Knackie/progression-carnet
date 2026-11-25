// Forms show at least 3 inputs (e.g. 3 strengths) even when fewer were saved.
export function padToThree(values?: string[] | null): string[] {
  const list = values ?? [];
  return [...list, '', '', ''].slice(0, Math.max(3, list.length));
}
