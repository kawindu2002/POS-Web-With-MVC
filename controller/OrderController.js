import {customers_db, items_db, orders_db,} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

// --- Order Management ---
const $orderCustomerSelect = $('#orderCustomerSelect');
const $orderDateInput = $('#orderDateInput');
const $availableItemsTableBody = $('#availableItemsTableBody');
const $orderItemsList = $('#orderItemsList');
const $orderSubtotalSpan = $('#orderSubtotal');
const $orderTaxSpan = $('#orderTax');
const $orderTotalSpan = $('#orderTotal');
const $placeOrderBtn = $('#placeOrderBtn');
const $cancelOrderBtn = $('#cancelOrderBtn');
const $orderItemSearchInput = $('#orderItemSearchInput');

let currentOrderItems = [];

window.loadCustomersForOrder = function () {
    //Set the dropdown HTML to a default disabled option prompting user to select a customer
    $orderCustomerSelect.html('<option value="" selected disabled>Select Customer</option>');
    
    customers_db.forEach(customer => {
        // Add an <option> to the dropdown with the customer's id as value and display their name with id
        $orderCustomerSelect.append(`<option value="${customer.id}">${customer.name} (${customer.id})</option>`);
    });
    
}


//load available items into the items table
window.loadAvailableItems = function () {
    
    //Clear all existing rows from the available items table body
    $availableItemsTableBody.empty();
    items_db.forEach(item => {
        //Create an HTML table row with item data stored as data attributes
        const row = `
            <tr data-code="${item.code}" data-name="${item.name}" data-price="${item.price}" data-quantity="${item.quantity}">
                
                <td>${item.code}</td>
                <td>${item.name}</td>
                //Show the item price with 2 decimal places in a table cell
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-success add-item-to-order" data-code="${item.code}">
                      <i class="fas fa-plus"></i> Add
                    </button>
                </td>
            </tr>`;
        
        $availableItemsTableBody.append(row);
    });
    
    addAvailableItemsListeners();
}


// add click event listeners to all "Add" buttons in the available items table
function addAvailableItemsListeners() {
    
    //Find all elements with the class 'add-item-to-order' inside the available items table body and add a click event
    $availableItemsTableBody.find('.add-item-to-order').on('click', function () {
        //Get the 'data-code' attribute (item code) from the clicked button
        const itemCode = $(this).data('code');
        //Add the item to the order using the item code
        addItemToOrder(itemCode);
    });
}


//add an item to the current order using its item code
function addItemToOrder(itemCode) {
    
    //Find the item in the items database that matches the given item code
    const itemToAdd = items_db.find(item => item.code === itemCode);
    
    //If the item is not found in the database, exit the function
    if (!itemToAdd) {
        return;
    }
    
    //Check if the item is already present in the current order items
    const existingOrderItem = currentOrderItems.find(item => item.code === itemCode);
    
    //If the item is already in the order
    if (existingOrderItem) {
        
        //Calculate the total quantity of this item in the order by summing up its quantities
        const totalQuantityInOrder = currentOrderItems
                .filter(item => item.code === itemCode)
                .reduce((sum, item) => sum + item.quantity, 0);
        
        //If the total quantity in the order is less than the item's available stock
        if (totalQuantityInOrder < itemToAdd.quantity) {
            
            //Increment the quantity of the existing item in the order
            existingOrderItem.quantity += 1;
        } else {
            //Show a warning message that the stock limit has been reached
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: `Cannot add more ${itemToAdd.name}. Stock limit reached!`
            });
            return;
        }
    } else {
        
        //If the item is not already in the order and is in stock
        if (itemToAdd.quantity > 0) {
            
            //Add the item to the order with a quantity of 1
            currentOrderItems.push({...itemToAdd, quantity: 1});
        } else {
            
            // Show an error message that the item is out of stock
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${itemToAdd.name} is out of stock.`
            });
            return;
        }
    }
    
    //Update the list of order items
    updateOrderItemsList();
    
    //Update the order summary
    updateOrderSummary();
}

//Update the list of items shown in the current order
function updateOrderItemsList() {
    
    //Clear all content from the order items list container
    $orderItemsList.empty();
    
    //If there are no items in the current order
    if (currentOrderItems.length === 0) {
        
        // Show a message saying "No items added yet" in the center
        $orderItemsList.html('<div class="text-muted text-center py-3">No items added yet</div>');
        return;
    }
    
    // Loop through each item in the current order
    currentOrderItems.forEach(item => {
        
        // Create an HTML block showing item name, price, quantity, and controls
        const itemElement = `
            <div class="order-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${item.name} (${item.code})</h6>
                    <small class="text-muted">Rs.${item.price.toFixed(2)} each</small>
                </div>

                <div class="quantity-control">
                    <button class="btn btn-sm btn-outline-secondary quantity-btn minus-item" data-code="${item.code}">
                        <i class="fas fa-minus"></i>
                    </button>

                    <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" data-code="${item.code}">

                    <button class="btn btn-sm btn-outline-secondary quantity-btn plus-item" data-code="${item.code}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>

                <div class="ms-3 fw-bold">Rs.${(item.price * item.quantity).toFixed(2)}</div>

                <button class="btn btn-sm btn-outline-danger ms-2 remove-item-from-order" data-code="${item.code}">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        
        // Add the created item block to the order items list in the UI
        $orderItemsList.append(itemElement);
    });
    
    // Attach event listeners to the newly added buttons and inputs
    addOrderItemsListListeners();
}

// adds event listeners to all order item controls
function addOrderItemsListListeners() {
    
    // Attach a click event to all minus buttons inside the order items list
    $orderItemsList.find('.minus-item').on('click', function () {
        
        // Get the item code from the clicked button's data attribute
        const itemCode = $(this).data('code');
        
        // Find the item in the current order by its code
        const item = currentOrderItems.find(item => item.code === itemCode);
        
        // If the item exists and quantity is more than 1, reduce quantity by 1
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            
            // Update the order item display and total summary
            updateOrderItemsList();
            updateOrderSummary();
        }
    });
    
    // Attach a click event to all plus buttons inside the order items list
    $orderItemsList.find('.plus-item').on('click', function () {
        
        const itemCode = $(this).data('code');
        const item = currentOrderItems.find(item => item.code === itemCode);
        
        // Find the item in the available stock (from `items`) to check stock limit
        const availableItem = items_db.find(i => i.code === itemCode);
        
        // If item exists and stock limit is not reached, increase quantity
        if (item && availableItem && item.quantity < availableItem.quantity) {
            item.quantity += 1;
            
            // Update the UI and summary
            updateOrderItemsList();
            updateOrderSummary();
        } else {
            // Show an error if user tries to go over stock limit
            Swal.fire({icon: "error", title: "Oops...", text: `Cannot add more ${item.name}. Stock limit reached.`});
        }
    });
    
    // Attach a change event to all quantity input boxes
    $orderItemsList.find('.quantity-input').on('change', function () {
        
        // Get the item code from the input box
        const itemCode = $(this).data('code');
        
        // Find the current order item
        const item = currentOrderItems.find(item => item.code === itemCode);
        
        // Find the full stock info for this item
        const availableItem = items_db.find(i => i.code === itemCode);
        
        // Get the new quantity value typed by the user
        const newQuantity = parseInt($(this).val());
        
        // If the item and stock data exist
        if (item && availableItem) {
            
            // If new quantity is valid and within stock limit, apply it
            if (newQuantity > 0 && newQuantity <= availableItem.quantity) {
                item.quantity = newQuantity;
                
                // Update the summary (no need to redraw item list)
                updateOrderSummary();
            } else {
                // Show warning if input is out of range and reset the input box value
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: `Invalid quantity. Must be between 1 and ${availableItem.quantity}.`
                });
                $(this).val(item.quantity);
            }
        }
    });
    
    // Attach a click event to all remove buttons
    $orderItemsList.find('.remove-item-from-order').on('click', function () {
        
        // Get the item code from the button
        const itemCode = $(this).data('code');
        
        // Remove the item from the current order list
        currentOrderItems = currentOrderItems.filter(item => item.code !== itemCode);
        
        // Update the item list and summary in the UI
        updateOrderItemsList();
        updateOrderSummary();
    });
}


// calculate and update the order summary
function updateOrderSummary() {
    
    // Calculate subtotal by summing (price × quantity) for each item
    const subtotal = currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax as 10% of the subtotal
    const tax = subtotal * 0.10;
    
    // Calculate total by adding tax to subtotal
    const total = subtotal + tax;
    
    // Display subtotal in the corresponding HTML span
    $orderSubtotalSpan.text(`Rs.${subtotal.toFixed(2)}`);
    
    // Display tax in the corresponding HTML span
    $orderTaxSpan.text(`Rs.${tax.toFixed(2)}`);
    
    // Display total amount in the corresponding HTML span
    $orderTotalSpan.text(`Rs.${total.toFixed(2)}`);
    
    // Disable the "Place Order" button if no items are selected or no customer is selected
    $placeOrderBtn.prop('disabled', currentOrderItems.length === 0 || $orderCustomerSelect.val() === "");
    
    // Disable the "Cancel Order" button if no items are selected or no customer is selected
    $cancelOrderBtn.prop('disabled', currentOrderItems.length === 0 || $orderCustomerSelect.val() === "");
}


// reset the order form to its initial state
window.resetOrderForm = function () {
    
    $orderCustomerSelect.val("");
    
    const today = new Date();
    const yyyy = today.getFullYear();
    
    // Get the month (0-based, so add 1) and pad with zero if needed
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    
    // Get the day of the month and pad with zero if needed
    const dd = String(today.getDate()).padStart(2, '0');
    
    // Set the date input field to today's date in YYYY-MM-DD format
    $orderDateInput.val(`${yyyy}-${mm}-${dd}`);
    
    // Clear the list of items in the current order
    currentOrderItems = [];
    
    // Update the item list display (it will now show "no items")
    updateOrderItemsList();
    
    // Update the summary (it will now be $0.00)
    updateOrderSummary();
}


// When the "Place Order" button is clicked, run this function
$placeOrderBtn.on('click', function () {
    // Get the selected customer ID from the dropdown
    const customerId = $orderCustomerSelect.val();
    
    // If no items are added, show a warning and stop the process
    if (currentOrderItems.length === 0) {
        Swal.fire({icon: "warning", title: "Oops...", text: "Please add items to the order."});
        return;
    }
    // If no customer is selected, show an info message and stop
    if (!customerId) {
        Swal.fire({icon: "info", title: "Oops...", text: "Please select a customer."});
        return;
    }
    
    // Find the customer object using the selected customer ID
    const selectedCustomer = customers_db.find(c => c.id === customerId);
    
    let orderId = getNextOrderId();
    let date = $orderDateInput.val();
    let cusId = customerId;
    let customerName = selectedCustomer ? selectedCustomer.name : 'Unknown Customer';
    let items = [...currentOrderItems];
    let subtotal = parseFloat($orderSubtotalSpan.text().replace('Rs.', ''));
    let tax = parseFloat($orderTaxSpan.text().replace('Rs.', ''));
    let total = parseFloat($orderTotalSpan.text().replace('Rs.', ''));
    
    let order_data = new OrderModel(orderId, date, cusId, customerName, items, subtotal, tax, total);
    
    if (validateOrder(order_data)) {
        orders_db.push(order_data);
        Swal.fire({title: "Success", text: `Order ${orderId} placed successfully!`, icon: "success"});
        resetOrderForm();
        
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Invalid order data`
        });
    }
    
});


// Function to generate a unique order ID
function getNextOrderId() {
    let lastOrderId = orders_db[orders_db.length - 1]?.orderId || 'ORD000';
    let lastIdNumber = parseInt(lastOrderId.substring(3)); // Remove the "ORD" and parse the number
    let nextIdNumber = lastIdNumber + 1; // Increment the number
    
    // Generate the new ID
    let newOrderId = `ORD${nextIdNumber.toString().padStart(3, '0')}`;
    
    // Check if this ID already exists in the database
    while (orders_db.some(order => order.orderId === newOrderId)) {
        // If it exists, increment and try again
        nextIdNumber++;
        newOrderId = `ORD${nextIdNumber.toString().padStart(3, '0')}`;
    }
    
    return newOrderId;
}


// When the "Cancel Order" button is clicked, run this function
$cancelOrderBtn.on('click', function () {
    
    // Check if there are any items in the order or a customer selected
    if (currentOrderItems.length > 0 || $orderCustomerSelect.val() !== "") {
        
        // Show a confirmation popup to ask if the user really wants to cancel
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            
            // if the user confirms the cancellation
            if (result.isConfirmed) {
                
                // Reset the order form (clear customer and items)
                resetOrderForm();
                
                // Show a success message saying the order is cancelled
                Swal.fire({title: "Cancelled", text: "Order cancelled.", icon: "success"});
            }
        });
        
    } else {
        // If there's nothing to cancel, show an error popup
        Swal.fire({icon: "error", title: "Oops...", text: "No active order to cancel."});
    }
    
});

//Search input bar
$orderItemSearchInput.on('input', function () {
    
    // Get the entered text and convert it to lowercase
    let searchText = $(this).val().toLowerCase();
    // Go through each row inside the table body
    $('#availableItemsTableBody tr').each(function () {
        // Get the text content of the row and convert it to lowercase
        let rowText = $(this).text().toLowerCase();
        //If the row contains the search text, show it
        if (rowText.includes(searchText)) {
            $(this).show();
        }
        //If not, hide the row
        else {
            $(this).hide();
        }
    });
});

