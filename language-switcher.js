// language-switcher.js

document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Get current page name (e.g., product-cabinet.html)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') currentPage = 'index.html';

        const origin = window.location.origin;

        // Redirect to correct language version with absolute URLs
        if (selectedLanguage === 'tr') {
            window.location.href = `${origin}/turkish/${currentPage}`;
        } else {
            window.location.href = `${origin}/${currentPage}`;
        }
    });

    // Hide broken images
    document.querySelectorAll('img').forEach(img => {
        checkImageExists(img.src, img);
    });

    // Localize legal links
    document.querySelectorAll('[data-legal-link]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const docType = link.getAttribute('data-legal-link');
            redirectToLegal(docType);
        });
    });
});

function loadLanguage(lang) {
    const languageFilePath = `/languages/${lang}.json`;

    fetch(languageFilePath)
        .then(response => {
            if (!response.ok) {
                console.warn(`Language file not found: ${languageFilePath}`);
                return {};
            }
            return response.json();
        })
        .then(translations => {
            if (Object.keys(translations).length === 0) return;
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });
        })
        .catch(error => console.error("Error loading language file:", error));
}

function redirectToLegal(doc) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    const origin = window.location.origin;
    const path = (lang === 'tr') 
        ? `/turkish/legal/${doc}.html` 
        : `/legal/${doc}.html`;
    window.location.href = `${origin}${path}`;
}

function checkImageExists(src, img) {
    fetch(src, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) img.style.display = 'none';
        })
        .catch(() => {
            img.style.display = 'none';
        });
}
