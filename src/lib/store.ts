import { GameEventBus } from "./gameEventBus";
import { PersistedStorage } from "./persistedStorage";
import { calculateSymbolsInWord, rotate, shuffleArray } from "./utils";

const SAVES_STATE_KEY = '__words_state';
const LVL_NUMS = 3;

export enum UIStates {
  loading,
  playing,
  win,
}

type Point = { x: number, y: number; };

class Store {
  uiState = UIStates.loading;

  persistedState: {
    currentLvl: number;
    words: { word: string, finished: boolean; }[];
  } = {
      currentLvl: 1,
      words: [],
    };

  symbols: ({ char: string, } & Point)[] = [];
  pickedSymbolsIndicies: number[] = [];

  relativePointerPosition: Point | null = null;

  relativeLinePoints: Point[] = [];

  windowSize: Point = { x: 0, y: 0 };

  getWindowPoint(relX: number, relY: number): Point {
    return { x: relX * this.windowSize.x, y: relY * this.windowSize.y };
  };

  getWindowLinePoints(): Point[] {
    return this.relativeLinePoints.map(p => this.getWindowPoint(p.x, p.y));
  }

  async launchGame() {
    await this.loadState();

    // if game was interrupted on the WIN screen
    if (this.isLvlSolved()) {
      await this.goToNextLvl();
      return;
    }

    await this.prepareLvl(this.persistedState.words.length === 0);
    this.uiState = UIStates.playing;
    GameEventBus.uiStateChanged.emit(this.uiState);
  }

  private async loadWords() {
    try {
      const cycledLvl = ((this.persistedState.currentLvl - 1) % LVL_NUMS) + 1;
      const repsonse = await fetch(`./levels/${cycledLvl}.json`);
      const json = await repsonse.json();

      if ('words' in json && Array.isArray(json.words)) {
        return json.words as string[];
      }
    } catch (error) {
      console.error(error);
    }

    throw new Error(`something wrong`); //TODO
  }

  private async prepareLvl(fresh = false) {
    if (fresh) {
      const words = await this.loadWords();
      this.generateWords(words);
    }

    this.generateSymbols();

    this.pickedSymbolsIndicies = [];

    await this.saveState();
  }

  private generateWords(words: string[]) {
    console.log(words);
    const shuffledWords = shuffleArray(words);
    const wordsCount = 5; // TODO randomly?
    this.persistedState.words = shuffledWords.slice(0, Math.min(wordsCount, shuffledWords.length)).sort((a, b) => a.length - b.length).map(word => ({ word, finished: false }));
  }

  private generateSymbols() {
    const totalSymbols: Record<string, number> = {} as any;

    this.persistedState.words.forEach(word => {
      const wordSymbolsCount = calculateSymbolsInWord(word.word);

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
  }

  // input

  pickSymbol(index: number) {
    this.pickedSymbolsIndicies.push(index);

    GameEventBus.charPicked.emit(index);
  }

  isPossibleToSelect(index: number): boolean {
    return this.pickedSymbolsIndicies.length > 0 && !this.pickedSymbolsIndicies.includes(index);
  }

  private isLvlSolved(): boolean {
    return this.persistedState.words.length > 0 && this.persistedState.words.every(w => w.finished);
  }

  async finishInput() {
    const word = this.pickedSymbolsIndicies.map(i => this.symbols[i].char).join('');

    this.pickedSymbolsIndicies.length = 0;
    this.relativePointerPosition = null;
    this.relativeLinePoints.length = 0;
    GameEventBus.lineChanged.emit();

    for (const wordInfo of this.persistedState.words) {
      if (wordInfo.word !== word) continue;

      if (wordInfo.finished) {
        GameEventBus.wordExisted.emit();
        return;
      }

      wordInfo.finished = true;
      GameEventBus.wordFound.emit();

      await this.saveState();

      if (this.isLvlSolved()) {
        await this.goToWin();
      }

      return;
    }

    GameEventBus.wordFailed.emit();
  }

  private async goToWin() {
    this.uiState = UIStates.win;
    GameEventBus.uiStateChanged.emit(this.uiState);
  }

  async goToNextLvl() {
    this.persistedState.currentLvl++;
    await this.prepareLvl(true);
    this.uiState = UIStates.playing;
    GameEventBus.uiStateChanged.emit(this.uiState);
  }

  private async saveState() {
    await PersistedStorage.set(SAVES_STATE_KEY, JSON.stringify(this.persistedState));
  }

  private async loadState() {
    const str = await PersistedStorage.get(SAVES_STATE_KEY);
    if (str) {
      this.persistedState = JSON.parse(str);
    }
  }

  processPointerMove(clientX: number, clientY: number): void {
    const relX = clientX / this.windowSize.x;
    const relY = clientY / this.windowSize.y;

    if (!this.relativePointerPosition) {
      this.relativePointerPosition = { x: relX, y: relY };
    } else {
      this.relativePointerPosition.x = relX;
      this.relativePointerPosition.y = relY;
    }

    GameEventBus.relativePointerChanged.emit(this.relativePointerPosition);
    GameEventBus.lineChanged.emit();
  }

  addWindowLinePoint(x: number, y: number): void {
    const relX = x / this.windowSize.x;
    const relY = y / this.windowSize.y;

    this.relativeLinePoints.push({ x: relX, y: relY });
    GameEventBus.lineChanged.emit();
  }
}

export const GlobalStore = new Store();

// for debugging
(window as any).__globalStorer = GlobalStore;
