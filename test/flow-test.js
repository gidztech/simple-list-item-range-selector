const Flow = require('./Flow');
let flow = new Flow('my flow');

const createStep = function() {
    return flow.createStep.apply(flow, arguments);
};
const createFork = function() {
    return flow.createFork.apply(flow, arguments);
};

createStep(() => {
    console.log('step 1');
});

createStep(() => {
    console.log('step 2');
});

createFork({
    a: () => {
        createStep(() => {
            console.log('fork a: step 3');
        });
        createStep(() => {
            console.log('fork a: step 4');
        });
        createFork({
            c: () => {
                createStep(() => {
                    console.log('fork c: step 5');
                });
                createStep(() => {
                    console.log('fork c: step 6');
                });
            },
            d: () => {
                createStep(() => {
                    console.log('fork d: step 7');
                });
                createStep(() => {
                    console.log('fork d: step 8');
                });
            }
        });
        createStep(() => {
            console.log('step 9');
        });
        createStep(() => {
            console.log('step 10');
        });
    },
    b: () => {
        createStep(() => {
            console.log('fork b: step 11');
        });
        createStep(() => {
            console.log('fork b: step 12');
        });
    }
});

createStep(() => {
    console.log('step 13');
});
createStep(() => {
    console.log('step 14');
});
createStep(() => {
    console.log('step 15');
});

console.log(">>>>>")
console.log(flow.traverse());