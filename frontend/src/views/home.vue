<template>
  <div class="container">
    <h1>📝 Task Manager</h1>
    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="New task" />
      <button>Add</button>
    </form>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" v-model="task.is_completed" @change="toggleTask(task)" />
        <span :class="{ done: task.is_completed }">{{ task.title }}</span>
        <button @click="deleteTask(task.id)">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])
const newTask = ref('')
const api = 'http://localhost:8000/api/tasks'

const fetchTasks = async () => {
  const res = await axios.get(api)
  tasks.value = res.data
}

const addTask = async () => {
  if (!newTask.value.trim()) return
  await axios.post(api, { title: newTask.value })
  newTask.value = ''
  fetchTasks()
}

const toggleTask = async (task) => {
  await axios.put(`${api}/${task.id}`, {
    ...task,
    is_completed: task.is_completed,
  })
}

const deleteTask = async (id) => {
  await axios.delete(`${api}/${id}`)
  fetchTasks()
}

onMounted(fetchTasks)
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: Arial;
}
.done {
  text-decoration: line-through;
  color: gray;
}
</style>
