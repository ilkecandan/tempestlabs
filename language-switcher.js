document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;
    
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);
        
        // Get the current page name
        let page = window.location.pathname.split('/').pop();
        if (!page || page === 'index.html') page = 'index.html';
        
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

        if (selectedLanguage === 'tr') {
            window.location.href = `/turkish/${pageMap[page] || 'index.html'}`;
        } else {
            window.location.href = `/${pageMap[page] || 'index.html'}`;
        }
    });
});

function loadLanguage(lang) {
    fetch(`/languages/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            document.querySelectorAll('[data-key]').forEach(element => {
                const translationKey = element.getAttribute('data-key');
                if (translations[translationKey]) {
                    element.textContent = translations[translationKey];
                }
            });
        })
        .catch(error => console.error("Error loading language file:", error));
}
