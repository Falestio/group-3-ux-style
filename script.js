// STYLE — small UI helpers (product rendering + UI toggles). No persistence, no camera, no fake AI.

/* ---------- Product card markup ---------- */
function productCardHTML(p) {
  return `<a class="product-card" href="product.html?id=${p.id}" data-cat="${p.category}">
    <div class="product-thumb" style="background:${p.color}22;">
      <span>${p.emoji}</span>
      <button class="heart-fab" type="button" aria-label="Save to wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button>
    </div>
    <div class="product-body">
      <div class="product-name">${p.name}</div>
      <div class="product-cat">${p.category}</div>
      <div class="product-price-row"><span class="product-price">${formatPrice(p.price)}</span></div>
    </div>
  </a>`;
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Home: recommended products ---------- */
  const homeGrid = document.getElementById('home-recommended');
  if (homeGrid && typeof PRODUCTS !== 'undefined') {
    homeGrid.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
  }

  /* ---------- Shop: filterable catalog ---------- */
  const shopGrid = document.getElementById('shop-grid');
  if (shopGrid && typeof PRODUCTS !== 'undefined') {
    const initialCat = getQueryParam('cat') || 'all';

    function renderShop(cat) {
      const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
      shopGrid.innerHTML = list.length
        ? list.map(productCardHTML).join('')
        : '<div class="empty-state" style="grid-column:1/3;"><div class="big">🔍</div>Tidak ada produk di kategori ini.</div>';
      bindHeartButtons();
    }

    const filterPills = document.querySelectorAll('#shop-filters [data-item]');
    filterPills.forEach(pill => {
      if (pill.dataset.filter === initialCat) pill.classList.add('active');
      else pill.classList.remove('active');
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderShop(pill.dataset.filter);
      });
    });

    renderShop(initialCat);
  }

  /* ---------- Product detail page ---------- */
  const detail = document.getElementById('product-detail');
  if (detail && typeof PRODUCTS !== 'undefined') {
    const product = getProduct(getQueryParam('id')) || PRODUCTS[0];

    document.getElementById('pd-thumb').textContent = product.emoji;
    document.getElementById('pd-thumb').style.background = product.color + '22';
    document.getElementById('pd-name').textContent = product.name;
    document.getElementById('pd-price').textContent = formatPrice(product.price);
    document.getElementById('pd-cat').textContent = CATEGORY_LABEL[product.category] || product.category;
    document.getElementById('pd-desc').textContent = product.desc;
    document.title = product.name + ' — STYLE';

    const tryonBtn = document.getElementById('pd-tryon-btn');
    if (tryonBtn) tryonBtn.href = 'tryon.html?id=' + product.id;

    const backBtn = document.getElementById('pd-back-btn');
    if (backBtn) backBtn.href = 'shop.html?cat=' + product.category;

    const relatedGrid = document.getElementById('pd-related');
    if (relatedGrid) {
      const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
      relatedGrid.innerHTML = related.map(productCardHTML).join('');
    }

    bindHeartButtons();
  }

  /* ---------- Try-on page: show the section matching the product's category ---------- */
  const tryonPage = document.getElementById('tryon-page');
  if (tryonPage && typeof PRODUCTS !== 'undefined') {
    const product = getProduct(getQueryParam('id')) || PRODUCTS[0];

    document.getElementById('tryon-subtitle').textContent = 'Trying on: ' + product.name;
    document.getElementById('tryon-thumb').textContent = product.emoji;
    document.getElementById('tryon-thumb').style.background = product.color + '22';
    document.title = 'Try On ' + product.name + ' — STYLE';

    document.querySelectorAll('.tryon-section').forEach(section => {
      section.hidden = section.dataset.cat !== product.category;
    });

    const backBtn = document.getElementById('tryon-back-btn');
    if (backBtn) backBtn.href = 'product.html?id=' + product.id;

    const lookLink = document.getElementById('tryon-add-look');
    if (lookLink) lookLink.href = 'mixmatch.html?added=' + product.id;
  }

  /* ---------- Exclusive toggle groups: pills, category tiles, shade swatches, tabs ---------- */
  document.querySelectorAll('[data-group]').forEach(group => {
    if (group.id === 'shop-filters') return; // handled separately above
    const items = group.querySelectorAll('[data-item]');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const groupName = group.dataset.group;

        if (item.dataset.target) {
          document.querySelectorAll(`[data-panel="${groupName}"]`).forEach(p => p.hidden = true);
          const panel = document.getElementById(item.dataset.target);
          if (panel) panel.hidden = false;
        }

        if (item.dataset.shadeHex) {
          const dot = document.querySelector(`[data-shade-dot="${groupName}"]`);
          const name = document.querySelector(`[data-shade-name="${groupName}"]`);
          if (dot) dot.style.background = item.dataset.shadeHex;
          if (name) name.textContent = item.dataset.shadeName;
        }
      });
    });
  });

  bindHeartButtons();

  /* ---------- "Start Analysis" / "Try Another" — reveal a result panel on click ---------- */
  document.querySelectorAll('[data-analyze]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.analyze);
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Analyzing...';
      setTimeout(() => {
        if (panel) {
          panel.hidden = false;
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        btn.disabled = false;
        btn.textContent = original;
        showToast('Analysis complete ✓');
      }, 900);
    });
  });

  /* ---------- Generic action buttons (Save Look, Buy Now, Buy All Items, Share, ...) ---------- */
  document.querySelectorAll('[data-toast]').forEach(btn => {
    btn.addEventListener('click', () => showToast(btn.dataset.toast));
  });

  /* ---------- Remove an item row from a look (Mix & Match) ---------- */
  document.querySelectorAll('.list-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.list-item-row');
      if (row) row.remove();
      showToast('Item removed from look');
    });
  });

  /* ---------- Mix & Match: acknowledge item added via ?added=id ---------- */
  const addedId = getQueryParam('added');
  if (addedId && typeof PRODUCTS !== 'undefined') {
    const p = getProduct(addedId);
    if (p) showToast(p.name + ' added to your look ✓');
  }

});

/* ---------- Favorite (wishlist) heart toggle — visual only, re-bindable for dynamic grids ---------- */
function bindHeartButtons() {
  document.querySelectorAll('.heart-btn, .heart-fab').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.querySelector('.app-shell').appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}
