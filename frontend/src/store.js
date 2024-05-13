import { create } from 'zustand';

const useStore = create((set) => ({
  stockData: {}, // Initialize as an empty object
  setStockData: (newData) => set({ stockData: newData }),
}));

export default useStore;