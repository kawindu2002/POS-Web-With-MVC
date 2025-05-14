
//================================================= Customer Validation ================================================

window.validateCustomer =  function(customer) {
        if (!customer.name || customer.name.length < 3) {
                Swal.fire({
                        title: "Warning",
                        text: `Customer name must be at least 3 characters long`,
                        icon: "warning"
                });
                return false;
        }
        if (!customer.email || !isValidEmail(customer.email)) {
                Swal.fire({
                        title: "Warning",
                        text: `Please enter a valid email address`,
                        icon: "warning"
                });
                return false;
        }
        if (!customer.phone || !isValidPhone(customer.phone)) {
                Swal.fire({
                        title: "Warning",
                        text: `Please enter a valid phone number`,
                        icon: "warning"
                });
                return false;
        }
        if (!customer.address || customer.address.length < 5) {
                Swal.fire({
                        title: "Warning",
                        text: `Address must be at least 5 characters long`,
                        icon: "warning"
                });
                return false;
        }
        return true;
}

// Helper function to validate email
function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
}

// Helper function to validate phone number
function isValidPhone(phone) {
        const phonePattern = /^[0-9]{10}$/;
        return phonePattern.test(phone);
}


//================================================= Item Validation ====================================================

window.validateItem =  function(item) {
        if (!item.name || item.name.length < 3) {
                Swal.fire({
                        title: "Warning",
                        text: `Item name must be at least 3 characters long`,
                        icon: "warning"
                });
                return false;
        }
        if (!item.description || item.description.length < 5) {
                Swal.fire({
                        title: "Warning",
                        text: `Item description must be at least 5 characters long`,
                        icon: "warning"
                });
                return false;
        }
        if (!item.price || isNaN(item.price) || item.price <= 0) {
                Swal.fire({
                        title: "Warning",
                        text: `Please enter a valid price greater than 0`,
                        icon: "warning"
                });
                return false;
        }
        if (!item.quantity || isNaN(item.quantity) || item.quantity < 0) {
                Swal.fire({
                        title: "Warning",
                        text: `Please enter a valid quantity (0 or greater)`,
                        icon: "warning"
                });
                return false;
        }
        return true;
}


//================================================= Order Validation ===================================================

window.validateOrder =  function(order) {
        if (!order.items || order.items.length === 0) {
                Swal.fire({
                        title: "Warning",
                        text: `Order must have at least one item`,
                        icon: "warning"
                });
                return false;
        }
        return true;
}

//======================================================================================================================

