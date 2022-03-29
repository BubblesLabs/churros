import Dexie, { Table } from "dexie";

export interface DbBlock {
  hash: string;
  chainId: string;
  header: any;
  metadata: any;
  operations: any;
}

export interface DbContracts {
  address: string;
  originationLevel: number;
  storageSnapshots: {
    level: number;
    storage: any;
  };
}

export class DexieWrapper extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  blocks!: Table<DbBlock>;
  contracts!: Table<DbContracts>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      blocks: "++hash, chainId, header, metadata, operations",
      contracts: "++address, originationLevel, storageSnapshots"
    });
  }
}

export const db = new DexieWrapper();
