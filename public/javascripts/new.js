document.addEventListener("DOMContentLoaded", function() {

  console.log('testing new frontend javascript');

  document.querySelector('.hash').addEventListener('keypress', e => {
    console.log(e.key)
    if(e.key == ' ') {
      console.log(e.target.value);
      e.target.value = e.target.value.split(' ').map(item => {
        if (item[0] === "#") {
          return item
        }
      	return '#' + item
      }).join(' ')
    }
  })
})
