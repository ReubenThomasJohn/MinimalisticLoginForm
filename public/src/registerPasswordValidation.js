function validatePassword() {
  let password1 = document.getElementById('p1');
  let password2 = document.getElementById('p2');

  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let dob = document.getElementById('dob').value;
  let password_input = document.getElementById('p1').value;
  console.log(password2.value);
  if (password1.value === password2.value) {
    // document.getElementById('password1').style.color = 'green';
    document.getElementById('submitButton').disabled = false;
    password2.style.color = 'green';
  }
  // if (name == '' || email == '' || dob == '' || password_input == '') {
  //   document.getElementById('submitButton').disabled = true;
  // }
  //   document.getElementById('password1').style.color = 'red';
  else password2.style.color = 'red';
  //   document.getElementById('submitButton').disabled = false;
}

// function checkEmail() {
//   email = document.getElementById('email').value;
//   fetch('/checkEmail', {
//     method: 'POST',
//     body: new URLSearchParams({ email }),
//   }).then((response) => console.log(response.json()));
// }
