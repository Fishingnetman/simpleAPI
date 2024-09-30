<template>
  <div>
    <h1>Todo App</h1>
    
    <!-- Add Todo Form -->
    <form @submit.prevent="addTodo">
      <input v-model="newTodo.title" placeholder="Title" required>
      <input v-model="newTodo.description" placeholder="Description" required>
      <button type="submit">Add Todo</button>
    </form>

    <!-- Todo List -->
    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)">
        {{ todo.title }}
        {{ todo.description }}
        <button @click="deleteTodo(todo._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

export default {
  setup() {
    const todos = ref([])
    const newTodo = ref({ title: '', description: '', completed: false })

    const fetchTodos = async () => {
      const response = await axios.get(`${API_URL}/todos`)
      todos.value = response.data
    }

    const addTodo = async () => {
      const response = await axios.post(`${API_URL}/todos`, newTodo.value)
      todos.value.push(response.data)
      newTodo.value = { title: '', description: '', completed: false }
    }

    const updateTodo = async (todo) => {
      await axios.put(`${API_URL}/todos/${todo._id}`, todo)
    }

    const deleteTodo = async (id) => {
      await axios.delete(`${API_URL}/todos/${id}`)
      todos.value = todos.value.filter(todo => todo._id !== id)
    }

    onMounted(fetchTodos)

    return {
      todos,
      newTodo,
      addTodo,
      updateTodo,
      deleteTodo
    }
  }
}
</script>