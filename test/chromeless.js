const { Chromeless } = require('chromeless');
const chromeless = new Chromeless();

// My extension functions
chromeless.waitOrTimeout = ({fn, p}) => {
    let firstTime = new Date().getTime();

    let timer = setInterval(() => {
        if ((new Date().getTime() - firstTime) / 1000 < 2) {
            fn(value => {
                clearInterval(timer);
                p.resolve(value);
            });
        } else {
            clearInterval(timer);
            p.reject('We have timed out!');
        }
    }, 100);
};

chromeless.waitFor = tester => {
    return new Promise((resolve, reject) => {
        let fn = complete => {
            tester().then(complete).catch(e => {
                reject(e);
            });
        };

        chromeless.waitOrTimeout({
            fn: fn,
            p: {resolve, reject}
        });
    });
};

chromeless.waitForElementCount = (selector, expectedCount, message) => {
    return new Promise((resolve, reject) => {
        chromeless.waitFor(
            async () => {
                let count = await chromeless.evaluate(selector => {
                    return document.querySelectorAll(selector).length;
                }, selector);
                return Promise.resolve(count === expectedCount);
            },
        ).then(value => {
            resolve(value);
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = chromeless;