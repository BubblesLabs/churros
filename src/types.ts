import type { TezosToolkit } from "@taquito/taquito";
import type { BlockResponse } from "@taquito/rpc";

export type TezosContractAddress = `KT1${string}`;
export type TezosAccountAddress = `tz${"1" | "2" | "3"}${string}`;

export enum Protocol {
  HANGZHOU = "hangzhou",
  ITHACA = "ithaca",
  GRANADA = "granada",
  ALPHA = "alpha"
}

export interface OriginationData {
  address: TezosContractAddress;
  level: number;
}

export type TransactionData = { hash: string; level: number };

/*interface BlockHeader {
  context: string;
  fitness: Array<string>;
  level: number;
  liquidity_baking_escape_vote: boolean;
  operations_hash: string;
  predecessor: string;
  priority: number;
  proof_of_work_nonce: string;
  proto: number;
  signature: string;
  timestamp: string;
  validation_pass: number;
}

type BlockMetadataBalanceUpdateContract = {
  change: string;
  contract: TezosAccountAddress;
  kind: "contract";
  origin: "block";
};
type BlockMetadataBalanceUpdateDeposits = {
  category: "deposits";
  change: string;
  cycle: number;
  delegate: TezosAccountAddress;
  kind: "freezer";
  origin: "block";
};
type BlockMetadataBalanceUpdateRewards = {
  category: "rewards";
  change: string;
  cycle: number;
  delegate: TezosAccountAddress;
  kind: "freezer";
  origin: "block";
};
type ImplicitOperationResult = {
  balance_updates: Array<
    | BlockMetadataBalanceUpdateContract
    | BlockMetadataBalanceUpdateDeposits
    | BlockMetadataBalanceUpdateRewards
  >;
  consumed_gas: string;
  consumed_milligas: string;
  kind: "transaction";
  storage: Array<{ int: string } | { bytes: string }>;
  storage_size: string;
};

interface BlockMetadata {
  baker: TezosAccountAddress;
  balance_updates: Array<
    | BlockMetadataBalanceUpdateContract
    | BlockMetadataBalanceUpdateDeposits
    | BlockMetadataBalanceUpdateRewards
  >;
  consumed_gas: string;
  deactivated: Array<any>;
  implicit_operations_results: Array<ImplicitOperationResult>;
  level_info: {
    level: number;
    level_position: number;
    cycle: number;
    cycle_position: number;
    expected_commitment: boolean;
  };
  liquidity_baking_escape_ema: number;
  max_block_header_length: number;
  max_operation_data_length: number;
  max_operation_list_length: Array<{ max_size: number; max_op?: number }>;
  max_operations_ttl: number;
  next_protocol: string;
  nonce_hash: any;
  protocol: string;
  test_chain_status: { status: string };
  voting_period_info: {
    position: number;
    remaining: number;
    voting_period: { index: number; kind: string; start_position: number };
  };
}

type BlockOperation = {
  branch: string;
  chain_id: string;
  contents: Array<{
    endorsement: {
      branch: string;
      operations: { kind: OpKind; level: number };
      signature: string;
    };
    kind: string;
    metadata: {
      balance_updates: Array<
        | BlockMetadataBalanceUpdateContract
        | BlockMetadataBalanceUpdateDeposits
        | BlockMetadataBalanceUpdateRewards
      >;
      delegate: TezosAccountAddress;
      slots: Array<number>;
    };
    slot: number;
  }>;
  hash: string;
  protocol: string;
};

export interface Block {
  chain_id: string;
  hash: string;
  header: BlockHeader;
  metadata: BlockMetadata;
  operations: Array<BlockOperation>;
  protocol: string;
}*/

export interface State {
  chainStatus: "running" | "not_running" | "idle" | "off" | "unknown";
  currentLevel: number;
  blockchainLaunched: boolean;
  blockchainProtocol: Protocol;
  Tezos: TezosToolkit | undefined;
  userAddress: string | undefined;
  userBalance: number | undefined;
  chainDetails: {
    chainId: string | undefined;
    protocolHash: string | undefined;
  };
  blocks: Array<BlockResponse>;
  blockTime: number;
  toast: {
    showToast: boolean;
    toastText: string;
  };
  contracts: Array<OriginationData>;
  transactions: Array<TransactionData>;
}

export interface ContractSessionStorage {
  [p: TezosContractAddress]: {
    origination: {
      level: number;
      storage: any;
    };
    updates: Array<{
      level: number;
      previousStorage: any;
      currentStorage: any;
    }>;
  };
}
