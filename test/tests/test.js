const chromeless = require('../chromeless');
const {expect} = require('chai');

const list = '[data-automation="list"]';
const addMoreItemsBtn = '#addMoreItems';
const resetBtn = '[data-automation="reset"]';

describe('Simple list item range selector', async function () {
    describe('No list items flow', async function () {
        before(async() => {
            await chromeless
                .goto('http://localhost:3000/')
                .evaluate(() => {
                    window.__test.numOfItems = 0;
                    window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                    document.querySelector('#initialise').click();
                });
        });

        it('There are no list items', async function () {
            let elementCount = await chromeless.waitForElementCount(list + ' li', 0, 'Should see zero list items');
            expect(elementCount).to.be.true;
        });

        it('There should be five items after clicking add more button', async function () {
            await chromeless.click(addMoreItemsBtn);
            let elementCount = await chromeless.waitForElementCount(list + ' li', 5, 'Should see five list items');
            expect(elementCount).to.be.true;
        });
    });
    describe('Five items flow', async function () {
        describe('Select four list items flow', async function () {
            before(async() => {
                await chromeless
                    .goto('http://localhost:3000/')
                    .evaluate(() => {
                        window.__test.numOfItems = 5;
                        window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                        document.querySelector('#initialise').click();
                    });
            });

            it('There are five items', async function () {
                let elementCount = await chromeless.waitForElementCount(list + ' li', 5, 'Should see five list items');
                expect(elementCount).to.be.true;
            });

            it('First four items get selected', async function () {
                let firstListItemSelector = listItemAtIndex(1);

                await chromeless.wait(firstListItemSelector);
                await chromeless.click(firstListItemSelector);

                let fourthListItemSelector = listItemAtIndex(4);

                await chromeless.wait(fourthListItemSelector);
            });


        });
    });
    after(async () => {
        await chromeless.end();
    });
});

function listItemAtIndex(index) {
    return list + ' li:nth-child(' + index + ')';
}