const express = require('express');
const path = require('path');

let app = express();

app.use(express.static(path.join(__dirname, '..', 'demo')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

let startServer = (callback) => {
    return app.listen(3000, () => {
        console.log('Started test server on port 3000');
        callback && callback();
    });
};

let stopServer =  (server) => {
    server.close();
    console.log('Closed test server');
    process.exit(0);
};

let arg = process.argv[2];

if (arg && arg === 'start') {
    startServer();
}

module.exports = {
    start: startServer,
    stop: stopServer
};
