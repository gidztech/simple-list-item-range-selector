# Simple List Item Range Selector
This is a small library that allows you to take a list of items and apply selection events to it. 

## Features
- Supports the following click selection modes
   * `CTRL_CLICK_TO_SELECT` - This mode requires the user to hold the `CTRL` modifer key, while left-clicking on items to make selections. If you click the same item again while the modifier key is held, the item will be unselected. Clicking on another item without the modifer key will select the new item and unselect all others.
   * `CLICK_TO_SELECT` - This mode simply allows the user to click on an item to select and unselect it
- Supports range selection
  - The user can make a range selection using the `SHIFT` modifier key.
  - Usage:
    - Left-click on the first item to be in the selection
    - Hold the `SHIFT` modifier key and left-click on the last item to be in the selection
    - All list items within the range will be selected
- Supports CSS class addition change for selected nodes
 - There is a built in option for you to supply a CSS class name to be applied when items are selected
- Supports custom logic from your app to apply `onSelectionChanged`
