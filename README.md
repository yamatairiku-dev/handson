# handson

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
    whereClause = {}
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
```
