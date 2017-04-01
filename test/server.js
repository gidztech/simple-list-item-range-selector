let express = require('express');
let path = require('path');

let app = express();
app.use(express.static(path.join(__dirname, '..', 'demo')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

let server = app.listen(3000, () => {
    console.log('Started test server');
});