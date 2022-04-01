import Dexie, { Table } from "dexie";

export interface DbBlock {
  hash: string;
  level: number;
  chainId: string;
  timestamp: string;
  operationsCount: number;
}

export interface DbContracts {
  address: string;
  originationLevel: number;
  storageSnapshots: {
    level: number;
    storage: any;
  };
}

export interface DbChainId {
  chainId: string;
  initTime: string;
}

export class DexieWrapper extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  blocks!: Table<DbBlock>;
  contracts!: Table<DbContracts>;
  chainId!: Table<DbChainId>;
  currentChainId: string;

  constructor(chainId: string) {
    super("churros-tz");
    // checks the current chainId in the database
    this.version(2).stores({
      chainId: "++, chainId",
      blocks: "level, hash, chainId, timestamp, operationsCount",
      contracts: "address, originationLevel, storageSnapshots"
    });
    this.currentChainId = chainId;
  }

  async init() {
    const db = await this.open();
    const table = await db.table("chainId");
    const chainIdInDb = await table
      .where("chainId")
      .equals(this.currentChainId)
      .toArray();
    const entriesCount = await table.count();
    if (chainIdInDb.length === 0) {
      // the current chain id is not in the database
      if (entriesCount > 0) {
        await table.clear();
      }
      // saves new chainId
      await table.add({
        chainId: this.currentChainId,
        initTime: new Date(Date.now()).toISOString()
      });
      // clears previous block data
      const blocksDb = await db.table("blocks");
      await blocksDb.clear();
    }

    return this;
  }
}

export const initDb = async (chainId: string) => {
  const db = new DexieWrapper(chainId);
  return await db.init();
};
