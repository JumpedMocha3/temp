// js/products.js
const products = [
    {
        id: "1",
        title: "عسل سدر أصلي",
        price: 120,
        category: "honey",
        type: "sidr",
        image: "images/products/sidr-honey.jpg",
        description: "عسل سدر طبيعي 100% من جبال السروات"
    },
    {
        id: "2",
        title: "عسل طلح بلدي",
        price: 100,
        category: "honey",
        type: "talh",
        image: "images/products/talh-honey.jpg",
        description: "عسل طلح طبيعي من أشجار الطلح"
    },
    {
        id: "3",
        title: "عسل سمر جبلي",
        price: 150,
        category: "honey",
        type: "samar",
        image: "images/products/samar-honey.jpg",
        description: "عسل سمر جبلي من أعالي الجبال"
    },
    {
        id: "4",
        title: "عسل زهور متنوع",
        price: 80,
        category: "honey",
        type: "flower",
        image: "images/products/flower-honey.jpg",
        description: "عسل زهور متنوع من رحيق أزهار مختلفة"
    },
    {
        id: "5",
        title: "شمع عسل طبيعي",
        price: 50,
        category: "bee-products",
        image: "images/products/bee-wax.jpg",
        description: "شمع عسل طبيعي نقي"
    },
    {
        id: "6",
        title: "حبوب لقاح النحل",
        price: 70,
        category: "bee-products",
        image: "images/products/bee-pollen.jpg",
        description: "حبوب لقاح النحل الغنية بالعناصر الغذائية"
    },
    {
        id: "7",
        title: "خلطة عسل بالحبة السوداء",
        price: 130,
        category: "mixtures",
        image: "images/products/honey-black-seed.jpg",
        description: "خلطة مميزة من عسل السدر مع حبة البركة"
    },
    {
        id: "8",
        title: "عرض عسل سدر + شمع",
        price: 150,
        category: "offers",
        image: "images/products/honey-wax-combo.jpg",
        description: "عرض خاص: عبوة عسل سدر + قطعة شمع عسل"
    }
];

// Function to load products by category
function loadProducts(category = null, type = null) {
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (type) {
        filteredProducts = filteredProducts.filter(product => product.type === type);
    }
    
    let html = '';
    filteredProducts.forEach(product => {
        html += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">${product.price} ر.س</p>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart" 
                        data-id="${product.id}"
                        data-name="${product.title}"
                        data-price="${product.price}"
                        data-image="${product.image}">
                        أضف إلى السلة
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Load featured products on home page
if (document.getElementById('featured-products')) {
    loadProducts();
}

// Load category-specific products
if (window.location.pathname.includes('/categories/')) {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const category = window.location.pathname.split('/').pop().replace('.html', '');
    loadProducts(category, type);
}
