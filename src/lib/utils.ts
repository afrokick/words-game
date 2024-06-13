export function shuffleArray<T extends any[]>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function rotate(cx: number, cy: number, x: number, y: number, angle: number) {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
  const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

export function wait(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

export function calculateSymbolsInWord(word: string) {
  const totalSymbols: Record<string, number> = {} as any;

  for (const s of word) {
    if (totalSymbols[s] == null) {
      totalSymbols[s] = 1;
    } else {
      totalSymbols[s]++;
    }
  }

  return totalSymbols;
}

export function getRandomString() {
  return Date.now() + '_' + Math.round(Math.random() * 1000000);
};