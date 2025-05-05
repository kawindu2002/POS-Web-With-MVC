export default class OrderModel {
    constructor(orderId, date, customerId, customerName, items, subtotal, tax, total) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.total = total;
    }
}
