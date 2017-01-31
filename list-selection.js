(function () {
    const ClickModes = {
        CTRL_CLICK_TO_SELECT: 0,
        CLICK_TO_SELECT: 1
    };

    const clickMode = ClickModes.CLICK_TO_SELECT;
    let totalItemCount = $('.list li').length;
    let lastClickedIndexWithoutShift = null;
    let newSelection = [];

    function setupBindings() {
        $('.list').bind('selectstart dragstart', (e) => {
            // disable selecting/dragging text
            e.preventDefault();
            return false;
        });

        $('.reset').on('click', clearAllSelections);

        $('.list li').on('click', function (e) {
            updateSelection.call(this, e, updateDOM);
        });
    }

    function updateDOM(selection) {
        let sortedSelection = selection.concat().sort();

        for (let i = 0; i < totalItemCount; i++) {
            let item = $('.list li').get(i);

            // TODO: This will cause reflow because we are reading and writing to them dom
            if (item) {
                if (sortedSelection.includes($(item).index())) {
                    if(!isItemSelected(item)) {
                        $(item).addClass('selected');
                    }
                } else {
                    if (isItemSelected(item)) {
                        $(item).removeClass('selected');
                    }
                }
            }
        }
    }

    function updateSelection(e, updateDOM) {
        let $listItem = $(this);

        if (!e.shiftKey) {
            lastClickedIndexWithoutShift = $listItem.index();

            if (isItemSelected($listItem)) {
                if (clickMode === ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // if user clicks without CTRL key, clear everything and select the one they clicked on
                    newSelection = [];
                    newSelection.push($listItem.index());
                } else {
                    // CTRL clicking or clicking in CLICK_TO_SELECT mode will unselect the item
                    newSelection.splice(newSelection.indexOf($listItem.index()), 1);
                }
            } else {
                if (clickMode === ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // clear all selected items first if not using CTRL key
                    newSelection = [];
                }

                newSelection.push($listItem.index());
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

                    // user is selecting from the selected item to the last clicked item without shift
                    selectItemsWithinRange({start: selectedItemIndex, end: lastClickedIndexWithoutShift -1 });
                    // the user is reducing the selection above the last clicked index without shift, so we need to clear selection before the current selected item
                    unselectItemsWithinRange({start: selectedItemIndex - 1, end: 0, mode: 'reverse'});
                    // clear items after the last clicked index without shift
                    unselectItemsWithinRange({start: lastClickedIndexWithoutShift + 1, end: totalItemCount, mode: 'forward'});
                }
            } else {
                // user is selecting range upwards, so select between the last clicked index without shift and the selected item
                selectItemsWithinRange({start: selectedItemIndex, end: lastClickedIndexWithoutShift });
                // clear items after the last clicked index without shift
                unselectItemsWithinRange({start: lastClickedIndexWithoutShift + 1, end: totalItemCount, mode: 'forward'});
            }
        }

        updateDOM(newSelection);
    }

    function selectItemsWithinRange({start, end}) {
        if (start < 0 || end < start) return;

        for (let i = start; i <= end; i++) {
            let item = $('.list li').get(i);
            if (item && !isItemSelected(item)) {
                newSelection.push($(item).index());
            }
        }
    }

    function unselectItemsWithinRange({start, end, mode}) {
        if (start < 0) return;

        function unselectItemAtIndex(index) {
            let item = $('.list li').get(index);
            if (item && isItemSelected(item)) {
                newSelection.splice(newSelection.indexOf(index), 1);
            }
        }

        if (mode === 'reverse' && end <= start) {
            for (let i = start; i >= end; i--) {
                unselectItemAtIndex(i);
            }
        } else if (mode === 'forward' && end > start) {
            for (let i = start; i <= end; i++) {
                unselectItemAtIndex(i);
            }
        }
    }

    function isItemSelected(item) {
        return $(item).hasClass('selected');
    }

    function clearAllSelections() {
        newSelection = [];
        updateDOM(newSelection);
    }

    setupBindings();

})();
