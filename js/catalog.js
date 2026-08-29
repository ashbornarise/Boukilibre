// Catalog Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const typeFiltersEl = document.getElementById('typeFilters');
    const categoryFiltersEl = document.getElementById('categoryFilters');
    const sortSelect = document.getElementById('sortSelect');
    const catalogGrid = document.getElementById('catalogGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    const TYPE_LABELS = { ebook: 'Ebook', application: 'Application', outil: 'Outil' };

    let allProducts = [];
    let currentType = 'all';
    let currentCategory = 'all';
    let currentSort = 'newest';
    let searchQuery = '';

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function renderCard(product) {
        const price = Number(product.price) || 0;
        return `
            <div class="ebook-card card-premium" data-type="${product.type}" data-category="${escapeHtml(product.category)}" data-price="${price}">
                <div class="ebook-image">
                    <img src="${product.coverImage}" alt="${escapeHtml(product.title)}" loading="lazy">
                    ${product.badge ? `<div class="ebook-badge">${escapeHtml(product.badge)}</div>` : ''}
                </div>
                <div class="ebook-content">
                    <div class="ebook-category">${TYPE_LABELS[product.type] || ''} · ${escapeHtml(product.category)}</div>
                    <h3 class="ebook-title">${escapeHtml(product.title)}</h3>
                    <p class="ebook-description">${escapeHtml(product.description)}</p>
                    <div class="ebook-footer">
                        <div class="ebook-price">
                            <span class="price-amount">${price.toLocaleString()} FCFA</span>
                        </div>
                        <div class="ebook-actions">
                            <a href="product.html?id=${product._id}" class="btn btn-secondary btn-sm">Détails</a>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product._id}"
                                data-title="${escapeHtml(product.title)}"
                                data-price="${price}">Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCategoryFilters() {
        const scoped = currentType === 'all'
            ? allProducts
            : allProducts.filter((p) => p.type === currentType);
        const categories = [...new Set(scoped.map((p) => p.category))].sort();

        categoryFiltersEl.innerHTML = `<button class="filter-btn${currentCategory === 'all' ? ' active' : ''}" data-category="all">Toutes</button>` +
            categories.map((cat) => `
                <button class="filter-btn${currentCategory === cat ? ' active' : ''}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
            `).join('');

        categoryFiltersEl.querySelectorAll('.filter-btn').forEach((btn) => {
            btn.addEventListener('click', function () {
                currentCategory = this.dataset.category;
                renderCategoryFilters();
                filterAndSort();
            });
        });
    }

    function filterAndSort() {
        let filtered = allProducts.filter((p) => {
            const matchesType = currentType === 'all' || p.type === currentType;
            const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = searchQuery === '' ||
                p.title.toLowerCase().includes(searchQuery) ||
                p.description.toLowerCase().includes(searchQuery);
            return matchesType && matchesCategory && matchesSearch;
        });

        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        resultsCount.textContent = filtered.length;

        if (filtered.length === 0) {
            catalogGrid.style.display = 'none';
            noResults.classList.add('show');
            catalogGrid.innerHTML = '';
        } else {
            catalogGrid.style.display = 'grid';
            noResults.classList.remove('show');
            catalogGrid.innerHTML = filtered.map(renderCard).join('');
        }
    }

    typeFiltersEl.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            typeFiltersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            currentCategory = 'all';
            renderCategoryFilters();
            filterAndSort();
        });
    });

    sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        filterAndSort();
    });

    function performSearch() {
        searchQuery = searchInput.value.toLowerCase().trim();
        filterAndSort();
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    async function loadProducts() {
        try {
            const response = await fetch('/api/ebooks');
            allProducts = response.ok ? await response.json() : [];
        } catch (error) {
            allProducts = [];
        }
        renderCategoryFilters();
        filterAndSort();
    }

    loadProducts();
});
