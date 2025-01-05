import { create } from "zustand";

const useQuizStore = create((set) => ({
  people: [],
  setPeople: (newPeople) => set({ people: newPeople }),
}));

export default useQuizStore;
