import SimpleListItemSelector from '../src/js/simple-list-item-selector';
import html from './ui.html';
import './styles.css';

document.body.innerHTML = html;

document.body.onload = function () {
    let count = 5;
    let containerNode = document.querySelector('.list');
    let resetNode = document.querySelector('.reset');
    let addMoreItems = document.querySelector('#addMoreItems');
    let instance = SimpleListItemSelector.createInstance('my_id');

    addMoreItems.addEventListener('click', () => {
        addItems();
    });

    resetNode.addEventListener('click', () => {
        while (containerNode.hasChildNodes()) {
            containerNode.removeChild(containerNode.firstChild);
        }
        init();
    });

    function init() {
        count = 0;
        addItems();

        instance.init({
            clickMode: SimpleListItemSelector.clickModes.CLICK_TO_SELECT,
            containerNode,
            childSelector: 'li',
            resetSelector: '.reset',
            selectedClassName: 'selected',
            onSelectionChanged: function (selection) {
                console.log("Updated selection", selection);
            }
        });
    }

    function addItems() {
        for (let i = 0; i < 5; i++) {
            let li = document.createElement('li');
            li.innerText = 'Test ' + ++count;
            containerNode.appendChild(li);
        }

        instance.updateForNewItems(containerNode);
    }

    init();
};