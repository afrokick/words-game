import { GameEventBus } from "./gameEventBus";
import { rotate, shuffleArray } from "./utils";

export enum UIStates {
  playing,
  win,
}

class Store {
  uiState = UIStates.playing;

  persistedState: {
    currentLvl: number;
    words: { word: string, finished: boolean; }[];
    pickedSymbolsIndicies: number[];
  } = {
      currentLvl: 1,
      words: [],
      pickedSymbolsIndicies: [],
    };

  symbols: { char: string, x: number, y: number; }[] = [];

  async checkWord() {

  }

  async generateWords() {
    const repsonse = await fetch(`./levels/${this.persistedState.currentLvl}.json`);
    const json = await repsonse.json();

    if ('words' in json && Array.isArray(json.words)) {
      const words = json.words as string[];

      const shuffledWords = shuffleArray(words);
      const wordsCount = 5; // TODO randomly?
      this.persistedState.words = shuffledWords.slice(0, Math.min(wordsCount, shuffledWords.length)).sort((a, b) => a.length - b.length).map(word => ({ word, finished: false }));

      const totalSymbols: Record<string, number> = {} as any;

      this.persistedState.words.forEach(word => {
        const wordSymbolsCount = this.calculateSymbolsInWord(word.word);

        Object.entries(wordSymbolsCount).forEach(([symbol, count]) => {
          if (totalSymbols[symbol] == null || totalSymbols[symbol] < count) {
            totalSymbols[symbol] = count;
          }
        });
      });

      const chars = Object.entries(totalSymbols).reduce((acc, pair) => {
        while (pair[1]--) {
          acc.push(pair[0]);
        }
        return acc;
      }, [] as string[]);

      this.symbols = chars.map((char, i) => {
        const [x, y] = rotate(147, -147, 147, 0, 360 * i / chars.length);
        return {
          char,
          x,
          y
        };
      });

      this.persistedState.pickedSymbolsIndicies = [];
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

  // input

  beginInput(index: number) {
    this.persistedState.pickedSymbolsIndicies.push(index);

    GameEventBus.charPicked.emit(index);
  }

  pickSymbol(index: number) {
    this.persistedState.pickedSymbolsIndicies.push(index);

    GameEventBus.charPicked.emit(index);
  }

  isPossibleToSelect(index: number): boolean {
    return this.persistedState.pickedSymbolsIndicies.length > 0 && !this.persistedState.pickedSymbolsIndicies.includes(index);
  }

  finishInput() {
    const word = this.persistedState.pickedSymbolsIndicies.map(i => this.symbols[i].char).join('');

    this.persistedState.pickedSymbolsIndicies.length = 0;

    for (const wordInfo of this.persistedState.words) {
      if (wordInfo.finished) continue;

      if (wordInfo.word !== word) continue;

      wordInfo.finished = true;
      GameEventBus.wordFound.emit();
      return;
    }

    GameEventBus.wordFailed.emit();
  }
}

export const GlobalStore = new Store();
