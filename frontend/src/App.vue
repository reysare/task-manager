<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <h1 class="logo">Task Manager</h1>
        <div v-if="isAuthenticated" class="user-info">
          <span>Hello, {{ user.name }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
        <router-link v-else to="/login" class="login-btn">Login</router-link>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <footer class="footer">
        <p>© 2023 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const user = computed(() => store.state.auth.user)

    const logout = async () => {
      await store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      isAuthenticated,
      user,
      logout
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #6c63ff;
  --primary-light: #a29bfe;
  --secondary-color: #ff7675;
  --success-color: #00b894;
  --warning-color: #fdcb6e;
  --danger-color: #d63031;
  --light-color: #f5f6fa;
  --dark-color: #2d3436;
  --gray-color: #636e72;
  --light-gray: #dfe6e9;
  --white: #ffffff;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  color: var(--dark-color);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.header {
  background-color: var(--white);
  box-shadow: var(--shadow);
  padding: 20px 0;
  margin-bottom: 30px;

  .logo {
    color: var(--primary-color);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;

    span {
      font-weight: 500;
    }
  }

  .login-btn, .logout-btn {
    background-color: var(--primary-color);
    color: var(--white);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);

    &:hover {
      background-color: var(--primary-light);
    }
  }
}

.main-content {
  flex: 1;
  padding-bottom: 40px;
}

.footer {
  text-align: center;
  padding: 20px 0;
  color: var(--gray-color);
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;

  &-primary {
    background-color: var(--primary-color);
    color: var(--white);

    &:hover {
      background-color: var(--primary-light);
    }
  }

  &-secondary {
    background-color: var(--secondary-color);
    color: var(--white);

    &:hover {
      background-color: #e17055;
    }
  }

  &-success {
    background-color: var(--success-color);
    color: var(--white);

    &:hover {
      background-color: #00cec9;
    }
  }

  &-danger {
    background-color: var(--danger-color);
    color: var(--white);

    &:hover {
      background-color: #e84393;
    }
  }

  &-sm {
    padding: 5px 10px;
    font-size: 14px;
  }
}

.card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 20px;
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  &-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--dark-color);
  }

  &-body {
    color: var(--gray-color);
    margin-bottom: 15px;
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--dark-color);
  }

  input, textarea, select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--light-gray);
    border-radius: 4px;
    font-family: inherit;
    font-size: 16px;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
}

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;

  &-success {
    background-color: rgba(0, 184, 148, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(0, 184, 148, 0.2);
  }

  &-error {
    background-color: rgba(214, 48, 49, 0.1);
    color: var(--danger-color);
    border: 1px solid rgba(214, 48, 49, 0.2);
  }
}

.task-list {
  display: grid;
  gap: 20px;
}

.task-item {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  &-content {
    flex: 1;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
      color: var(--dark-color);
    }

    p {
      color: var(--gray-color);
      margin-bottom: 5px;
    }

    .due-date {
      font-size: 14px;
      color: var(--secondary-color);
    }
  }

  &-completed {
    h3, p, .due-date {
      text-decoration: line-through;
      opacity: 0.7;
    }
  }

  &-actions {
    display: flex;
    gap: 10px;
  }
}

.completed-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--success-color);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-color);

  img {
    max-width: 200px;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .header {
    .logo {
      font-size: 24px;
    }
  }

  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    &-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>