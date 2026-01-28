// Product Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Product data
    const products = {
        1: {
            id: 1,
            title: "Guide Complet de l'Entrepreneur Moderne",
            category: "Entrepreneuriat",
            description: "Apprenez les strategies eprouvees pour lancer et developper votre entreprise avec succes. Un guide pas a pas pour transformer votre idee en realite.",
            price: 2000,
            badge: "Nouveau",
            image: "images/ebook-1.jpg",
            learnings: [
                "Comment valider votre idee de business avant de vous lancer",
                "Les strategies de lancement qui fonctionnent vraiment",
                "Comment creer un business plan solide et realiste",
                "Les techniques de marketing digital pour attirer vos premiers clients",
                "La gestion financiere simplifiee pour les debutants"
            ]
        },
        2: {
            id: 2,
            title: "Maitrisez Votre Productivite et Votre Temps",
            category: "Developpement Personnel",
            description: "Decouvrez les methodes scientifiquement prouvees pour multiplier votre productivite et atteindre vos objectifs plus rapidement.",
            price: 2000,
            badge: "Populaire",
            image: "images/ebook-2.jpg",
            learnings: [
                "Les techniques de gestion du temps les plus efficaces",
                "Comment eliminer la procrastination definitivement",
                "Les habitudes des personnes hautement productives",
                "Comment maintenir votre concentration pendant des heures",
                "Les outils et applications qui boostent votre productivite"
            ]
        }
    };

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 1;
    const product = products[productId];

    if (product) {
        // Update page content
        document.getElementById('productTitle').textContent = product.title;
        document.getElementById('productCategory').textContent = product.category;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productPrice').textContent = product.price.toLocaleString() + ' FCFA';
        document.getElementById('productBadge').textContent = product.badge;
        document.getElementById('productImage').src = product.image;
        document.getElementById('productImage').alt = product.title;

        // Update page title
        document.title = product.title + ' - Boukilibre';

        // Update add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn.dataset.id = product.id;
        addToCartBtn.dataset.title = product.title;
        addToCartBtn.dataset.price = product.price;

        // Update learnings list
        const learningsList = document.getElementById('learningsList');
        learningsList.innerHTML = product.learnings.map(learning => `
            <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>${learning}</span>
            </li>
        `).join('');

        // Update related ebooks (show the other product)
        const relatedEbooks = document.getElementById('relatedEbooks');
        const otherProducts = Object.values(products).filter(p => p.id !== parseInt(productId));

        relatedEbooks.innerHTML = otherProducts.map(p => `
            <div class="ebook-card card-premium">
                <div class="ebook-image">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                    <div class="ebook-badge">${p.badge}</div>
                </div>
                <div class="ebook-content">
                    <div class="ebook-category">${p.category}</div>
                    <h3 class="ebook-title">${p.title}</h3>
                    <p class="ebook-description">${p.description}</p>
                    <div class="ebook-footer">
                        <div class="ebook-price">
                            <span class="price-amount">${p.price.toLocaleString()} FCFA</span>
                        </div>
                        <a href="product.html?id=${p.id}" class="btn btn-primary">Decouvrir</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Update problem/solution based on product category
        if (product.category === "Developpement Personnel") {
            document.querySelector('.problem-box p').textContent =
                "Vous vous sentez deborde et improductif ? Vous avez l'impression de ne jamais avoir assez de temps pour accomplir vos objectifs ?";
            document.querySelector('.solution-box p').textContent =
                "Ce guide vous donne les methodes eprouvees pour reprendre le controle de votre temps et multiplier votre productivite.";

            // Update audience
            document.querySelector('.audience-list').innerHTML = `
                <div class="audience-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                        <strong>Professionnels debördes</strong>
                        <p>Qui veulent accomplir plus en moins de temps</p>
                    </div>
                </div>
                <div class="audience-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    <div>
                        <strong>Etudiants</strong>
                        <p>Qui veulent optimiser leur temps d'etude</p>
                    </div>
                </div>
                <div class="audience-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <div>
                        <strong>Entrepreneurs</strong>
                        <p>Qui jonglent avec de multiples responsabilites</p>
                    </div>
                </div>
            `;

            // Update table of contents
            document.querySelector('.toc-list').innerHTML = `
                <div class="toc-item">
                    <div class="toc-number">1</div>
                    <div class="toc-content">
                        <h4>Comprendre votre relation au temps</h4>
                        <p>Analysez vos habitudes actuelles et identifiez vos points faibles.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">2</div>
                    <div class="toc-content">
                        <h4>La methode Pomodoro et ses variantes</h4>
                        <p>Maitrisez cette technique simple mais puissante.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">3</div>
                    <div class="toc-content">
                        <h4>Priorisation et planification</h4>
                        <p>Apprenez a identifier ce qui compte vraiment.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">4</div>
                    <div class="toc-content">
                        <h4>Eliminer les distractions</h4>
                        <p>Creez un environnement propice a la concentration.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">5</div>
                    <div class="toc-content">
                        <h4>Habitudes de haute performance</h4>
                        <p>Developpez des routines qui boostent votre productivite.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">6</div>
                    <div class="toc-content">
                        <h4>Outils et applications</h4>
                        <p>Les meilleurs outils pour gerer votre temps efficacement.</p>
                    </div>
                </div>
                <div class="toc-item">
                    <div class="toc-number">7</div>
                    <div class="toc-content">
                        <h4>Maintenir la motivation</h4>
                        <p>Comment rester productif sur le long terme.</p>
                    </div>
                </div>
            `;
        }
    }

    // Add smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
