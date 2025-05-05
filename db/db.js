export let customers_db = [
    { id: 'C001', name: 'Pasindu Malshan', email: 'pmalshan@gmail.com', phone: '0716236452', address: 'Galle' },
    { id: 'C002', name: 'Shanuka Sathsara', email: 'shanuka@gmail.com', phone: '0772367123', address: 'Panadura' },
];

export let items_db = [
    { code: 'I001', name: 'Laptop', description: 'High performance laptop', price: 1200.00, quantity: 15 },
    { code: 'I002', name: 'Mouse', description: 'Wireless ergonomic mouse', price: 25.50, quantity: 150 },
    { code: 'I003', name: 'Keyboard', description: 'Mechanical keyboard', price: 49.99, quantity: 30 },
    { code: 'I004', name: 'Monitor', description: '27-inch 4K monitor', price: 199.99, quantity: 10 },
];

export let orders_db = [
        {
            orderId: 'ORD001',
            date: '2023-10-26',
            customerId: 'C001',
            customerName: 'John Doe',
            total: 1251.00,
            items: [
                { code: 'I001', name: 'Laptop', price: 1200.00, quantity: 1 }
            ]
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

