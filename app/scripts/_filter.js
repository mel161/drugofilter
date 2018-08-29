/* global VK:true */
const templateElement = require('./../_item.pug')

export default function () {
  const friendClass = 'js-friend'
  const friendListsClass = 'js-friends-list'
  const friendButtonClass = 'js-friend-button'

  const filterContainer = document.querySelector('.js-filter')
  const commonFriends = document.querySelector(`.${friendListsClass}[data-list="common"]`)
  const favoriteFriends = document.querySelector(`.${friendListsClass}[data-list="favorite"]`)
  const friendList = document.querySelectorAll(`.${friendListsClass}`)
  const filterInputs = document.querySelectorAll(`.js-filter-input`)
  const saveButton = document.querySelector('.js-save')

  const filter = {
    allFriends: undefined,
    objectFriends: {},
    dragElement: undefined,
    init: function () {
      (async () => {
        try {
          this.authentication()
          this.allFriends = await this.getFriends('friends.get', {fields: 'nickname, photo_100'})
          this.objectFriends = this.parseFriends(this.allFriends.items)
          let storageFriends = window.localStorage.getItem('friends')
          if (storageFriends === null) {
            this.renderFriends(this.allFriends)
          } else {
            this.loadFriends(storageFriends)
          }
        } catch (e) {
          console.error(e)
        }
      })()
      this.addListeners()
    },
    authentication: function () {
      return new Promise((resolve, reject) => {
        VK.init({
          apiId: 6673574
        })

        VK.Auth.login(data => {
          if (data.session) {
            resolve()
          } else {
            reject(new Error('Не удалось авторизоваться'))
          }
        }, 2)
      })
    },
    getFriends: function (method, params) {
      params.v = '5.80'

      return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
          if (!data.error) {
            resolve(data.response)
          } else {
            reject(data.error)
          }
        })
      })
    },
    parseFriends: function (friendList) {
      let object = {}
      friendList.forEach(function (friend) {
        object[friend.id] = friend
      })
      return object
    },
    renderFriends: function (friends) {
      const html = templateElement(friends)
      commonFriends.innerHTML = html
    },
    addListeners: function () {
      filterContainer.addEventListener('dragstart', this.dragFriend.bind(this))
      filterContainer.addEventListener('dragend', this.endDragFriend.bind(this))
      filterContainer.addEventListener('drop', this.handleDrop.bind(this))
      filterContainer.addEventListener('click', this.switchFriend)
      saveButton.addEventListener('click', this.saveFriends)

      filterInputs.forEach(function (input) {
        input.addEventListener('input', this.checkMatch.bind(this))
      }.bind(this))

      friendList.forEach(function (list) {
        list.addEventListener('dragenter', this.handleEnter)
        list.addEventListener('dragover', this.handleOver)
        list.addEventListener('dragleave', this.handleLeave)
      }.bind(this))
    },
    dragFriend: function (event) {
      let target = event.target
      this.dragElement = target

      if (!target.classList.contains(friendClass))
        return false

      event.dataTransfer.effectAllowed = 'move'

      filterContainer.classList.add('drag')
      target.classList.add('drag')
    },
    endDragFriend: function (event) {
      let target = event.target
      if (!target.classList.contains(friendClass))
        return false

      filterContainer.classList.remove('drag')
      target.classList.remove('drag')
    },
    handleEnter: function (event) {
      event.preventDefault()

      this.classList.add('over')
    },
    handleOver: function (event) {
      event.preventDefault()

      event.dataTransfer.dropEffect = 'move'

      return false
    },
    handleLeave: function () {
      this.classList.remove('over')
    },
    handleDrop: function (event) {
      let target = event.target

      target.insertBefore(this.dragElement, target.firstChild)
      target.classList.remove('over')

      filterInputs.forEach(function (input) {
        this.checkMatch(undefined, input)
      }.bind(this))

      this.dragElement = undefined
    },
    switchFriend: (event) => {
      let target = event.target
      let button = target.closest(`.${friendButtonClass}`)
      let friend = target.closest(`.${friendClass}`)
      let dataList = target.closest(`.${friendListsClass}`).getAttribute('data-list')

      if (!button)
        return

      if (dataList === 'common') {
        favoriteFriends.insertBefore(friend, favoriteFriends.firstChild)
      } else {
        commonFriends.insertBefore(friend, commonFriends.firstChild)
      }
    },
    checkMatch: function (event, element) {
      let input = (event)
        ? event.target
        : element
      let value = input.value
      let inputData = input.getAttribute('data-input')
      let list = document.querySelector(`.${friendListsClass}[data-list="${inputData}"]`)
      let friends = list.querySelectorAll(`.${friendClass}`)

      if (value) {
        friends.forEach(function (friend) {
          let dataFriend = JSON.parse(friend.getAttribute('data-friend'))

          if (this.doMatch(dataFriend.name, value) || this.doMatch(dataFriend.lastName, value)) {
            friend.classList.remove('hide')
          } else {
            friend.classList.add('hide')
          }
        }.bind(this))
      } else {
        friends.forEach(friend => friend.classList.remove('hide'))
      }
    },
    doMatch: function (full, chunk) {
      let str = full
      let regexp = new RegExp(chunk, 'i')
      let result = str.match(regexp)

      if (chunk.length === 0)
        return false

      if (result != null) {
        return true
      } else {
        return false
      }
    },
    saveFriends: function () {
      let saveList = {}
      let friends = document.querySelectorAll(`.${friendClass}`)

      friends.forEach(function (friend) {
        let list = friend.closest(`.${friendListsClass}`)
        let listName = list.dataset.list
        let id = friend.dataset.id

        if (!saveList.hasOwnProperty(listName)) {
          saveList[listName] = []
          saveList[listName].push(id)
        } else {
          saveList[listName].push(id)
        }
      })

      let stringList = JSON.stringify(saveList)
      window.localStorage.setItem('friends', stringList)
    },
    loadFriends: function (friendList) {
      let parseList = JSON.parse(friendList)
      for (let key in parseList) {
        let renderList = []
        let friends = this.objectFriends

        parseList[key].forEach(function (id) {
          if (friends.hasOwnProperty(id)) {
            renderList.push(friends[id])
          }
        })

        const html = templateElement({
          items: renderList
        })

        if (key === 'common') {
          commonFriends.innerHTML = html
        } else {
          favoriteFriends.innerHTML = html
        }
      }
    }
  }

  filter.init()
}
