// js/cart.js
document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartModal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const whatsappCheckout = document.getElementById('whatsapp-checkout');
    
    // Open cart modal
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            updateCart();
        });
    }
    
    // Close cart modal
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            cartModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image') || 'images/default-product.jpg';
            
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
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            showAddedToCartMessage(name);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        
        const cartCountElements = document.querySelectorAll('.carts-products-counter');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
        
        // Update cart items
        if (cartItemsContainer) {
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartItemsContainer.innerHTML = '<p id="empty-cart-message">سلة المشتريات فارغة</p>';
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
                                    <button class="remove-item" style="margin-right: 10px; color: red; background: none; border: none; cursor: pointer;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                cartItemsContainer.innerHTML = itemsHTML;
                if (cartTotal) cartTotal.textContent = total;
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                        const item = cart.find(item => item.id === itemId);
                        
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCart();
                        }
                    });
                });
                
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                        const item = cart.find(item => item.id === itemId);
                        
                        item.quantity += 1;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
                });
                
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', (e) => {
                        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                        const item = cart.find(item => item.id === itemId);
                        const newQuantity = parseInt(e.target.value);
                        
                        if (newQuantity > 0) {
                            item.quantity = newQuantity;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCart();
                        } else {
                            e.target.value = item.quantity;
                        }
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
                        cart = cart.filter(item => item.id !== itemId);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
                });
            }
            
            // Update WhatsApp checkout link
            updateWhatsAppLink();
        }
    }
    
    // Update WhatsApp checkout link
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
    }
    
    // Show "added to cart" message
    function showAddedToCartMessage(productName) {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.left = '20px';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '15px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '10000';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        message.textContent = `تمت إضافة ${productName} إلى السلة`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 500);
        }, 2000);
    }
    
    // Initialize cart
    updateCart();
});
