const list = '[data-automation="list"]';
const firstListItemSelector = '[data-automation="list"] li:first-child';
const secondListItemSelector = '[data-automation="list"] li:nth-child(2)';
const thirdListItemSelector = '[data-automation="list"] li:nth-child(3)';
const fourthListItemSelector = '[data-automation="list"] li:nth-child(4)';
const fifthListItemSelector = '[data-automation="list"] li:nth-child(5)';

(function() {
    flow('Simple list item range selector', () => {
        step("Load page", () => {
            casper.thenOpen("http://localhost:3000/");
        });
        chance({
           'Click to select': () => {
               step('Configure app', () => {
                   casper.evaluate(() => {
                       window.__test.itemCount = 5;
                       window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CLICK_TO_SELECT;
                   });
               });
               step('Initialise app', () => {
                   casper.evaluate(() => {
                       document.querySelector('#initialise').click();
                   });

                   assert.waitForSelector(list, 'Should see list of items');
               });

               step("Click on first list item", () => {
                   assert.waitForSelector(firstListItemSelector, 'First list item should be visible').then(() => {
                       casper.click(firstListItemSelector);
                       casper.test.pass('Clicked on first list item');
                   });
               });

               step("Check that first list item is selected", () => {
                   assert.waitForElementToHaveAttr(firstListItemSelector, 'data-slirs-selected', '1', 'First list item should be selected');
               });

               step("Click on fourth list item", () => {
                   assert.waitForSelector(fourthListItemSelector, 'Fourth list item be visible').then(() => {
                       casper.click(fourthListItemSelector);
                       casper.test.pass('Clicked on fourth list item');
                   });
               });

               step("Check that fourth list item is selected", () => {
                   assert.waitForElementToHaveAttr(fourthListItemSelector, 'data-slirs-selected', '1', 'Fourth list item should be selected');
               });
           },
           'Ctrl click to select': () => {
                step('Configure app', () => {
                    casper.evaluate(() => {
                        window.__test.itemCount = 5;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT;
                    });
                });
                step('Initialise app', () => {
                    casper.evaluate(() => {
                        document.querySelector('#initialise').click();
                    });

                    assert.waitForSelector(list, 'Should see list of items');
                });

                step("Click on first list item", () => {
                    assert.waitForSelector(firstListItemSelector, 'First list item should be visible').then(() => {
                        casper.click(firstListItemSelector);
                        casper.test.pass('Clicked on first list item');
                    });
                });

                step("Check that first list item is selected", () => {
                    assert.waitForElementToHaveAttr(firstListItemSelector, 'data-slirs-selected', '1', 'First list item should be selected');
                });

                step("Click on fourth list item", () => {
                    assert.waitForSelector(fourthListItemSelector, 'Fourth list item be visible').then(() => {
                        casper.click(fourthListItemSelector);
                        casper.test.pass('Clicked on fourth list item');
                    });
                });

                step("Check that first list item is not selected", () => {
                    assert.waitForElementToNotHaveAttr(firstListItemSelector, 'data-slirs-selected', 'Fourth list item should not be selected');
                });
            },
        });
    });
})();