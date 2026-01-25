// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearch = document.getElementById('faqSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');

    let currentCategory = 'all';

    // Accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filterFAQ();
        });
    });

    // Search functionality
    if (faqSearch) {
        faqSearch.addEventListener('input', function () {
            filterFAQ();
        });
    }

    function filterFAQ() {
        const searchQuery = faqSearch ? faqSearch.value.toLowerCase() : '';

        faqItems.forEach(item => {
            const category = item.dataset.category;
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesSearch = searchQuery === '' ||
                question.includes(searchQuery) ||
                answer.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
                item.classList.remove('active');
            }
        });
    }
});
