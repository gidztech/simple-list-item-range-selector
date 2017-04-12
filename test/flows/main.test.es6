const list = '[data-automation="list"]';
const firstListItemSelector = '[data-automation="list"] li:first-child';

(function() {
    flow('Simple list item range selector', () => {
        step("Load page", () => {
            casper.thenOpen("http://localhost:3000/");
        });
        step("Click on first list item", () => {
            casper.waitForSelector(list,
                () => {
                    casper.test.pass('Should see list');
                },
                () => {
                    casper.test.fail('Should see list');
                }).then(() => {
                casper.click(firstListItemSelector)
            });
        });
    });
})();