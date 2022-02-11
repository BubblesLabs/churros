import { writable } from "svelte/store";
import type { TezosToolkit } from "@taquito/taquito";
import type { State, TezosAccountAddress } from "./types";

const initialState: State = {
  currentLevel: 0,
  Tezos: undefined,
  userAddress: undefined,
  userBalance: undefined,
  flextesaLaunched: false,
  flextesaProtocol: "hangzhou"
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateTezos: (tezos: TezosToolkit) =>
    store.update(store => ({ ...store, Tezos: tezos })),
  updateFlextesaLaunched: (status: boolean) =>
    store.update(store => ({ ...store, flextesaLaunched: status })),
  updateCurrentLevel: (level: number) =>
    store.update(store => ({ ...store, currentLevel: level })),
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
  }
};

export default state;
