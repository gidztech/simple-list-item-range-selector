var list = '[data-automation="list"]';
var firstListItemSelector = '[data-automation="list"] li:first-child';

(function() {
    flow('Simple list item range selector', function() {
        step("Load page", function() {
            casper.thenOpen("http://localhost:3000/");
        });
        step("Click on first list item", function() {
            casper.waitForSelector(list,
                function() {
                    casper.test.pass('Should see list');
                },
                function ()  {
                    casper.test.fail('Should see list');
                }).then(function() {
                casper.click(firstListItemSelector)
            });
        });
    });
})();