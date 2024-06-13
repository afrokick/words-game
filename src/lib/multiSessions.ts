import { GameEventBus } from "./gameEventBus";
import { PersistedStorage } from "./persistedStorage";
import { getRandomString } from "./utils";

const SAVES_SESSION_KEY = '__words_session';

class MultiSessionsManager {
  private currentSession: string = '';
  private expired = false;

  async init() {
    GameEventBus.tabVisibilityChanged.on(async visible => {
      if (!visible || this.expired) return;

      const isValid = await this.isCurrentSessionValid();
      if (isValid) return;

      this.expired = true;

      GameEventBus.sessionExpired.emit();
    });


    this.startSession();
  }

  private async getSavedSession() {
    return PersistedStorage.get(SAVES_SESSION_KEY);
  }

  private async isCurrentSessionValid() {
    const lastSession = await this.getSavedSession();

    if (!lastSession) return true;

    return this.currentSession === lastSession;
  }

  async startSession() {
    this.currentSession = getRandomString();
    await PersistedStorage.set(SAVES_SESSION_KEY, this.currentSession);
    this.expired = false;
    GameEventBus.sessionUpdated.emit();
  }
}

export const MultiSessions = new MultiSessionsManager();
