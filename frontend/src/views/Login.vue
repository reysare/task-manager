<template>
  <div class="login-container">
    <div class="card">
      <h2 class="card-title">Login</h2>
      
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            placeholder="Enter your email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required
            placeholder="Enter your password"
          >
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <p class="register-link">
          Don't have an account? <router-link to="/register">Register here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref(null)
    
    const handleLogin = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await axios.post('/api/login', {
          email: form.value.email,
          password: form.value.password,
          device_name: 'vue-task-manager'
        })
        
        // Save token and user data
        store.commit('auth/SET_TOKEN', response.data.token)
        store.commit('auth/SET_USER', response.data.user)
        
        router.push('/')
      } catch (err) {
        error.value = err.response?.data?.message || 'Invalid credentials'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 50px;
}

.card {
  padding: 30px;
}

.card-title {
  text-align: center;
  margin-bottom: 30px;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: var(--gray-color);
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>