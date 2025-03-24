document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'tr';
    
    // Load language content based on saved language
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        let currentPage = window.location.pathname.split('/').pop(); // get current page
        if (!currentPage || currentPage === '') currentPage = 'index.html'; // default page
        
        const origin = window.location.origin;
        
        // Handle legal pages separately for Turkish and English
        if (currentPage.startsWith('legal/')) {
            if (selectedLanguage === 'tr') {
                window.location.href = `${origin}/turkish${window.location.pathname}`;
            } else {
                // English: Remove /turkish from the path and just use /legal/
                window.location.href = `${origin}${window.location.pathname.replace('/turkish', '')}`;
            }
        } else {
            // Non-legal pages: Simply adjust to the /turkish/ prefix for Turkish, and remove it for English
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
