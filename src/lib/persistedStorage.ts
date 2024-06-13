class Storage {
  async get(key: string) {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }
}

export const PersistedStorage = new Storage();
