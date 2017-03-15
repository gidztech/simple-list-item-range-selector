import SimpleListItemSelector from '../src/js/simple-list-item-selector';
import html from './ui.html';
import './styles.css';

document.body.innerHTML = html;

document.body.onload = function () {
    let containerNode = document.querySelector('.list');

    let instance = SimpleListItemSelector.createInstance('my_id');
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

    let addMoreItems = document.querySelector('#addMoreItems');
    addMoreItems.addEventListener('click', () => {

    });
};