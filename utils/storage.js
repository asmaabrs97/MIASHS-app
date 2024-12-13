export const getLocalStorage = (key) => {
    if (process.client) {
      return JSON.parse(localStorage.getItem(key));
    }
    return null;
  };
  
  export const setLocalStorage = (key, value) => {
    if (process.client) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  