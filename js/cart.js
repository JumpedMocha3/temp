// js/cart.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const whatsappCheckout = document.getElementById('whatsapp-checkout');
    
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Event Listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartModal);
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
            
            addToCart(id, name, price, image);
        }
    });
    
    // Cart Functions
    function openCart() {
        cartModal.style.display = 'block';
        cartOverlay.style.display = 'block';
        document.body.classList.add('no-scroll');
        updateCartDisplay();
    }
    
    function closeCartModal() {
        cartModal.style.display = 'none';
        cartOverlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
    
    function addToCart(id, name, price, image) {
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
        showCartNotification(name);
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.classList.toggle('active', totalItems > 0);
        });
    }
    
    function updateCartDisplay() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            cartTotal.textContent = '0';
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
            cartTotal.textContent = total;
            
            // Add event listeners to cart items
            addCartItemEventListeners();
        }
        
        updateWhatsAppLink();
    }
    
    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                updateQuantity(itemId, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                updateQuantity(itemId, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                removeItem(itemId);
            });
        });
    }
    
    function updateQuantity(itemId, change) {
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity < 1) {
                cart = cart.filter(item => item.id !== itemId);
            }
            
            saveCart();
            updateCartDisplay();
        }
    }
    
    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartDisplay();
    }
    
    function updateWhatsAppLink() {
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
        
        whatsappCheckout.href = `https://wa.me/966123456789?text=${encodeURIComponent(message)}`;
        whatsappCheckout.target = '_blank';
    }
    
    function showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>تمت إضافة ${productName} إلى السلة</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Initialize cart display
    updateCartDisplay();
});
