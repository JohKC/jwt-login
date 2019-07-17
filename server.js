const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const loginRoutes = require('./routes/login.routes');

app.set('json spaces', 4);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', loginRoutes);

app.listen(3000, () => {
    console.log('listening on port 3000');
});