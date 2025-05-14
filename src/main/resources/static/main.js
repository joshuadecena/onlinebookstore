document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const cartBtn = document.getElementById('cartBtn');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authSection = document.getElementById('authSection');
    const bookCatalog = document.getElementById('bookCatalog');
    const cartSection = document.getElementById('cartSection');
    const orderHistorySection = document.getElementById('orderHistorySection');

    const loginSubmit = document.getElementById('loginSubmit');
    const registerSubmit = document.getElementById('registerSubmit');

    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    const booksContainer = document.getElementById('booksContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const orderMessage = document.getElementById('orderMessage');
    const orderHistory = document.getElementById('orderHistory');

    let currentUser = null;
    let cart = [];

    function showLogin() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    function showRegister() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    function showCatalog() {
        authSection.style.display = 'none';
        bookCatalog.style.display = 'block';
        cartSection.style.display = 'none';
        orderHistorySection.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
    }

    function showCart() {
        authSection.style.display = 'none';
        bookCatalog.style.display = 'none';
        cartSection.style.display = 'block';
        orderHistorySection.style.display = 'none';
    }

    function showOrderHistory() {
        authSection.style.display = 'none';
        bookCatalog.style.display = 'none';
        cartSection.style.display = 'none';
        orderHistorySection.style.display = 'block';
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    function renderBooks(books) {
        booksContainer.innerHTML = '';
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'bookCard';
            bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
                <p>${book.description}</p>
                <button data-id="${book.id}">Add to Cart</button>
            `;
            booksContainer.appendChild(bookCard);
        });
    }

    function fetchBooks() {
        fetch('/api/books')
            .then(res => res.json())
            .then(data => {
                renderBooks(data);
                populateCategories(data);
            });
    }

    function populateCategories(books) {
        const categories = new Set(books.map(book => book.category).filter(c => c));
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    function addToCart(bookId) {
        const existingItem = cart.find(item => item.book.id === bookId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            fetch(`/api/books/${bookId}`)
                .then(res => res.json())
                .then(book => {
                    cart.push({ book, quantity: 1 });
                    updateCartCount();
                });
        }
        updateCartCount();
    }

    function renderCart() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cartItem';
            div.innerHTML = `
                <p><strong>${item.book.title}</strong> - Quantity: ${item.quantity}</p>
                <button data-index="${index}">Remove</button>
            `;
            cartItems.appendChild(div);
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        renderCart();
        updateCartCount();
    }

    function checkout() {
        if (cart.length === 0) {
            orderMessage.textContent = 'Cart is empty.';
            return;
        }
        const order = {
            orderItems: cart.map(item => ({
                book: { id: item.book.id },
                quantity: item.quantity
            }))
        };
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(res => {
            if (res.ok) {
                orderMessage.textContent = 'Order placed successfully!';
                cart = [];
                renderCart();
                updateCartCount();
            } else {
                orderMessage.textContent = 'Failed to place order.';
            }
        });
    }

    loginBtn.addEventListener('click', () => {
        showLogin();
        authSection.style.display = 'block';
        bookCatalog.style.display = 'none';
        cartSection.style.display = 'none';
        orderHistorySection.style.display = 'none';
    });

    registerBtn.addEventListener('click', () => {
        showRegister();
        authSection.style.display = 'block';
        bookCatalog.style.display = 'none';
        cartSection.style.display = 'none';
        orderHistorySection.style.display = 'none';
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        authSection.style.display = 'block';
        bookCatalog.style.display = 'none';
        cartSection.style.display = 'none';
        orderHistorySection.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        cart = [];
        updateCartCount();
    });

    loginSubmit.addEventListener('click', () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => {
            if (res.ok) {
                currentUser = username;
                showCatalog();
                fetchBooks();
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        });
    });

    registerSubmit.addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(res => {
            if (res.ok) {
                registerError.textContent = 'Registration successful! Please login.';
                showLogin();
            } else {
                res.text().then(text => {
                    registerError.textContent = text;
                });
            }
        });
    });

    booksContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const bookId = parseInt(e.target.getAttribute('data-id'));
            addToCart(bookId);
        }
    });

    cartBtn.addEventListener('click', () => {
        renderCart();
        showCart();
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        checkout();
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query === '') {
            fetchBooks();
        } else {
            fetch(`/api/books/search?title=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => renderBooks(data));
        }
    });

    categoryFilter.addEventListener('change', () => {
        const category = categoryFilter.value;
        if (category === '') {
            fetchBooks();
        } else {
            fetch(`/api/books/filter?category=${encodeURIComponent(category)}`)
                .then(res => res.json())
                .then(data => renderBooks(data));
        }
    });

    // Function to fetch and render order history
    function fetchOrderHistory() {
        fetch('/api/orders/history')
            .then(res => res.json())
            .then(data => {
                renderOrderHistory(data);
            });
    }

    // Function to render order history
    function renderOrderHistory(orders) {
        orderHistory.innerHTML = '';
        if (orders.length === 0) {
            orderHistory.textContent = 'No order history found.';
            return;
        }
        orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'orderItem';
            let itemsHtml = '';
            order.orderItems.forEach(item => {
                itemsHtml += `<p>${item.book.title} - Quantity: ${item.quantity}</p>`;
            });
            div.innerHTML = `
                <h3>Order #${order.id} - ${new Date(order.orderDate).toLocaleString()}</h3>
                ${itemsHtml}
            `;
            orderHistory.appendChild(div);
        });
    }

    // Add event listener for order history navigation
    const orderHistoryBtn = document.createElement('button');
    orderHistoryBtn.textContent = 'Order History';
    orderHistoryBtn.addEventListener('click', () => {
        fetchOrderHistory();
        showOrderHistory();
    });
    document.querySelector('nav').appendChild(orderHistoryBtn);

    // Initialize
    showLogin();
});
