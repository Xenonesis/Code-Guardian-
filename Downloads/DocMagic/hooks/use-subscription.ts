import { create } from "zustand";

interface SubscriptionStore {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
}

export const useSubscription = create<SubscriptionStore>((set) => ({
  isPro: false,
  setIsPro: (isPro) => set({ isPro }),
}));