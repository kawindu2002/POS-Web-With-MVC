$(document).ready(function () {
    const $navLinks = $('.nav-link[data-target]');
    const $cardButtons = $('.card-button[data-target]');
    const $pageSections = $('.page-section');

    // --- Page Navigation ---
    function showPage(targetId) {
        $pageSections.removeClass('active');

        const $targetSection = $('#' + targetId);
        if ($targetSection.length) {
            $targetSection.addClass('active');
        }

        $navLinks.each(function () {
            const $link = $(this);
            if ($link.data('target') === targetId) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });

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

    // 🟢 Link and card click behavior
    $navLinks.on('click', function (event) {
        event.preventDefault();
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    $cardButtons.on('click', function () {
        const targetId = $(this).data('target');
        showPage(targetId);
    });

    // --- Initial Page Load ---
    const $initialActivePage = $('.page-section.active');

    if ($initialActivePage.length > 0) {
        const initialTargetId = $initialActivePage.attr('id');

        $navLinks.each(function () {
            const $link = $(this);
            if ($link.data('target') === initialTargetId) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });

        // 🟢 Call correct function on page load
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
        showPage('homepage');
    }
});