// module-level global vars

// we're using a single, global state object
// in this app
var state = {
  items: []
};

// used to create each item on list
// used in renderList and renderItem (called "itemTemplate" in latter)
// class 'js-shopping-item' used in renderItem to add item value to span
// and to addClass ('shopping-item__checked') if the item has been checkedOff
// via handleItemToggles function
// class 'js-shopping-item-toggle' used as value of toggleIdentifier
// class 'js-shopping-item-delete' used as value of removeItemIdentifier
var listItemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="js-shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);


// state management

// adds item to state object array
// item is a object with displayname holding value of item
// and checkedOff holding boolean for use in renderItem function
// if checkedOff is given "true" value, renderItem will add the 
// 'shipping-item__checked' class to the span displaying the item value
// as represented in the ListItemTemplate
function addItem(state, item) {
  state.items.push({
    displayName: item,
    checkedOff: false
  });
}

// returns item by index from state object array
function getItem(state, itemIndex) {
  return state.items[itemIndex];
}

// deletes item by index from state object array
function deleteItem(state, itemIndex) {
  state.items.splice(itemIndex, 1);
}

// newItemState refers to item object containing displayName
// and checkedOff name/value pairs
// this function is only used in the handleItemToggles function
// this allows for this state to replace the state object array item object
// with a new state that includes current toggle state for the line-through check
function updateItem(state, itemIndex, newItemState) {
  state.items[itemIndex] = newItemState;
}

// DOM manipulation
// listItemTemplate === itemTemplate (i.e., the html var used to render output)
function renderItem(item, itemId, itemTemplate, itemDataAttr) {
  // assign html var used to render output to a JQuery object called "element"
  var element = $(itemTemplate);
  // add item displayName value to span with 'js-shopping-item' class
  // if the checkedOff state of the item is "true", add 'shopping-item__checked' class to same span
  element.find('.js-shopping-item').text(item.displayName);
  if (item.checkedOff) {
    element.find('.js-shopping-item').addClass('shopping-item__checked');
  }
  //element.find('.js-shopping-item-toggle')
  // add attr to item, which is 'data-list-item-id'=itemIndex
  element.attr(itemDataAttr, itemId);
  return element;
}

// renders to entire list of items, using map function
function renderList(state, listElement, itemDataAttr) {
  var itemsHTML = state.items.map(
    function(item, index) {
      return renderItem(item, index, listItemTemplate, itemDataAttr);
  });
  listElement.html(itemsHTML);
}


// Event listeners
// when the form is submitted by clicking "Add Item" or return key,
// this event triggers function below
// parameters are 1) formElement - id of form itself; 2) newItemIdentifier -
// id if item added; 3) itemDataAttr - attr storing index of item in state array;
// 4) listElement - class of ul parent of list elements; and 5) state - global state object
function handleItemAdds(
  formElement, newItemIdentifier, itemDataAttr, listElement, state) {

  formElement.submit(function(event) {
    //prevents default action of sending form to url
    event.preventDefault();
    // newItem represents the value added via input to the form
    var newItem = formElement.find(newItemIdentifier).val();
    // this new item is then added to the state object array
    addItem(state, newItem);
    // the list is updated with the new item attr
    renderList(state, listElement, itemDataAttr);
    // reset form
    this.reset();
  });
}

// when delete button is clicked, the removeIdentifier is activated 
// (i.e., the dynamically added '.js-shopping-item-delete' class)
// triggering the function below
// paramaters are same as handleItemAdds, except 2nd param (removeIdentifier)

function handleItemDeletes(
  formElement, removeIdentifier, itemDataAttr, listElement, state) {

  listElement.on('click', removeIdentifier, function(event) {
    // creates var with value of index of item in state object array
    var itemIndex = parseInt($(this).closest('li').attr(itemDataAttr));
    // call function that deletes item at that index
    deleteItem(state, itemIndex);
    // updates list w/out that item
    renderList(state, listElement, itemDataAttr);
  })
}

// when check button clicked, toggleIdentifier activated 
// (i.e., the dynamically added .js-shopping-item-toggle' class)
// triggering function below
// parameters do not inlcude formElement
// new identifier param = toggleIdentifier
function handleItemToggles(
  listElement, toggleIdentifier, itemDataAttr, state) {

  listElement.on('click', toggleIdentifier, function(event) {
    // creates var with value of index of item in state objec array
    var itemId = $(event.currentTarget.closest('li')).attr(itemDataAttr);
    // creates new var to hold existing state object array item with that index value
    var oldItem = getItem(state, itemId);
    // updates the item with checkedOff changes to "true"
    updateItem(state, itemId, {
      displayName: oldItem.displayName,
      checkedOff: !oldItem.checkedOff
    });
    // updates list w/ this change
    renderList(state, listElement, itemDataAttr);
  });
}

// self-executing function - invokes these var assignments and functions when page loads
// NEED CLARIFICATION ON WHY THIS IS NECESSARY
$(function() {

  // represents the form itself (id), which is then used in handler functions
  // for adding and deleting items
  var formElement = $('#js-shopping-list-form');
  // represents the ul parent of all list items (class)
  // it is used in all handler functions and renderList function
  var listElement = $('.js-shopping-list');

  // from index.html -- it's the id of the input
  // containing shopping list items
  // it is used in the add item handler (handleItemAdds)
  var newItemIdentifier = '#js-new-item';

  // from `listItemTemplate` at top of this file. for each
  // displayed shopping list item, we'll be adding a button
  // that has this class name on it 
  // class added dynamically; not in original html
  // used in handleItemDeletes 
  var removeIdentifier = '.js-shopping-item-delete';

  // we'll use this attribute to store the id of the list item
  // another dynamically added item, but appears to be just text,
  // because there is no period or hash before name
  // apparently, this is how an attribute is written (attr)
  // this is used in all handler and render functions
  // the id is stored as a number starting with 0, which 
  // represents the first element of the state array
  // the attr, id pair is created in renderItem: element.attr(itemDataAttr, itemId);
  var itemDataAttr = 'data-list-item-id';

  // class added dynamically, not in original html
  // used only in handleItemToggles as 
  var toggleIdentifier = '.js-shopping-item-toggle';

  handleItemAdds(
    formElement, newItemIdentifier, itemDataAttr, listElement, state);
  handleItemDeletes(
    formElement, removeIdentifier, itemDataAttr, listElement, state);
  handleItemToggles(listElement, toggleIdentifier, itemDataAttr, state);
});

