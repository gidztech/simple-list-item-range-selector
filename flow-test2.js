class Node {
    constructor(fn) {
        this.fn = fn;
        this.next = [];
    }
}


function createStep(fn) {
    currentNode.fn = fn;

    const nextNode = new Node();
    currentNode.next.push(nextNode);

    currentNode = nextNode;
}

function createFork(obj){

    let branchNode = currentNode;
    let nodeAfterBranch = new Node();

    Object.keys(obj).forEach(key => {
        let nextNode = new Node();
        currentNode.next.push(nextNode);
        currentNode = nextNode;
        obj[key]();
        currentNode.next.push(nodeAfterBranch);
        currentNode = branchNode;
    });

    currentNode = nodeAfterBranch;

}

const startNode = new Node();
let currentNode = startNode;


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


