import SimpleListItemRangeSelector from '../src/js/simple-list-item-range-selector';
import html from './ui.html';
import './styles.css';

document.body.innerHTML = html;

document.body.onload = () => {
    let app = document.querySelector('.app');
    let selectedItemsContainer = document.querySelector('.selected-items');
    let initialise = document.querySelector('#initialise');
    let itemIndexCount = 5;
    let numOfItems = 5;
    let clickMode = SimpleListItemRangeSelector.clickModes.CTRL_CLICK_TO_SELECT;

    function init() {
        if (window.__test) {
            // value types
            if (window.__test.numOfItems) {
                numOfItems = window.__test.numOfItems;
                itemIndexCount = numOfItems;
            }
            if (window.__test.clickMode) {
                clickMode = window.__test.clickMode;
            }
        }
        let containerNode = document.querySelector('.list');
        let resetNode = document.querySelector('.reset');
        let addMoreItemsBtn = document.querySelector('#addMoreItems');
        let instance = SimpleListItemRangeSelector.createInstance('demo');

        addMoreItemsBtn.addEventListener('click', () => {
            addItems(5);
        });

        resetNode.addEventListener('click', () => {
            while (containerNode.hasChildNodes()) {
                containerNode.removeChild(containerNode.firstChild);
            }

            initLibrary();
        });

        function initLibrary() {
            itemIndexCount = 0;
            addItems();

            instance.init({
                clickMode: clickMode,
                containerNode,
                childSelector: 'li',
                resetSelector: '.reset',
                selectedClassName: 'selected',
                onSelectionChanged: selection => {
                    prettyPrintSelection(selection);
                    console.log("Updated selection", selection);
                }
            });
        }

        function addItems(count) {
            count = count || numOfItems;
            for (let i = 0; i < count; i++) {
                let li = document.createElement('li');
                li.innerText = 'Test ' + ++itemIndexCount;
                containerNode.appendChild(li);
            }

            instance.updateForNewItems(containerNode);
        }

        initLibrary();
    }

    initialise.addEventListener('click', () => {
        initialise.setAttribute('style', 'display: none');
        app.setAttribute('style', 'display: block');
        init();
    });

    // horrible stuff that would have been better with templating but it's just for testing purposes
    function prettyPrintSelection(selection) {
        let oldTable = document.querySelector('table');

        if (oldTable) {
            selectedItemsContainer.removeChild(oldTable);
        }

        if (selection.length) {
            let table = document.createElement('table');
            table.setAttribute('border', '0');
            let heading = document.createElement('tr');
            let idHeader = document.createElement('th');
            idHeader.textContent = 'Id';
            let nameHeading = document.createElement('th');
            nameHeading.textContent = 'Name';
            heading.appendChild(idHeader);
            heading.appendChild(nameHeading);
            table.appendChild(heading);

            selection.map(item => {
                let row = document.createElement('tr');
                let id = document.createElement('td');
                id.textContent = parseInt(item.getAttribute('data-slirs-selected'));
                let name = document.createElement('td');
                name.textContent = item.textContent;
                row.appendChild(id);
                row.appendChild(name);
                table.appendChild(row);
            });

            selectedItemsContainer.appendChild(table);
        }
    }

    // expose this on the window object for usage in the test suite
    window.__test = {
        SimpleListItemRangeSelector,
        clickMode,
        numOfItems
    }
};