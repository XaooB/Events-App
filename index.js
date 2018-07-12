const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();
const PORT = process.env.port || 3000;

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render('index');
});

app.listen(PORT);
