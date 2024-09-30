const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) =>{
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) =>{
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed || false,
    });
    await todo.save();
    res.status(201).json(todo);
});

app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;
        todo.completed = req.body.completed || todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } else {
        res.status(404).send('Todo not found');
    }
});

app.delete('/todos/:id', async (req, res) =>{
    const todo = await Todo.findById(req.params.id);
    if(todo){
        await todo.deleteOne();
        res.status(204).send();
    }else{
        res.status(404).send('Todo not found');
    }
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});












