import {orders_db,} from "../db/db.js";


// Order History Part

const $orderHistoryTableBody = $('#orderHistoryTableBody');

window.loadOrderHistoryTable = function () {
    $orderHistoryTableBody.empty();

    // Sort orders by date (newest first)
    const sortedOrders = [...orders_db].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
        const row = `
            <tr data-order-id="${order.orderId}">
                <td>${order.orderId}</td>
                <td>${order.date}</td>
                <td>${order.customerName} (${order.customerId})</td>
                <td>Rs.${order.total.toFixed(2)}</td>
            </tr>
        `;
        $orderHistoryTableBody.append(row);
    });
}

