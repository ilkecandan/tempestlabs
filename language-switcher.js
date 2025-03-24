document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    // Set the selected language based on previous choice or default to English
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;
    
    // Add event listener for language change
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Get the current page name (e.g., product-cabinet.html)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') currentPage = 'index.html';
        
        const origin = window.location.origin;
        
        // Redirect to the corresponding language version with correct folder structure
        if (selectedLanguage === 'tr') {
            // Check if the current page is a legal document
            if (currentPage.startsWith('legal/')) {
                window.location.href = `${origin}/turkish/${currentPage}`;
            } else {
                window.location.href = `${origin}/turkish/${currentPage}`;
            }
        } else {
            if (currentPage.startsWith('turkish/')) {
                window.location.href = `${origin}/${currentPage.replace('turkish/', '')}`;
            } else {
                window.location.href = `${origin}/${currentPage}`;
            }
        }
    });

    // Function to load language translations from the JSON file
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
});


function checkImageExists(src, img) {
    fetch(src, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) img.style.display = 'none';
        })
        .catch(() => {
            img.style.display = 'none';
        });
}
