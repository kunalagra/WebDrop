import P2PT from 'p2pt'
import Vue from 'vue'
import Vuex from 'vuex'

import device from '../device'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: {} as any,
    selectedUsers: [] as any,

    msgs: [],
    shares: {},

    p2pt: P2PT,

    settings: {
      autoCopy: false,
      autoStart: true,
      anim: true,
      defaultTab: 0,

      name: '',
      color: ''
    },

    internetShare: false,
    roomID: ''
  },
  mutations: {
    initSettings (state) {
      let settings = window.localStorage.getItem('settings')
      if (settings) {
        settings = JSON.parse(settings)
        state.settings = Object.assign({}, state.settings, settings)
      }

      // Length limit to prevent malicious inputs

      const name = state.settings.name
      if (!name || name.length > 30) {
        state.settings.name = `${device.os} ${device.browser}`
      }

      const color = state.settings.color
      if (!color || color.length > 20) {
        // random color
        state.settings.color = `hsla(${~~(360 * Math.random())},60%,60%,1)`
      }
    },

    updateSettings (state, payload) {
      Vue.set(state, 'settings', {
        ...state.settings,
        ...payload
      })

      window.localStorage.setItem('settings', JSON.stringify(state.settings))
    },

    addUser (state, payload) {
      Vue.set(state.users, payload.id, {
        name: payload.name,
        color: payload.color,
        conn: payload.conn
      })
    },

    removeUser (state, userID: string) {
      // userID == peerID
      Vue.delete(state.users, userID)
    },

    selectUser (state, userID: string) {
      state.selectedUsers.push(userID)
    },

    deselectUser (state, userID: string) {
      state.selectedUsers.splice(state.selectedUsers.indexOf(userID), 1)
    },

    clearSelectedUsers (state) {
      state.selectedUsers = []
    },

    // share added by user
    addShare (state, payload) {
      Vue.set(state.shares, payload.i, {
        ...payload,
        ...{ m: true } // m for mine
      })
    },

    // share received from a peer
    newShare (state, payload) {
      Vue.set(state.shares, payload.i, {
        ...payload,
        ...{ m: false } // m for mine
      })
    },

    setRoom (state, roomID: string) {
      state.roomID = roomID
    },

    activateInternetShare (state, roomID: string) {
      state.internetShare = true
      state.roomID = roomID
    },

    setP2PT (state, payload) {
      state.p2pt = payload
    },

    destroyP2PT (state) {
      if (state.p2pt !== null) {
        state.p2pt.destroy()
        state.users = {}
      }
    },

    addMessage (state, payload) {
      Vue.set(state.msgs, state.msgs.length, payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
