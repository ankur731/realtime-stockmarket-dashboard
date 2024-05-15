import { create } from 'zustand';

const useStore = create((set) => ({
  stockData: {}, // Initialize as an empty object
  setStockData: (newData) => set({ stockData: newData }),
}));

export const themeStore = create((set) => ({
  theme: localStorage.getItem("theme")||'light', // Initialize as an empty object
  setTheme: (newData) => set({ theme: newData }),
}));


export default useStore;
