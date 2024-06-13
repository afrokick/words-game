import { shuffleArray } from "./utils";

export enum GameStates {
  playing,
  win,
}

class State {
  state: GameStates = GameStates.playing;

  currentLvl: number = 1;

  words: string[] = [];

  typingWord: string = '';

  symbols: string[] = [];

  async checkWord() {

  }

  async generateWords() {
    const repsonse = await fetch(`./levels/${this.currentLvl}.json`);
    const json = await repsonse.json();

    if ('words' in json && Array.isArray(json.words)) {
      const words = json.words as string[];

      const shuffledWords = shuffleArray(words);
      const wordsCount = 5; // TODO randomly?
      this.words = shuffledWords.slice(0, Math.min(wordsCount, shuffledWords.length)).sort((a, b) => a.length - b.length);

      const totalSymbols: Record<string, number> = {} as any;

      this.words.forEach(word => {
        const wordSymbolsCount = this.calculateSymbolsInWord(word);

        Object.entries(wordSymbolsCount).forEach(([symbol, count]) => {
          if (totalSymbols[symbol] == null || totalSymbols[symbol] < count) {
            totalSymbols[symbol] = count;
          }
        });
      });

      this.symbols = Object.entries(totalSymbols).reduce((acc, pair) => {
        while (pair[1]--) {
          acc.push(pair[0]);
        }
        return acc;
      }, [] as string[]);
    }
  }

  calculateSymbolsInWord(word: string) {
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
}

export const GlobalState = new State();
