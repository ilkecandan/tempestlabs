
document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;
    
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);
        
        if (selectedLanguage === 'tr') {
            window.location.href = '/turkish/index.html';
        } else {
            window.location.href = '/index.html';
        }
    });
});

function loadLanguage(lang) {
    fetch(`/languages/${lang}.json`)
        .then(response => response.json())
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

function redirectToLegal(doc) {
    const language = localStorage.getItem('preferredLanguage') || 'en';
    let url = `/legal/${doc}-agreement.html`;
    if (language === 'tr') {
        url = `/turkish/legal/${doc}-sozlesmesi.html`;
    }
    window.location.href = url;
}
