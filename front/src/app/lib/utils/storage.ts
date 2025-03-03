export class Storage {
  static get<TValue = unknown>(key: string) {
    try {
      const fromStorage = localStorage.getItem(key);
      if (!fromStorage) return null;
      return JSON.parse(fromStorage) as TValue;
    } catch {
      return null;
    }
  }

  static set<TValue = unknown>(key: string, value: TValue) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static delete(key: string) {
    localStorage.removeItem(key);
  }
}
