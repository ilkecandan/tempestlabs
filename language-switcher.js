document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Detect if current page is in the Turkish directory
        const isTurkishPage = window.location.pathname.includes('/turkish/');
        
        // Define base path
        let basePath = isTurkishPage ? '/turkish/' : '/';

        // Define page mapping for both languages
        let pageMap = {
            'index.html': 'index.html',
            'about.html': 'about.html',
            'products.html': 'products.html',
            'product-cabinet.html': 'product-cabinet.html',
            'product-intuiva.html': 'product-intuiva.html',
            'product-stem.html': 'product-stem.html',
            'contact.html': 'contact.html'
        };

        // Get the current page name
        let page = window.location.pathname.split('/').pop();
        if (!page || page === 'index.html') page = 'index.html';

        // Redirect to the correct language version of the page
        if (selectedLanguage === 'tr') {
            window.location.href = `/turkish/${pageMap[page] || 'index.html'}`;
        } else {
            window.location.href = `/${pageMap[page] || 'index.html'}`;
        }
    });
});

function loadLanguage(lang) {
    // Adjust paths for GitHub Pages
    let basePath = window.location.pathname.includes('/turkish/') 
        ? window.location.origin + "/tempestlabs/languages/tr.json" 
        : window.location.origin + "/tempestlabs/languages/en.json";

    fetch(basePath)
        .then(response => {
            if (!response.ok) {
                console.warn(`Language file not found: ${basePath}`);
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
});
s
