        document.addEventListener('DOMContentLoaded', () => {

            // --- STATE MANAGEMENT ---
            const state = {
                products: [],
                cart: [],
                categories: ['All', 'Electronics', 'Apparel', 'Books', 'Home Goods'],
                activeCategory: 'All',
            };

            // --- DOM ELEMENTS ---
            const productGrid = document.getElementById('product-grid');
            const flashDealGrid = document.getElementById('flash-deal-grid');
            const categoryFilters = document.getElementById('category-filters');
            const countdownTimer = document.getElementById('countdown-timer');
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartOverlay = document.getElementById('cart-overlay');
            const openCartBtn = document.getElementById('open-cart-btn');
            const closeCartBtn = document.getElementById('close-cart-btn');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartSubtotalEl = document.getElementById('cart-subtotal');
            const cartCountBadge = document.getElementById('cart-count-badge');
            const emptyCartMessage = document.getElementById('empty-cart-message');
            const checkoutBtn = document.getElementById('checkout-btn');
            const toast = document.getElementById('toast');
            const flashDealsSection = document.getElementById('flash-deals');
            const productsSection = document.getElementById('products');


            // --- MOCK DATA ---
            const fetchProducts = () => {
                state.products = [
                    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 99.99, salePrice: 79.99, imageUrl: "https://placehold.co/400x400/3b82f6/ffffff?text=Headphones", isFlashSale: true },
                    { id: 2, name: "Smartwatch Series 8", category: "Electronics", price: 399.00, salePrice: null, imageUrl: "https://placehold.co/400x400/10b981/ffffff?text=Smartwatch", isFlashSale: false },
                    { id: 3, name: "Classic Cotton T-Shirt", category: "Apparel", price: 25.00, salePrice: 19.99, imageUrl: "https://placehold.co/400x400/f59e0b/ffffff?text=T-Shirt", isFlashSale: false },
                    { id: 4, name: "The Midnight Library", category: "Books", price: 15.99, salePrice: null, imageUrl: "https://placehold.co/400x400/8b5cf6/ffffff?text=Book", isFlashSale: false },
                    { id: 5, name: "Ceramic Coffee Mug", category: "Home Goods", price: 12.50, salePrice: null, imageUrl: "https://placehold.co/400x400/ec4899/ffffff?text=Mug", isFlashSale: false },
                    { id: 6, name: "Bluetooth Speaker", category: "Electronics", price: 49.99, salePrice: 39.99, imageUrl: "https://placehold.co/400x400/6366f1/ffffff?text=Speaker", isFlashSale: true },
                    { id: 7, name: "Denim Jacket", category: "Apparel", price: 89.99, salePrice: null, imageUrl: "https://placehold.co/400x400/22d3ee/ffffff?text=Jacket", isFlashSale: false },
                    { id: 8, name: "A Brief History of Time", category: "Books", price: 18.00, salePrice: 14.50, imageUrl: "https://placehold.co/400x400/a855f7/ffffff?text=Science+Book", isFlashSale: true },
                    { id: 9, name: "Pro Gaming Mouse", category: "Electronics", price: 60.00, salePrice: 44.99, imageUrl: "https://placehold.co/400x400/ef4444/ffffff?text=Gaming+Mouse", isFlashSale: true },
                ];
            };

            // --- RENDER FUNCTIONS ---
            
            const createProductCardHTML = (product) => {
                const isSale = product.salePrice !== null;
                return `
                    <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div class="relative">
                            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-56 object-cover">
                            ${isSale ? `<span class="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">SALE</span>` : ''}
                            ${product.isFlashSale ? `<span class="absolute top-4 ${isSale ? 'left-20' : 'left-4'} bg-yellow-400 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">FLASH DEAL</span>` : ''}
                        </div>
                        <div class="p-6 flex-grow flex flex-col">
                            <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                            <p class="text-sm text-slate-500 mb-4">${product.category}</p>
                            <div class="mt-auto">
                                <div class="flex items-baseline mb-4">
                                    <span class="text-2xl font-bold text-indigo-600">${isSale ? `$${product.salePrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}</span>
                                    ${isSale ? `<span class="ml-2 text-slate-400 line-through">$${product.price.toFixed(2)}</span>` : ''}
                                </div>
                                <button data-product-id="${product.id}" class="add-to-cart-btn w-full bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition flex items-center justify-center">
                                    <i data-feather="shopping-cart" class="h-5 w-5 mr-2"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            };

            const renderFlashDeals = () => {
                flashDealGrid.innerHTML = '';
                const flashProducts = state.products.filter(p => p.isFlashSale);

                flashProducts.forEach(product => {
                    const card = createProductCardHTML(product);
                    flashDealGrid.insertAdjacentHTML('beforeend', card);
                });
            };

            const renderProducts = () => {
                productGrid.innerHTML = '';
                const filteredProducts = state.activeCategory === 'All'
                    ? state.products
                    : state.products.filter(p => p.category === state.activeCategory);

                if (filteredProducts.length === 0) {
                    productGrid.innerHTML = `<p class="text-center text-slate-500 col-span-full">No products found in this category.</p>`;
                    return;
                }

                filteredProducts.forEach(product => {
                    const card = createProductCardHTML(product);
                    productGrid.insertAdjacentHTML('beforeend', card);
                });
                feather.replace();
            };

            const renderCategories = () => {
                categoryFilters.innerHTML = '';
                state.categories.forEach(category => {
                    const isActive = category === state.activeCategory;
                    const buttonClasses = isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100';
                    const button = `
                        <button class="category-btn px-4 py-2 rounded-full font-semibold text-sm transition shadow-sm ${buttonClasses}" data-category="${category}">
                            ${category}
                        </button>
                    `;
                    categoryFilters.insertAdjacentHTML('beforeend', button);
                });
            };
            
            const renderCart = () => {
                cartItemsContainer.innerHTML = '';
                
                if (state.cart.length === 0) {
                    emptyCartMessage.classList.remove('hidden');
                    checkoutBtn.disabled = true;
                } else {
                    emptyCartMessage.classList.add('hidden');
                    checkoutBtn.disabled = false;
                    state.cart.forEach(item => {
                        const cartItemHTML = `
                            <div class="flex items-center justify-between mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0">
                                <div class="flex items-center gap-4">
                                    <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 rounded-md object-cover">
                                    <div>
                                        <p class="font-semibold">${item.name}</p>
                                        <p class="text-sm text-slate-500">$${(item.salePrice || item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center border rounded-md">
                                        <button data-id="${item.id}" class="quantity-change-btn dec-btn px-2 py-1 text-slate-600 hover:bg-slate-100">-</button>
                                        <span class="px-3 text-sm">${item.quantity}</span>
                                        <button data-id="${item.id}" class="quantity-change-btn inc-btn px-2 py-1 text-slate-600 hover:bg-slate-100">+</button>
                                    </div>
                                    <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700">
                                        <i data-feather="trash-2" class="h-5 w-5"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
                    });
                }
                
                updateCartSubtotal();
                updateCartCountBadge();
                feather.replace();
            };

            // --- UPDATE FUNCTIONS ---

            const updateCartSubtotal = () => {
                const subtotal = state.cart.reduce((acc, item) => {
                    return acc + (item.salePrice || item.price) * item.quantity;
                }, 0);
                cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            };

            const updateCartCountBadge = () => {
                const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
                if (totalItems > 0) {
                    cartCountBadge.textContent = totalItems;
                    cartCountBadge.classList.remove('hidden');
                } else {
                    cartCountBadge.classList.add('hidden');
                }
            };

            // --- CART LOGIC ---
            
            const addToCart = (productId) => {
                const product = state.products.find(p => p.id === productId);
                if (!product) return;

                const existingItem = state.cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    state.cart.push({ ...product, quantity: 1 });
                }
                renderCart();
            };
            
            const removeFromCart = (productId) => {
                state.cart = state.cart.filter(item => item.id !== productId);
                renderCart();
            };
            
            const changeQuantity = (productId, change) => {
                const item = state.cart.find(item => item.id === productId);
                if (item) {
                    item.quantity += change;
                    if (item.quantity <= 0) {
                        removeFromCart(productId);
                    } else {
                        renderCart();
                    }
                }
            };
            
            const clearCart = () => {
                state.cart = [];
                renderCart();
            };

            const handleCheckout = () => {
                if (state.cart.length === 0) return;

                // --- WhatsApp Integration ---
                // IMPORTANT: Replace with your WhatsApp number (including country code, without '+')
                const phoneNumber = "+8801310227710"; 
                
                let message = "Hello! I'd like to place an order:\n\n";
                
                state.cart.forEach(item => {
                    const itemPrice = (item.salePrice || item.price).toFixed(2);
                    message += `- ${item.name} (x${item.quantity}) - $${itemPrice} each\n`;
                });

                const subtotal = state.cart.reduce((acc, item) => {
                    return acc + (item.salePrice || item.price) * item.quantity;
                }, 0);

                message += `\n*Total: $${subtotal.toFixed(2)}*`;

                // Create the WhatsApp URL
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                
                // Open the URL in a new tab
                window.open(whatsappUrl, '_blank');
                // --- End of WhatsApp Integration ---

                // Provide feedback to the user
                showToast("Redirecting to WhatsApp to place your order!");
                clearCart();
                toggleCart(false);
            };
            
            const showToast = (message) => {
                toast.textContent = message;
                toast.classList.remove('opacity-0', '-translate-y-10');
                toast.classList.add('opacity-100', 'translate-y-0');
                setTimeout(() => {
                    toast.classList.remove('opacity-100', 'translate-y-0');
                    toast.classList.add('opacity-0', '-translate-y-10');
                }, 3000);
            };

            // --- UI INTERACTIONS ---

            const toggleCart = (show) => {
                if (show) {
                    cartOverlay.classList.remove('hidden');
                    cartSidebar.classList.remove('translate-x-full');
                } else {
                    cartOverlay.classList.add('hidden');
                    cartSidebar.classList.add('translate-x-full');
                }
            };

            const handleCategoryClick = (e) => {
                const categoryBtn = e.target.closest('.category-btn');
                if (!categoryBtn) return;
                
                state.activeCategory = categoryBtn.dataset.category;
                renderCategories();
                renderProducts();
            };
            
            const handleProductGridClick = (e) => {
                const addToCartBtn = e.target.closest('.add-to-cart-btn');
                if (addToCartBtn) {
                    const productId = parseInt(addToCartBtn.dataset.productId);
                    addToCart(productId);
                    showToast(`${state.products.find(p=>p.id === productId).name} added to cart!`);
                }
            };

            const handleFlashDealGridClick = (e) => {
                const addToCartBtn = e.target.closest('.add-to-cart-btn');
                if (addToCartBtn) {
                    const productId = parseInt(addToCartBtn.dataset.productId);
                    addToCart(productId);
                    showToast(`${state.products.find(p=>p.id === productId).name} added to cart!`);
                }
            };
            
            const handleCartItemsClick = (e) => {
                const target = e.target.closest('button');
                if(!target) return;
                
                const productId = parseInt(target.dataset.id);

                if(target.classList.contains('remove-from-cart-btn')) {
                    removeFromCart(productId);
                }
                if(target.classList.contains('quantity-change-btn')) {
                    const change = target.classList.contains('inc-btn') ? 1 : -1;
                    changeQuantity(productId, change);
                }
            };

            // --- HERO SLIDER ---
            const startHeroSlider = () => {
                const slides = document.querySelectorAll('.hero-slide');
                if (slides.length === 0) return;
                let currentSlide = 0;
                
                setInterval(() => {
                    slides[currentSlide].classList.remove('opacity-100');
                    slides[currentSlide].classList.add('opacity-0');
                    
                    currentSlide = (currentSlide + 1) % slides.length;
                    
                    slides[currentSlide].classList.remove('opacity-0');
                    slides[currentSlide].classList.add('opacity-100');
                }, 4000); // Change image every 4 seconds
            };

            // --- COUNTDOWN TIMER ---
            const startCountdown = () => {
                const countdownDate = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now

                const interval = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = countdownDate - now;

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    countdownTimer.innerHTML = `
                        <div class="countdown-item text-center p-3 rounded-lg w-20"><div class="text-2xl font-bold">${String(days).padStart(2, '0')}</div><div class="text-xs">Days</div></div>
                        <div class="countdown-item text-center p-3 rounded-lg w-20"><div class="text-2xl font-bold">${String(hours).padStart(2, '0')}</div><div class="text-xs">Hours</div></div>
                        <div class="countdown-item text-center p-3 rounded-lg w-20"><div class="text-2xl font-bold">${String(minutes).padStart(2, '0')}</div><div class="text-xs">Minutes</div></div>
                        <div class="countdown-item text-center p-3 rounded-lg w-20"><div class="text-2xl font-bold">${String(seconds).padStart(2, '0')}</div><div class="text-xs">Seconds</div></div>
                    `;

                    if (distance < 0) {
                        clearInterval(interval);
                        countdownTimer.innerHTML = '<div class="text-xl font-bold">The sale has ended!</div>';
                    }
                }, 1000);
            };

            // --- INITIALIZATION ---
            const init = () => {
                // Set current year in footer
                document.getElementById('current-year').textContent = new Date().getFullYear();

                // Initial data fetch
                fetchProducts();
                
                // Render UI
                renderFlashDeals();
                renderCategories();
                renderProducts();
                renderCart();
                
                // Start features
                startCountdown();
                startHeroSlider();
                feather.replace();

                // Add event listeners
                categoryFilters.addEventListener('click', handleCategoryClick);
                productGrid.addEventListener('click', handleProductGridClick);
                flashDealGrid.addEventListener('click', handleProductGridClick); // Use same handler for consistency
                openCartBtn.addEventListener('click', () => toggleCart(true));
                closeCartBtn.addEventListener('click', () => toggleCart(false));
                cartOverlay.addEventListener('click', () => toggleCart(false));
                cartItemsContainer.addEventListener('click', handleCartItemsClick);
                checkoutBtn.addEventListener('click', handleCheckout);
            };

            // Run the app
            init();
        });