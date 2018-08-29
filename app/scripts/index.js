// import 'normalize.css/normalize.css'
import './../styles/main.scss'

import filter from './_filter.js'

// import './_vk.js'

if (process.env.NODE_ENV !== 'production') {
  require('./../index.pug')
}

document.addEventListener('DOMContentLoaded', function (e) {
  filter()
})
