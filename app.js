require('./config/db');

const app = require('express')();
app.set('view engine', 'ejs');
const port = process.env.PORT || 5000;

//cors
const cors = require('cors');
app.use(cors());

app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
  })
);

const UserRouter = require('./api/User');

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
