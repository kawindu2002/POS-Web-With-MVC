
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

});


// ===========================================================================================================================


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
