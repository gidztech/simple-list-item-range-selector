let browser, page, pupUtils;

const puppeteer = require('puppeteer');
const PupUtils = require('../puputils');
const {expect} = require('chai');

const list = '[data-automation="list"]';
const addMoreItemsBtn = '#addMoreItems';

async function initPage() {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    pupUtils = new PupUtils(page);
    await page.goto('http://localhost:3000/');
}

describe('Simple list item range selector', async function() {
    describe('No list items flow', async function() {
        before(async() => {
            await initPage();
            await page.evaluate(() => {
                window.__test.numOfItems = 0;
                window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                document.querySelector('#initialise').click();
            });
        });

        it('There are no list items', async function() {
            const elementCount = await pupUtils.waitForElementCount(list + ' li', 0);
            expect(elementCount).to.be.true;
        });

        it('There should be five items after clicking add more button', async function () {
            await page.click(addMoreItemsBtn);
            const elementCount = await pupUtils.waitForElementCount(list + ' li', 5);
            expect(elementCount).to.be.true;
        });
    });
    describe('Five items flow', async function() {
        describe('Select four list items flow', async function() {
            before(async() => {
                await initPage();
                await page.evaluate(() => {
                    window.__test.numOfItems = 5;
                    window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                    document.querySelector('#initialise').click();
                });
            });

            it('There are five items', async function() {
                const elementCount = await pupUtils.waitForElementCount(list + ' li', 5);
                expect(elementCount).to.be.true;
            });

            it('First four items get selected', async function() {
                const firstListItemSelector = listItemAtIndex(1);
                const fourthListItemSelector = listItemAtIndex(4);

                // select items 1-4
                await page.waitForSelector(firstListItemSelector);
                await page.click(firstListItemSelector);
                await page.keyboard.down('Shift');
                await page.click(fourthListItemSelector);
                await page.keyboard.up('Shift');

                let res;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(3), 'data-slirs-selected', '1');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1');
                expect(res).to.be.true;
            });

        });
        describe('Select fifth item flow', async function() {
            describe('Click to select mode', async function() {
                it('Fifth item gets selected too', async function() {
                    await page.evaluate(() => {
                        const instance = window.__test.SimpleListItemRangeSelector.getInstance('demo');
                        instance.setClickMode(window.__test.SimpleListItemRangeSelector.clickModes.CLICK_TO_SELECT);
                    });

                    const fifthListItemSelector = listItemAtIndex(5);
                    await page.waitForSelector(fifthListItemSelector);
                    await page.click(fifthListItemSelector);

                    let res;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(3), 'data-slirs-selected', '1');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(4), 'data-slirs-selected', '1');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1');
                    expect(res).to.be.true;
                })
            });

            describe('Ctrl + click to select mode', async function() {
                before(async() => {
                    // TODO: I don't like this, should reset whole test
                    const fifthListItemSelector = listItemAtIndex(5);
                    await page.waitForSelector(fifthListItemSelector);
                    await page.click(fifthListItemSelector);
                    await page.evaluate(() => {
                        const instance = window.__test.SimpleListItemRangeSelector.getInstance('demo');
                        instance.setClickMode(window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT);
                    });
                });

                it('Only fifth item gets selected', async function() {
                    const fifthListItemSelector = listItemAtIndex(5);
                    await page.waitForSelector(fifthListItemSelector);
                    await page.click(fifthListItemSelector);

                    let res;

                    res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(2), 'data-slirs-selected');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected');
                    expect(res).to.be.true;

                    res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(5), 'data-slirs-selected', '1');
                    expect(res).to.be.true;
                })
            })
        });
        describe('Select first two items flow', async function() {
            it('First two list items selected', async function() {
                const firstListItemSelector = listItemAtIndex(1);
                const secondListItemSelector = listItemAtIndex(2);
                await page.click(firstListItemSelector);

                await page.keyboard.down('Shift');
                await page.click(secondListItemSelector);
                await page.keyboard.up('Shift');

                let res;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(1), 'data-slirs-selected', '1');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToHaveAttr(listItemAtIndex(2), 'data-slirs-selected', '1');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(3), 'data-slirs-selected');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(4), 'data-slirs-selected');
                expect(res).to.be.true;

                res = await pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(5), 'data-slirs-selected');
                expect(res).to.be.true;

            })
        });
        describe('Don\'t want to use this anymore flow', async function() {
            await page.evaluate(() => {
                window.__test.SimpleListItemRangeSelector.removeInstance('demo');
            });

            it('Data attributes should not exist', async function() {
                pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-selected');
                pupUtils.waitForElementToNotHaveAttr(listItemAtIndex(1), 'data-slirs-index');

            })
        })
    });
    after(async() => {
        browser.close();
    });
});

function listItemAtIndex(index) {
    return list + ' li:nth-child(' + index + ')';
}