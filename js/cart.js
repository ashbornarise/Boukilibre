// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
        this.initEventListeners();
    }

    loadCart() {
        const saved = localStorage.getItem('boukilibre_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('boukilibre_cart', JSON.stringify(this.items));
    }

    addItem(id, title, price) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.id === id);

        if (existingItem) {
            alert('Ce produit est déjà dans votre panier.');
            return;
        }

        this.items.push({
            id: id,
            title: title,
            price: parseInt(price)
        });

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Produit ajouté au panier !');
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartUI();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    getItemCount() {
        return this.items.length;
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #4b3fe0 0%, #6c63ff 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    initEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const id = e.target.dataset.id;
                const title = e.target.dataset.title;
                const price = e.target.dataset.price;
                this.addItem(id, title, price);
            }
        });

        // Cart button click
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        }
    }

    showCartModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-overlay"></div>
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h3>Votre Panier</h3>
                    <button class="cart-modal-close">&times;</button>
                </div>
                <div class="cart-modal-body">
                    ${this.renderCartItems()}
                </div>
                <div class="cart-modal-footer">
                    <div class="cart-total">
                        <strong>Total:</strong>
                        <span>${this.getTotal().toLocaleString()} FCFA</span>
                    </div>
                    ${this.items.length > 0 ? `
                        <button class="btn btn-primary btn-block" id="checkoutBtn">
                            Passer la commande
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal events
        modal.querySelector('.cart-modal-close').addEventListener('click', () => this.closeCartModal(modal));
        modal.querySelector('.cart-modal-overlay').addEventListener('click', () => this.closeCartModal(modal));

        // Remove item events
        modal.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeItem(e.target.dataset.id);
                this.closeCartModal(modal);
                this.showCartModal();
            });
        });

        // Checkout button
        const checkoutBtn = modal.querySelector('#checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.closeCartModal(modal);
                window.location.href = 'checkout.html';
            });
        }
    }

    renderCartItems() {
        if (this.items.length === 0) {
            return '<p class="cart-empty">Votre panier est vide.</p>';
        }

        return `
            <div class="cart-items">
                ${this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p class="cart-item-price">${item.price.toLocaleString()} FCFA</p>
                        </div>
                        <button class="btn btn-sm remove-item" data-id="${item.id}">
                            Retirer
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    closeCartModal(modal) {
        document.body.style.overflow = '';
        modal.remove();
    }
}

// Add cart modal styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .cart-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .cart-modal-content {
        position: relative;
        background: rgba(255, 255, 255, 0.75);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        border-radius: 1.5rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(75, 63, 224, 0.3);
    }
    
    .cart-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .cart-modal-header h3 {
        margin: 0;
        color: #4b3fe0;
    }
    
    .cart-modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #718096;
        cursor: pointer;
        line-height: 1;
    }
    
    .cart-modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex-grow: 1;
    }
    
    .cart-empty {
        text-align: center;
        color: #718096;
        padding: 2rem;
    }
    
    .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #eef0f6;
        border-radius: 0.5rem;
    }
    
    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #4b3fe0;
    }
    
    .cart-item-price {
        margin: 0;
        font-weight: 600;
        color: #4b3fe0;
    }
    
    .cart-modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
    }
    
    .cart-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: #4b3fe0;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(cartStyles);

// Initialize cart
const cart = new ShoppingCart();
