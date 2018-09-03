import './../styles/main.scss'

import 'babel-polyfill'

import filter from './_filter.js'

// import './_vk.js'

if (process.env.NODE_ENV !== 'production') {
  require('./../index.pug')
}

document.addEventListener('DOMContentLoaded', function (e) {
  filter()
})

document.querySelector('.image--logo').addEventListener('click', function (e) {
  document.querySelector('.filter').classList.remove('hide')
  filter()
})

document.querySelector('.filter__close').addEventListener('click', function (e) {
  document.querySelector('.filter').classList.add('hide')
})
