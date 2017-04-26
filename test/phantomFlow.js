const server = require('./server.js');

let showReport = false;
let filterTest = false;
let debugMode = false;
let remoteDebug = false;
let dashboard = false;

process.argv.forEach((arg, i) => {
    if (arg === 'report'){
        showReport = true;
    }
    if (/^debug/.test(arg)){
        debugMode = true;
    }
    if (/^remoteDebug/.test(arg)){
        remoteDebug = true;
    }
    if (/^test=/.test(arg)){
        filterTest = arg.split('=')[1];
    }
    if (/^dashboard/.test(arg)){
        dashboard = true;
    }
});


let flow = require('phantomflow').init({
    debug: debugMode,
    createReport: true,
    test: filterTest,
    remoteDebug: remoteDebug,
    dashboard: dashboard,
    includes: 'test/includes/'
});


if (showReport){
    flow.report();
} else {
    let serverInstance = server.start(() => {
        flow.run(function(code) {
            server.stop(serverInstance);
            process.exit(code);
        });
    });
}