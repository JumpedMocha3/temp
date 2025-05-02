// script.js
let products = []; // This will hold our products when loaded
let cart = JSON.parse(localStorage.getItem('honeyCart')) || [];

// DOM Elements
const cartCountElement = document.getElementById('cart-count');
const featuredProductsContainer = document.getElementById('featured-products');
const productsGridContainer = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkoutModal');
const customerForm = document.getElementById('customerForm');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// WhatsApp contact information
const whatsappNumber = "201097575383";
const whatsappMessage = "مرحباً، أرغب في الاستفسار عن منتجات العسل لديكم";

// Function to show products loading error
function showProductsError() {
    const errorHTML = `
        <div class="alert alert-danger text-center">
            <h3>⚠️ لا يمكن عرض المنتجات حالياً</h3>
            <p class="mb-3">لا يمكننا تحميل المنتجات في الوقت الحالي. يرجى التواصل معنا عبر واتساب للمساعدة.</p>
            <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}" 
               class="btn btn-success">
               <i class="fab fa-whatsapp"></i> تواصل معنا عبر واتساب
            </a>
        </div>
    `;
    
    if (featuredProductsContainer) featuredProductsContainer.innerHTML = errorHTML;
    if (productsGridContainer) productsGridContainer.innerHTML = errorHTML;
}

// Function to load products
function loadProducts(callback) {
    if (products.length > 0) {
        if (callback) callback();
        return;
    }

    fetch('products.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            products = data;
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showProductsError();
        });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load products and initialize the rest
    loadProducts(function() {
        updateCartCount();
        
        // Load featured products on index.html
        if (featuredProductsContainer) {
            loadFeaturedProducts();
        }
        
        // Load all products on products.html
        if (productsGridContainer) {
            loadAllProducts();
            setupFilterAndSort();
        }
        
        // Load cart items on cart.html
        if (cartItemsContainer) {
            if (cart.length === 0) {
                showEmptyCart();
            } else {
                loadCartItems();
            }
            updateCartTotals();
        }

        // Initialize search functionality
        if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleSearch();
            });
        }
        
        // Initialize modal functionality
        if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
        if (customerForm) customerForm.addEventListener('submit', processOrder);
    });
});

// Search functionality
function handleSearch() {
    if (products.length === 0) {
        showProductsError();
        return;
    }

    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) return;
    
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.productId.toLowerCase().includes(searchTerm)
    );
    
    if (productsGridContainer) {
        loadAllProducts(filteredProducts);
    } else if (featuredProductsContainer) {
        featuredProductsContainer.innerHTML = '';
        filteredProducts.slice(0, 4).forEach(product => {
            const productElement = createProductElement(product);
            featuredProductsContainer.appendChild(productElement);
        });
    }
}

// Load featured products (first 4) on homepage
function loadFeaturedProducts() {
    if (products.length === 0) {
        showProductsError();
        return;
    }

    const featuredProducts = products.slice(0, 4);
    featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productElement = createProductElement(product);
        featuredProductsContainer.appendChild(productElement);
    });
}

// Load all products on shop page
function loadAllProducts(filteredProducts = products) {
    if (products.length === 0) {
        showProductsError();
        return;
    }

    productsGridContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGridContainer.innerHTML = '<div class="alert alert-info text-center">لا توجد منتجات مطابقة لبحثك.</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productElement = createProductElement(product);
        productsGridContainer.appendChild(productElement);
    });
}

// Create product HTML element
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'col-md-3 col-6 mb-4';
    productElement.dataset.id = product.id;
    productElement.dataset.category = product.category;
    productElement.dataset.subcategory = product.subcategory;
    
    productElement.innerHTML = `
        <div class="card product-card h-100">
            <img src="${product.image}" class="card-img-top product-image" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title product-title">${product.title}</h5>
                <p class="text-muted product-description">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="product-price">${product.price.toLocaleString('ar-EG')} ر.س</span>
                    <button class="btn btn-sm btn-primary add-to-cart">أضف للسلة</button>
                </div>
            </div>
        </div>
    `;
    
    // Add to cart functionality
    productElement.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
    
    return productElement;
}

// Add product to cart
function addToCart(productId) {
    if (products.length === 0) {
        showProductsError();
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            productId: product.productId,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showAddedToCartMessage(product.title);
}

// Show notification when item is added to cart
function showAddedToCartMessage(productTitle) {
    const notification = document.createElement('div');
    notification.className = 'notification alert alert-success';
    notification.textContent = `${productTitle} تمت إضافته للسلة!`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = count;
}

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('honeyCart', JSON.stringify(cart));
    updateCartCount();
    if (cartItemsContainer) loadCartItems();
}

// Load cart items on cart page
function loadCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('tr');
        cartItemElement.dataset.id = item.id;
        
        cartItemElement.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.title}" width="60" class="me-3">
                    <div>
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">${item.productId}</small>
                    </div>
                </div>
            </td>
            <td>${item.price.toLocaleString('ar-EG')} ر.س</td>
            <td>
                <div class="input-group quantity-selector" style="width: 100px;">
                    <button class="btn btn-outline-secondary minus">-</button>
                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}">
                    <button class="btn btn-outline-secondary plus">+</button>
                </div>
            </td>
            <td>${(item.price * item.quantity).toLocaleString('ar-EG')} ر.س</td>
            <td><button class="btn btn-danger btn-sm remove-item"><i class="fas fa-trash"></i></button></td>
        `;
        
        // Add event listeners
        cartItemElement.querySelector('.minus').addEventListener('click', (e) => {
            e.preventDefault();
            updateQuantity(item.id, -1);
        });
        
        cartItemElement.querySelector('.plus').addEventListener('click', (e) => {
            e.preventDefault();
            updateQuantity(item.id, 1);
        });
        
        cartItemElement.querySelector('.quantity-input').addEventListener('change', (e) => {
            e.preventDefault();
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) updateQuantity(item.id, 0, newQuantity);
        });
        
        cartItemElement.querySelector('.remove-item').addEventListener('click', (e) => {
            e.preventDefault();
            removeItem(item.id);
        });
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    updateCartTotals();
}

// Update item quantity in cart
function updateQuantity(productId, change, newQuantity = null) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (newQuantity !== null) {
        item.quantity = newQuantity;
    } else {
        item.quantity += change;
    }

    if (item.quantity <= 0) {
        removeItem(productId);
        return;
    }

    updateCart();
    
    const quantityInput = document.querySelector(`.cart-item[data-id="${productId}"] .quantity-input`);
    if (quantityInput) quantityInput.value = item.quantity;
    
    updateCartTotals();
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('honeyCart', JSON.stringify(cart));
    
    const itemElement = document.querySelector(`tr[data-id="${productId}"]`);
    if (itemElement) {
        itemElement.classList.add('table-danger');
        setTimeout(() => {
            itemElement.remove();
            if (cart.length === 0) showEmptyCart();
            updateCartTotals();
        }, 300);
    }
}

function showEmptyCart() {
    cartItemsContainer.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-4">
                <p class="mb-3">سلة التسوق فارغة</p>
                <a href="products.html" class="btn btn-primary">متابعة التسوق</a>
            </td>
        </tr>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (subtotalElement && totalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('ar-EG') + ' ر.س';
        totalElement.textContent = subtotal.toLocaleString('ar-EG') + ' ر.س';
    }
    
    updateCartCount();
}

// Setup filter and sort functionality
function setupFilterAndSort() {
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSortProducts);
    if (sortBy) sortBy.addEventListener('change', filterAndSortProducts);
}

// Filter and sort products based on selections
function filterAndSortProducts() {
    if (products.length === 0) {
        showProductsError();
        return;
    }

    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
            p.category === category || p.subcategory === category
        );
    }
    
    // Apply sorting
    switch (sortBy) {
        case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
        case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
        case 'newest': filteredProducts.sort((a, b) => b.id - a.id); break;
    }
    
    loadAllProducts(filteredProducts);
}

// Open checkout modal
function openCheckoutModal() {
    if (checkoutModal) {
        const modal = new bootstrap.Modal(checkoutModal);
        modal.show();
    }
}

// Process order via WhatsApp
function processOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Validation
    if (!/^[0-9]{11}$/.test(phone)) {
        alert('يرجى إدخال رقم هاتف صحيح (11 رقم فقط)');
        document.getElementById('phone').focus();
        return;
    }
    
    if (!name || !address) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }

    // Build WhatsApp message
    let message = `*طلب جديد من متجر العسل*\n\n`;
    message += `*اسم العميل:* ${name}\n`;
    message += `*الهاتف:* ${phone}\n`;
    message += `*العنوان:* ${address}\n\n`;
    message += `*المنتجات:*\n`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.title} (${item.productId})\n`;
        message += `  الكمية: ${item.quantity}\n`;
        message += `  السعر: ${item.price.toLocaleString('ar-EG')} ر.س\n`;
        message += `  الإجمالي: ${itemTotal.toLocaleString('ar-EG')} ر.س\n\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `*المجموع:* ${subtotal.toLocaleString('ar-EG')} ر.س\n\n`;
    message += `شكراً لطلبك! سنتواصل معك لتأكيد الطلب.`;

    // Clear cart
    cart = [];
    updateCart();
    localStorage.setItem('honeyCart', JSON.stringify(cart));
    
    // Update UI
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p class="mb-3">تم تقديم طلبك بنجاح!</p>
                    <a href="products.html" class="btn btn-primary">متابعة التسوق</a>
                </td>
            </tr>
        `;
    }
    updateCartTotals();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(checkoutModal);
    modal.hide();

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message)
        .replace(/\n/g, '%0A')
        .replace(/\*/g, '%2A');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}
