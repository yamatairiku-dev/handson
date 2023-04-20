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
        todo.deadline = formatter.formatDate(todo.deadline)
        todoList.push(todo)
      })
      const todoListWithCount = { count, todoList }
      return todoListWithCount
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
