const localStorageService = {
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      return undefined;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return {
        key: value,
      };
    } catch (err) {
      return undefined;
    }
  },

  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return undefined;
    }
  },
};

export default localStorageService;
