'use strict'
// const { v4: uuidv4 } = require('uuid')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const models = require('./models')

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
  const title = req.body.title
  const description = req.body.description
  const deadline = req.body.deadline
  models.Todo.addTodo(title, description, deadline).then((id) => {
    res.redirect('/todos')
  })
})
// 削除
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  models.Todo.delTodo(id).then(id => {
    if (!id) {
      console.log('削除失敗！')
    }
    res.redirect('/todos')
  })
})
// 編集画面
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  models.Todo.getTodo(id).then(todo => {
    res.render('edit', { todo })
  })
})
// 更新
app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const title = req.body.title
  const deadline = req.body.deadline
  const description = req.body.description
  const value = { title, deadline, description }
  models.Todo.modTodo(id, value).then(id => {
    if (!id) {
      console.log('更新失敗！')
    }
    res.redirect(`/todos/${id}`)
  })
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
  models.Todo.getTodoList().then(todoListWithCount => {
    const todos = todoListWithCount.todoList
    res.render('todos', { todos })
  })
})
// 詳細画面
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  models.Todo.getTodo(id).then(todo => {
    res.render('show', { todo })
  })
})
// apiデータ
app.get('/api/todos', (req, res) => res.json(todos))
// メニュー画面
app.get('/', (req, res) => res.render('menu'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
