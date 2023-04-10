function validatePassword() {
  let password1 = document.getElementById('p1');
  let password2 = document.getElementById('p2');
  console.log(password2.value);
  if (password1.value === password2.value) {
    // document.getElementById('password1').style.color = 'green';
    document.getElementById('submitButton').disabled = false;
    password2.style.color = 'green';
  }
  //   document.getElementById('password1').style.color = 'red';
  else password2.style.color = 'red';
  //   document.getElementById('submitButton').disabled = false;
}

function checkEmail() {
  email = document.getElementById('email').value;
  fetch('/checkEmail', {
    method: 'POST',
    body: new URLSearchParams({ email }),
  }).then((response) => console.log(response.json()));
}

/*
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="..." class="rounded mr-2" alt="...">
    <strong class="mr-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
*/

//window.innerHTML = ...
