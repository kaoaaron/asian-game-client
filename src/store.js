import { create } from "zustand";

const ScreenEnum = {
  START: "start",
  FILTERS: "filters",
  QUIZ: "quiz",
};

const useQuizStore = create((set) => ({
  screen: ScreenEnum.START,
  setScreen: (newScreen) => set({ screen: newScreen }),
  previousScreen: null,
  setPreviousScreen: (screen) => set({ previousScreen: screen }),
  quizResults: null,
  setQuizResults: (results) => set({ quizResults: results }),
  zoomFinished: false,
  setZoomFinished: (finished) => set({ zoomFinished: finished }),
  leaderboardQualified: true,
  setLeaderboardQualified: (qualified) =>
    set({ leaderboardQualified: qualified }),
  timerDisabled: false,
  setTimerDisabled: (disabled) => set({ timerDisabled: disabled }),
  timerActive: false,
  setTimerActive: (active) => set({ timerActive: active }),
  timeRemaining: 12,
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  resetTimer: () => set({ timeRemaining: 12, timerActive: false }),

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
      timeRemaining: 12,
      timerActive: false,
      previousScreen: null,
      quizResults: null,
    })),
}));

export { ScreenEnum };
export default useQuizStore;
