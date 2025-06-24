<template>
  <div class="register-container">
    <div class="card">
      <h2 class="card-title">Register</h2>
      
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required
            placeholder="Enter your name"
          >
        </div>
        
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
        
        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input 
            type="password" 
            id="password_confirmation" 
            v-model="form.password_confirmation" 
            required
            placeholder="Confirm your password"
          >
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
        
        <p class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    
    const form = ref({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
    
    const loading = ref(false)
    const error = ref(null)
    
    const handleRegister = async () => {
      if (form.value.password !== form.value.password_confirmation) {
        error.value = 'Passwords do not match'
        return
      }
      
      loading.value = true
      error.value = null
      
      try {
        await axios.post('/api/register', {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          password_confirmation: form.value.password_confirmation
        })
        
        router.push('/login')
      } catch (err) {
        if (err.response && err.response.data.errors) {
          // Handle validation errors
          const firstError = Object.values(err.response.data.errors)[0][0]
          error.value = firstError
        } else {
          error.value = err.response?.data?.message || 'Registration failed'
        }
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: var(--gray-color);
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
</style>