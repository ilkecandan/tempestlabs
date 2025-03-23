// language-switcher.js

// This script supports dynamic switching between English and Turkish
// for Cabinet of Selves product pages and related legal pages.

// ENGLISH PAGE: /product-cabinet.html
// TURKISH PAGE: /turkish/product-cabinet.html

document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

    // Load translations based on stored language
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Determine current page (e.g., product-cabinet.html)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') currentPage = 'index.html';

        // If on Cabinet page and language changes, redirect accordingly
        if (selectedLanguage === 'tr') {
            window.location.href = `/turkish/${currentPage}`;
        } else {
            window.location.href = `/${currentPage}`;
        }
    });

    // Hide broken images
    document.querySelectorAll('img').forEach(img => {
        checkImageExists(img.src, img);
    });

    // Legal document link localization
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
            if (Object.keys(translations).length === 0) {
                console.warn("Translation data is empty or could not be loaded.");
                return;
            }
            document.querySelectorAll('[data-key]').forEach(element => {
                const translationKey = element.getAttribute('data-key');
                if (translations[translationKey]) {
                    element.textContent = translations[translationKey];
                }
            });
        })
        .catch(error => console.error("Error loading language file:", error));
}

function redirectToLegal(doc) {
    const language = localStorage.getItem('preferredLanguage') || 'en';
    let url = (language === 'tr')
        ? `/turkish/legal/${doc}.html`
        : `/legal/${doc}.html`;
    window.location.href = url;
}

function checkImageExists(imageSrc, imgElement) {
    fetch(imageSrc, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn(`Image not found: ${imageSrc}`);
                imgElement.style.display = 'none';
            }
        })
        .catch(error => console.error("Error checking image:", imageSrc, error));
}
