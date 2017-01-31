(function () {

    const ClickModes = {
        CTRL_CLICK_TO_SELECT: 0,
        CLICK_TO_SELECT: 1
    };

    let clickMode = ClickModes.CLICK_TO_SELECT;
    let totalItemCount = $('.list li').length;
    let lastClickedIndexWithoutShift = null;
    let anItemIsSelected = false;

    // disable selecting/dragging text
    $('.list').bind('selectstart dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    $('.reset').on('click', clearAllSelections);

    $('.list li').on('click', function (e) {
        let $listItem = $(this);

        if (!e.shiftKey) {
            lastClickedIndexWithoutShift = $listItem.index();

            // normal clicking toggles selection in CLICK_TO_SELECT mode
            if (clickMode === ClickModes.CLICK_TO_SELECT && isItemSelected($listItem)) {
                $listItem.removeClass('selected');
            } else {
                // clear all selected items first
                if (clickMode === ClickModes.CTRL_CLICK_TO_SELECT) {
                    clearAllSelections();
                }

                $listItem.addClass('selected');
            }

        } else {
            let firstSelectedItemIndex = $('.list li.selected').first().index();
            let selectedItemIndex = $('.list li').index($listItem);

            console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", lastClickedIndexWithoutShift);

            if (firstSelectedItemIndex === selectedItemIndex) {
                // multiple items are selected currently and user wants to reduce range to just the selected item
                unselectItemsWithinRange({start: selectedItemIndex + 1, end: totalItemCount, mode: 'forward'});
            } else if (firstSelectedItemIndex < selectedItemIndex) {
                if (selectedItemIndex > lastClickedIndexWithoutShift) {
                    // user wants to add the next items up until selected item to complete a forward range
                    selectItemsWithinRange({start: lastClickedIndexWithoutShift + 1, end: selectedItemIndex });
                    // the user may be reducing the range as a result, so clear selection after the current selected item
                    unselectItemsWithinRange({start: selectedItemIndex + 1, end: totalItemCount, mode: 'forward'});
                    // if a previous selection is before the last clicked index without a shift, we need to clear it
                    unselectItemsWithinRange({start: lastClickedIndexWithoutShift - 1, end: 0, mode: 'reverse'});
                } else {
                    // the user is reducing the selection above the last clicked index without shift, so we need to clear selection before the current selected item
                    unselectItemsWithinRange({start: selectedItemIndex - 1, end: 0, mode: 'reverse'});
                }
            } else {
                // user is selecting range upwards, so select between the last clicked index without shift and the selected item
                selectItemsWithinRange({start: selectedItemIndex, end: lastClickedIndexWithoutShift });
                // clear selected items after the last clicked index without shift
                unselectItemsWithinRange({start: lastClickedIndexWithoutShift + 1, end: totalItemCount, mode: 'forward'});

            }
        }
    });

    function isItemSelected(item) {
        return $(item).hasClass('selected');
    }

    function selectItemsWithinRange({start, end}) {
        if (start < 0 || end < start) return;

        for (let i = start; i <= end; i++) {
            let item = $('.list li').get(i);
            if (item && !isItemSelected(item)) {
                $(item).addClass('selected');
            }
        }
    }

    function unselectItemsWithinRange({start, end, mode}) {
        if (start < 0) return;

        if (mode === 'reverse' && end < start) {
            for (let i = start; i >= end; i--) {
                let item = $('.list li').get(i);
                if (item && isItemSelected(item)) {
                    $(item).removeClass('selected');
                }
            }
        } else if (mode === 'forward' && end > start) {
            for (let i = start; i <= end; i++) {
                let item = $('.list li').get(i);
                if (item && isItemSelected(item)) {
                    $(item).removeClass('selected');
                }
            }
        }
    }

    function clearAllSelections() {
        unselectItemsWithinRange({start: 0, end: totalItemCount, mode: 'forward'});
    }

})();
