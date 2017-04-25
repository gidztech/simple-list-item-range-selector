const list = '[data-automation="list"]';
const addMoreItemsBtn = '#addMoreItems';
const resetBtn = '[data-automation="reset"]';

(function () {
    flow('Simple list item range selector', () => {
        step('Load page', () => {
            casper.thenOpen('http://localhost:3000/');
        });
        chance({
            'Click to select mode': () => {
                step('Configure app', () => {
                    casper.evaluate(() => {
                        window.__test.numOfItems = 5;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CLICK_TO_SELECT;
                    });
                });
                step('Initialise app', () => {
                    casper.evaluate(() => {
                        document.querySelector('#initialise').click();
                    });

                    assert.waitForElementCount(list + ' li', 5, 'Should see five list items');
                });

                step('Click on first list item', () => {
                    let firstListItemSelector = listItemAtIndex(1);

                    assert.waitForSelector(firstListItemSelector, 'First list item should be visible').then(() => {
                        casper.click(firstListItemSelector);
                        casper.test.pass('Clicked on first list item');
                    });
                });

                step('Shift + click on fourth list item', () => {
                    let fourthListItemSelector = listItemAtIndex(4);

                    assert.waitForSelector(fourthListItemSelector, 'Fourth list item should be visible').then(() => {
                        let {x, y} = casper.getElementInfo(fourthListItemSelector);
                        casper.page.sendEvent('click', x, y, 'left', casper.page.event.modifier.shift);
                        casper.test.pass('Shift + clicked on fourth list item');
                    });
                });

                step('Check that the first four items are selected', () => {
                    assert.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1', 'First list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1', 'Second list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(3), 'data-slirs-selected', '1', 'Third list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected');
                });

                step('Click on fifth list item', () => {
                    let fifthListItemSelector = listItemAtIndex(5);

                    assert.waitForSelector(fifthListItemSelector, 'Fifth list item should be visible').then(() => {
                        casper.click(fifthListItemSelector);
                        casper.test.pass('Clicked on fifth list item');
                    });
                });

                step('Check that the first five items are selected', () => {
                    assert.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1', 'First list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1', 'Second list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(3), 'data-slirs-selected', '1', 'Third list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1', 'Fifth list item should be selected');
                });

                step('Shift + click on third list item', () => {
                    let thirdListItemSelector = listItemAtIndex(3);

                    assert.waitForSelector(thirdListItemSelector, 'Third list item should be visible').then(() => {
                        let {x, y} = casper.getElementInfo(thirdListItemSelector);
                        casper.page.sendEvent('click', x, y, 'left', casper.page.event.modifier.shift);
                        casper.test.pass('Shift + clicked on third list item');
                    });
                });

                step('Check that only the third, fourth and fifth items are selected', () => {
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not be selected');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(2), 'data-slirs-selected', 'Second list item should not be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(3), 'data-slirs-selected', '1', 'Third list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1', 'Fifth list item should be selected');
                });

                step('Uninstall instance', () => {
                    casper.evaluate(() => {
                        window.__test.SimpleListItemRangeSelector.removeInstance('demo');
                    });

                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not have selected attribute');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-index', 'First list item should not have index attribute');

                });
            },
            'Ctrl + click to select mode': () => {
                step('Configure app', () => {
                    casper.evaluate(() => {
                        window.__test.numOfItems = 5;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT;
                    });
                });
                step('Initialise app', () => {
                    casper.evaluate(() => {
                        document.querySelector('#initialise').click();
                    });

                    assert.waitForElementCount(list + ' li', 5, 'Should see five list items');
                });

                step('Click on first list item', () => {
                    let firstListItemSelector = listItemAtIndex(1);

                    assert.waitForSelector(firstListItemSelector, 'First list item should be visible').then(() => {
                        casper.click(firstListItemSelector);
                        casper.test.pass('Clicked on first list item');
                    });
                });

                step('Check that first list item is selected', () => {
                    let firstListItemSelector = listItemAtIndex(1);
                    assert.waitForElementToHaveAttr(firstListItemSelector, 'data-slirs-selected', '1', 'First list item should be selected');
                });

                step('Click on fourth list item', () => {
                    let fourthListItemSelector = listItemAtIndex(4);

                    assert.waitForSelector(fourthListItemSelector, 'Fourth list item be visible').then(() => {
                        casper.click(fourthListItemSelector);
                        casper.test.pass('Clicked on fourth list item');
                    });
                });

                step('Check that only the fourth item is selected', () => {
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected');
                });

                step('Add five more list items', () => {
                    casper.click(addMoreItemsBtn);
                    casper.test.pass('Clicked on add more items button');
                });

                step('Check list item count', () => {
                    assert.waitForElementCount(list + ' li', 10, 'Should see ten list items');
                });

                step('Check that fourth item is still selected', () => {
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected still');
                });

                step('Shift + click on seventh list item', () => {
                    let seventhListItemSelector = listItemAtIndex(7);

                    assert.waitForSelector(seventhListItemSelector, 'Seventh list item should be visible').then(() => {
                        let {x, y} = casper.getElementInfo(seventhListItemSelector);
                        casper.page.sendEvent('click', x, y, 'left', casper.page.event.modifier.shift);
                        casper.test.pass('Shift + clicked on seventh list item');
                    });
                });

                step('Check that items four to seven are selected', () => {
                    assert.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1', 'Fourth list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1', 'Fifth list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(6), 'data-slirs-selected', '1', 'Sixth list item should be selected');
                    assert.waitForElementToHaveAttr(listItemAtIndex(7), 'data-slirs-selected', '1', 'Seventh list item should be selected');
                });

                step('Click on Reset button', () => {
                    casper.click(resetBtn);
                    casper.test.pass('Clicked on reset button');
                });

                step('Check that nothing is selected', () => {
                    assert.waitForElementCount(list + ' li', 5, 'Should see five list items');

                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not be selected');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(2), 'data-slirs-selected', 'Second list item should not be selected');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected', 'Third list item should not be selected');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected', 'Fourth list item should not be selected');
                    assert.waitForElementToNotHaveAttr(listItemAtIndex(5), 'data-slirs-selected', 'Fifth list item should not be selected');
                })
            }
        });
    });
})();

function listItemAtIndex(index) {
    return list + ' li:nth-child(' + index + ')';
}