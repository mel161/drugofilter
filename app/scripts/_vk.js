VK.init({apiId: 6673574})

VK.Auth.login(function (response) {
  if (response.session) {
    console.log('всё ок!')
  } else {
    alert('Не удалось авторизоваться')
  }
}, 8)

VK.Api.call('friends.get', {
  user_ids: 8498114,
  fields: "nickname",
  v:"5.73"
}, function (r) {
  if (r.response) {
    createList(r.response.items);
  }
})

function createList(items) {
  var friendList = document.querySelector('.friends__list--base');
  console.log(friendList);

  items.forEach(function (item) {
    var li = document.createElement('li');
    li.className = "friends__item";
    li.innerHTML = '<span class="text">'+ item.first_name + ' ' + item.last_name +'</span><svg class="icon icon--plus" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#C3C3C3" fill-rule="evenodd" d="M14 10h-4v4a2 2 0 1 1-4 0v-4H2a2 2 0 1 1 0-4h4V2a2 2 0 1 1 4 0v4h4a2 2 0 1 1 0 4z"></path></svg>';

    friendList.appendChild(li);
  });
}
