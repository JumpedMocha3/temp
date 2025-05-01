// js/cart.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get DOM elements
    const cartModal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const whatsappCheckout = document.getElementById('whatsapp-checkout');

    // Function to update cart count in header
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count, .carts-products-counter');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    // Function to show cart modal
    function openCartModal() {
        cartModal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }

    // Function to close cart modal
    function closeCartModal() {
        cartModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Function to update cart display
    function updateCartDisplay() {
        // Update cart count
        updateCartCount();
        
        // Update cart items display
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.innerHTML = '<p id="empty-cart-message">سلة المشتريات فارغة</p>';
            if (cartTotal) cartTotal.textContent = '0';
        } else {
            emptyCartMessage.style.display = 'none';
            
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price} ر.س</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-quantity">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                                <button class="quantity-btn increase-quantity">+</button>
                                <button class="remove-item">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = itemsHTML;
            if (cartTotal) cartTotal.textContent = total;
            
            // Add event listeners to cart items
            addCartItemEventListeners();
        }
        
        // Update WhatsApp link
        updateWhatsAppLink();
    }

    // Function to add event listeners to cart items
    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function(e) {
                const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== itemId);
                }
                
                saveCart();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function(e) {
                const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                
                item.quantity += 1;
                saveCart();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function(e) {
                const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                cart = cart.filter(item => item.id !== itemId);
                saveCart();
                updateCartDisplay();
            });
        });
    }

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update WhatsApp checkout link
    function updateWhatsAppLink() {
        if (!whatsappCheckout) return;
        
        if (cart.length === 0) {
            whatsappCheckout.removeAttribute('href');
            return;
        }
        
        let message = 'مرحباً، أريد طلب المنتجات التالية:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `- ${item.name} (${item.quantity} × ${item.price} ر.س) = ${itemTotal} ر.س\n`;
        });
        
        message += `\nالإجمالي: ${total} ر.س\n\n`;
        message += 'الاسم: \n';
        message += 'العنوان: \n';
        message += 'رقم الجوال: \n\n';
        message += 'شكراً لكم!';
        
        const encodedMessage = encodeURIComponent(message);
        whatsappCheckout.href = `https://wa.me/966123456789?text=${encodedMessage}`;
        
        // Ensure WhatsApp link opens in new tab
        whatsappCheckout.target = '_blank';
    }

    // Function to show "added to cart" message
    function showAddedToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'cart-notification';
        message.textContent = `تمت إضافة ${productName} إلى السلة`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 2000);
    }

    // Add event listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCartModal);
    }

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartCount();
            showAddedToCartMessage(name);
        }
    });

    // Initialize cart display
    updateCartCount();
    updateWhatsAppLink();
});
