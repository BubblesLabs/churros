const objHasProperty = (obj: any, property: string): boolean => {
  return (
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    obj !== null &&
    obj.hasOwnProperty(property)
  );
};

const shortenHash = (hash: string): string =>
  hash ? hash.slice(0, 7) + "..." + hash.slice(-7) : "";

const isString = (val: any): boolean => typeof val === "string";
const isNumber = (val: any): boolean =>
  typeof +val === "number" && !isNaN(+val);

export default { objHasProperty, shortenHash, isString, isNumber };
