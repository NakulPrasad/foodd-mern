import Cookies from "js-cookie";

/**
 * Custom Hook to manage browser cookie values cleanly without double stringifying.
 */
export const useCookie = () => {
  const setItem = (key: string, value: any) => {
    if (value === undefined || value === null) {
      return;
    }
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      Cookies.set(key, stringValue, { expires: 1 });
    } catch (error: any) {
      console.error("Cookie setItem error:", error);
    }
  };

  const getItem = (key: string) => {
    try {
      const value = Cookies.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error: any) {
      console.error("Cookie getItem error:", error);
      return null;
    }
  };

  const removeItem = (key: string) => {
    try {
      Cookies.remove(key);
    } catch (error: any) {
      console.error("Cookie removeItem error:", error);
    }
  };

  return { setItem, getItem, removeItem };
};
