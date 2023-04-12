'use strict'
const { v4: uuidv4 } = require('uuid')
const express = require('express')
const methodOverride = require('method-override')
const app = express()

// サーバの待ち受けポート設定
const port = process.env.PORT || 3000

// expressの設定
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}))

// 初期データ
const todos = require('./initData.json')

// 新規登録画面
app.get('/todos/new', (req, res) => {
  res.render('new')
})
// 登録
app.post('/todos/create', (req, res) => {
  const todo = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    completed: false
  }
  todos.push(todo)
  res.redirect('/todos')
})
// 削除
app.delete('/todos/:id', (req, res) => {
  const i = todos.findIndex(todo => todo.id === req.params.id)
  todos.splice(i, 1)
  res.redirect('/todos')
})
// 編集画面
app.get('/todos/:id/edit', (req, res) => {
  const data = todos.filter(todo => todo.id === req.params.id)
  res.render('edit', { todo: data[0] })
})
// 更新
app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const i = todos.findIndex(todo => todo.id === id)
  todos[i].title = req.body.title
  todos[i].deadline = req.body.deadline
  todos[i].description = req.body.description
  res.redirect(`/todos/${id}`)
})
// 完了登録
app.put('/todos/:id/completed', (req, res) => {
  const id = req.params.id
  const i = todos.findIndex(todo => todo.id === id)
  todos[i].completed = true
  res.redirect(`/todos/${id}`)
})
// 未完了登録
app.delete('/todos/:id/completed', (req, res) => {
  const id = req.params.id
  const i = todos.findIndex(todo => todo.id === id)
  todos[i].completed = false
  res.redirect(`/todos/${id}`)
})
// 一覧画面
app.get('/todos', (req, res) => {
  if (!req.query.completed) {
    return res.render('todos', { todos })
  }
  const completed = req.query.completed === 'true'
  const data = todos.filter(todos => todos.completed === completed)
  res.render('todos', { todos: data })
})
// 詳細画面
app.get('/todos/:id', (req, res) => {
  const i = todos.findIndex(todo => todo.id === req.params.id)
  res.render('show', { todo: todos[i] })
})
// apiデータ
app.get('/api/todos', (req, res) => res.json(todos))
// メニュー画面
app.get('/', (req, res) => res.render('menu'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
