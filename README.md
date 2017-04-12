# Simple List Item Range Selector

[![CircleCI](https://circleci.com/gh/gidztech/simple-list-item-range-selector.svg?style=svg)](https://circleci.com/gh/gidztech/simple-list-item-range-selector)

This is a small UI library that allows you to take a list of items, e.g. `<li>`s, and attach selection events to it. 

## Features
- Supports the following click selection modes:
   * <kbd>CTRL</kbd> + <kbd>Click</kbd> to select
   * <kbd>Click</kbd> to select
- Supports range selection
  - The user can make a range selection using the <kbd>SHIFT</kbd> modifier key.
  - Usage:
    - Left-click on the first item to be in the selection
    - Hold the <kbd>SHIFT</kbd> modifier key and left-click on the last item to be in the selection
    - All list items within the range will be selected
- Supports appending a CSS class for selected nodes
- Supports custom logic from your app to be hooked in when the selection changes

## Demo
Try out the live demo:
https://gidztech.github.io/simple-list-item-range-selector/demo/

## Usage
### API
#### SimpleListItemRangeSelector
- `createInstance (id: string): {}`
  * Description: Takes a unique identifer for the instance, allowing you to isolate multiple instances of the library.
- `getInstance (id: string): {}`
  * Description: Gets an existing instance of the library, given the Id as a parameter.
- `removeInstance (id: string)`
  * Description: Removes an existing instance of the library, given the Id as a parameter.
  * Throws: 'Instance cannot be found at Id {Id}' if no instance is found.
- `clickModes`
  * `CTRL_CLICK_TO_SELECT` - This mode requires the user to hold the <kbd>CTRL</kbd> modifer key, while left-clicking on items to make selections. If you click the same item again while the modifier key is held, the item will be unselected. Clicking on another item without the modifer key will select the new item and unselect all others.
   * `CLICK_TO_SELECT` - This mode simply allows the user to click on an item to select and unselect it

#### Instance
- `init (options: {})`
  * Description: Initialises the current instance of the library, binding events to the DOM
  * Options:
    - `clickMode: ClickModes` - Click mode from: `CTRL_CLICK_TO_SELECT`, `CLICK_TO_SELECT` **[Required]**
    - `containerNode: Element`- A DOM node, e.g. `document.querySelector('.list')` **[Required]**
    - `childSelector: String` - A child selector, e.g. `li`. Defaults to `li` **[Optional]**
    - `resetSelector: String` - A reset selector for clearing the selection, e.g. `#reset` **[Optional]**
    - `selectedClassName: String` - A class name to be applied for selected items, e.g. `selected` **[Optional]**
    - `onSelectionChanged: Event` - A custom event handler executed when the selection has changed **[Optional]**
    - `debug: int` - A debug flag, 0 or 1 **[Optional]**
  *  Throws: Various errors for missing or invalid options
- `selectItem (item: Element)`
  * Description: Select a single item programmatically
- `unselectItem (item: Element)`
  * Description: Unselect a single item programmatically
- `disableRangeSelection`
  * Description: Disables the range selection mode, i.e. usage of the <kbd>SHIFT</kbd> modifier key
- `reset`
  * Description: Resets the DOM for the items and re-initialises with the same configuration
- `unregisterEvents (options: {})`
  * Description: Unregisters certain or all the event handlers that were previously set up by this library
  * Options:
    - `resetEvent: boolean` - Reset click event for reset selector. Defaults to false. **[Optional]**
    - `rangeEvent: boolean` - Range selection event. Defaults to true. **[Optional]**
    - `clickEvent: boolean` - Click event for list items. Defaults to true. **[Optional]**
- `updateForNewItems (containerNode: Element)`
  * Description: Adds tracking indexes and click events to new list items that have been added to the page

### ES2015 Module
```
import SimpleListItemRangeSelector from 'simple-list-item-range-selector';
```

### CommonJS Module
```
let SimpleListItemRangeSelector = require('simple-list-item-range-selector')
```
### Example
```javascript
let instance = SimpleListItemRangeSelector.createInstance('ebec9955-2102-4c5a-a554-e7f9da80af59'); // anything unique
let options = {
    clickMode: SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT,
    containerNode: document.querySelector('.list'),
    childSelector: 'li',
    selectedClassName: 'selected',
    onSelectionChanged (selectedNodes) {
        // custom logic here
    }
};
instance.init(options);
```

### More
If your list of items is paged, you can use `updateForNewItems` to add tracking indexes and click handlers for the new DOM nodes. The following example shows code that subscribes to an observable object, which changes when a new page is recieved from the server. We simply call the update function from the library at that point.

```javascript
onPageReceived.subscribe(() => {
    setTimeout(() => {
        instance.updateForNewItems(element);
    }, 100);
});
```

## Contribute
Check out the [Contributing.md](https://github.com/gidztech/simple-list-item-range-selector/blob/master/CONTRIBUTING.md) file.
