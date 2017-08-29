const TIMEOUT = 2000;

module.exports = class PupUtils {
    constructor(page) {
        this.page = page;
    }

    async waitForElementCount(selector, expectedCount) {
        return new Promise(async(resolve, reject) => {
            this.page.waitForFunction((selector, expectedCount) => {
                return document.querySelectorAll(selector).length === expectedCount;
            }, {timeout: TIMEOUT}, selector, expectedCount).then(() => {
                resolve(true);
            }).catch(() => {
                reject(new Error(`Timeout exceeded: Element count for selector ${selector} is not ${expectedCount}.`));
            });
        });
    }

    async waitForElementToHaveAttr(selector, attrName, expectedValue) {
        return new Promise(async(resolve, reject) => {
            this.page.waitForFunction((selector, attrName, expectedValue) => {
                let els = document.querySelectorAll(selector);
                if (els && els[0] && els[0].hasAttribute(attrName)) {
                    return els[0].getAttribute(attrName) === expectedValue;
                }
                return false;
            }, {timeout: TIMEOUT}, selector, attrName, expectedValue).then(() => {
                resolve(true);
            }).catch(() => {
                reject(new Error(`Timeout exceeded: Element at selector ${selector} does not have ${attrName}:${expectedValue}.`));
            });
        });
    }

};