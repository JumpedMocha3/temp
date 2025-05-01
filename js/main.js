// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Initialize dropdown menus for mobile
    document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdown = this.querySelector('.dropdown-menu');
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.mobile-menu-btn')) {
            mainNav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Load cart from localStorage if available
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }
});
