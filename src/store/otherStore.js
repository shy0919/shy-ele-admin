import { defineStore } from "pinia";

export const useOtherStore = defineStore({
  id: "otherState",
  state: () => ({
    count: 5
  }),
});
