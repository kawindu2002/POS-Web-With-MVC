import {customers_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

// Customer Management Part

$(document).ready(function () {
    //Initialize Elements to variables
    const $customerForm = $('#customerForm');
    const $customerIdInput = $('#customerIdInput');
    const $customerNameInput = $('#customerNameInput');
    const $customerEmailInput = $('#customerEmailInput');
    const $customerPhoneInput = $('#customerPhoneInput');
    const $customerAddressInput = $('#customerAddressInput');
    const $customerTableBody = $('#customerTableBody');
    const $saveCustomerBtn = $('#saveCustomerBtn');
    const $updateCustomerBtn = $('#updateCustomerBtn');
    const $deleteCustomerBtn = $('#deleteCustomerBtn');
    const $resetCustomerBtn = $('#resetCustomerBtn');

    //Load customer table
    // window. can make a function available globally
    
    window.loadCustomersTable =  function() {
        //Clear current table data
        $customerTableBody.empty();

        customers_db.forEach(customer => {
            const row = `
                            <!-- data-* allow us to store extra information on HTML elements without affecting the element’s functionality or appearance -->
                            <tr data-id="${customer.id}" data-name="${customer.name}" data-email="${customer.email}" data-phone="${customer.phone}" data-address="${customer.address}">
                                <td>${customer.id}</td>
                                <td>${customer.name}</td>
                                <td>${customer.email}</td>
                                <td>${customer.phone}</td>
                                <td>${customer.address}</td>
                                <td>
                                    <!--These are the buttons inside of row-->
                                    <button class="btn btn-sm btn-info view-customer me-1"><i class="fas fa-eye"></i> View</button>
                                    <button class="btn btn-sm btn-warning edit-customer me-1"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger delete-customer"><i class="fas fa-trash-alt"></i> Delete</button>
                                </td>
                            </tr>
            `;

            // Add the row to the table
            $customerTableBody.append(row);
        });

        addCustomerTableListeners(); //Activate button listeners
    }

    // This function sets up event listeners (click actions) for buttons inside each customer row in the table
    function addCustomerTableListeners() {
        $customerTableBody.find('.edit-customer').on('click', function () {
            // finds the table row of the button
            const $row = $(this).closest('tr');
            // Gets all the data-* values from that row & fills the form with this customer’s data.
            populateCustomerForm($row.data());
        });

        $customerTableBody.find('.view-customer').on('click', function () {
            // finds the table row of the button
            const $row = $(this).closest('tr');
            // Gets all the data-* values from that row & fills the form with this customer’s data.
            populateCustomerForm($row.data());

            //Disable everything in the form except the Reset button for view mode
            $customerForm.find('input, textarea, button').not('.btn-secondary').prop('disabled', true);
        });
        
        $customerTableBody.find('.delete-customer').on('click', function () {
            const $row = $(this).closest('tr');
            const customerId = $row.data('id');
            
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you really want to delete customer ${customerId}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCustomer(customerId);
                    Swal.fire({
                        title: 'Deleted!',
                        text: `Customer ${customerId} has been deleted.`,
                        icon: 'success'
                    });
                }
            });
        });
    }
    
    
    // Function to add table data to input fields
    function populateCustomerForm(data) {
        // Add row data to input fields
        $customerIdInput.val(data.id);
        $customerNameInput.val(data.name);
        $customerEmailInput.val(data.email);
        $customerPhoneInput.val(data.phone);
        $customerAddressInput.val(data.address);

        //Manage button status
        $saveCustomerBtn.prop('disabled', true);
        $updateCustomerBtn.prop('disabled', false);
        $deleteCustomerBtn.prop('disabled', false);

        //Enable form inputs and textareas
        $customerForm.find('input, textarea').prop('disabled', false);
        $customerIdInput.prop('disabled', true);
        
    }

    //function to reset input fields
    window.resetCustomerForm =  function() {
        // To use .reset(), we need to work with the raw HTML element, not the jQuery object.
        // So, we use $customerForm[0] to get the raw HTML form, and then we call .reset() on it.
        // Then the form will be reset
        $customerForm[0].reset();
        // Make $customerIdInput empty
        $customerIdInput.val(getNextCustomerId());

        //Manage button status
        $saveCustomerBtn.prop('disabled', false);
        $updateCustomerBtn.prop('disabled', true);
        $deleteCustomerBtn.prop('disabled', true);

        //Enable form inputs and textareas
        $customerForm.find('input, textarea').prop('disabled', false);
        $customerIdInput.prop('disabled', true);

        loadCustomersTable();
    }
    
    //function save customer
    function saveCustomer() {
        // Add input field values to customer Id object

        let id = getNextCustomerId();
        let name = $customerNameInput.val();
        let email = $customerEmailInput.val();
        let phone = $customerPhoneInput.val();
        let address = $customerAddressInput.val();
        
        let customer_data = new CustomerModel(id,name,email,phone,address);
        
        if (validateCustomer(customer_data)) {
            // Add new customer object to customers array
            customers_db.push(customer_data);
            // Show saved success message
            Swal.fire({
                title: "Success",
                text: `Customer saved!`,
                icon: "success"
            });
            // Load table again
            loadCustomersTable();
            // Reset the form
            resetCustomerForm();
            
        }
        // else {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: `Invalid customer data`
        //     });
        // }
    }
    
    //function update customer
    function updateCustomer() {
        // get the value of customer id input field (We use val() instead of value() in jQuery)
        const idToUpdate = $customerIdInput.val();

        // customers_db.findIndex(c) {
        //     return c.id === idToUpdate;
        // }
        // Check the customer list, and get index of the customer whose ID matches idToUpdate.
        let customerIndex = customers_db.findIndex(c => c.id === idToUpdate);

        if (customerIndex > -1) {
            
            // Get the updated customer details from the form
            const updatedCustomer = {
                id: idToUpdate,
                name: $customerNameInput.val(),
                email: $customerEmailInput.val(),
                phone: $customerPhoneInput.val(),
                address: $customerAddressInput.val()
            };

            // Validate the updated customer data
            if (validateCustomer(updatedCustomer)) {
                // If validation passes, update the customer in the db
                customers_db[customerIndex] = updatedCustomer;
                Swal.fire({
                    title: "Success",
                    text: `Customer ${idToUpdate} updated!`,
                    icon: "success"
                });

                //load the customer table data after adding data into array
                loadCustomersTable();

                //reset the customer form
                resetCustomerForm();
            }
            // else {
            //     Swal.fire({
            //         icon: "error",
            //         title: "Oops...",
            //         text: `Invalid customer data!`
            //     });
            // }
        }
    }
    
    // Function to delete a customer
    function deleteCustomer(idToDelete) {

        // This shows an error even though customers_db declared as let.
        // customers_db = customers_db.filter(c => c.id !== idToDelete);

        // This line get the customer index with the matching ID (idToDelete) from the customers array.
        const index = customers_db.findIndex(c => c.id === idToDelete);
        if (index !== -1) {
            //remove the customer object from the array at the found index
            customers_db.splice(index, 1);
        }

        Swal.fire({
            title: "Success",
            text: `Customer ${idToDelete} deleted!`,
            icon: "success"
        });

        //load the customer table data after adding data into array
        loadCustomersTable();
        //reset the customer form
        resetCustomerForm();

    }

    //Button click bindings
    // Save customer when save button clicked
    $saveCustomerBtn.on('click', saveCustomer);
    // Update customer when update button clicked
    $updateCustomerBtn.on('click', updateCustomer);
    // Delete customer when delete button clicked
    
    $deleteCustomerBtn.on('click', function () {
        let idToDelete = $customerIdInput.val();
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete customer ${idToDelete}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCustomer(idToDelete);
                Swal.fire({
                    title: 'Deleted!',
                    text: `Customer ${idToDelete} has been deleted.`,
                    icon: 'success'
                });
            }
        });
    });
    
    
    // Reset customer form when reset button clicked
    $resetCustomerBtn.on('click', resetCustomerForm);
    
    
    // Function to generate a unique customer ID
    function getNextCustomerId() {
        let lastCustomerId = customers_db[customers_db.length - 1]?.id || 'C000';
        let lastIdNumber = parseInt(lastCustomerId.substring(1)); // Remove the "C" and parse the number
        let nextIdNumber = lastIdNumber + 1; // Increment the number
        
        // Generate the new ID
        let newCustomerId = `C${nextIdNumber.toString().padStart(3, '0')}`;
        
        // Check if this ID already exists in the database
        while (customers_db.some(customer => customer.id === newCustomerId)) {
            // If it exists, increment and try again
            nextIdNumber++;
            newCustomerId = `C${nextIdNumber.toString().padStart(3, '0')}`;
        }
        
        return newCustomerId;
    }
    
    
});

