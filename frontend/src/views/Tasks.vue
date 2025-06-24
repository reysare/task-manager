<template>
  <div class="tasks-container">
    <div class="header-actions">
      <h2>My Tasks</h2>
      <button @click="showTaskForm = true" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add Task
      </button>
    </div>
    
    <div v-if="loading && tasks.length === 0" class="loading-state">
      <p>Loading tasks...</p>
    </div>
    
    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>
    
    <div v-else-if="tasks.length === 0" class="empty-state">
      <img src="../assets/empty-tasks.svg" alt="No tasks">
      <h3>No tasks yet</h3>
      <p>You don't have any tasks. Add one to get started!</p>
      <button @click="showTaskForm = true" class="btn btn-primary">
        Add Your First Task
      </button>
    </div>
    
    <div v-else class="task-list">
      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-item"
        :class="{ 'task-item-completed': task.completed }"
      >
        <div class="task-item-content">
          <h3>{{ task.title }}</h3>
          <p v-if="task.description">{{ task.description }}</p>
          <p v-if="task.due_date" class="due-date">
            Due: {{ formatDate(task.due_date) }}
          </p>
        </div>
        
        <div class="task-item-actions">
          <input 
            type="checkbox" 
            class="completed-checkbox"
            :checked="task.completed"
            @change="toggleTaskCompletion(task)"
          >
          
          <button 
            @click="editTask(task)"
            class="btn btn-sm btn-secondary"
          >
            Edit
          </button>
          
          <button 
            @click="deleteTask(task.id)"
            class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <!-- Task Form Modal -->
    <div v-if="showTaskForm" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="taskForm.title" 
              required
              placeholder="Task title"
            >
          </div>
          
          <div class="form-group">
            <label for="description">Description (Optional)</label>
            <textarea 
              id="description" 
              v-model="taskForm.description" 
              placeholder="Task description"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="due_date">Due Date (Optional)</label>
            <input 
              type="datetime-local" 
              id="due_date" 
              v-model="taskForm.due_date" 
            >
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="formLoading">
            {{ formLoading ? 'Saving...' : 'Save Task' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'Tasks',
  setup() {
    const store = useStore()
    
    // State
    const showTaskForm = ref(false)
    const editingTask = ref(null)
    const formLoading = ref(false)
    
    const taskForm = ref({
      title: '',
      description: '',
      due_date: ''
    })
    
    // Computed
    const tasks = computed(() => store.getters['tasks/allTasks'])
    const loading = computed(() => store.getters['tasks/isLoading'])
    const error = computed(() => store.getters['tasks/error'])
    
    // Methods
    const fetchTasks = () => {
      store.dispatch('tasks/fetchTasks')
    }
    
    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
    }
    
    const toggleTaskCompletion = async (task) => {
      await store.dispatch('tasks/toggleTaskCompletion', task)
    }
    
    const editTask = (task) => {
      editingTask.value = task
      taskForm.value = {
        title: task.title,
        description: task.description,
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm") : ''
      }
      showTaskForm.value = true
    }
    
    const deleteTask = async (taskId) => {
      if (confirm('Are you sure you want to delete this task?')) {
        await store.dispatch('tasks/deleteTask', taskId)
      }
    }
    
    const handleSubmit = async () => {
      formLoading.value = true
      
      try {
        const taskData = {
          title: taskForm.value.title,
          description: taskForm.value.description,
          due_date: taskForm.value.due_date || null
        }
        
        if (editingTask.value) {
          await store.dispatch('tasks/updateTask', {
            id: editingTask.value.id,
            ...taskData
          })
        } else {
          await store.dispatch('tasks/createTask', taskData)
        }
        
        closeModal()
      } catch (error) {
        console.error('Error saving task:', error)
      } finally {
        formLoading.value = false
      }
    }
    
    const closeModal = () => {
      showTaskForm.value = false
      editingTask.value = null
      taskForm.value = {
        title: '',
        description: '',
        due_date: ''
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      fetchTasks()
    })
    
    return {
      tasks,
      loading,
      error,
      showTaskForm,
      editingTask,
      formLoading,
      taskForm,
      formatDate,
      toggleTaskCompletion,
      editTask,
      deleteTask,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.tasks-container {
  padding: 20px 0;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.header-actions h2 {
  color: var(--dark-color);
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: var(--gray-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-header h3 {
  font-size: 20px;
  color: var(--dark-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gray-color);
}
.modal-close:hover {
  color: var(--dark-color);
}
</style>