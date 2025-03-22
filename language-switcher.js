document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

    loadLanguage(savedLanguage);
    languageSelector.value = savedLanguage;

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Get the current page name (e.g., index.html)
        let currentPage = window.location.pathname.split('/').pop();
        if (!currentPage || currentPage === '') currentPage = 'index.html';

        // Redirect based on selected language
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

    // Legal links redirection
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
    let url;

    if (language === 'tr') {
        url = `/turkish/legal/${doc}.html`;
    } else {
        url = `/legal/${doc}.html`;
    }

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
