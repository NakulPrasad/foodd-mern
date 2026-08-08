import Cookies from "js-cookie";

/**
 * Custom Hook to manage a cookie value 
 * 
 * @returns An Object containing:
 * - `setItem`: A function to get cookie value
 * - `getItem`: A function to set/update cookie 
 * - `removeItem`: A function to delete the cookie
 */
export const useCookie = () => {
  /**
   * @description Set Key Value pair to browser cookie storage, expire after 24hrs
   * @param key - Unique key
   * @param value - Value
   */
  const setItem = (key: string, value: JSON | string | undefined | null) => {
    if (!value) {
      throw new Error("setItem : value is empty");
    }
    try {
      Cookies.set(key, JSON.stringify(value), { expires: 1 });
    } catch (error: any) {
      throw new Error(error);
      // console.error(error);
    }
  };

  /**
   * @description Fetches value cookie storage for provided key
   * @param key - Unique Key
   * @returns JSON value of given key | null for invalid key
   */
  const getItem = (key: string) => {
    try {
      const value = Cookies.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error: any) {
      throw new Error(error);
      // console.error(error);
    }
  };

  /**
   * @description removes the value for provided key from cookie storage
   * @param key - key whom to delete from cookie storage
   */
  const removeItem = (key: string) => {
    try {
      Cookies.remove(key);
    } catch (error: any) {
      throw new Error(error)
      // console.error(error);
    }
  };
  return { setItem, getItem, removeItem };
};
