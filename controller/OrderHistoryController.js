import {customers_db,items_db,orders_db,} from "../db/db.js";


// Order History Part

const $orderHistoryTableBody = $('#orderHistoryTableBody');

function loadOrderHistoryTable() {
    $orderHistoryTableBody.empty();

    // Sort orders by date (newest first)
    const sortedOrders = [...orders_db].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
        const row = `
            <tr data-order-id="${order.orderId}">
                <td>${order.orderId}</td>
                <td>${order.date}</td>
                <td>${order.customerName} (${order.customerId})</td>
                <td>$${order.total.toFixed(2)}</td>
            </tr>
        `;
        $orderHistoryTableBody.append(row);
    });
}

$(document).ready(function () {
    loadOrderHistoryTable();
});
