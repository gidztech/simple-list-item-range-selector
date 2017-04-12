const list = '[data-automation="list"]';
const firstListItemSelector = '[data-automation="list"] li:first-child';
const fourthListItemSelector = '[data-automation="list"] li:nth-child(4)';

(function() {
    flow('Simple list item range selector', () => {
        step("Load page", () => {
            casper.thenOpen("http://localhost:3000/");
        });
        step('Configure app', () => {
            casper.evaluate(() => {
                window.__test.itemCount = 10;
                window.__test.clickMode = 1;
            });
        });
        step('Initialise app', () => {
            casper.evaluate(() => {
                document.querySelector('#initialise').click();
            });

            waitForSelector(list, 'Should see list of items');
        });

        step("Click on first list item", () => {
            waitForSelector(firstListItemSelector, 'First list item should be visible').then(() => {
                casper.click(firstListItemSelector);
                casper.test.pass('Clicked on first list item');
            });
        });

        step("Check that first list item is selected", () => {
            waitForElementToHaveAttr(firstListItemSelector, 'data-slirs-selected', '1', 'First list item should be selected');
        });

        step("Click on fourth list item", () => {
            waitForSelector(fourthListItemSelector, 'Fourth list item be visible').then(() => {
                casper.click(fourthListItemSelector);
                casper.test.pass('Clicked on fourth list item');
            });
        });

        step("Check that fourth list item is selected", () => {
            waitForElementToHaveAttr(fourthListItemSelector, 'data-slirs-selected', '1', 'Fourth list item should be selected');
        });
    });


    // some helper functions
    function waitForSelector(selector, message) {
        return casper.waitForSelector(selector, () => {
                casper.test.pass(message);
            }, () => {
                casper.test.fail(message);
            }
        );
    }

    function waitForElementToHaveAttr(selector, attrName, expectedValue, message) {
        casper.then(() => {
            let attrValue = '';
            casper.waitFor(
                () => {
                    attrValue = casper.evaluate((selector, attrName) => {
                        let els = document.querySelectorAll(selector);
                        if (els && els[0] && els[0].hasAttribute(attrName)) {
                            return els[0].getAttribute(attrName);
                        } else {
                            return false;
                        }
                    }, selector, attrName);

                    return attrValue === expectedValue;
                }, () => {
                    casper.test.pass(message);
                }, () => {
                    casper.test.fail(message + ': ' + selector + ' child should have attr ' + attrName + ' = ' + expectedValue + ', but it was ' + attrValue);
                }
            );
        });
    }
})();