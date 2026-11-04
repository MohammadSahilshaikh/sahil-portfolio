/**
 * Wikipedia API Live Connector
 * Connects website to Wikipedia REST API (https://en.wikipedia.org/api/rest_v1/)
 * Created for Mohammad Sahil Shaikh Portfolio & Travel Experience Pages
 */

const WikipediaAPI = (function () {
    const API_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
    const memoryCache = {};

    /**
     * Fetch summary data from Wikipedia API with caching
     * @param {string} title 
     * @returns {Promise<Object>}
     */
    async function fetchSummary(title) {
        if (!title) return null;
        const normalized = title.trim();
        const cacheKey = 'wiki_cache_' + normalized.toLowerCase();

        // 1. Check in-memory cache
        if (memoryCache[cacheKey]) {
            return memoryCache[cacheKey];
        }

        // 2. Check sessionStorage
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                memoryCache[cacheKey] = parsed;
                return parsed;
            }
        } catch (e) {
            // sessionStorage might be disabled, ignore
        }

        // 3. Fetch from live Wikipedia REST API
        try {
            const url = API_BASE + encodeURIComponent(normalized.replace(/ /g, '_'));
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error(`Wikipedia API error: ${res.status}`);
            }

            const data = await res.json();
            const result = {
                title: data.title || normalized,
                description: data.description || 'Verified Wikipedia Article',
                extract: data.extract || 'No extract available.',
                thumbnail: data.thumbnail ? data.thumbnail.source : (data.originalimage ? data.originalimage.source : null),
                pageUrl: (data.content_urls && data.content_urls.desktop && data.content_urls.desktop.page) 
                    ? data.content_urls.desktop.page 
                    : `https://en.wikipedia.org/wiki/${encodeURIComponent(normalized.replace(/ /g, '_'))}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Cache result
            memoryCache[cacheKey] = result;
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify(result));
            } catch (e) {}

            return result;
        } catch (err) {
            console.warn('Wikipedia API fetch failed for:', title, err);
            return null;
        }
    }

    /**
     * Render the Wikipedia Card HTML inside a container
     * @param {HTMLElement} container 
     * @param {Object} data 
     * @param {boolean} enableInteractive
     */
    function renderCard(container, data, enableInteractive = true) {
        if (!data) {
            container.innerHTML = `
                <div style="padding: 25px; text-align: center; color: #94a3b8;">
                    <i class="fas fa-exclamation-circle" style="color: #f59e0b; margin-right: 8px;"></i>
                    Wikipedia API se data load nahi ho paya. Kripya apna internet connection check karein.
                </div>
            `;
            return;
        }

        const fallbackImg = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80';
        const imgUrl = data.thumbnail || fallbackImg;

        let interactiveHtml = '';
        if (enableInteractive && container.dataset.wikiInteractive === 'true') {
            const chips = ['Bihar', 'Delhi', 'Hyderabad', 'Bangalore', 'Kolkata', 'Chennai', 'Gujarat'];
            interactiveHtml = `
                <div class="wiki-interactive-bar">
                    <span style="font-size: 0.82rem; color: #94a3b8; font-weight: 500;">
                        <i class="fas fa-bolt" style="color: #f59e0b;"></i> Quick Explore:
                    </span>
                    ${chips.map(c => `
                        <button type="button" class="wiki-chip-btn ${c.toLowerCase() === data.title.toLowerCase() || (c === 'Bangalore' && data.title === 'Bengaluru') ? 'active' : ''}" data-city="${c}">
                            ${c}
                        </button>
                    `).join('')}
                    <div class="wiki-search-box">
                        <input type="text" class="wiki-search-input" placeholder="Search any topic..." />
                        <button type="button" class="wiki-search-btn" title="Search Wikipedia">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="wiki-card-header">
                <div class="wiki-brand-group">
                    <div class="wiki-icon-badge" title="Verified Wikipedia API Connection">
                        <i class="fab fa-wikipedia-w"></i>
                    </div>
                    <div>
                        <div class="wiki-pill">
                            <span class="wiki-live-dot"></span> Live Wikipedia API
                        </div>
                        <h3 class="wiki-title">${data.title}</h3>
                        <p class="wiki-description">${data.description}</p>
                    </div>
                </div>
                <div class="wiki-actions">
                    <a href="${data.pageUrl}" target="_blank" rel="noopener noreferrer" class="wiki-read-btn">
                        <i class="fab fa-wikipedia-w"></i> Read on Wikipedia <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
                    </a>
                </div>
            </div>
            <div class="wiki-card-body">
                <div class="wiki-image-wrap">
                    <img src="${imgUrl}" alt="${data.title}" class="wiki-image" onerror="this.src='${fallbackImg}'" />
                </div>
                <div class="wiki-text-wrap">
                    <p class="wiki-extract">${data.extract}</p>
                    <div class="wiki-footer-meta">
                        <span><i class="fas fa-database"></i> Source: MediaWiki REST API</span>
                        <span><i class="fas fa-sync-alt"></i> Synced live</span>
                    </div>
                </div>
            </div>
            ${interactiveHtml}
        `;

        // Attach listeners for interactive chips and search box if present
        if (enableInteractive && container.dataset.wikiInteractive === 'true') {
            container.querySelectorAll('.wiki-chip-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const city = btn.dataset.city;
                    container.dataset.wikiQuery = city;
                    loadCard(container, city);
                });
            });

            const searchInput = container.querySelector('.wiki-search-input');
            const searchBtn = container.querySelector('.wiki-search-btn');
            
            const handleSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    loadCard(container, query);
                }
            };

            if (searchBtn && searchInput) {
                searchBtn.addEventListener('click', handleSearch);
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') handleSearch();
                });
            }
        }
    }

    /**
     * Load card data and render
     */
    async function loadCard(container, query) {
        container.innerHTML = `
            <div style="padding: 35px 20px; text-align: center; color: #94a3b8;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.8rem; color: #3b82f6; margin-bottom: 12px; display: block;"></i>
                <span style="font-size: 0.95rem;">Fetching live data for <strong>${query}</strong> from Wikipedia API...</span>
            </div>
        `;
        const data = await fetchSummary(query);
        renderCard(container, data);
    }

    /**
     * Initialize all Wikipedia cards on page
     */
    function init() {
        const cards = document.querySelectorAll('.wiki-overview-card');
        cards.forEach(card => {
            const query = card.dataset.wikiQuery || 'India';
            loadCard(card, query);
        });
    }

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        fetchSummary,
        loadCard,
        init
    };
})();
