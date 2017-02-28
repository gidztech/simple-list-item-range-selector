(function () {
    let _ClickModes = {
        CTRL_CLICK_TO_SELECT: 0,
        CLICK_TO_SELECT: 1
    };

    let _clickMode;
    let _allItemElems = [];
    let _$allItemsElems = [];
    let _lastClickedIndexWithoutShift = null;
    let _newSelection = [];
    let _selectedClass;
    let _itemsSelector;

    function init({clickMode, containerSelector, childSelector, resetSelector, selectedClass}) {
        _clickMode = clickMode;
        _selectedClass = selectedClass;
        _itemsSelector = containerSelector + " " + childSelector;

        _allItemElems = document.querySelectorAll(_itemsSelector);
        _$allItemsElems = $(_itemsSelector); // TODO: Remove jQuery dependency?

        let listElem = document.querySelector(containerSelector);
        let resetElem = document.querySelector(resetSelector);

        listElem.addEventListener('selectstart', (e) => {
            // disable selecting text
            e.preventDefault();
            return false;
        });

        resetElem.addEventListener('click', clearAllSelections);

        [..._allItemElems].forEach(elem => elem.addEventListener('click', function (e) {
            updateSelection.call(this, e, updateDOM);
        }));
    }

    function updateDOM(selection) {
        let sortedSelection = selection.concat().sort();

        for (let i = 0; i < _allItemElems.length; i++) {
            let item = _$allItemsElems.get(i);

            // TODO: This will cause reflow because we are reading and writing to the dom. Need to look into performance improvements here
            if (item) {
                if (sortedSelection.includes($(item).index())) {
                    if (!isItemSelected(item)) {
                        $(item).addClass(_selectedClass);
                    }
                } else {
                    if (isItemSelected(item)) {
                        $(item).removeClass(_selectedClass);
                    }
                }
            }
        }
    }

    function updateSelection(e, updateDOM) {
        let $listItem = $(this);

        if (!e.shiftKey) {
            _lastClickedIndexWithoutShift = $listItem.index();

            if (isItemSelected($listItem)) {
                if (_clickMode === _ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // if user clicks without CTRL key, clear everything and select the one they clicked on
                    _newSelection = [];
                    _newSelection.push($listItem.index());
                } else {
                    // CTRL clicking or clicking in CLICK_TO_SELECT mode will unselect the item
                    _newSelection.splice(_newSelection.indexOf($listItem.index()), 1);
                }
            } else {
                if (_clickMode === _ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // clear all selected items first if not using CTRL key
                    _newSelection = [];
                }

                _newSelection.push($listItem.index());
            }
        } else {
            let firstSelectedItemIndex = $(_itemsSelector + "." + _selectedClass).first().index();
            let selectedItemIndex = _$allItemsElems.index($listItem);

            console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", _lastClickedIndexWithoutShift);

            if (firstSelectedItemIndex === selectedItemIndex) {
                // multiple items are selected currently and user wants to reduce range to just the selected item
                unselectItemsWithinRange({start: selectedItemIndex + 1, end: _allItemElems.length, mode: 'forward'});
            } else if (firstSelectedItemIndex < selectedItemIndex) {
                if (selectedItemIndex > _lastClickedIndexWithoutShift) {
                    // user wants to add the next items up until selected item to complete a forward range
                    selectItemsWithinRange({start: _lastClickedIndexWithoutShift + 1, end: selectedItemIndex});
                    // the user may be reducing the range as a result, so clear selection after the current selected item
                    unselectItemsWithinRange({start: selectedItemIndex + 1, end: _allItemElems.length, mode: 'forward'});
                    // if a previous selection is before the last clicked index without a shift, we need to clear it
                    unselectItemsWithinRange({start: _lastClickedIndexWithoutShift - 1, end: 0, mode: 'reverse'});
                } else {

                    // user is selecting from the selected item to the last clicked item without shift
                    selectItemsWithinRange({start: selectedItemIndex, end: _lastClickedIndexWithoutShift - 1});
                    // the user is reducing the selection above the last clicked index without shift, so we need to clear selection before the current selected item
                    unselectItemsWithinRange({start: selectedItemIndex - 1, end: 0, mode: 'reverse'});
                    // clear items after the last clicked index without shift
                    unselectItemsWithinRange({
                        start: _lastClickedIndexWithoutShift + 1,
                        end: _allItemElems.length,
                        mode: 'forward'
                    });
                }
            } else {
                // user is selecting range upwards, so select between the last clicked index without shift and the selected item
                selectItemsWithinRange({start: selectedItemIndex, end: _lastClickedIndexWithoutShift});
                // clear items after the last clicked index without shift
                unselectItemsWithinRange({
                    start: _lastClickedIndexWithoutShift + 1,
                    end: _allItemElems.length,
                    mode: 'forward'
                });
            }
        }

        updateDOM(_newSelection);
    }

    function selectItemsWithinRange({start, end}) {
        if (start < 0 || end < start) return;

        for (let i = start; i <= end; i++) {
            let item = _$allItemsElems.get(i);
            if (item && !isItemSelected(item)) {
                _newSelection.push($(item).index());
            }
        }
    }

    function unselectItemsWithinRange({start, end, mode}) {
        if (start < 0) return;

        if (mode === 'reverse' && end <= start) {
            for (let i = start; i >= end; i--) {
                unselectItemAtIndex(i);
            }
        } else if (mode === 'forward' && end > start) {
            for (let i = start; i <= end; i++) {
                unselectItemAtIndex(i);
            }
        }

        function unselectItemAtIndex(index) {
            let item = _$allItemsElems.get(index);
            if (item && isItemSelected(item)) {
                _newSelection.splice(_newSelection.indexOf(index), 1);
            }
        }
    }

    function isItemSelected(item) {
        return $(item).hasClass(_selectedClass);
    }

    function clearAllSelections() {
        _newSelection = [];
        updateDOM(_newSelection);
    }

    let SimpleListSelectionRange = {
        init,
        ClickModes: _ClickModes
    };

    if (typeof module !== "undefined") {
        module.exports = SimpleListSelectionRange;
    } else {
        window.SimpleListSelectionRange = SimpleListSelectionRange
    }
})();

