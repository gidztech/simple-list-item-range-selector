import 'babel-polyfill';

let _instances = [];

const _clickModes = {
    CTRL_CLICK_TO_SELECT: 1,
    CLICK_TO_SELECT: 2
};

let SimpleListItemRangeSelector = {
    createInstance(id) {
        let _clickMode;
        let _allItemElements = [];
        let _lastClickedIndexWithoutShift;
        let _rangeSelectionEnabled = true;
        let _newSelection = [];
        let _containerNode;
        let _itemsSelector;
        let _selectedClassName;
        let _resetSelector;
        let _onSelectionChanged = () => {
        };
        let _debug = false;

        function _init({
            clickMode,
            containerNode,
            childSelector,
            resetSelector,
            selectedClassName,
            onSelectionChanged,
            rangeSelectionEnabled = true,
            debug
        }) {

            if (containerNode) {
                _containerNode = containerNode;

                if (childSelector) {
                    _itemsSelector = childSelector;
                } else {
                    _itemsSelector = 'li';
                    console.warn('No childSelector was specified. Defaulted to "li"');
                }

                _allItemElements = containerNode.querySelectorAll(_itemsSelector);

                if (_allItemElements) {
                    _setClickMode(clickMode, SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT);

                    if (onSelectionChanged && typeof onSelectionChanged === 'function') {
                        _onSelectionChanged = onSelectionChanged;
                    }

                    _selectedClassName = selectedClassName;
                    _resetSelector = resetSelector;
                    _debug = debug;

                    _registerEvents({resetEvent: resetSelector, rangeEvent: rangeSelectionEnabled});

                } else {
                    throw Error('Items were not found using ' + _itemsSelector + ' selector.');
                }
            } else {
                throw Error('You need to specify a valid containerNode');
            }
        }

        function _ctrlKeyUsed(e) {
            let isMacUser = navigator.platform.indexOf('Mac') !== -1;

            if (isMacUser && e.metaKey) return true;
            else if(!isMacUser && e.ctrlKey) return true;

            return false;
        }

        function _setClickMode(clickMode, defaultMode) {
            if (_isValidClickMode(clickMode)) {
                _clickMode = clickMode;
            } else {
                _clickMode = defaultMode;
                console.warn('Invalid clickMode was specified. Defaulted to "' + defaultMode.toString() + '"');
            }
        }

        function _registerEvents({ resetEvent = false, rangeEvent = true } = {}) {
            if (resetEvent && _resetSelector) {
                let resetElem = document.querySelector(_resetSelector);
                resetElem.addEventListener('click', _clearAllSelectionsHandler);
            }

            if (rangeEvent) {
                _rangeSelectionEnabled = true;
                _containerNode.addEventListener('selectstart', _preventDefaultHandler);
            }

            [..._allItemElements].forEach((elem, index) => {
                elem.setAttribute('data-slirs-index', index.toString());
                elem.addEventListener('click', _clickElementHandler);
            });
        }

        function _unregisterEvents({ resetEvent = false, rangeEvent = true, clickEvent = true } = {}) {
            if (resetEvent && _resetSelector) {
                let resetElem = document.querySelector(_resetSelector);
                resetElem.removeEventListener('click', _clearAllSelectionsHandler);
            }

            if (rangeEvent) {
                _rangeSelectionEnabled = false;
                _containerNode.removeEventListener('selectstart', _preventDefaultHandler);
            }

            if (clickEvent) {
                [..._allItemElements].forEach(elem => {
                    elem.removeEventListener('click', _clickElementHandler);
                });
            }
        }

        function _updateDOM(selection, notify) {
            let selectedItems = [];
            let sortedSelection = selection.concat().sort();

            for (let item of _allItemElements) {
                let index = _indexOfItem(item);
                if (sortedSelection.includes(index)) {
                    selectedItems.push(item);
                    if (!_isItemSelected(item)) {
                        item.setAttribute('data-slirs-selected', '1');
                        if (_selectedClassName) {
                            item.classList.add(_selectedClassName);
                        }
                    }
                } else {
                    if (_isItemSelected(item)) {
                        item.removeAttribute('data-slirs-selected');
                        if (_selectedClassName) {
                            item.classList.remove(_selectedClassName);
                        }
                    }
                }
            }

            if (notify) {
                _onSelectionChanged(selectedItems);
            }
        }

        function _updateSelection(e, updateDOM) {
            let item = this;
            let selectedItemIndex = _indexOfItem(item);

            if (!e.shiftKey || !_rangeSelectionEnabled) {
                _lastClickedIndexWithoutShift = selectedItemIndex;

                if (_isItemSelected(item)) {
                    if (_clickMode === _clickModes.CTRL_CLICK_TO_SELECT && !_ctrlKeyUsed(e)) {
                        // if user clicks without CTRL key, clear everything and select the one they clicked on
                        _newSelection = [];
                        _newSelection.push(selectedItemIndex);
                    } else {
                        // CTRL clicking or clicking in CLICK_TO_SELECT mode will unselect the item
                        _newSelection.splice(_newSelection.indexOf(selectedItemIndex), 1);
                    }
                } else {
                    if (_clickMode === _clickModes.CTRL_CLICK_TO_SELECT && !_ctrlKeyUsed(e)) {
                        // clear all selected items first if not using CTRL key
                        _newSelection = [];
                    }

                    _newSelection.push(selectedItemIndex);
                }
            } else {
                let firstSelectedItem = document.querySelector(_itemsSelector + '[data-slirs-selected="1"]');

                if (!firstSelectedItem) {
                    // first item selected had shift modified applied so just select it normally
                    _newSelection.push(selectedItemIndex);
                    _lastClickedIndexWithoutShift = selectedItemIndex;
                    updateDOM(_newSelection, true);
                    return;
                }

                let firstSelectedItemIndex = _indexOfItem(firstSelectedItem);

                if (_debug) {
                    console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", _lastClickedIndexWithoutShift);
                }

                if (firstSelectedItemIndex === selectedItemIndex) {
                    // multiple items are selected currently and user wants to reduce range to just the selected item
                    _unselectItemsWithinRange({
                        start: selectedItemIndex + 1,
                        end: _allItemElements.length,
                        mode: 'forward'
                    });
                } else if (firstSelectedItemIndex < selectedItemIndex) {
                    if (selectedItemIndex > _lastClickedIndexWithoutShift) {
                        // user wants to add the next items up until selected item to complete a forward range
                        _selectItemsWithinRange({start: _lastClickedIndexWithoutShift + 1, end: selectedItemIndex});
                        // the user may be reducing the range as a result, so clear selection after the current selected item
                        _unselectItemsWithinRange({
                            start: selectedItemIndex + 1,
                            end: _allItemElements.length,
                            mode: 'forward'
                        });
                        // if a previous selection is before the last clicked index without a shift, we need to clear it
                        _unselectItemsWithinRange({start: _lastClickedIndexWithoutShift - 1, end: 0, mode: 'reverse'});
                    } else {

                        // user is selecting from the selected item to the last clicked item without shift
                        _selectItemsWithinRange({start: selectedItemIndex, end: _lastClickedIndexWithoutShift - 1});
                        // the user is reducing the selection above the last clicked index without shift, so we need to clear selection before the current selected item
                        _unselectItemsWithinRange({start: selectedItemIndex - 1, end: 0, mode: 'reverse'});
                        // clear items after the last clicked index without shift
                        _unselectItemsWithinRange({
                            start: _lastClickedIndexWithoutShift + 1,
                            end: _allItemElements.length,
                            mode: 'forward'
                        });
                    }
                } else {
                    // user is selecting range upwards, so select between the last clicked index without shift and the selected item
                    _selectItemsWithinRange({start: selectedItemIndex, end: _lastClickedIndexWithoutShift});
                    // clear items after the last clicked index without shift
                    _unselectItemsWithinRange({
                        start: _lastClickedIndexWithoutShift + 1,
                        end: _allItemElements.length,
                        mode: 'forward'
                    });
                }
            }

            updateDOM(_newSelection, true);
        }

        function _selectItemsWithinRange({start, end}) {
            if (start < 0 || end < start) return;

            for (let i = start; i <= end; i++) {
                let item = _allItemElements[i];
                if (item && !_isItemSelected(item)) {
                    let index = _indexOfItem(item);
                    _newSelection.push(index);
                }
            }
        }

        function _unselectItemAtIndex(index) {
            let item = _allItemElements[index];
            if (item && _isItemSelected(item)) {
                _newSelection.splice(_newSelection.indexOf(index), 1);
            }
        }

        function _unselectItemsWithinRange({start, end, mode}) {
            if (start < 0) return;

            if (mode === 'reverse' && end <= start) {
                for (let i = start; i >= end; i--) {
                    _unselectItemAtIndex(i);
                }
            } else if (mode === 'forward' && end > start) {
                for (let i = start; i <= end; i++) {
                    _unselectItemAtIndex(i);
                }
            }
        }

        function _isItemSelected(item) {
            return item.hasAttribute('data-slirs-selected', '1');
        }

        function _clearAllSelectionsHandler() {
            _newSelection = [];
            _updateDOM(_newSelection, false);
        }

        function _preventDefaultHandler(e) {
            e.preventDefault();
            return false;
        }

        function _clickElementHandler(e) {
            _updateSelection.call(this, e, _updateDOM);
        }

        function _indexOfItem(item) {
            try {
                return parseInt(item.getAttribute('data-slirs-index'));
            }
            catch (e) {
                throw Error('Index doesn\'t exist. Something went dreadfully wrong.');
            }
        }

        function _isValidClickMode(value) {
            let isValid = false;

            if (typeof value === 'undefined' || value === '') {
                return false;
            }

            for (let mode in _clickModes) {
                if (value === _clickModes[mode]) {
                    isValid = true;
                }
            }

            return isValid;
        }

        function _selectItem(item) {
            if (item && !_isItemSelected(item)) {
                let index = _indexOfItem(item);
                _newSelection.push(index);
            }

            _updateDOM(_newSelection, false);
        }

        function _unselectItem(item) {
            if (item) {
                let index = _indexOfItem(item);
                _unselectItemAtIndex(index);
            }

            _updateDOM(_newSelection, false);
        }

        function _disableRangeSelection() {
            _unregisterEvents({rangeEvent: true, clickEvent: false});
        }

        function _resetDOM() {
            for (let item of _allItemElements) {
                item.removeAttribute('data-slirs-index');
                item.removeAttribute('data-slirs-selected');

                if (_selectedClassName) {
                    item.classList.remove(_selectedClassName);
                }

            }
        }

        function _reset() {
            _newSelection = [];
            _unregisterEvents({ resetEvent: true, rangeEvent:  true, clickEvent: true });
            _resetDOM();
        }

        function _updateForNewItems(containerNode) {
            if (_debug) {
                console.log("Going to do update for new items");
            }

            _containerNode = containerNode;

            if (_containerNode) {
                _allItemElements = _containerNode.querySelectorAll(_itemsSelector);

                [..._allItemElements].forEach((elem, index) => {
                    elem.setAttribute('data-slirs-index', index.toString());
                    elem.addEventListener('click', _clickElementHandler);
                });
            }
        }

        let instance = {
            id,
            init: _init,
            setClickMode: _setClickMode,
            selectItem: _selectItem,
            unselectItem: _unselectItem,
            disableRangeSelection: _disableRangeSelection,
            unregisterEvents: _unregisterEvents,
            updateForNewItems: _updateForNewItems,
            clearAllSelections: _clearAllSelectionsHandler,
            reset: _reset,
        };

        _instances.push(instance);

        return instance;
    },
    getInstance(id) {
        return _instances.find((instance) => instance.id === id);
    },
    removeInstance(id) {
        let instance = this.getInstance(id);

        if (instance) {
            instance.reset();
            let indexToRemove = _instances.indexOf(instance);
            _instances.splice(indexToRemove, 1);
        } else {
            throw Error('Instance cannot be found at Id' + id);
        }

    },
    clickModes: _clickModes
};

module.exports = SimpleListItemRangeSelector;

