"use client"

import { create } from "zustand"

type GlobalLoadingStore = {
  /** ローディング表示フラグ */
  isLoading: boolean
  /** ローディング表示を開始する */
  startLoading: () => void
  /** ローディング表示を終了する */
  stopLoading: () => void
}

/** グローバルローディング状態を管理するストア */
export const useGlobalLoadingStore = create<GlobalLoadingStore>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}))
