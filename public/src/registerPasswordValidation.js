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
