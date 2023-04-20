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
