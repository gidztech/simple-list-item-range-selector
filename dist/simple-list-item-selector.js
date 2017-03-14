(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SimpleListItemSelector"] = factory();
	else
		root["SimpleListItemSelector"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
    var _instances = [];

    var _clickModes = {
        CTRL_CLICK_TO_SELECT: 0,
        CLICK_TO_SELECT: 1
    };

    var SimpleListItemSelector = {
        createInstance: function createInstance(id) {
            var _clickMode = void 0;
            var _allItemElements = [];
            var _lastClickedIndexWithoutShift = void 0;
            var _newSelection = [];
            var _containerNode = void 0;
            var _itemsSelector = void 0;
            var _selectedClassName = void 0;
            var _resetSelector = void 0;
            var _onSelectionChanged = function _onSelectionChanged() {};
            var _debug = false;

            function _init(_ref) {
                var clickMode = _ref.clickMode,
                    containerNode = _ref.containerNode,
                    childSelector = _ref.childSelector,
                    resetSelector = _ref.resetSelector,
                    selectedClassName = _ref.selectedClassName,
                    onSelectionChanged = _ref.onSelectionChanged,
                    debug = _ref.debug;


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
                        _resetDOM();

                        if (_isValidClickMode(clickMode)) {
                            _clickMode = clickMode;
                        } else {
                            _clickMode = SimpleListItemSelector.clickModes.CTRL_CLICK_TO_SELECT;
                            console.warn('Invalid clickMode was specified. Defaulted to "CTRL_CLICK_TO_SELECT"');
                        }

                        if (onSelectionChanged && typeof onSelectionChanged === 'function') {
                            _onSelectionChanged = onSelectionChanged;
                        }

                        _selectedClassName = selectedClassName;
                        _resetSelector = resetSelector;
                        _debug = debug;

                        _registerEvents();
                    } else {
                        throw Error('Items were not found using ' + _itemsSelector + ' selector.');
                    }
                } else {
                    throw Error('You need to specify a valid containerNode');
                }
            }

            function _registerEvents() {
                if (_resetSelector) {
                    var resetElem = document.querySelector(_resetSelector);
                    resetElem.addEventListener('click', _clearAllSelectionsHandler);
                }

                _containerNode.addEventListener('selectstart', function (e) {
                    return _preventDefaultHandler;
                });

                [].concat(_toConsumableArray(_allItemElements)).forEach(function (elem, index) {
                    elem.setAttribute('data-slis-index', index.toString());
                    elem.addEventListener('click', _clickElementHandler);
                });
            }

            function _unregisterEvents() {
                if (_resetSelector) {
                    var resetElem = document.querySelector(_resetSelector);
                    resetElem.removeEventListener('click', _clearAllSelectionsHandler);
                }

                _containerNode.removeEventListener('selectstart', _preventDefaultHandler);

                var i = 0;
                [].concat(_toConsumableArray(_allItemElements)).forEach(function (elem, index) {
                    elem.removeEventListener('click', _clickElementHandler);
                });
            }

            function _updateDOM(selection) {
                var selectedItems = [];
                var sortedSelection = selection.concat().sort();

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _allItemElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        var index = _indexOfItem(item);
                        if (sortedSelection.includes(index)) {
                            selectedItems.push(item);
                            if (!_isItemSelected(item)) {
                                item.setAttribute('data-slis-selected', '1');
                                if (_selectedClassName) {
                                    item.classList.add(_selectedClassName);
                                }
                            }
                        } else {
                            if (_isItemSelected(item)) {
                                item.removeAttribute('data-slis-selected');
                                if (_selectedClassName) {
                                    item.classList.remove(_selectedClassName);
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _onSelectionChanged(selectedItems);
            }

            function _updateSelection(e, updateDOM) {
                var item = this;
                var selectedItemIndex = _indexOfItem(item);

                if (!e.shiftKey) {
                    _lastClickedIndexWithoutShift = selectedItemIndex;

                    if (_isItemSelected(item)) {
                        if (_clickMode === _clickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                            // if user clicks without CTRL key, clear everything and select the one they clicked on
                            _newSelection = [];
                            _newSelection.push(selectedItemIndex);
                        } else {
                            // CTRL clicking or clicking in CLICK_TO_SELECT mode will unselect the item
                            _newSelection.splice(_newSelection.indexOf(selectedItemIndex), 1);
                        }
                    } else {
                        if (_clickMode === _clickModes.CTRL_CLICK_TO_SELECT && !e.ctrlKey) {
                            // clear all selected items first if not using CTRL key
                            _newSelection = [];
                        }

                        _newSelection.push(selectedItemIndex);
                    }
                } else {
                    var firstSelectedItem = document.querySelector(_itemsSelector + '[data-slis-selected="1"]');
                    var firstSelectedItemIndex = _indexOfItem(firstSelectedItem);

                    if (_debug) {
                        console.log("first selected item: ", firstSelectedItemIndex, " current selected item: ", selectedItemIndex, " last selected item without shift: ", _lastClickedIndexWithoutShift);
                    }

                    if (firstSelectedItemIndex === selectedItemIndex) {
                        // multiple items are selected currently and user wants to reduce range to just the selected item
                        _unselectItemsWithinRange({ start: selectedItemIndex + 1, end: _allItemElements.length, mode: 'forward' });
                    } else if (firstSelectedItemIndex < selectedItemIndex) {
                        if (selectedItemIndex > _lastClickedIndexWithoutShift) {
                            // user wants to add the next items up until selected item to complete a forward range
                            _selectItemsWithinRange({ start: _lastClickedIndexWithoutShift + 1, end: selectedItemIndex });
                            // the user may be reducing the range as a result, so clear selection after the current selected item
                            _unselectItemsWithinRange({ start: selectedItemIndex + 1, end: _allItemElements.length, mode: 'forward' });
                            // if a previous selection is before the last clicked index without a shift, we need to clear it
                            _unselectItemsWithinRange({ start: _lastClickedIndexWithoutShift - 1, end: 0, mode: 'reverse' });
                        } else {

                            // user is selecting from the selected item to the last clicked item without shift
                            _selectItemsWithinRange({ start: selectedItemIndex, end: _lastClickedIndexWithoutShift - 1 });
                            // the user is reducing the selection above the last clicked index without shift, so we need to clear selection before the current selected item
                            _unselectItemsWithinRange({ start: selectedItemIndex - 1, end: 0, mode: 'reverse' });
                            // clear items after the last clicked index without shift
                            _unselectItemsWithinRange({
                                start: _lastClickedIndexWithoutShift + 1,
                                end: _allItemElements.length,
                                mode: 'forward'
                            });
                        }
                    } else {
                        // user is selecting range upwards, so select between the last clicked index without shift and the selected item
                        _selectItemsWithinRange({ start: selectedItemIndex, end: _lastClickedIndexWithoutShift });
                        // clear items after the last clicked index without shift
                        _unselectItemsWithinRange({
                            start: _lastClickedIndexWithoutShift + 1,
                            end: _allItemElements.length,
                            mode: 'forward'
                        });
                    }
                }

                updateDOM(_newSelection);
            }

            function _selectItemsWithinRange(_ref2) {
                var start = _ref2.start,
                    end = _ref2.end;

                if (start < 0 || end < start) return;

                for (var i = start; i <= end; i++) {
                    var item = _allItemElements[i];
                    if (item && !_isItemSelected(item)) {
                        var index = _indexOfItem(item);
                        _newSelection.push(index);
                    }
                }
            }

            function _unselectItemAtIndex(index) {
                var item = _allItemElements[index];
                if (item && _isItemSelected(item)) {
                    _newSelection.splice(_newSelection.indexOf(index), 1);
                }
            }

            function _unselectItemsWithinRange(_ref3) {
                var start = _ref3.start,
                    end = _ref3.end,
                    mode = _ref3.mode;

                if (start < 0) return;

                if (mode === 'reverse' && end <= start) {
                    for (var i = start; i >= end; i--) {
                        _unselectItemAtIndex(i);
                    }
                } else if (mode === 'forward' && end > start) {
                    for (var _i = start; _i <= end; _i++) {
                        _unselectItemAtIndex(_i);
                    }
                }
            }

            function _isItemSelected(item) {
                return item.hasAttribute('data-slis-selected', '1');
            }

            function _clearAllSelectionsHandler() {
                _newSelection = [];
                _updateDOM(_newSelection);
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
                    return parseInt(item.getAttribute('data-slis-index'));
                } catch (e) {
                    throw Error('Index doesn\'t exist. Something went dreadfully wrong.');
                }
            }

            function _isValidClickMode(value) {
                var isValid = false;

                if (typeof value === 'undefined' || value === '') {
                    return false;
                }

                for (var mode in _clickModes) {
                    if (value === _clickModes[mode]) {
                        isValid = true;
                    }
                }

                return isValid;
            }

            function _selectItem(item) {
                if (item && !_isItemSelected(item)) {
                    var index = _indexOfItem(item);
                    _newSelection.push(index);
                }
            }

            function _unselectItem(item) {
                if (item) {
                    var index = _indexOfItem(item);
                    _unselectItemAtIndex(index);
                }
            }

            function _resetDOM() {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = _allItemElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        item.removeAttribute('data-slis-index');
                        item.removeAttribute('data-slis-selected');

                        if (_selectedClassName) {
                            item.classList.remove(_selectedClassName);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }

            function _reset() {
                _init({
                    clickMode: _clickMode,
                    containerNode: _containerNode,
                    itemsSelector: _itemsSelector,
                    resetSelector: _resetSelector,
                    selectedClassName: _selectedClassName,
                    onSelectionChanged: _onSelectionChanged,
                    debug: _debug
                });
            }

            var instance = {
                id: id,
                init: _init,
                selectItem: _selectItem,
                unselectItem: _unselectItem,
                reset: _reset,
                unregisterEvents: _unregisterEvents
            };

            _instances.push(instance);

            return instance;
        },
        getInstance: function getInstance(id) {
            return _instances.find(function (instance) {
                return instance.id === id;
            });
        },
        removeInstance: function removeInstance(id) {
            var instance = SimpleListItemSelector.getInstance(id);

            if (instance) {
                instance.unregisterEvents();
                var indexToRemove = _instances.indexOf(instance);
                _instances.splice(indexToRemove, 1);
            } else {
                throw Error('Instance cannot be found at Id' + id);
            }
        },

        clickModes: _clickModes
    };

    module.exports = SimpleListItemSelector;
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=simple-list-item-selector.js.map