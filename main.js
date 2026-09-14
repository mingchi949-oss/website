document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // User dropdown functionality
    const userMenu = document.querySelector('.user-menu-container');
    if (userMenu) {
        const userIcon = userMenu.querySelector('.user-acc');
        const userDropdown = userMenu.querySelector('.user-dropdown');

        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            // Also check if the click is on the search icon or inside the search container
            const searchIcon = document.querySelector('.search');
            const searchContainer = document.querySelector('.search-container');
            if (!userMenu.contains(e.target) && (!searchIcon || !searchIcon.contains(e.target)) && (!searchContainer || !searchContainer.contains(e.target))) {
                userDropdown.classList.remove('active');
            }
        });
    }
});