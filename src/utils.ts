const objHasProperty = (obj: any, property: string): boolean => {
  return (
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    obj !== null &&
    obj.hasOwnProperty(property)
  );
};

const shortenHash = (hash: string, length_?: number): string => {
  const length = length_ ? length_ : 7;
  return hash ? hash.slice(0, length) + "..." + hash.slice(-length) : "";
};

const isString = (val: any): boolean => typeof val === "string";
const isNumber = (val: any): boolean =>
  typeof +val === "number" && !isNaN(+val);

export default { objHasProperty, shortenHash, isString, isNumber };
