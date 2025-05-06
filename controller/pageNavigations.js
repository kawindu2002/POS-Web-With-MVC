// Run this code only after the HTML page is fully loaded
$(document).ready(function () {

    // Select all nav links that have a 'data-target' attribute
    const $navLinks = $('.nav-link[data-target]');

    // Select all card buttons that have a 'data-target' attribute
    const $cardButtons = $('.card-button[data-target]');

    // Select all sections of the page
    const $pageSections = $('.page-section');

    // This is the function to switch between pages
    function showPage(targetId) {
        // Hide all sections
        $pageSections.removeClass('active');

        // Show only the section that matches the clicked link's target
        const $targetSection = $('#' + targetId);
        if ($targetSection.length) {
            $targetSection.addClass('active');
        }

        // Highlight the active navigation link
        $navLinks.each(function () {
            const $link = $(this);
            if ($link.data('target') === targetId) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });

        // Call specific functions depending on which page is shown
        if (targetId === 'order-page') {
            loadCustomersForOrder();  // Load customers for placing orders
            loadAvailableItems();     // Load items to choose from
            resetOrderForm();         // Clear old form data
        } else if (targetId === 'customer-page') {
            loadCustomersTable();     // Load all customers into a table
            resetCustomerForm();      // Clear the customer form
        } else if (targetId === 'item-page') {
            loadItemsTable();         // Load all items into a table
            resetItemForm();          // Clear the item form
        } else if (targetId === 'order-history-page') {
            loadOrderHistoryTable();  // Load previous orders
        }
    }

    // When a nav link is clicked, stop default behavior and show the linked page
    $navLinks.on('click', function (event) {
        event.preventDefault();
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    // When a card button is clicked, show the linked page
    $cardButtons.on('click', function () {
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    // --- Initial Page Load Setup ---

    // Find the section that was already marked as active
    const $initialActivePage = $('.page-section.active');

    if ($initialActivePage.length > 0) {
        const initialTargetId = $initialActivePage.attr('id');

        // Highlight the correct nav link when page loads
        $navLinks.each(function () {
            const $link = $(this);
            if ($link.data('target') === initialTargetId) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });

        // load correct data based on initial page
        if (initialTargetId === 'customer-page') {
            loadCustomersTable();
        } else if (initialTargetId === 'item-page') {
            loadItemsTable();
        } else if (initialTargetId === 'order-page') {
            loadCustomersForOrder();
            loadAvailableItems();
            resetOrderForm();
        } else if (initialTargetId === 'order-history-page') {
            loadOrderHistoryTable();
        }

    } else {
        //If no active section is set, show the homepage
        showPage('homepage');
    }

});
