# Simple List Item Range Selector
This is a small library that allows you to take a list of items and apply selection events to it. 

## Features
- Supports the following click selection modes
   * `CTRL` + `Click` to select
   * `Click` to select
- Supports range selection
  - The user can make a range selection using the `SHIFT` modifier key.
  - Usage:
    - Left-click on the first item to be in the selection
    - Hold the `SHIFT` modifier key and left-click on the last item to be in the selection
    - All list items within the range will be selected
- Supports CSS class addition change for selected nodes
 - There is a built in option for you to supply a CSS class name to be applied when items are selected
- Supports custom logic from your app to apply `onSelectionChanged`

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
  * `CTRL_CLICK_TO_SELECT` - This mode requires the user to hold the `CTRL` modifer key, while left-clicking on items to make selections. If you click the same item again while the modifier key is held, the item will be unselected. Clicking on another item without the modifer key will select the new item and unselect all others.
   * `CLICK_TO_SELECT` - This mode simply allows the user to click on an item to select and unselect it

### Instance
- `init (options: {})`
 * Description: Initialises the current instance of the library, binding events to the DOM
 * Options:
   - `clickMode: ClickModes` - Click mode from: `CTRL_CLICK_TO_SELECT`, `CLICK_TO_SELECT` **[Required]**
   - `containerNode: Element`- A DOM node, e.g. `document.querySelector('.list')` **[Required]**
   - `childSelector: String` - A child selector, e.g. `li`. Defaults to `li` **[Optional]**
   - `resetSelector: String` - A reset selector for clearing the selection, e.g. `#reset` **[Optional]**
   - `selectedClassName: String` - A class name to be applied for selected items, e.g. `selected` **[Optional]**
   - `onSelectionChanged: Event` - A custom event handler that will execute when the selection has changed **[Optional]**
   - `debug: int` - A debug flag, 0 or 1 **[Optional]**
 * Throws: Various errors for missing or invalid options
- `selectItem (item: Element)`
  * Description: Select a single item programmatically
- `unselectItem (item: Element)`
  * Description: Unselect a single item programmatically
- `disableRangeSelection`
  * Description: Disables the range selection mode, i.e. usage of the `SHIFT` modifier key
- `reset`
  * Description: Resets the DOM for the items and re-initialises with the same configuration
- `unregisterEvents (options: {})`
  * Description: Unregisters certain or all the event handlers that were previously set up by this library
  * Options:
    - `resetEvent: boolean` - Reset click event for reset selector. Defaults to false
    - `rangeEvent: boolean` - Range selection event. Defaults to true
    - `clickEvent: boolean` - Click event for list items. Defaults to true
- `updateForNewItems`

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
let instanceId = 'ebec9955-2102-4c5a-a554-e7f9da80af59';
let instance = SimpleListItemRangeSelector.createInstance(instanceId);
instance.init({
    clickMode: SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT,
    containerNode: document.querySelector('.list'),
    childSelector: 'li',
    selectedClassName: 'selected',
    onSelectionChanged (selectedNodes) {
        // custom logic here
    }
});
```

