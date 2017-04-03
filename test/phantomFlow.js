var path = require('path');

var showReport = false;
var filterTest = false;
var debugMode = false;
var remoteDebug = false;
var dashboard = false;

process.argv.forEach(function(arg, i){
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


var flow = require('phantomflow').init({
    debug: debugMode ? 2 : undefined,
    createReport: true,
    test: filterTest,
    remoteDebug: remoteDebug,
    dashboard: dashboard
});


if (showReport){
    flow.report();

} else {
    flow.run(function(code) {
        process.exit(code);
    });
}

