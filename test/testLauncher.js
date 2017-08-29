const server = require('./server.js');
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const testDir = 'test/tests';

let serverInstance = server.start(() => {
    // we need to increase the timeout or else mocha will exit with an error
    let mocha = new Mocha({timeout: 10000});

    fs.readdirSync(testDir).filter(function(file){
        return file.substr(-3) === '.js';
    }).forEach(function(file){
        mocha.addFile(
            path.join(testDir, file)
        );
    });

    mocha.run(function(failures){
        server.stop(serverInstance);
        process.on('exit', function () {
            process.exit(failures);
        });
    });
});

