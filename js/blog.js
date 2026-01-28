// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const blogGrid = document.getElementById('blogGrid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const noResults = document.getElementById('noResults');
    const blogNewsletterForm = document.getElementById('blogNewsletterForm');

    let currentCategory = 'all';

    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filterArticles();
        });
    });

    function filterArticles() {
        const articles = blogGrid.querySelectorAll('.blog-card');
        let visibleCount = 0;

        articles.forEach(article => {
            const category = article.dataset.category;
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            if (matchesCategory) {
                article.classList.remove('hidden');
                visibleCount++;
            } else {
                article.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.classList.add('show');
            blogGrid.style.display = 'none';
        } else {
            noResults.classList.remove('show');
            blogGrid.style.display = 'grid';
        }
    }

    // Newsletter form
    if (blogNewsletterForm) {
        blogNewsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const btn = this.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Inscription...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    btn.textContent = 'Inscrit !';
                    btn.style.background = 'var(--color-success)';
                    this.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Erreur lors de l\'inscription');
                }
            } catch (error) {
                btn.textContent = 'Erreur';
                btn.style.background = 'var(--color-error)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Initialize
    filterArticles();
});
