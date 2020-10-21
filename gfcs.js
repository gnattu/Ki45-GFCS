const Nightmare = require('nightmare')
const { JSDOM } = require("jsdom")

const args = process.argv.slice(2)

const nightmare = Nightmare({
  show: true,
  width: 1440,
  height: 900
})

nightmare.useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0')

const url = args[0]
const user = args[1]
let html = ""

const setup = () => {
  nightmare
    .goto(url)
    .wait('#items.yt-live-chat-item-list-renderer')
    .catch(error => {
    console.error('Search failed:', error)
  })
}

const check = () => {
  nightmare
    .evaluate(() => {
      html = document.documentElement.outerHTML
      return html
  })
    .then(x => {
      html = x
    })
  const { window } = new JSDOM(html)
  const $ = require('jquery')(window)
  const users = $('yt-live-chat-text-message-renderer').find('#author-name')
  let lastSeen
  if (users.length > 0) {
    lastSeen = $(users).filter(index => $(users[index]).text() === user).last().parent().parent().find('#timestamp').text()
  }
  console.clear()
  console.log(lastSeen? user+' last seen '+lastSeen : 'No comment detected for '+user)
}

setup()
setInterval(check, 1500)
