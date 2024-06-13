import { GameEventBus } from "./gameEventBus";
import { PersistedStorage } from "./persistedStorage";
import { getRandomString } from "./utils";

const SAVES_SESSION_KEY = '__words_session';

class MultiSessionsManager {
  private currentSession: string = '';

  async init() {
    let expired = false;
    GameEventBus.tabVisibilityChanged.on(async visible => {
      if (!visible || expired) return;

      const isValid = await this.isCurrentSessionValid();
      if (isValid) return;

      expired = true;

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

  private async startSession() {
    this.currentSession = getRandomString();
    await PersistedStorage.set(SAVES_SESSION_KEY, this.currentSession);
  }
}

export const MultiSessions = new MultiSessionsManager();
