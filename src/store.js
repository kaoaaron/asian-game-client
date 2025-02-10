import { create } from "zustand";

const ScreenEnum = {
  START: "start",
  FILTERS: "filters",
  QUIZ: "quiz",
};

const useQuizStore = create((set) => ({
  screen: ScreenEnum.START,
  setScreen: (newScreen) => set({ screen: newScreen }),
  zoomFinished: false,
  setZoomFinished: (finished) => set({ zoomFinished: finished }),
  leaderboardQualified: true,
  setLeaderboardQualified: (qualified) =>
    set({ leaderboardQualified: qualified }),

  filters: {
    numberOfPeople: 30,
    gender: "both",
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

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
  resetToStart: () =>
    set((state) => ({
      screen: ScreenEnum.START,
      zoomFinished: false,
      incorrectGuesses: [],
    })),
}));

export { ScreenEnum };
export default useQuizStore;
