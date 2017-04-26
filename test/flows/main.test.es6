const list = '[data-automation="list"]';
const addMoreItemsBtn = '#addMoreItems';
const resetBtn = '[data-automation="reset"]';

(function () {
    flow('Simple list item range selector', () => {
        step('Load page', () => {
            casper.thenOpen('http://localhost:3000/');
        });
        chance({
            'There are no list items': () => {
                step('Configure app', () => {
                    casper.evaluate(() => {
                        window.__test.numOfItems = 0;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                    });
                });
                step('Initialise app', () => {
                    casper.evaluate(() => {
                        document.querySelector('#initialise').click();
                    });
                });
                step('Check there are no list items', () => {
                    assert.waitForElementCount(list + ' li', 0, 'Should see zero list items');
                });

                decision({
                    'Want to add five list items': () => {
                        step('Add five more list items', () => {
                            casper.click(addMoreItemsBtn);
                            casper.test.pass('Clicked on add more items button');
                        });
                        step('Check list item count', () => {
                            assert.waitForElementCount(list + ' li', 5, 'Should see five list items');
                        });
                    },
                    'Want to longer use this library': () => {
                        step('Uninstall instance', () => {
                            let instance = casper.evaluate(() => {
                                window.__test.SimpleListItemRangeSelector.removeInstance('demo');
                                return window.__test.SimpleListItemRangeSelector.getInstance('demo');
                            });

                            casper.then(() => {
                                casper.test.assert(instance === null, 'Should not have an instance named "demo"');
                            });
                        });
                    }
                });
            },
            'There are five list items': () => {
                step('Configure app', () => {
                    casper.evaluate(() => {
                        window.__test.numOfItems = 5;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                    });
                });
                step('Initialise app', () => {
                    casper.evaluate(() => {
                        document.querySelector('#initialise').click();
                    });
                });
                step('Check there are five list items', () => {
                    assert.waitForElementCount(list + ' li', 5, 'Should see five list items');
                });

                decision({
                    'Want to select first four list items': () => {
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

                        decision({
                            'Want to select firth item': () => {
                                chance({
                                    'Click to select mode is enabled': () => {
                                        step('Set select mode', () => {
                                            casper.evaluate(() => {
                                                let instance = window.__test.SimpleListItemRangeSelector.getInstance('demo');
                                                instance.setClickMode(window.__test.SimpleListItemRangeSelector.clickModes.CLICK_TO_SELECT);
                                            });
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
                                    },
                                    'Ctrl + click to select mode is enabled': () => {
                                        step('Set select mode', () => {
                                            casper.evaluate(() => {
                                                let instance = window.__test.SimpleListItemRangeSelector.getInstance('demo');
                                                instance.setClickMode(window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT);
                                            });
                                        });
                                        step('Click on fifth list item', () => {
                                            let fifthListItemSelector = listItemAtIndex(5);

                                            assert.waitForSelector(fifthListItemSelector, 'Fifth list item should be visible').then(() => {
                                                casper.click(fifthListItemSelector);
                                                casper.test.pass('Clicked on fifth list item');
                                            });
                                        });
                                        step('Check that only the fifth item is selected', () => {
                                            assert.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1', 'Fifth list item should be selected');
                                            assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not be selected');
                                            assert.waitForElementToNotHaveAttr(listItemAtIndex(2), 'data-slirs-selected', 'Second list item should not be selected');
                                            assert.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected', 'Third list item should not be selected');
                                            assert.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected', 'Fourth list item should not be selected');
                                        });
                                    }
                                });
                            },
                            'Want to only have first two list items selected': () => {
                                step('Shift + click on second list item', () => {
                                    let secondListItemSelector = listItemAtIndex(2);

                                    assert.waitForSelector(secondListItemSelector, 'Second list item should be visible').then(() => {
                                        let {x, y} = casper.getElementInfo(secondListItemSelector);
                                        casper.page.sendEvent('click', x, y, 'left', casper.page.event.modifier.shift);
                                        casper.test.pass('Shift + clicked on second list item');
                                    });
                                });

                                step('Check that only the first and second list items are selected', () => {
                                    assert.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1', 'First list item should be selected');
                                    assert.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1', 'Second list item should be selected');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected', 'Third list item should not be selected');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected', 'Fourth list item should not be selected');

                                });
                            },
                            'Want to reset selection': () => {
                                step('Reset selection', () => {
                                    casper.click(resetBtn);
                                    casper.test.pass('Clicked on reset button');

                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not have selected attribute');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(2), 'data-slirs-selected', 'Second list item should not have selected attribute');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected', 'Third list item should not have selected attribute');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected', 'Fourth list item should not have selected attribute');
                                });
                            },
                            'Want to longer use this library': () => {
                                step('Uninstall instance', () => {
                                    casper.evaluate(() => {
                                        window.__test.SimpleListItemRangeSelector.removeInstance('demo');
                                    });

                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected', 'First list item should not have selected attribute');
                                    assert.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-index', 'First list item should not have index attribute');
                                });
                            }
                        });
                    }
                });
            }
        });
    });
})();

function listItemAtIndex(index) {
    return list + ' li:nth-child(' + index + ')';
}