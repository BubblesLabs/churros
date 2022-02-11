import type { TezosToolkit } from "@taquito/taquito";

export type TezosContractAddress = `KT1${string}`;
export type TezosAccountAddress = `tz${"1" | "2" | "3"}${string}`;

export interface State {
  currentLevel: number;
  flextesaLaunched: boolean;
  flextesaProtocol: string;
  Tezos: TezosToolkit | undefined;
  userAddress: string | undefined;
  userBalance: number | undefined;
}
