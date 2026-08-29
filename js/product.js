// Product Page JavaScript
document.addEventListener('DOMContentLoaded', async function () {
    const TYPE_LABELS = { ebook: 'Ebook', application: 'Application', outil: 'Outil' };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'catalog.html';
        return;
    }

    let product;
    try {
        const response = await fetch(`/api/ebooks/${productId}`);
        if (!response.ok) throw new Error('not found');
        product = await response.json();
    } catch (error) {
        window.location.href = 'catalog.html';
        return;
    }

    // Basic info
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productCategory').textContent =
        `${TYPE_LABELS[product.type] || ''} · ${product.category}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = product.price.toLocaleString() + ' FCFA';
    document.getElementById('productImage').src = product.coverImage;
    document.getElementById('productImage').alt = product.title;
    document.title = product.title + ' - Boukilibre';

    const badgeEl = document.getElementById('productBadge');
    if (product.badge) {
        badgeEl.textContent = product.badge;
        badgeEl.style.display = '';
    } else {
        badgeEl.style.display = 'none';
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.dataset.id = product._id;
    addToCartBtn.dataset.title = product.title;
    addToCartBtn.dataset.price = product.price;

    // Benefits / learnings
    const learningsList = document.getElementById('learningsList');
    const learningsSection = learningsList.closest('.product-learnings');
    if (product.benefits && product.benefits.length > 0) {
        learningsList.innerHTML = product.benefits.map((item) => `
            <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>${item}</span>
            </li>
        `).join('');
    } else if (learningsSection) {
        learningsSection.style.display = 'none';
    }

    // Target audience
    const audienceList = document.querySelector('.audience-list');
    const audienceSection = audienceList ? audienceList.closest('.product-audience') : null;
    if (product.targetAudience && product.targetAudience.length > 0 && audienceList) {
        audienceList.innerHTML = product.targetAudience.map((item) => `
            <div class="audience-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
                <div><p>${item}</p></div>
            </div>
        `).join('');
    } else if (audienceSection) {
        audienceSection.style.display = 'none';
    }

    // Table of contents (mostly relevant for ebooks)
    const tocList = document.querySelector('.toc-list');
    const tocSection = tocList ? tocList.closest('section') : null;
    if (product.tableOfContents && product.tableOfContents.length > 0 && tocList) {
        tocList.innerHTML = product.tableOfContents.map((item, index) => `
            <div class="toc-item">
                <div class="toc-number">${index + 1}</div>
                <div class="toc-content">
                    <h4>${item.chapter}</h4>
                    <p>${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    } else if (tocSection) {
        tocSection.style.display = 'none';
    }

    // Related products (same type)
    try {
        const relatedResponse = await fetch(`/api/ebooks?type=${product.type}`);
        const related = relatedResponse.ok ? await relatedResponse.json() : [];
        const others = related.filter((p) => p._id !== product._id).slice(0, 2);

        const relatedEbooks = document.getElementById('relatedEbooks');
        relatedEbooks.innerHTML = others.map((p) => `
            <div class="ebook-card card-premium">
                <div class="ebook-image">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy">
                    ${p.badge ? `<div class="ebook-badge">${p.badge}</div>` : ''}
                </div>
                <div class="ebook-content">
                    <div class="ebook-category">${TYPE_LABELS[p.type] || ''} · ${p.category}</div>
                    <h3 class="ebook-title">${p.title}</h3>
                    <p class="ebook-description">${p.description}</p>
                    <div class="ebook-footer">
                        <div class="ebook-price">
                            <span class="price-amount">${p.price.toLocaleString()} FCFA</span>
                        </div>
                        <a href="product.html?id=${p._id}" class="btn btn-primary">Decouvrir</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        // No related products available
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
