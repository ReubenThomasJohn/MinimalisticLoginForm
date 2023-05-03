const bcrypt = require('bcrypt');
const password = '123456789';
const hashedPW = '$2b$10$j.HskUh2hVG4uLz3BaeP0u7fonaR2Ndg71J90v7LvN3Pml.0PX/qO';

bcrypt.compare(password, hashedPW).then((value) => {
  console.log(value);
});
