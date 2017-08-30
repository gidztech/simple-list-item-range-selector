class Node {
    constructor(fn) {
        this.fn = fn;
        this.connections = [];
    }
}

module.exports = class Flow {
    constructor(name) {
        this.name = name;
        this.startNode = new Node();
        this.currentNode = this.startNode;
    }

    createStep(fn) {
        this.currentNode.fn = fn;
        const nextNode = new Node();
        this.currentNode.connections.push(nextNode);
        this.currentNode = nextNode;


    }
    createFork(obj) {
        let branchNode = this.currentNode;
        let nodeAfterBranch = new Node();

        Object.keys(obj).forEach(key => {
            let nextNode = new Node();
            this.currentNode.connections.push(nextNode);
            this.currentNode = nextNode;
            obj[key]();
            this.currentNode.connections.push(nodeAfterBranch);
            this.currentNode = branchNode;
        });

        this.currentNode = nodeAfterBranch;
    }
    traverse() {
        let node = this.startNode;
        console.log(this.name);

        function t(node) {
            if (typeof node.fn) {
                console.log(node.fn.toString());
            }

            node.connections.forEach(nextNode => {
               return t(nextNode);
            });

            return '';
        }

        return t(node);
    }
};