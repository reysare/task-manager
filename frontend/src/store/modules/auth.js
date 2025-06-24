import axios from 'axios'
import { format } from 'date-fns'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    token: state => state.token
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/sanctum/token', {
          ...credentials,
          device_name: 'vue-task-manager'
        })
        
        commit('SET_TOKEN', response.data)
        
        const userResponse = await axios.get('/api/user')
        commit('SET_USER', userResponse.data)
        
        return true
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async register({ commit }, userData) {
      try {
        await axios.post('/api/register', userData)
        return true
      } catch (error) {
        throw error
      }
    },
    async logout({ commit }) {
      try {
        await axios.post('/api/logout')
        commit('CLEAR_AUTH')
        return true
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async fetchUser({ commit }) {
      if (!localStorage.getItem('token')) return
      
      commit('SET_TOKEN', localStorage.getItem('token'))
      
      try {
        const response = await axios.get('/api/user')
        commit('SET_USER', response.data)
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  }
}