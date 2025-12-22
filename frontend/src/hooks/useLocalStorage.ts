export const useLocalStorage = () => {
  const setItem = (name: string, value: any | string | undefined | null) => {
    if (!value) {
      throw new Error("setItem : value is empty");
    }
    try {
      localStorage.set(name, JSON.stringify(value));
    } catch (error: any) {
      console.error(error);
    }
  };
  const getItem = (name: string) => {
    try {
      const value = localStorage.get(name);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error: any) {
      console.error(error);
    }
  };
  const removeItem = (name: string) => {
    try {
      localStorage.remove(name);
    } catch (error: any) {
      console.error(error);
    }
  };
  return { setItem, getItem, removeItem };
};
