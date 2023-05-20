'use strict'
const { Model } = require('sequelize')
const formatter = require('../subroutine/formatter')

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }

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

    // Todo一覧の取得
    static async getTodoList (whereClause) {
      const todos = await this.findAndCountAll({
        attributes: [
          'id',
          'title',
          'deadline',
          'completed',
          'updatedAt'
        ],
        where: whereClause
      })
      console.dir(todos, { depth: null }) // todosの中身を確認
      const count = todos.count
      const todoList = []
      todos.rows.forEach(element => {
        const todo = element.dataValues
        todo.deadline = formatter.formatDate(todo.deadline)
        todo.updatedAt = formatter.formatDate(todo.updatedAt) + ' ' + formatter.formatHourMin(todo.updatedAt)
        todoList.push(todo)
      })
      const todoListWithCount = { count, todoList }
      return todoListWithCount
    }

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

    // ToDoの削除
    static async delTodo (id) {
      const changes = await this.destroy(
        {
          where: { id }
        }
      )
      return changes === 1 ? id : null // changes:削除できたレコード数
    }

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
  }

  Todo.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    completed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deadline: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Todo',
    freezeTableName: true
  })
  return Todo
}
