
import {customers_db, items_db} from "../db/db.js";
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
            
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you really want to delete item ${itemCode}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteItem(itemCode);
                    Swal.fire({
                        title: 'Deleted!',
                        text: `item ${itemCode} has been deleted.`,
                        icon: 'success'
                    });
                }
            });
        });
        
    }
    
    // Function to add table data to input fields
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
        $itemCodeInput.prop('disabled', true);
        
    }
    
    // Function to reset item form
    window.resetItemForm = function() {
        // To use .reset(), we need to work with the raw HTML element, not the jQuery object.
        // So, we use $itemForm[0] to get the raw HTML form, and then we call .reset() on it.
        // Then the form will be reset
        $itemForm[0].reset();
        // Make $itemIdInput empty
        $itemCodeInput.val(getNextItemCode());

        //Manage button status
        $saveItemBtn.prop('disabled', false);
        $updateItemBtn.prop('disabled', true);
        $deleteItemBtn.prop('disabled', true);

        //Enable form inputs and textareas
        $itemForm.find('input, textarea').prop('disabled', false);
        $itemCodeInput.prop('disabled', true);

        loadItemsTable();
    }
    
    // Function to save an item
    function saveItem() {
        // Add input field values to Item code object
        
        let code = getNextItemCode();
        let name = $itemNameInput.val();
        let description = $itemDescriptionInput.val();
        let price = parseFloat($itemPriceInput.val());
        let quantity = parseInt($itemQuantityInput.val());
        
        let item_data = new ItemModel(code,name,description,price,quantity);
        
        if (validateItem(item_data)) {
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
        // else {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: `Invalid item data`
        //     });
        // }
    }
    
    // Function to update an item
    function updateItem() {
        // get the value of item code input field (We use val() instead of value() in jQuery)
            const codeToUpdate = $itemCodeInput.val();

        // items_db.findIndex(c) {
        //     return i.id === codeToUpdate;
        // }
        
        // Check the item list, and get index of the item whose Code matches codeToUpdate.
        let itemIndex = items_db.findIndex(i => i.code === codeToUpdate);
        if (itemIndex > -1) {

            // Get the updated item details from the form
            const updatedItem = {
                code: codeToUpdate,
                name : $itemNameInput.val(),
                description : $itemDescriptionInput.val(),
                price: parseFloat($itemPriceInput.val()),
                quantity: parseInt($itemQuantityInput.val())
            };

            // Validate the updated item data
            if (validateItem(updatedItem)) {
                // If validation passes, update the item in the db
                items_db[itemIndex] = updatedItem;
                Swal.fire({
                    title: "Success",
                    text: `Item ${codeToUpdate} updated!`,
                    icon: "success"
                });

                //load the item table data after adding data into array
                loadItemsTable();

                //reset the item form
                resetItemForm();
            }
            // else {
            //     Swal.fire({
            //         icon: "error",
            //         title: "Oops...",
            //         text: `Invalid item data!`
            //     });
            // }
        }
    }
    
    // Function to generate a unique item code
    function getNextItemCode() {
        let lastItemCode = items_db[items_db.length - 1]?.code || 'I000';
        let lastIdNumber = parseInt(lastItemCode.substring(1)); // Remove the "I" and parse the number
        let nextIdNumber = lastIdNumber + 1; // Increment the number
        
        // Generate the new ID
        let newItemCode = `I${nextIdNumber.toString().padStart(3, '0')}`;
        
        // Check if this code already exists in the database
        while (items_db.some(item => item.code === newItemCode)) {
            // If it exists, increment and try again
            nextIdNumber++;
            newItemCode = `I${nextIdNumber.toString().padStart(3, '0')}`;
        }
        
        return newItemCode;
    }
    
    // Function to delete items
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
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete item ${codeToDelete}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem(codeToDelete);
                Swal.fire({
                    title: 'Deleted!',
                    text: `Item ${codeToDelete} has been deleted.`,
                    icon: 'success'
                });
            }
        });
    });
    // Reset item form when reset button clicked
    $resetItemBtn.on('click', resetItemForm);

});


