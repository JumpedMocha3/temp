// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.dev3-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Load cart from localStorage if available
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count, .carts-products-counter');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.classList.toggle('d-none', totalItems === 0);
        });
    }
});
