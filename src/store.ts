import { writable } from "svelte/store";
import type { TezosToolkit } from "@taquito/taquito";
import type { BlockResponse } from "@taquito/rpc";
import { State, TezosAccountAddress, Protocol } from "./types";
import config from "./config";

const initialState: State = {
  currentLevel: 0,
  Tezos: undefined,
  userAddress: undefined,
  userBalance: undefined,
  blockchainLaunched: false,
  blockchainProtocol: Protocol.HANGZHOU,
  chainDetails: { chainId: undefined, protocolHash: undefined },
  blocks: [],
  blockTime: config.blockTime,
  toast: {
    showToast: false,
    toastText: ""
  }
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateTezos: (tezos: TezosToolkit) =>
    store.update(store => ({ ...store, Tezos: tezos })),
  updateBlockchainLaunched: (status: boolean) =>
    store.update(store => ({ ...store, blockchainLaunched: status })),
  updateBlockchainProtocol: (protocol: Protocol) =>
    store.update(store => ({ ...store, blockchainProtocol: protocol })),
  updateCurrentLevel: (level: number) =>
    store.update(store => ({ ...store, currentLevel: level })),
  updateBlockTime: (blockTime: number) =>
    store.update(store => ({ ...store, blockTime })),
  updateUserAddress: (address: TezosAccountAddress | undefined) => {
    store.update(store => ({
      ...store,
      userAddress: address
    }));
  },
  updateUserBalance: (balance: number) => {
    store.update(store => ({
      ...store,
      userBalance: balance
    }));
  },
  updateToast: ({
    showToast,
    toastText
  }: {
    showToast: boolean;
    toastText: string;
  }) => {
    store.update(store => {
      if (showToast === true) {
        setTimeout(
          () => state.updateToast({ showToast: false, toastText: "" }),
          4000
        );
      }
      return {
        ...store,
        toast: { showToast, toastText }
      };
    });
  },
  updateChainDetails: ({ chainId, protocolHash }: State["chainDetails"]) => {
    store.update(store => ({
      ...store,
      chainDetails: { chainId, protocolHash }
    }));
  },
  addNewBlock: (block: BlockResponse) =>
    store.update(store => {
      // checks if block hasn't been added yet
      if (!store.blocks.find(_block => _block.hash === block.hash)) {
        if (store.blocks.length < 100) {
          return { ...store, blocks: [block, ...store.blocks] };
        } else {
          // remove the last element of the array
          store.blocks.pop();

          return { ...store, blocks: [block, ...store.blocks] };
        }
      }
    }),
  resetBlocks: () => store.update(store => ({ ...store, blocks: [] }))
};

export default state;
