(function () {

    let totalItemCount = $('.list li').length;
    let lastClickIndexWithoutShift = null;

    // disable selecting/dragging text
    $('.list').bind('selectstart dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    $('.reset').on('click', (e) => {
        unselectItemsWithinRange(0, totalItemCount);
    });

    $('.list li').on('click', function (e) {
        let $listItem = $(this);

        if (!e.shiftKey) {
            lastClickIndexWithoutShift = $listItem.index();

            // normal clicking toggles selection
            if (isItemSelected($listItem)) {
                $listItem.removeClass('selected');
            } else {
                $listItem.addClass('selected')
            }
        } else {
            let firstSelectedItemIndex = $('.list li.selected').first().index();
            let selectedItemIndex = $('.list li').index($listItem);

            console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", lastClickIndexWithoutShift);

            if (firstSelectedItemIndex === selectedItemIndex) {
                // multiple items are selected currently and user wants to reduce range to just the selected item
                unselectItemsAfterThisItemForwards(selectedItemIndex, totalItemCount);
            } else if (firstSelectedItemIndex < selectedItemIndex) {

                if (selectedItemIndex  > lastClickIndexWithoutShift) {
                    // user wants to add the next item up until selected item to complete a range
                    selectItemsBetweenFirstSelectionAndThisItemForwards(lastClickIndexWithoutShift, selectedItemIndex)
                    // the user may be reducing the range as a result, so clear selection after the current selected item
                    unselectItemsAfterThisItemForwards(selectedItemIndex, totalItemCount);
                    unselectItemsAfterThisItemBackwards(lastClickIndexWithoutShift);
                } else {
                    unselectItemsAfterThisItemBackwards(selectedItemIndex);
                }


            } else {
                // user is selecting range upwards
                selectItemsBetweenLastStandardClickIndexAndThisItemBackwards(lastClickIndexWithoutShift, selectedItemIndex);
                unselectItemsAfterThisItemForwards(lastClickIndexWithoutShift, totalItemCount);

            }
        }
    });

    function isItemSelected(item) {
        return $(item).hasClass('selected');
    }

    function selectItemsWithinRange(start, end) {
        if (start < 0 || end < start) return;

        for (let i = start; i <= end; i++) {
            let item = $('.list li').get(i);
            if (item && !isItemSelected(item)) {
                $(item).addClass('selected');
            }
        }
    }

    function unselectItemsWithinRange(start, end, reverse) {
        if (start < 0) return;

        if (reverse && end < start) {
            for (let i = start; i >= end; i--) {
                let item = $('.list li').get(i);
                if (item && isItemSelected(item)) {
                    $(item).removeClass('selected');
                }
            }
        } else if (!reverse && end > start) {
            for (let i = start; i <= end; i++) {
                let item = $('.list li').get(i);
                if (item && isItemSelected(item)) {
                    $(item).removeClass('selected');
                }
            }
        }
    }

    function unselectItemsAfterThisItemBackwards(lastClickIndexWithoutShift) {
        let start = lastClickIndexWithoutShift -1;
        unselectItemsWithinRange(start, 0, true);
    }

    function unselectItemsAfterThisItemForwards(selectedItemIndex, totalItemCount) {
        let start = selectedItemIndex + 1;
        let end = totalItemCount;

        unselectItemsWithinRange(start, end);
    }

    function selectItemsBetweenFirstSelectionAndThisItemForwards(firstSelectedItemIndex, selectedItemIndex) {
        // we skip the first because it's already selected
        let start = firstSelectedItemIndex + 1;
        let end = selectedItemIndex;

        selectItemsWithinRange(start, end);
    }

    function selectItemsBetweenLastStandardClickIndexAndThisItemBackwards(lastClickIndexWithoutShift, selectedItemIndex) {
        let start = selectedItemIndex;
        let end = lastClickIndexWithoutShift;

        selectItemsWithinRange(start, end);
    }
})();
