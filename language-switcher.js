document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Base path for GitHub Pages (Adjust based on repo name)
        const basePath = "/tempestlabs/";

        // Detect if the current page is in the Turkish directory
        const isTurkishPage = window.location.pathname.includes('/turkish/');

        // Define page mapping for both languages
        let pageMap = {
            'index.html': 'index.html',
            'about.html': 'about.html',
            'products.html': 'products.html',
            'product-cabinet.html': 'product-cabinet.html',
            'product-intuiva.html': 'product-intuiva.html',
            'product-stem.html': 'product-stem.html',
            'contact.html': 'contact.html',
            'distance-sales-agreement.html': 'distance-sales-agreement.html'
        };

        // Get the current page name
        let page = window.location.pathname.split('/').pop();
        if (!page || page === 'index.html') page = 'index.html';

        // Redirect to the correct language version of the page
        if (selectedLanguage === 'tr') {
            window.location.href = `${basePath}turkish/${pageMap[page] || 'index.html'}`;
        } else {
            window.location.href = `${basePath}${pageMap[page] || 'index.html'}`;
        }
    });
});

// Ensure correct legal page redirects
function redirectToLegal(doc) {
    const basePath = "/tempestlabs/";
    const language = localStorage.getItem('preferredLanguage') || 'en';
    let url;

    if (language === 'tr') {
        url = `${basePath}turkish/legal/${doc}-sozlesmesi.html`;
    } else {
        url = `${basePath}legal/${doc}-sales-agreement.html`;
    }

    window.location.href = url;
}

function loadLanguage(lang) {
    // Adjust paths for GitHub Pages
    let basePath = "/tempestlabs/languages/";
    const languageFilePath = `${window.location.origin}${basePath}${lang}.json`;

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

// Ensure images exist before setting the src
function checkImageExists(imageSrc, imgElement) {
    fetch(imageSrc, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn(`Image not found: ${imageSrc}`);
                imgElement.style.display = 'none'; // Hide missing images
            }
        })
        .catch(error => console.error("Error checking image:", imageSrc, error));
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        checkImageExists(img.src, img);
    });

    // Update all legal links to use correct redirect function
    document.querySelectorAll('[data-legal-link]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const docType = link.getAttribute('data-legal-link');
            redirectToLegal(docType);
        });
    });
});
