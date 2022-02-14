import type { BlockResponse } from "@taquito/rpc";
import { OpKind } from "@taquito/taquito";
import type { TezosContractAddress, OriginationData } from "./types";

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

const checkForOriginationOps = (
  block: BlockResponse
): Array<OriginationData> => {
  // looks for origination ops
  const originations: Array<OriginationData> = [];
  block.operations.forEach(ops => {
    if (ops.length > 0) {
      ops.forEach(op => {
        console.log(op);
        if (op.contents.length > 0) {
          op.contents.forEach(_op => {
            if (_op.kind === OpKind.ORIGINATION) {
              const address = (_op as any).metadata.operation_result
                .originated_contracts[0];
              originations.push({ address, level: block.header.level });
            }
          });
        }
      });
    }
  });
  return originations;
};

export default {
  objHasProperty,
  shortenHash,
  isString,
  isNumber,
  checkForOriginationOps
};
