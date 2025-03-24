document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
    
    // Load language content based on saved language
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') currentPage = 'index.html';
        
        const origin = window.location.origin;
        
        // Check if the page is in the 'legal' directory, and adjust path
        if (currentPage.startsWith('legal/')) {
            // Legal pages: Turkish path should be '/turkish/legal/'
            if (selectedLanguage === 'tr') {
                window.location.href = `${origin}/turkish${window.location.pathname}`;
            } else {
                window.location.href = `${origin}${window.location.pathname.replace('/turkish', '')}`;
            }
        } else {
            // Non-legal pages: Turkish path should be '/turkish/'
            if (selectedLanguage === 'tr') {
                window.location.href = `${origin}/turkish/${currentPage}`;
            } else {
                window.location.href = `${origin}/${currentPage}`;
            }
        }
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
