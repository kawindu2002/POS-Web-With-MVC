
import { items_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

// Item Management Part

$(document).ready(function () {
    //Initialize Elements to variables
    const $itemForm = $('#itemForm');
    const $itemCodeInput = $('#itemCodeInput');
    const $itemNameInput = $('#itemNameInput');
    const $itemDescriptionInput = $('#itemDescriptionInput');
    const $itemPriceInput = $('#itemPriceInput');
    const $itemQuantityInput = $('#itemQuantityInput');
    const $itemTableBody = $('#itemTableBody');
    const $saveItemBtn = $('#saveItemBtn');
    const $updateItemBtn = $('#updateItemBtn');
    const $deleteItemBtn = $('#deleteItemBtn');
    const $resetItemBtn = $('#resetItemBtn');


    //Load Item table
    window.loadItemsTable =  function () {
        //Clear current table data
        $itemTableBody.empty();
        items_db.forEach(item => {
            const row = `
                            <!-- data-* allow us to store extra information on HTML elements without affecting the element’s functionality or appearance -->
                            <tr data-code="${item.code}" data-name="${item.name}" data-description="${item.description}" data-price="${item.price}" data-quantity="${item.quantity}">
                                <td>${item.code}</td>
                                <td>${item.name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>
                                    <button class="btn btn-sm btn-info view-item me-1"><i class="fas fa-eye"></i> View</button>
                                    <button class="btn btn-sm btn-warning edit-item me-1"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger delete-item"><i class="fas fa-trash-alt"></i> Delete</button>
                                </td>
                            </tr>
            `;

            // This line says: Add the row to the table
            $itemTableBody.append(row);
        });

        addItemTableListeners(); //Activate button listeners
    }

    // This function sets up event listeners (click actions) for buttons inside each item row in the table
    function addItemTableListeners() {
        $itemTableBody.find('.edit-item').on('click', function () {
            // finds the table row of the button
            const $row = $(this).closest('tr');
            // Gets all the data-* values from that row & fills the form with this item’s data.
            populateItemForm($row.data());
        });

        $itemTableBody.find('.view-item').on('click', function () {
            // finds the table row of the button
            const $row = $(this).closest('tr');
            // Gets all the data-* values from that row & fills the form with this item’s data.
            populateItemForm($row.data());

            //Disable everything in the form except the Reset button for view mode
            $itemForm.find('input, textarea, button').not('.btn-secondary').prop('disabled', true);
        });

        $itemTableBody.find('.delete-item').on('click', function () {
            // finds the table row of the button
            const $row = $(this).closest('tr');
            // Table row code value stores in itemCode variable
            const itemCode = $row.data('code');

            if (confirm(`Are you sure you want to delete item ${itemCode}?`)) {
                deleteItem(itemCode);
            }
        });
    }


    function populateItemForm(data) {
        // Add row data to input fields
        $itemCodeInput.val(data.code);
        $itemNameInput.val(data.name);
        $itemDescriptionInput.val(data.description);
        $itemPriceInput.val(data.price);
        $itemQuantityInput.val(data.quantity);

        //Manage button status
        $saveItemBtn.prop('disabled', true);
        $updateItemBtn.prop('disabled', false);
        $deleteItemBtn.prop('disabled', false);

        //Enable form inputs and textareas
        $itemForm.find('input, textarea').prop('disabled', false);
    }

    window.resetItemForm = function() {
        // To use .reset(), we need to work with the raw HTML element, not the jQuery object.
        // So, we use $itemForm[0] to get the raw HTML form, and then we call .reset() on it.
        // Then the form will be reset
        $itemForm[0].reset();
        // Make $itemIdInput empty
        $itemCodeInput.val('');

        //Manage button status
        $saveItemBtn.prop('disabled', false);
        $updateItemBtn.prop('disabled', true);
        $deleteItemBtn.prop('disabled', true);

        //Enable form inputs and textareas
        $itemForm.find('input, textarea').prop('disabled', false);

        loadItemsTable();
    }

    function saveItem() {
        // Format the new Item code
        let newCode = 'I' + String(items_db.length + 1).padStart(3, '0');
        // Add input field values to item object

        let code = newCode;
        let name = $itemNameInput.val();
        let description = $itemDescriptionInput.val();
        let price = parseFloat($itemPriceInput.val());
        let quantity = parseInt($itemQuantityInput.val());

        let item_data = new ItemModel(code,name,description,price,quantity);
        // Add new item object to items array
        items_db.push(item_data);

        // Show saved success message
        Swal.fire({
            title: "Success",
            text: `Item saved!`,
            icon: "success"
        });
        // Load table again
        loadItemsTable();
        // Reset the form
        resetItemForm();

    }

    function updateItem() {
        // get the value of item id input field (We use val() instead of value() in jQuery)
        const codeToUpdate = $itemCodeInput.val();

        // items_db.findIndex(i) {
        //     return i.code === codeToUpdate;
        // }

        // Check the item list, and get index of the item whose ID matches idToUpdate.
        let itemIndex = items_db.findIndex(i => i.code === codeToUpdate);

        if (itemIndex > -1) {

            items_db[itemIndex] = {
                // Add updated data to related item object of the array
                code: codeToUpdate,
                name : $itemNameInput.val(),
                description : $itemDescriptionInput.val(),
                price: parseFloat($itemPriceInput.val()),
                quantity: parseInt($itemQuantityInput.val())
            };

            Swal.fire({
                title: "Success",
                text: `Item ${codeToUpdate} updated!`,
                icon: "success"
            });


            //load the item table data after adding data into array
            loadItemsTable();

            //reset the item form
            resetItemForm();

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Item not found!`
            });
        }
    }

    function deleteItem(codeToDelete) {

        // This shows an error even though items_db declared as let.
        // items_db = items_db.filter(i => i.id !== codeToDelete);

        // This line get the item index with the matching ID (codeToDelete) from the items array.
        const index = items_db.findIndex(i => i.code === codeToDelete);
        if (index !== -1) {
            //remove the item object from the array at the found index
            items_db.splice(index, 1);
        }

        Swal.fire({
            title: "Success",
            text: `Item ${codeToDelete} deleted!`,
            icon: "success"
        });

        //load the item table data after adding data into array
        loadItemsTable();
        //reset the item form
        resetItemForm();

    }

    //Button click bindings

    // Save item when save button clicked
    $saveItemBtn.on('click', saveItem);
    // Update item when update button clicked
    $updateItemBtn.on('click', updateItem);
    // Delete item when delete button clicked
    $deleteItemBtn.on('click', function () {
        let codeToDelete = $itemCodeInput.val();
        if (confirm(`Are you sure you want to delete item ${codeToDelete}?`)) {
            deleteItem(codeToDelete);
        }

    });
    // Reset item form when reset button clicked
    $resetItemBtn.on('click', resetItemForm);

});


