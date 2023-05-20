'use strict'
// const { v4: uuidv4 } = require('uuid')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const models = require('./models')
const expressEjsLayouts = require('express-ejs-layouts')

// サーバの待ち受けポート設定
const port = process.env.PORT || 3000

// expressの設定
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}))
app.use(expressEjsLayouts)
app.use(express.static('public'))

// 初期データ
// const todos = require('./initData.json')

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
  const value = { completed: true }
  models.Todo.modTodo(id, value).then(id => {
    if (!id) {
      console.log('更新失敗！')
    }
    res.redirect(`/todos/${id}`)
  })
})
// 未完了登録
app.delete('/todos/:id/completed', (req, res) => {
  const id = req.params.id
  const value = { completed: false }
  models.Todo.modTodo(id, value).then(id => {
    if (!id) {
      console.log('更新失敗！')
    }
    res.redirect(`/todos/${id}`)
  })
})
// 一覧画面
app.get('/todos', (req, res) => {
  const completedQuery = req.query.completed
  let whereClause = {}
  if (completedQuery === 'true') {
    whereClause = { completed: true }
  } else if (completedQuery === 'false') {
    whereClause = { completed: false }
  } else {
    whereClause = undefined
  }
  models.Todo.getTodoList(whereClause).then(todoListWithCount => {
    const todos = todoListWithCount.todoList
    const itemNum = todoListWithCount.count
    res.render('todos', { todos, itemNum })
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
app.get('/api/todos', (req, res) => {
  models.Todo.getTodoList().then(todoListWithCount => {
    res.json(todoListWithCount)
  })
})
// メニュー画面 => Top画面
app.get('/', (req, res) => res.render('index'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
