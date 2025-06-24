import axios from 'axios'

export default {
  namespaced: true,
  state: {
    tasks: [],
    loading: false,
    error: null
  },
  getters: {
    allTasks: state => state.tasks,
    completedTasks: state => state.tasks.filter(task => task.completed),
    pendingTasks: state => state.tasks.filter(task => !task.completed),
    loading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task)
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask)
      }
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId)
    },
    CLEAR_TASKS(state) {
      state.tasks = []
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await axios.get('/api/tasks')
        commit('SET_TASKS', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch tasks')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createTask({ commit }, taskData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await axios.post('/api/tasks', taskData)
        commit('ADD_TASK', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create task')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateTask({ commit }, { id, taskData }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await axios.put(`/api/tasks/${id}`, taskData)
        commit('UPDATE_TASK', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update task')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteTask({ commit }, taskId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await axios.delete(`/api/tasks/${taskId}`)
        commit('REMOVE_TASK', taskId)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete task')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async toggleComplete({ commit }, task) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await axios.patch(`/api/tasks/${task.id}/complete`)
        commit('UPDATE_TASK', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to toggle task completion')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    clearTasks({ commit }) {
      commit('CLEAR_TASKS')
    }
  }
}