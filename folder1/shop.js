// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search');
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productCards = document.querySelectorAll('.product-card');
    const shopGrid = document.querySelector('.shop-grid');

    // Toggle search container
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target) && !searchIcon.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        currentSearchTerm = searchTerm;
        currentPage = 1;
        
        applyFiltersAndDisplay();
    }

    // Search on button click
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search (optional - remove if you want search only on button click)
    searchInput.addEventListener('input', function() {
        currentSearchTerm = searchInput.value.toLowerCase().trim();
        currentPage = 1;
        applyFiltersAndDisplay();
    });

    // Cart functionality
    let cart = [];
    const cartIcon = document.querySelector('.cart');
    const cartCount = document.querySelector('.cart-count');
    
    // Create cart sidebar HTML
    function createCartSidebar() {
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="cart-close">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="cart-total-amount">$0.00</span>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);
        
        // Create overlay
        const cartOverlay = document.createElement('div');
        cartOverlay.className = 'cart-overlay';
        document.body.appendChild(cartOverlay);
        
        return { cartSidebar, cartOverlay };
    }
    
    const { cartSidebar, cartOverlay } = createCartSidebar();
    const cartItemsContainer = cartSidebar.querySelector('.cart-items');
    const cartCloseBtn = cartSidebar.querySelector('.cart-close');
    const cartTotalAmount = cartSidebar.querySelector('.cart-total-amount');
    
    // Toggle cart sidebar
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    });
    
    // Close cart sidebar
    cartCloseBtn.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // Add to cart function
    function addToCart(productName, productPrice, quantity = 1) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: quantity
            });
        }
        
        updateCart();
        showNotification(`${productName} added to cart!`);
    }
    
    // Remove from cart
    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
    }
    
    // Update quantity
    function updateQuantity(productName, change) {
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productName);
            } else {
                updateCart();
            }
        }
    }
    
    // Update cart display
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animate cart count
        cartCount.classList.add('bump');
        setTimeout(() => cartCount.classList.remove('bump'), 300);
        
        // Update cart items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="bi bi-bag-x"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotalAmount.textContent = '$0.00';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="./assets/images/${getProductImage(item.name)}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="window.updateCartItem('${item.name}', -1)">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="window.updateCartItem('${item.name}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.removeCartItem('${item.name}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
            
            // Calculate total
            const total = cart.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('$', '').replace(',', ''));
                return sum + (price * item.quantity);
            }, 0);
            cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Helper function to get product image
    function getProductImage(productName) {
        const imageMap = {
            'Creed Aventus Cologne': 'creed Aventus Cologne.webp',
            'GIO Giorgio Armani': 'GIO Giorgio Armani.webp',
            'Harmes H24 EDT': 'Hermes H24 EDT.webp',
            'JPG Le Male Le Parfum': 'JPG Le Male Le Parfum.png',
            'Stronger With You Absolutely': 'Stronger With You Absolutely.webp',
            'Versace Pour Homme': 'Versace Pour Homme.webp',
            'Dior Sauvage Elixir': 'Saugave Elixir.avif',
            'LV Imagination': 'LV Imagination.webp',
            'La Male Elixir Parfum': 'La Male Elixir Parfum.webp',
            'Valentino Eau de Parfum': 'Valentino Eau de Parfum.webp',
            'Versace Dylan Blue': 'Versace DylanBlue.webp',
            'Versace Eros Najim Parfum': 'Versace Eros Najim Parfum.webp'
        };
        return imageMap[productName] || 'placeholder.webp';
    }
    
    // Add to cart button event listeners
    const addToCartButtons = document.querySelectorAll('.order-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            addToCart(productName, productPrice, 1);
        });
    });
    
    // Make functions globally accessible
    window.updateCartItem = function(productName, change) {
        updateQuantity(productName, change);
    };
    
    window.removeCartItem = function(productName) {
        removeFromCart(productName);
    };
    
    // Show products per page functionality
    const showSelect = document.querySelector('.show select');
    let currentPage = 1;
    let itemsPerPage = 12;
    let currentFilter = 'all';
    let currentSearchTerm = '';
    
    showSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        applyFiltersAndDisplay();
        showNotification(`Showing ${itemsPerPage} products per page`);
    });
    
    function applyFiltersAndDisplay() {
        // Get visible products based on current filter and search
        const visibleProducts = Array.from(productCards).filter(card => {
            // Check category filter
            if (currentFilter !== 'all') {
                const cardCategories = card.getAttribute('data-category') || '';
                if (!cardCategories.includes(currentFilter)) {
                    return false;
                }
            }
            
            // Check search term
            if (currentSearchTerm) {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (!productName.includes(currentSearchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Hide all products first
        productCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show only products for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        visibleProducts.slice(startIndex, endIndex).forEach(card => {
            card.style.display = 'block';
        });

        // Show/hide no results message
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        if (visibleProducts.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = '<i class="bi bi-search"></i><p>No perfumes found matching your search.</p>';
            shopGrid.appendChild(noResultsDiv);
        }

        
        // Update pagination
        updatePagination(visibleProducts.length);
    }
    
    function updatePagination(totalVisible) {
        // Remove existing pagination if any
        const existingPagination = document.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.remove();
        }
        
        const totalPages = Math.ceil(totalVisible / itemsPerPage);
        
        if (totalPages > 1) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination';
            
            // Previous button
            const prevBtn = document.createElement('a');
            prevBtn.href = '#';
            prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    applyFiltersAndDisplay();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            pagination.appendChild(prevBtn);
            
            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.textContent = i;
                if (i === currentPage) {
                    pageLink.classList.add('active');
                }
                pageLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentPage = i;
                    applyFiltersAndDisplay();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                pagination.appendChild(pageLink);
            }
            
            // Next button
            const nextBtn = document.createElement('a');
            nextBtn.href = '#';
            nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    applyFiltersAndDisplay();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            pagination.appendChild(nextBtn);
            
            // Append pagination after shop-grid
            const shopGrid = document.querySelector('.shop-grid');
            shopGrid.parentNode.insertBefore(pagination, shopGrid.nextSibling);
        }
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort select');
    let originalOrder = Array.from(productCards);
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const shopGrid = document.querySelector('.shop-grid');
        
        // Remove existing products from grid
        productCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Sort products based on selection
        let sortedCards = [...productCards];
        
        switch(sortValue) {
            case 'Price: Low to High':
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', '').replace(',', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', '').replace(',', ''));
                    return priceA - priceB;
                });
                break;
                
            case 'Price: High to Low':
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', '').replace(',', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', '').replace(',', ''));
                    return priceB - priceA;
                });
                break;
                
            case 'Newest':
                // Reverse the original order (assuming original is featured/newest first)
                sortedCards = [...productCards].reverse();
                break;
                
            case 'Featured':
            default:
                // Return to original order
                sortedCards = [...originalOrder];
                break;
        }
        
        // Re-append sorted products
        sortedCards.forEach(card => {
            shopGrid.appendChild(card);
            card.style.display = 'block';
        });
        
        // Show notification
        showNotification(`Products sorted by: ${sortValue}`);
    });

    // Rating functionality
    const starContainers = document.querySelectorAll('.stars');
    
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const ratingText = container.querySelector('.rating-text');
        let currentRating = Math.round(parseFloat(ratingText.textContent.replace('(', '').replace(')', '')));
        
        // Set initial star states
        updateStars(stars, currentRating);
        
        // Add click event to each star
        stars.forEach(star => {
            star.addEventListener('click', function(e) {
                e.preventDefault();
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Update rating (in real app, this would send to server)
                currentRating = rating;
                updateStars(stars, currentRating);
                
                // Show notification
                const productName = this.closest('.product-card').querySelector('h3').textContent;
                showNotification(`You rated ${productName} ${rating} star${rating > 1 ? 's' : ''}!`);
                
                // Update rating text
                ratingText.textContent = `(${rating}.0)`;
            });
            
            // Hover effect
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(stars, rating);
            });
        });
        
        // Reset stars on mouse leave
        container.addEventListener('mouseleave', function() {
            updateStars(stars, currentRating);
        });
    });
    
    function updateStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.classList.remove('inactive');
            } else {
                star.classList.add('inactive');
                star.classList.remove('active');
            }
        });
    }
    
    function highlightStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f0d78c';
            } else {
                star.style.color = '#e4ddd0';
            }
        });
    }

    // Notification function
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #28a745;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            font-family: "Jost", sans-serif;
            font-size: 14px;
            color: #1c1a17;
            animation: slideInRight 0.4s ease-out;
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }

    // Intersection Observer for card animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        observer.observe(card);
    });

    // Quick View Modal Functionality
    function createQuickViewModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const quickViewModal = document.createElement('div');
        quickViewModal.className = 'quick-view-modal';
        quickViewModal.innerHTML = `
            <button class="modal-close-btn">&times;</button>
            <div class="modal-content">
                <div class="modal-img">
                    <img src="" alt="">
                </div>
                <div class="modal-details">
                    <h2 class="modal-product-name"></h2>
                    <div class="modal-product-stars"></div>
                    <div class="modal-product-price"></div>
                    <p class="description">
                        A captivating scent that blends tradition with modernity. Perfect for any occasion, leaving a memorable trail.
                    </p>
                    <div class="modal-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-value" value="1" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="order-btn">Add to Cart</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        document.body.appendChild(quickViewModal);

        return { quickViewModal, modalOverlay };
    }

    const { quickViewModal, modalOverlay } = createQuickViewModal();
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modalCloseBtn = quickViewModal.querySelector('.modal-close-btn');

    function openModal(productCard) {
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productStarsHTML = productCard.querySelector('.stars').innerHTML;
        const productImageSrc = productCard.querySelector('.product-img img').src;

        quickViewModal.querySelector('.modal-product-name').textContent = productName;
        quickViewModal.querySelector('.modal-product-price').textContent = productPrice;
        quickViewModal.querySelector('.modal-product-stars').innerHTML = productStarsHTML;
        quickViewModal.querySelector('.modal-img img').src = productImageSrc;
        quickViewModal.querySelector('.modal-img img').alt = productName;

        // Handle quantity controls in modal
        const quantityInput = quickViewModal.querySelector('.modal-quantity .quantity-value');
        const minusBtn = quickViewModal.querySelector('.modal-quantity .minus');
        const plusBtn = quickViewModal.querySelector('.modal-quantity .plus');

        quantityInput.value = 1; // Reset quantity

        minusBtn.onclick = () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        };
        plusBtn.onclick = () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        };

        // Handle add to cart from modal
        const modalOrderBtn = quickViewModal.querySelector('.order-btn');
        const newModalOrderBtn = modalOrderBtn.cloneNode(true);
        modalOrderBtn.parentNode.replaceChild(newModalOrderBtn, modalOrderBtn);

        newModalOrderBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(productName, productPrice, quantity);
            closeModal();
        });

        quickViewModal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        quickViewModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            openModal(productCard);
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
});
