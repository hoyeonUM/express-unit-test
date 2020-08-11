module.exports = {
  send (content) {
    if (this.isMms(content)) {
      this.sendMms(content)
      return true
    }
    this.sendSms(content)
    return true
  },
  isMms(content) {
    return content.length > 80
  },
  sendMms(content) {
    console.log('When you call this method, money goes out')
  },
  sendSms(content) {
    console.log('When you call this method, money goes out')
  }
}