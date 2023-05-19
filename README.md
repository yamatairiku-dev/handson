# handson

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
npm install nodemon
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