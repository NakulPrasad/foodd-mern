/**
 * @description Function to check if the origin contains 'foodd-mern'
 * @param origin : string
 * @returns boolean | string
 */

const isValidOrigin = (origin: string): boolean | string => {
  if (process.env.NODE_ENV === "production") {
    return Boolean(origin && /https?:\/\/.*foodd.*/.test(origin));
  }
  return Boolean(origin && /https?:\/\/.*localhost.*/.test(origin));
};

export default isValidOrigin;
