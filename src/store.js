import { create } from "zustand";

const useQuizStore = create((set) => ({
  people: [],
  setPeople: (newPeople) => set({ people: newPeople }),
  incorrectGuesses: [],
  addIncorrectGuess: (personId) =>
    set((state) => {
      if (!state.incorrectGuesses.includes(personId)) {
        return { incorrectGuesses: [...state.incorrectGuesses, personId] };
      }
      return state;
    }),
  resetIncorrectGuesses: () => set({ incorrectGuesses: [] }),
}));

export default useQuizStore;
