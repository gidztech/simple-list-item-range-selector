module.exports = class {
    constructor(name) {
        this.flow = {
            type: 'flow',
            name: name,
            paths: []
        }
    }
    flow () {
        return this.flow;
    }
    step(func) {
        let s = {
            type: 'step',
            func: func
        };

        if (!this.isInBranch){
            this.flow.paths.push(s);
        } else {
            return s;
        }
    }

    chance(obj) {
        this.isInBranch = true;
        // do stuff

        let branch = {
            type: 'branch',
            chance: []
        };

        for (let c in obj) {
            if (obj.hasOwnProperty(c)) {
                branch.chance.push = {
                    type: 'chance',
                    name: c,
                    paths: obj[c]
                };
            }
        }

        this.flow.paths.push(branch);

        this.isInBranch = false;
    }
};
