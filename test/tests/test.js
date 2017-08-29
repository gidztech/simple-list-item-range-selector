const puppeteer = require('puppeteer');
const PupUtils = require('../puputils');
const {expect} = require('chai');

const list = '[data-automation="list"]';
const addMoreItemsBtn = '#addMoreItems';
const resetBtn = '[data-automation="reset"]';
let browser, page, pupUtils;

describe('Simple list item range selector', async function () {
    describe('No list items flow', async function () {
        before(async() => {
            browser = await puppeteer.launch({headless: false});
            page = await browser.newPage();
            pupUtils = new PupUtils(page);
            await page.goto('http://localhost:3000/');
            await page.evaluate(() => {
                window.__test.numOfItems = 0;
                window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                document.querySelector('#initialise').click();
            });

        });

        it('There are no list items', async function () {
            let elementCount = await pupUtils.waitForElementCount(list + ' li', 0);
            expect(elementCount).to.be.true;
        });

        it('There should be five items after clicking add more button', async function () {
            await page.click(addMoreItemsBtn);
            let elementCount = await pupUtils.waitForElementCount(list + ' li', 5);
            expect(elementCount).to.be.true;
        });
    });
    describe('Five items flow', async function () {
        describe('Select four list items flow', async function () {
            before(async() => {
                browser = await puppeteer.launch({headless: false});
                page = await browser.newPage();
                pupUtils = new PupUtils(page);
                await page.goto('http://localhost:3000/');
                await page.evaluate(() => {
                    window.__test.numOfItems = 5;
                    window.__test.clickMode = window.__test.SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT; // default
                    document.querySelector('#initialise').click();
                });
            });

            it('There are five items', async function () {
                let elementCount = await pupUtils.waitForElementCount(list + ' li', 5);
                expect(elementCount).to.be.true;
            });

            it('First four items get selected', async function () {
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
    });
    after(async () => {
       // browser.close();
    });
});

function listItemAtIndex(index) {
    return list + ' li:nth-child(' + index + ')';
}