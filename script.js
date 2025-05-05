import {customers_db} from "./db/db";

$(document).ready(function () {
    const $navLinks = $('.nav-link[data-target]');
    const $cardButtons = $('.card-button[data-target]');
    const $pageSections = $('.page-section');

    // --- Page Navigation ---
    function showPage(targetId) {
        // 🟢 This line says: Hide all sections
        $pageSections.removeClass('active');

        // 🟢 This line says: Show the section with the matching ID
        const $targetSection = $('#' + targetId);
        if ($targetSection.length) {
            $targetSection.addClass('active');
        }

        // 🟢 This line says: Highlight the active nav link
        $navLinks.each(function () {
            const $link = $(this);
            if ($link.data('target') === targetId) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });

        // 🟢 This line says: Run specific functions depending on which page is shown
        if (targetId === 'order-page') {
            loadCustomersForOrder();
            loadAvailableItems();
            resetOrderForm();
        } else if (targetId === 'customer-page') {
            loadCustomersTable();
            resetCustomerForm();
        } else if (targetId === 'item-page') {
            loadItemsTable();
            resetItemForm();
        } else if (targetId === 'order-history-page') {
            loadOrderHistoryTable();
        }
    }

    // 🟢 This line says: When a nav link is clicked, show the page linked to it
    $navLinks.on('click', function (event) {
        event.preventDefault();
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    // 🟢 This line says: When a card button is clicked, show the page linked to it
    $cardButtons.on('click', function () {
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    window.customers_dbcustomers = [
        { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
        { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', address: '456 Oak Ave' },
    ];

    window.items = [
        { code: 'I001', name: 'Laptop', description: 'High performance laptop', price: 1200.00, quantity: 15 },
        { code: 'I002', name: 'Mouse', description: 'Wireless ergonomic mouse', price: 25.50, quantity: 150 },
        { code: 'I003', name: 'Keyboard', description: 'Mechanical keyboard', price: 49.99, quantity: 30 },
        { code: 'I004', name: 'Monitor', description: '27-inch 4K monitor', price: 199.99, quantity: 10 },
    ];

    window.orders = [
        {
            orderId: 'ORD001',
            date: '2023-10-26',
            customerId: 'C001',
            customerName: 'John Doe',
            total: 1251.00,
            items: [{ code: 'I001', name: 'Laptop', price: 1200.00, quantity: 1 }]
        },
        {
            orderId: 'ORD002',
            date: '2023-10-25',
            customerId: 'C002',
            customerName: 'Jane Smith',
            total: 500.00,
            items: [
                { code: 'I004', name: 'Monitor', price: 199.99, quantity: 2 },
                { code: 'I002', name: 'Mouse', price: 25.50, quantity: 4 }
            ]
        }
    ];
});



// ===========================================================================================================================
// Orders Management Part
//
// const $orderCustomerSelect = $('#orderCustomerSelect');
// const $orderDateInput = $('#orderDateInput');
// const $availableItemsTableBody = $('#availableItemsTableBody');
// const $orderItemsList = $('#orderItemsList');
// const $orderSubtotalSpan = $('#orderSubtotal');
// const $orderTaxSpan = $('#orderTax');
// const $orderTotalSpan = $('#orderTotal');
// const $placeOrderBtn = $('#placeOrderBtn');
// const $cancelOrderBtn = $('#cancelOrderBtn');
//
// let currentOrderItems = [];
//
// function loadCustomersForOrder() {
//     $orderCustomerSelect.html('<option value="" selected disabled>Select Customer</option>');
//     customers.forEach(customer => {
//         $orderCustomerSelect.append(`<option value="${customer.id}">${customer.name} (${customer.id})</option>`);
//     });
// }
//
// function loadAvailableItems() {
//     $availableItemsTableBody.empty();
//     items.forEach(item => {
//         const row = `
//             <tr data-code="${item.code}" data-name="${item.name}" data-price="${item.price}" data-quantity="${item.quantity}">
//                 <td>${item.code}</td>
//                 <td>${item.name}</td>
//                 <td>${item.price.toFixed(2)}</td>
//                 <td>${item.quantity}</td>
//                 <td>
//                     <button class="btn btn-sm btn-success add-item-to-order" data-code="${item.code}">
//                       <i class="fas fa-plus"></i> Add
//                     </button>
//                 </td>
//             </tr>`;
//         $availableItemsTableBody.append(row);
//     });
//     addAvailableItemsListeners();
// }
//
// function addAvailableItemsListeners() {
//     $availableItemsTableBody.find('.add-item-to-order').on('click', function() {
//         const itemCode = $(this).data('code');
//         addItemToOrder(itemCode);
//     });
// }
//
// function addItemToOrder(itemCode) {
//     const itemToAdd = items.find(item => item.code === itemCode);
//     if (!itemToAdd) return;
//
//     const existingOrderItem = currentOrderItems.find(item => item.code === itemCode);
//
//     if (existingOrderItem) {
//         const totalQuantityInOrder = currentOrderItems
//             .filter(item => item.code === itemCode)
//             .reduce((sum, item) => sum + item.quantity, 0);
//
//         if (totalQuantityInOrder < itemToAdd.quantity) {
//             existingOrderItem.quantity += 1;
//         } else {
//             Swal.fire({ icon: "warning", title: "Oops...", text: `Cannot add more ${itemToAdd.name}. Stock limit reached!` });
//             return;
//         }
//     } else {
//         if (itemToAdd.quantity > 0) {
//             currentOrderItems.push({ ...itemToAdd, quantity: 1 });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: `${itemToAdd.name} is out of stock.` });
//             return;
//         }
//     }
//
//     updateOrderItemsList();
//     updateOrderSummary();
// }
//
// function updateOrderItemsList() {
//     $orderItemsList.empty();
//
//     if (currentOrderItems.length === 0) {
//         $orderItemsList.html('<div class="text-muted text-center py-3">No items added yet</div>');
//         return;
//     }
//
//     currentOrderItems.forEach(item => {
//         const itemElement = `
//             <div class="order-item d-flex justify-content-between align-items-center">
//                 <div>
//                     <h6 class="mb-0">${item.name} (${item.code})</h6>
//                     <small class="text-muted">$${item.price.toFixed(2)} each</small>
//                 </div>
//                 <div class="quantity-control">
//                     <button class="btn btn-sm btn-outline-secondary quantity-btn minus-item" data-code="${item.code}">
//                         <i class="fas fa-minus"></i>
//                     </button>
//                     <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" data-code="${item.code}">
//                     <button class="btn btn-sm btn-outline-secondary quantity-btn plus-item" data-code="${item.code}">
//                         <i class="fas fa-plus"></i>
//                     </button>
//                 </div>
//                 <div class="ms-3 fw-bold">$${(item.price * item.quantity).toFixed(2)}</div>
//                 <button class="btn btn-sm btn-outline-danger ms-2 remove-item-from-order" data-code="${item.code}">
//                     <i class="fas fa-times"></i>
//                 </button>
//             </div>`;
//         $orderItemsList.append(itemElement);
//     });
//
//     addOrderItemsListListeners();
// }
//
// function addOrderItemsListListeners() {
//     $orderItemsList.find('.minus-item').on('click', function() {
//         const itemCode = $(this).data('code');
//         const item = currentOrderItems.find(item => item.code === itemCode);
//         if (item && item.quantity > 1) {
//             item.quantity -= 1;
//             updateOrderItemsList();
//             updateOrderSummary();
//         }
//     });
//
//     $orderItemsList.find('.plus-item').on('click', function() {
//         const itemCode = $(this).data('code');
//         const item = currentOrderItems.find(item => item.code === itemCode);
//         const availableItem = items.find(i => i.code === itemCode);
//         if (item && availableItem && item.quantity < availableItem.quantity) {
//             item.quantity += 1;
//             updateOrderItemsList();
//             updateOrderSummary();
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: `Cannot add more ${item.name}. Stock limit reached.` });
//         }
//     });
//
//     $orderItemsList.find('.quantity-input').on('change', function() {
//         const itemCode = $(this).data('code');
//         const item = currentOrderItems.find(item => item.code === itemCode);
//         const availableItem = items.find(i => i.code === itemCode);
//         const newQuantity = parseInt($(this).val());
//
//         if (item && availableItem) {
//             if (newQuantity > 0 && newQuantity <= availableItem.quantity) {
//                 item.quantity = newQuantity;
//                 updateOrderSummary();
//             } else {
//                 Swal.fire({ icon: "warning", title: "Oops...", text: `Invalid quantity. Must be between 1 and ${availableItem.quantity}.` });
//                 $(this).val(item.quantity);
//             }
//         }
//     });
//
//     $orderItemsList.find('.remove-item-from-order').on('click', function() {
//         const itemCode = $(this).data('code');
//         currentOrderItems = currentOrderItems.filter(item => item.code !== itemCode);
//         updateOrderItemsList();
//         updateOrderSummary();
//     });
// }
//
// function updateOrderSummary() {
//     const subtotal = currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const tax = subtotal * 0.10;
//     const total = subtotal + tax;
//
//     $orderSubtotalSpan.text(`$${subtotal.toFixed(2)}`);
//     $orderTaxSpan.text(`$${tax.toFixed(2)}`);
//     $orderTotalSpan.text(`$${total.toFixed(2)}`);
//
//     $placeOrderBtn.prop('disabled', currentOrderItems.length === 0 || $orderCustomerSelect.val() === "");
// }
//
// function resetOrderForm() {
//     $orderCustomerSelect.val("");
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, '0');
//     const dd = String(today.getDate()).padStart(2, '0');
//     $orderDateInput.val(`${yyyy}-${mm}-${dd}`);
//     currentOrderItems = [];
//     updateOrderItemsList();
//     updateOrderSummary();
// }
//
// $placeOrderBtn.on('click', function() {
//     const customerId = $orderCustomerSelect.val();
//
//     if (currentOrderItems.length === 0) {
//         Swal.fire({ icon: "warning", title: "Oops...", text: "Please add items to the order." });
//         return;
//     }
//
//     if (!customerId) {
//         Swal.fire({ icon: "info", title: "Oops...", text: "Please select a customer." });
//         return;
//     }
//
//     const newOrderId = 'ORD' + String(orders.length + 1).padStart(3, '0');
//     const selectedCustomer = customers.find(c => c.id === customerId);
//
//     const newOrder = {
//         orderId: newOrderId,
//         date: $orderDateInput.val(),
//         customerId: customerId,
//         customerName: selectedCustomer ? selectedCustomer.name : 'Unknown Customer',
//         items: [...currentOrderItems],
//         subtotal: parseFloat($orderSubtotalSpan.text().replace('$', '')),
//         tax: parseFloat($orderTaxSpan.text().replace('$', '')),
//         total: parseFloat($orderTotalSpan.text().replace('$', ''))
//     };
//
//     orders.push(newOrder);
//     console.log('Order Placed:', newOrder);
//     Swal.fire({ title: "Success", text: `Order ${newOrderId} placed successfully!`, icon: "success" });
//     resetOrderForm();
// });
//
// $cancelOrderBtn.on('click', function() {
//     if (currentOrderItems.length > 0 || $orderCustomerSelect.val() !== "") {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "Do you really want to cancel this order?",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, cancel it!'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 resetOrderForm();
//                 Swal.fire({ title: "Cancelled", text: "Order cancelled.", icon: "success" });
//             }
//         });
//     } else {
//         Swal.fire({ icon: "error", title: "Oops...", text: "No active order to cancel." });
//     }
// });

// ===========================================================================================================================
// Order History Part

const $orderHistoryTableBody = $('#orderHistoryTableBody');

function loadOrderHistoryTable() {
    $orderHistoryTableBody.empty(); // Clear the table

    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
        const row = `
            <tr data-order-id="${order.orderId}">
                <td>${order.orderId}</td>
                <td>${order.date}</td>
                <td>${order.customerName} (${order.customerId})</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-info view-order me-1"><i class="fas fa-eye"></i> View</button>
                    <button class="btn btn-sm btn-danger delete-order"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            </tr>
        `;
        $orderHistoryTableBody.append(row);
    });

    addOrderHistoryListeners();
}

function addOrderHistoryListeners() {
    $orderHistoryTableBody.find('.view-order').off('click').on('click', function () {
        const orderId = $(this).closest('tr').data('order-id');
        viewOrderDetails(orderId);
    });

    $orderHistoryTableBody.find('.delete-order').off('click').on('click', function () {
        const orderId = $(this).closest('tr').data('order-id');
        if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
            deleteOrder(orderId);
        }
    });
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        let detailsHtml = `
            <h5>Order ID: ${order.orderId}</h5>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerId})</p>
            <h6>Items:</h6>
            <ul>
        `;
        order.items.forEach(item => {
            detailsHtml += `<li>${item.name} (${item.code}) - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</li>`;
        });
        detailsHtml += `
                        </ul>
                            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
                            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
                        <h4><strong>Total:</strong> $${order.total.toFixed(2)}</h4>
        `;

        alert('Order Details:\n' + detailsHtml.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' '));
        console.log('Order Details:', order);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Order not found!'
        });
    }
}

function deleteOrder(orderId) {
    orders = orders.filter(o => o.orderId !== orderId);
    loadOrderHistoryTable();
    Swal.fire({
        title: "Success",
        text: `Order ${orderId} deleted!`,
        icon: "success"
    });
}

// ===========================================================================================================================
// Initial Page Load Setup

const $initialActivePage = $('.page-section.active');

if ($initialActivePage.length > 0) {
    const initialTargetId = $initialActivePage.attr('id');

    navLinks.each(function () {
        const $link = $(this);
        if ($link.data('target') === initialTargetId) {
            $link.addClass('active');
        } else {
            $link.removeClass('active');
        }
    });

    if (initialTargetId === 'customer-page'){
        loadCustomersTable();
    }
    else if (initialTargetId === 'item-page') {
        loadItemsTable();

    }else if(initialTargetId === 'order-page') {
        loadCustomersForOrder();
        loadAvailableItems();
        resetOrderForm();
    } else if (initialTargetId === 'order-history-page') {
        loadOrderHistoryTable();
    }
} else {
    showPage('homepage');
}


// ===========================================================================================================================
