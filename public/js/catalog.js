// Catalog Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const catalogGrid = document.getElementById('catalogGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'all';
    let currentSort = 'newest';
    let searchQuery = '';

    // Filter by category
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filterAndSort();
        });
    });

    // Sort
    sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        filterAndSort();
    });

    // Search
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

    // Filter and sort function
    function filterAndSort() {
        const cards = Array.from(catalogGrid.querySelectorAll('.ebook-card'));
        let visibleCount = 0;

        // Filter
        cards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.ebook-title').textContent.toLowerCase();
            const description = card.querySelector('.ebook-description').textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesSearch = searchQuery === '' ||
                title.includes(searchQuery) ||
                description.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Sort visible cards
        const visibleCards = cards.filter(card => !card.classList.contains('hidden'));

        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);

            switch (currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'popular':
                    // For now, keep original order (would need popularity data)
                    return 0;
                case 'newest':
                default:
                    return 0;
            }
        });

        // Reorder DOM
        visibleCards.forEach(card => catalogGrid.appendChild(card));

        // Update results count
        resultsCount.textContent = visibleCount;

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.classList.add('show');
            catalogGrid.style.display = 'none';
        } else {
            noResults.classList.remove('show');
            catalogGrid.style.display = 'grid';
        }
    }

    // Initialize
    filterAndSort();
});
