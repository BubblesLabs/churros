import { writable } from "svelte/store";
import type { ContractSessionStorage, TezosContractAddress } from "./types";

const sessionStoreName = "churros-contracts";

const sessionStorage = window.sessionStorage.getItem(sessionStoreName);
let initialState: ContractSessionStorage;
if (sessionStorage) {
  initialState = JSON.parse(sessionStorage);
} else {
  initialState = {};
  window.sessionStorage.setItem(sessionStoreName, JSON.stringify(initialState));
}
const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  addNewContract: (address: TezosContractAddress, level: number) =>
    store.update(store => {
      const newStore = {
        ...store,
        [address]: { origination: { level, storage: null }, updates: [] }
      };
      window.sessionStorage.setItem(sessionStoreName, JSON.stringify(newStore));

      return newStore;
    }),
  reset: () => {
    store.update(_ => {
      window.sessionStorage.removeItem(sessionStoreName);
      return {};
    });
  }
};

export default state;
