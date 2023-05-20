# handson
## ページのレイアウトを作る
ページのレイアウトを作ることができるミドルウェア'express-ejs-layouts'の導入
```
npm i express-ejs-layouts
```
index.jsに'express-ejs-layouts'を定義
```
const expressEjsLayouts = require('express-ejs-layouts')
```
index.jsに'express'の設定を定義
```
// expressの設定
（省略）
app.use(expressEjsLayouts)
```
すべての画面に適用されるベースレイアウトとして'./views/layout.ejs'を作成
```
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="/css/bootstrap.css">
  <title>ToDo管理アプリ</title>
</head>
<body>
  <%- include('./partials/top.ejs') %>
  <div class="container">
    <%- body %>
  </div>
  <script src="/js/bootstrap.bundle.js"></script>
</body>
</html>
```
画面の上部に表示されるメニューバー'./views/partials/top.ejs'を作成
```
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Todoアプリだぜ!</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/todos?completed=&order_by=updated_desc">Todo一覧</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/todos/new">Todoの登録</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">カテゴリー</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/categories">一覧</a></li>
            <li><a class="dropdown-item" href="/categories/new">新規登録</a></li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">ユーザー</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/users">一覧</a></li>
            <li><a class="dropdown-item" href="/users/new">新規登録</a></li>
            <li><hr class="dropdown-divider"></li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">ヘルプ</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" target=”_blank” href="http://localhost:8080">データベース</a></li>
            <li><a class="dropdown-item" target=”_blank” href="https://getbootstrap.jp/docs/5.0/getting-started/introduction/">Bootstrap</a></li>
            <li><a class="dropdown-item" target=”_blank” href="https://blog.capilano-fw.com/?p=5582">Sequelize</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
```
今まで作った画面（menu.ejs, todos.ejs, show.ejs, new.ejs, edit.ejs）をbody要素だけに編集する
## Bootstrap(CSSフレームワーク)を導入する
'./public/css/bootstrap.css', './public/css/bootstrap.css.map', 'bootstrap.bundle.js', 'bootstrap.bundle.js.map'をコピー
## expressに静的ファイルの供給フォルダーを設定
```
// expressの設定
（省略）
app.use(express.static('public'))
```
## Todo一覧画面の見た目を整える
./views/todos.ejsを編集
```
<div class="text-center">
  <h2>Todo一覧</h2>
</div>

<table class="table table-hover" id="todos-table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Title</th>
      <th scope="col">Deadline</th>
      <th scope="col">Completed</th>
      <th scope="col">ID</th>
      <th scope="col">全<%= itemNum %>件</th>
    </tr>
  </thead>
  <tbody>
    <% todos.forEach(todo => { %>
      <% const completedParams = todo.completed ? ['完了', 'DELETE', '完了取消'] : ['未完了', 'PUT', '完了'] %>
      <tr>
        <th> <%= todos.indexOf(todo) + 1 %> </th>
        <td> <%= todo.title %> </td>
        <td> <%= todo.deadline %> </td>
        <td> <%= completedParams[0] %> </td>
        <td> <a href="/todos/<%= todo.id %>"><%= todo.id %></a> </td>
        <td>
          <button class="btn btn-outline-primary btn-sm" onclick="location.href='/todos/<%= todo.id %>/completed?_method=<%= completedParams[1] %>'"><%= completedParams[2] %></button>
          <button class="btn btn-outline-danger btn-sm" onclick="location.href='/todos/<%= todo.id %>?_method=DELETE'">削除</button>
          <button class="btn btn-outline-warning btn-sm" onclick="location.href='/todos/<%= todo.id %>/edit'">編集</button>
        </td>
      </tr>
    <% }) %>
  </tbody>
</table>
<hr>
<button class="btn btn-primary" onclick="location.href='/todos?completed=true'">完了一覧</button>
<button class="btn btn-primary" onclick="location.href='/todos?completed=false'">未完了一覧</button>
<button class="btn btn-primary" onclick="location.href='/todos'">全件</button>
```
一覧画面にレード件数を渡すようにindex.jsを編集する
```
// 一覧画面
（省略）
  models.Todo.getTodoList(whereClause).then(todoListWithCount => {
    const todos = todoListWithCount.todoList
    const itemNum = todoListWithCount.count // レコード件数
    res.render('todos', { todos, itemNum }) // レコード件数を一覧画面に渡す
  })
（省略）
```
## Todo一覧画面からIDを削除して更新日時を追加
更新日時を取得するように'./models/todo.js'の「Todo一覧の取得」処理に'updatedAt'属性を追加
```
attributes: [
  'id',
  'title',
  'deadline',
  'completed',
  'updatedAt'
]
```
更新日時のフォーマットを整形するために'./models/todo.js'の「Todo一覧の取得」処理のforEachループに処理追加
```
todo.updatedAt = formatter.formatDate(todo.updatedAt) + ' ' + formatter.formatHourMin(todo.updatedAt)
```
'./views/todos.ejs'を編集しIDを非表示にして更新日時を追加
## Todo一覧画面の行を選択することで詳細表示画面へ遷移するようスクリプト（jQuery）を追加
'./views/todos.ejs'を編集
```
<script>
  $("#todos-table tbody tr").on("click",function(){
    const td_id = $(this).children().eq(5).text().trim();
    window.location.href = `/todos/${td_id}`
  })
</script>
```
---
# これまでやったこと
## ハンズオンのベースプロジェクトのコピー
```
git clone https://github.com/yamatairiku-dev/todo-simple-app.git
```
## ベースプロジェクトの動作に必要なモジュールのインストール
```
npm install
```
## ORMであるSequelizeとmysqlのライブラリをインストール
```
npm i sequelize mysql2
```
## Sequelize CLIのインストール
npm install -D sequelize-cli
## Sequelizeの初期設定
npx sequelize-cli init
## データベース接続情報の設定
./config/config.jsonを編集
## Todoモデルの作成
npx sequelize-cli model:generate --name Todo --attributes title:string
## Todoモデルを編集
./model/todo.jsにテーブルの属性を記述
## データベースにTodoテーブルを登録
./migrations/createTable.jsを作成、編集、実行 -> テーブルができていることを確認
## Todoモデルにデータベースへのインサート処理を記述
./model/todo.jsにデータベースへのインサート処理を記述
```
// Todoの登録
static async addTodo (title, description, deadline) {
  const todo = await this.create({
    title,
    description,
    deadline
  })
  console.log(todo) // todoの中身を確認
  return todo.dataValues.id
}
```
## サーバプログラムにDBへの登録処理を記述
index.jsを編集
```
// const { v4: uuidv4 } = require('uuid')
const models = require('./models')
```
```
// 登録
app.post('/todos/create', (req, res) => {
  const title = req.body.title
  const description = req.body.description
  const deadline = req.body.deadline
  models.Todo.addTodo(title, description, deadline).then((id) => {
    res.redirect('/todos')
  })
})
```
## nodemonの導入
```
npm install -D nodemon
```
package.jsonを編集
```
"scripts": {
  "dev": "nodemon index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
## Todoモデルにデータベースからの一覧取得処理を記述
./model/todo.jsを編集
```
// Todo一覧の取得
static async getTodoList () {
  const todos = await this.findAndCountAll({
    attributes: [
      'id',
      'title',
      'deadline',
      'completed'
    ]
  })
  console.dir(todos, { depth: null }) // todosの中身を確認
  const count = todos.count
  const todoList = []
  todos.rows.forEach(element => {
    const todo = element.dataValues
    todoList.push(todo)
  })
  const todoListWithCount = { count, todoList }
  return todoListWithCount
}
```
## サーバプログラムにDBから一覧取得処理を記述
index.jsを編集
```
// 一覧画面
app.get('/todos', (req, res) => {
  models.Todo.getTodoList().then(todoListWithCount => {
    const todos = todoListWithCount.todoList
    res.render('todos', { todos })
  })
})
```
## 日付の書式を変更
./subroutine/formatter.jsを作成
```
'use strict'

module.exports = {
  // Dateフォーマット
  formatDate: (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    let monthStr = '0' + month
    monthStr = monthStr.slice(-2)
    const day = date.getDate()
    let dayStr = '0' + day
    dayStr = dayStr.slice(-2)
    return `${year}-${monthStr}-${dayStr}`
  },
  // 時分フォーマット
  formatHourMin: (date) => {
    const hour = date.getHours()
    let hourStr = '0' + hour
    hourStr = hourStr.slice(-2)
    const min = date.getMinutes()
    let minStr = '0' + min
    minStr = minStr.slice(-2)
    return `${hourStr}:${minStr}`
  }
}
```
./model/todo.jsに外部モジュールを定義
```
const { Model } = require('sequelize') // 改行を削除しただけ
const formatter = require('../subroutine/formatter')
```
./model/todo.jsの「Todo一覧の取得」のforEachループに追記
```
todo.deadline = formatter.formatDate(todo.deadline)
```
## Todoモデルにデータベースからの一件取得処理を記述
./model/todo.jsを編集
```
// Todoの取得
static async getTodo (id) {
  const todoData = await this.findByPk(id, {
    attributes: [
      'id',
      'title',
      'completed',
      'deadline',
      'description'
    ]
  })
  const todo = todoData.dataValues
  todo.deadline = formatter.formatDate(todo.deadline)
  return todo
}
```
## サーバプログラムに一件取得処理を記述
index.jsを編集
```
// 詳細画面
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  models.Todo.getTodo(id).then(todo => {
    res.render('show', { todo })
  })
})
```
## Todoモデルにデータベースからの一件削除処理を記述
./model/todo.jsを編集
```
// ToDoの削除
static async delTodo (id) {
  const changes = await this.destroy(
    {
      where: { id }
    }
  )
  return changes === 1 ? id : null // changes:削除できたレコード数
}
```
## サーバプログラムに一件削除処理を記述
index.jsを編集
```
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
```
## サーバプログラムに編集画面表示処理を記述
index.jsを編集
```
// 編集画面
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  models.Todo.getTodo(id).then(todo => {
    res.render('edit', { todo })
  })
})
```
## Todoモデルにデータベースへの一件更新処理を記述
./model/todo.jsを編集
```
// ToDoの更新
static async modTodo (id, value) {
  const changes = await this.update(
    value,
    {
      where: { id }
    }
  )
  return changes[0] === 1 ? id : null
}
```
## サーバプログラムに一件更新処理を記述
index.jsを編集
```
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
```
## サーバプログラムに一件完了登録処理を記述
index.jsを編集
```
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
```
## サーバプログラムに一件未完了登録処理を記述
index.jsを編集
```
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
```
## サーバプログラムにTodo一覧API処理を記述
index.jsを編集
```
// apiデータ
app.get('/api/todos', (req, res) => {
  models.Todo.getTodoList().then(todoListWithCount => {
    res.json(todoListWithCount)
  })
})
```
## サーバプログラムから初期データの読み込みを削除
index.jsを編集
```
// 初期データ
// const todos = require('./initData.json')
```
## Todo一覧表示に完了一覧と未完了一覧の表示機能を追加
index.jsを編集
```
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
    res.render('todos', { todos })
  })
})
```
./model/todo.jsを編集
```
// Todo一覧の取得
static async getTodoList (whereClause) {
  const todos = await this.findAndCountAll({
    attributes: [
      'id',
      'title',
      'deadline',
      'completed'
    ],
    where: whereClause // where句を設定
  })
  console.dir(todos, { depth: null }) // todosの中身を確認
  const count = todos.count
  const todoList = []
  todos.rows.forEach(element => {
    const todo = element.dataValues
    todo.deadline = formatter.formatDate(todo.deadline)
    todoList.push(todo)
  })
  const todoListWithCount = { count, todoList }
  return todoListWithCount
}
```
