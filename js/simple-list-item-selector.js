(function () {
    let _ClickModes = {
        CTRL_CLICK_TO_SELECT: 0,
        CLICK_TO_SELECT: 1
    };

    let _clickMode;
    let _allItemElems = [];
    let _lastClickedIndexWithoutShift;
    let _newSelection = [];
    let _itemsSelector;
    let _selectedClassName;
    let _onSelectionChanged = () => {};
    let _debug = false;

    function init({clickMode, containerSelector, childSelector, resetSelector, selectedClassName, onSelectionChanged, debug}) {
        if (isValidClickMode(clickMode)) {
            _clickMode = clickMode;
        } else {
            throw Error('You need to specify a valid clickMode');
        }

        if (selectedClassName) {
            _selectedClassName = selectedClassName;
        }

        if (onSelectionChanged && typeof onSelectionChanged === 'function') {
            _onSelectionChanged = onSelectionChanged;
        } else {
            throw Error('You need to specify an _onSelectionChanged function callback');
        }

        let listElem = document.querySelector(containerSelector);

        if (!listElem) {
            throw Error('You need to specify a valid conainerSelector');
        }

        _itemsSelector = containerSelector + " " + childSelector;
        _allItemElems = document.querySelectorAll(_itemsSelector);

        if (!_allItemElems) {
            throw Error('Items were not found using ' + _itemsSelector + ' selector.');
        }

        listElem.addEventListener('selectstart', (e) => {
            // disable selecting text
            e.preventDefault();
            return false;
        });

        if (resetSelector) {
            let resetElem = document.querySelector(resetSelector);
            resetElem.addEventListener('click', clearAllSelections);
        }

        let i = 0;
        [..._allItemElems].forEach(elem => {
            elem.setAttribute('data-slis-index', i++);
            elem.addEventListener('click', function (e) {
                updateSelection.call(this, e, updateDOM);
            });
        });

        _debug = debug;
    }

    function updateDOM(selection) {
        let selectedItems = [];
        let sortedSelection = selection.concat().sort();

        for (let item of _allItemElems) {
            let index = indexOfItem(item);
            if (sortedSelection.includes(index)) {
                selectedItems.push(item);
                if (!isItemSelected(item)) {
                    item.setAttribute('data-slis-selected', '1')
                    if (_selectedClassName) {
                        item.classList.add(_selectedClassName);
                    }
                }
            } else {
                if (isItemSelected(item)) {
                    //item.classList.remove(_selectedClassName);
                    item.removeAttribute('data-slis-selected')
                    if (_selectedClassName) {
                        item.classList.remove(_selectedClassName);
                    }
                }
            }
        }

        _onSelectionChanged(selectedItems);
    }

    function updateSelection(e, updateDOM) {
        let item = this;
        let selectedItemIndex = indexOfItem(item);

        if (!e.shiftKey) {
            _lastClickedIndexWithoutShift = selectedItemIndex;

            if (isItemSelected(item)) {
                if (_clickMode === _ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // if user clicks without CTRL key, clear everything and select the one they clicked on
                    _newSelection = [];
                    _newSelection.push(selectedItemIndex);
                } else {
                    // CTRL clicking or clicking in CLICK_TO_SELECT mode will unselect the item
                    _newSelection.splice(_newSelection.indexOf(selectedItemIndex), 1);
                }
            } else {
                if (_clickMode === _ClickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                    // clear all selected items first if not using CTRL key
                    _newSelection = [];
                }

                _newSelection.push(selectedItemIndex);
            }
        } else {
            let firstSelectedItem = document.querySelector(_itemsSelector + '[data-slis-selected="1"]');
            let firstSelectedItemIndex = indexOfItem(firstSelectedItem);

            if (_debug) {
                console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", _lastClickedIndexWithoutShift);
            }

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
            let item = _allItemElems[i];
            if (item && !isItemSelected(item)) {
                let index = indexOfItem(item);
                _newSelection.push(index);
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
            let item = _allItemElems[index];
            if (item && isItemSelected(item)) {
                _newSelection.splice(_newSelection.indexOf(index), 1);
            }
        }
    }

    function isItemSelected(item) {
        return item.hasAttribute('data-slis-selected', '1');
    }

    function clearAllSelections() {
        _newSelection = [];
        updateDOM(_newSelection);
    }

    function indexOfItem(item) {
        try {
            return parseInt(item.getAttribute('data-slis-index'));
        }
        catch(e) {
            throw Error('Index doesn\'t exist. Something went dreadfully wrong.');
        }
    }

    function isValidClickMode(value) {
        let isValid = false;

        if (typeof value === 'undefined' || value === '') {
            return false;
        }

        for (let mode in _ClickModes) {
            if (value === _ClickModes[mode]) {
                isValid = true;
            }
        }

        return isValid;
    }

    let SimpleListItemSelector = {
        init,
        ClickModes: _ClickModes
    };

    module.exports = SimpleListItemSelector;

})();

