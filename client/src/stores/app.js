// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  id: 'appStore',
  state: () => ({
    userID: null
  }),

  actions: {
    setUserID(value) {
      this.userID = value
    }
  }
})
