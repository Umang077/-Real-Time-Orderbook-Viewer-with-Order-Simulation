import {create} from 'zustand';

export type simulationStateType = {
  venue: 'OKX'|'Bybit'|'Deribit';
  symbol: string;
  type: 'Limit' | 'Market';
  side: 'Buy' | 'Sell';
  price?: number;
  quantity: number;
  timingMs: number;
};

type Store = {
  simulation?: simulationStateType;
  setSimulation: (s: simulationStateType) => void;
};

export const useStore = create<Store>(set => ({
  simulation: undefined,
  setSimulation: sim => set({ simulation: sim })
}));

export default useStore;
