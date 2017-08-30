let myFlow = {
    type: 'flow',
    name: 'my flow',
    paths: [{
        type: 'step',
        func: () => console.log('step 1')
    }, {
        type: 'step',
        func: () => console.log('step 2')
    }, {
        type: 'step',
        func: () => console.log('step 3')
    }, {
        type: 'branch',
        chance: [{
            type: 'chance',
            name: 'chance 1',
            paths: [{
                type: 'step',
                func: () => console.log('chance1 - step 4')
            }, {
                type: 'step',
                func: () => console.log('chance1 - step 5')
            }, {
                type: 'branch',
                decision: [{
                    type: 'decision',
                    name: 'decision 1',
                    paths: [{
                        type: 'step',
                        func: () => console.log('chance1 - decision1 - step 6')
                    }, {
                        type: 'step',
                        func: () => console.log('chance1 - decision1 - step 7')
                    }
                    ]
                }, {
                    type: 'decision',
                    name: 'decision 2',
                    paths: [{
                        type: 'step',
                        func: () => console.log('chance1 - decision2 - step 8')
                    }, {
                        type: 'step',
                        func: () => console.log('chance1 - decision2 - step 9')
                    }]
                }
                ]
            }, {
                type: 'step',
                func: () => console.log('chance1 - step 10')
            }, {
                type: 'step',
                func: () => console.log('chance1 - step 11')

            }
            ]
        }, {
            type: 'chance',
            name: 'chance 2',
            paths: [{
                type: 'step',
                func: () => console.log('chance2 - step 12')
            }, {
                type: 'step',
                func: () => console.log('chance2 - step 13')
            }, {
                type: 'branch',
                decision: [{
                    type: 'decision',
                    name: 'decision 3',
                    paths: [
                        {
                            type: 'step',
                            func: () => console.log('chance2 - decision3 - step 14')
                        }, {
                            type: 'step',
                            func: () => console.log('chance2 - decision3 - step 15')

                        }

                    ]
                }, {
                    type: 'decision',
                    name: 'decision 4',
                    paths: [
                        {
                            type: 'step',
                            func: () => console.log('chance2 - decision4 - step 16')
                        }, {
                            type: 'step',
                            func: () => console.log('chance2 - decision4 - step 17')

                        }

                    ]
                }
                ]
            }
            ]
        }
        ]
    },
    ]
};
