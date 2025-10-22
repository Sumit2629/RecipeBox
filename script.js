
// Data Storage Manager
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }

        if (!localStorage.getItem('recipes')) {
            const sampleRecipes = [
                {
                    id: Date.now() + 1,
                    title: "Classic Pancakes",
                    category: "Breakfast",
                    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500",
                    calories: 350,
                    energy: 1465,
                    servings: 4,
                    ingredients: [
                        { name: "All-purpose flour", quantity: "2 cups" },
                        { name: "Eggs", quantity: "2" },
                        { name: "Milk", quantity: "1.5 cups" },
                        { name: "Sugar", quantity: "2 tbsp" },
                        { name: "Baking powder", quantity: "2 tsp" }
                    ],
                    steps: [
                        "Mix dry ingredients (flour, sugar, baking powder) in a large bowl.",
                        "In another bowl, whisk eggs and milk together.",
                        "Pour wet ingredients into dry ingredients and mix until combined.",
                        "Heat a non-stick pan over medium heat.",
                        "Pour 1/4 cup batter for each pancake and cook until bubbles form.",
                        "Flip and cook until golden brown on both sides.",
                        "Serve hot with maple syrup and butter."
                    ],
                    favorite: false,
                    userId: null,
                    createdBy: "Admin"
                },
                {
                    id: Date.now() + 2,
                    title: "Spaghetti Carbonara",
                    category: "Dinner",
                    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
                    calories: 580,
                    energy: 2427,
                    servings: 4,
                    ingredients: [
                        { name: "Spaghetti", quantity: "400g" },
                        { name: "Bacon", quantity: "200g" },
                        { name: "Eggs", quantity: "4" },
                        { name: "Parmesan cheese", quantity: "1 cup" },
                        { name: "Black pepper", quantity: "to taste" }
                    ],
                    steps: [
                        "Boil water and cook spaghetti according to package directions.",
                        "While pasta cooks, fry bacon until crispy, then chop into pieces.",
                        "In a bowl, whisk eggs with grated parmesan cheese.",
                        "Drain pasta, reserving 1 cup of pasta water.",
                        "Add hot pasta to the bacon pan off heat.",
                        "Quickly stir in egg mixture, adding pasta water to create creamy sauce.",
                        "Season with black pepper and serve immediately."
                    ],
                    favorite: false,
                    userId: null,
                    createdBy: "Admin"
                },
                {
                    id: Date.now() + 3,
                    title: "Chocolate Chip Cookies",
                    category: "Dessert",
                    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
                    calories: 220,
                    energy: 920,
                    servings: 12,
                    ingredients: [
                        { name: "Butter", quantity: "1 cup" },
                        { name: "Brown sugar", quantity: "1 cup" },
                        { name: "Eggs", quantity: "2" },
                        { name: "Vanilla extract", quantity: "2 tsp" },
                        { name: "All-purpose flour", quantity: "2.5 cups" },
                        { name: "Chocolate chips", quantity: "2 cups" }
                    ],
                    steps: [
                        "Preheat oven to 375°F (190°C).",
                        "Cream together butter and brown sugar until fluffy.",
                        "Beat in eggs and vanilla extract.",
                        "Gradually mix in flour until well combined.",
                        "Fold in chocolate chips.",
                        "Drop rounded tablespoons of dough onto baking sheets.",
                        "Bake for 10-12 minutes until edges are golden.",
                        "Cool on baking sheet for 5 minutes before transferring."
                    ],
                    favorite: false,
                    userId: null,
                    createdBy: "Admin"
                }
            ];
            localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    findUser(email, password) {
        const users = this.getUsers();
        return users.find(u => u.email === email && u.password === password);
    }

    getRecipes() {
        return JSON.parse(localStorage.getItem('recipes') || '[]');
    }

    saveRecipes(recipes) {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    addRecipe(recipe) {
        const recipes = this.getRecipes();
        recipes.push(recipe);
        this.saveRecipes(recipes);
    }

    updateRecipe(id, updatedRecipe) {
        const recipes = this.getRecipes();
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes[index] = { ...recipes[index], ...updatedRecipe };
            this.saveRecipes(recipes);
        }
    }

    deleteRecipe(id) {
        let recipes = this.getRecipes();
        recipes = recipes.filter(r => r.id !== id);
        this.saveRecipes(recipes);
    }

    getRecipeById(id) {
        const recipes = this.getRecipes();
        return recipes.find(r => r.id === id);
    }

    toggleFavorite(id) {
        const recipes = this.getRecipes();
        const recipe = recipes.find(r => r.id === id);
        if (recipe) {
            recipe.favorite = !recipe.favorite;
            this.saveRecipes(recipes);
        }
    }

    getFavoriteRecipes() {
        return this.getRecipes().filter(r => r.favorite);
    }

    setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    }

    logout() {
        sessionStorage.removeItem('currentUser');
    }
}

// App Controller
class RecipeApp {
    constructor() {
        this.dataManager = new DataManager();
        this.currentRecipeId = null;
        this.currentStep = 0;
        this.editingRecipeId = null;
        this.currentCategory = 'All';
        this.carouselIndex = 0;
        this.carouselRecipes = [];
        this.carouselInterval = null;
        this.currentPage = 'home';
        this.previousPage = 'home';
        this.init();
    }

    init() {
        this.checkAuth();
        this.attachEventListeners();
        this.attachValidationListeners();
    }

    checkAuth() {
        const user = this.dataManager.getCurrentUser();
        if (user) {
            this.showMainApp(user);
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('signupPage').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showSignup() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('signupPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp(user) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('signupPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('userName').textContent = `${user.name}`;
        this.navigateTo('home');
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // Show requested page
        this.previousPage = this.currentPage;
        this.currentPage = page;

        switch (page) {
            case 'home':
                document.getElementById('homePage').classList.remove('hidden');
                this.renderCategories();
                this.initCarousel();
                this.renderRecipes();
                break;
            case 'favorites':
                document.getElementById('favoritesPage').classList.remove('hidden');
                this.renderFavorites();
                break;
            case 'profile':
                document.getElementById('profilePage').classList.remove('hidden');
                this.renderProfile();
                break;
            case 'settings':
                document.getElementById('settingsPage').classList.remove('hidden');
                break;
        }
    }

    attachEventListeners() {
        // Auth
        document.getElementById('goToSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignup();
        });

        document.getElementById('goToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.navigateTo(link.dataset.page);
            });
        });

        // Recipe actions
        document.getElementById('addRecipeBtn').addEventListener('click', () => {
            this.openRecipeModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeRecipeModal();
        });

        document.getElementById('recipeModal').addEventListener('click', (e) => {
            if (e.target.id === 'recipeModal') {
                this.closeRecipeModal();
            }
        });

        document.getElementById('recipeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveRecipe();
        });

        document.getElementById('addIngredient').addEventListener('click', () => {
            this.addIngredientInput();
        });

        document.getElementById('addStep').addEventListener('click', () => {
            this.addStepInput();
        });

        document.getElementById('backToHome').addEventListener('click', () => {
            this.navigateTo(this.previousPage);
        });

        document.getElementById('exitCookingMode').addEventListener('click', () => {
            this.exitCookingMode();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });



        // Settings
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearData();
        });
    }

    attachValidationListeners() {
        const signupName = document.getElementById('signupName');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const signupConfirmPassword = document.getElementById('signupConfirmPassword');

        signupName.addEventListener('blur', () => {
            this.validateName(signupName.value);
        });

        signupName.addEventListener('input', () => {
            if (signupName.value.length > 0) {
                this.validateName(signupName.value);
            }
        });

        signupEmail.addEventListener('blur', () => {
            this.validateEmail(signupEmail.value, 'signup');
        });

        signupEmail.addEventListener('input', () => {
            if (signupEmail.value.length > 0) {
                this.validateEmail(signupEmail.value, 'signup');
            }
        });

        signupPassword.addEventListener('input', () => {
            this.validatePassword(signupPassword.value);
            this.updatePasswordStrength(signupPassword.value);
            if (signupConfirmPassword.value) {
                this.validateConfirmPassword(signupPassword.value, signupConfirmPassword.value);
            }
        });

        signupConfirmPassword.addEventListener('input', () => {
            this.validateConfirmPassword(signupPassword.value, signupConfirmPassword.value);
        });

        const loginEmail = document.getElementById('loginEmail');
        loginEmail.addEventListener('blur', () => {
            this.validateEmail(loginEmail.value, 'login');
        });
    }

    validateName(name) {
        const errorElement = document.getElementById('signupNameError');
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;

        if (!name) {
            errorElement.textContent = 'Name is required';
            errorElement.classList.add('show');
            return false;
        }

        if (name.length < 3) {
            errorElement.textContent = 'Name must be at least 3 characters';
            errorElement.classList.add('show');
            return false;
        }

        if (name.length > 50) {
            errorElement.textContent = 'Name must be less than 50 characters';
            errorElement.classList.add('show');
            return false;
        }

        if (!nameRegex.test(name)) {
            errorElement.textContent = 'Name should only contain letters and spaces';
            errorElement.classList.add('show');
            return false;
        }

        errorElement.classList.remove('show');
        return true;
    }

    validateEmail(email, type) {
        const errorElement = document.getElementById(`${type}EmailError`);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            errorElement.textContent = 'Email is required';
            errorElement.classList.add('show');
            return false;
        }

        if (!emailRegex.test(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.classList.add('show');
            return false;
        }

        errorElement.classList.remove('show');
        return true;
    }

    validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        document.getElementById('req-length').classList.toggle('valid', requirements.length);
        document.getElementById('req-length').classList.toggle('invalid', !requirements.length);
        document.getElementById('req-length').querySelector('span').textContent = requirements.length ? '✓' : '○';

        document.getElementById('req-uppercase').classList.toggle('valid', requirements.uppercase);
        document.getElementById('req-uppercase').classList.toggle('invalid', !requirements.uppercase);
        document.getElementById('req-uppercase').querySelector('span').textContent = requirements.uppercase ? '✓' : '○';

        document.getElementById('req-lowercase').classList.toggle('valid', requirements.lowercase);
        document.getElementById('req-lowercase').classList.toggle('invalid', !requirements.lowercase);
        document.getElementById('req-lowercase').querySelector('span').textContent = requirements.lowercase ? '✓' : '○';

        document.getElementById('req-number').classList.toggle('valid', requirements.number);
        document.getElementById('req-number').classList.toggle('invalid', !requirements.number);
        document.getElementById('req-number').querySelector('span').textContent = requirements.number ? '✓' : '○';

        document.getElementById('req-special').classList.toggle('valid', requirements.special);
        document.getElementById('req-special').classList.toggle('invalid', !requirements.special);
        document.getElementById('req-special').querySelector('span').textContent = requirements.special ? '✓' : '○';

        return Object.values(requirements).every(r => r);
    }

    updatePasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrengthBar');
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        strengthBar.className = 'password-strength-bar';

        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    validateConfirmPassword(password, confirmPassword) {
        const errorElement = document.getElementById('signupConfirmPasswordError');

        if (!confirmPassword) {
            errorElement.textContent = 'Please confirm your password';
            errorElement.classList.add('show');
            return false;
        }

        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.classList.add('show');
            return false;
        }

        errorElement.classList.remove('show');
        return true;
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!this.validateEmail(email, 'login')) {
            return;
        }

        if (!password) {
            const errorElement = document.getElementById('loginPasswordError');
            errorElement.textContent = 'Password is required';
            errorElement.classList.add('show');
            return;
        }

        const user = this.dataManager.findUser(email, password);
        if (user) {
            this.dataManager.setCurrentUser(user);
            this.showMainApp(user);
            document.getElementById('loginEmailError').classList.remove('show');
            document.getElementById('loginPasswordError').classList.remove('show');
        } else {
            const errorElement = document.getElementById('loginPasswordError');
            errorElement.textContent = 'Invalid email or password';
            errorElement.classList.add('show');
        }
    }

    handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        const isNameValid = this.validateName(name);
        const isEmailValid = this.validateEmail(email, 'signup');
        const isPasswordValid = this.validatePassword(password);
        const isConfirmPasswordValid = this.validateConfirmPassword(password, confirmPassword);

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const users = this.dataManager.getUsers();
        if (users.find(u => u.email === email)) {
            const errorElement = document.getElementById('signupEmailError');
            errorElement.textContent = 'Email already registered! Please login.';
            errorElement.classList.add('show');
            return;
        }

        const user = {
            id: Date.now(),
            name,
            email,
            password
        };

        this.dataManager.saveUser(user);
        alert('Account created successfully! Please login with your credentials.');
        document.getElementById('signupForm').reset();

        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.requirement').forEach(el => {
            el.classList.remove('valid');
            el.classList.add('invalid');
            el.querySelector('span').textContent = '○';
        });
        document.getElementById('passwordStrengthBar').className = 'password-strength-bar';

        this.showLogin();
    }

    handleLogout() {
        this.dataManager.logout();
        this.showLogin();
    }

    initCarousel() {
        this.carouselRecipes = this.dataManager.getRecipes().slice(0, 8); // Show up to 8 recipes
        if (this.carouselRecipes.length === 0) return;

        this.renderCarousel();
    }

    renderCarousel() {
        const container = document.getElementById('carouselContainer');

        if (this.carouselRecipes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No recipes to display</p>';
            return;
        }

        container.innerHTML = '';
        container.style.animationDuration = `${this.carouselSpeed}s`;

        const totalItems = this.carouselRecipes.length;
        const angleStep = 360 / totalItems;
        const radius = 280; // Distance from center

        this.carouselRecipes.forEach((recipe, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            item.innerHTML = `
                        <div class="carousel-card" data-id="${recipe.id}">
                            <img src="${recipe.image}" alt="${recipe.title}"
                                 onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
                            <div class="carousel-card-content">
                                <div class="carousel-card-title">${recipe.title}</div>
                                <div class="carousel-card-category">${recipe.category}</div>
                            </div>
                        </div>
                    `;

            // Position items in a circle using 3D transforms
            const angle = angleStep * index;
            const theta = (angle * Math.PI) / 180;

            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

            // Click event
            item.querySelector('.carousel-card').addEventListener('click', () => {
                this.viewRecipe(recipe.id);
            });

            // Pause on hover
            item.addEventListener('mouseenter', () => {
                container.style.animationPlayState = 'paused';
            });

            item.addEventListener('mouseleave', () => {
                if (!this.isCarouselPaused) {
                    container.style.animationPlayState = 'running';
                }
            });

            container.appendChild(item);
        });
    }



    rotateCarousel(direction) {
        // Not needed anymore with continuous rotation
    }

    startCarouselAutoPlay() {
        // Not needed anymore with CSS animation
    }

    stopCarouselAutoPlay() {
        // Not needed anymore with CSS animation
    }

    resetCarouselAutoPlay() {
        // Not needed anymore with CSS animation
    }

    renderCategories() {
        const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages'];
        const container = document.getElementById('categoriesContainer');

        container.innerHTML = categories.map(cat => `
                    <button class="category-btn ${cat === this.currentCategory ? 'active' : ''}" 
                            data-category="${cat}">${cat}</button>
                `).join('');

        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                this.renderCategories();
                this.renderRecipes();
            });
        });
    }

    renderRecipes(searchTerm = '') {
        let recipes = this.dataManager.getRecipes();
        const currentUser = this.dataManager.getCurrentUser();

        if (this.currentCategory !== 'All') {
            recipes = recipes.filter(r => r.category === this.currentCategory);
        }

        if (searchTerm) {
            recipes = recipes.filter(r =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const grid = document.getElementById('recipeGrid');

        if (recipes.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2em; color: var(--text-light);">No recipes found. Add your first recipe!</p>';
            return;
        }

        grid.innerHTML = recipes.map(recipe => {
            const isOwner = recipe.userId === currentUser.id;
            const isSampleRecipe = recipe.userId === null;
            return `
                    <div class="recipe-card" style="position: relative;">
                        <div class="favorite-badge ${recipe.favorite ? 'active' : ''}" onclick="app.toggleFavorite(${recipe.id}); event.stopPropagation();">
                            ${recipe.favorite ? '❤️' : '🤍'}
                        </div>
                        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" 
                             onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
                        <div class="recipe-content">
                            <div class="recipe-category">${recipe.category}</div>
                            <h3 class="recipe-title">${recipe.title}</h3>
                            <p style="color: var(--text-light); font-size: 0.9em;">
                                ${recipe.ingredients.length} ingredients • ${recipe.steps.length} steps<br>
                                🔥 ${recipe.calories} cal • ⚡ ${recipe.energy} kJ • 🍽️ ${recipe.servings} servings
                            </p>
                            <p style="color: var(--text-light); font-size: 0.85em; margin-top: 5px;">
                                👨‍🍳 By: ${recipe.createdBy || 'Unknown'}
                            </p>
                            <div class="recipe-actions">
                                <button class="btn-small btn-view" onclick="app.viewRecipe(${recipe.id})">View</button>
                                ${(isOwner && !isSampleRecipe) ? `<button class="btn-small btn-edit" onclick="app.editRecipe(${recipe.id})">Edit</button>` : ''}
                                ${(isOwner && !isSampleRecipe) ? `<button class="btn-small btn-delete" onclick="app.deleteRecipe(${recipe.id})">Delete</button>` : ''}
                            </div>
                        </div>
                    </div>
                `}).join('');
    }

    renderFavorites() {
        const favorites = this.dataManager.getFavoriteRecipes();
        const grid = document.getElementById('favoritesGrid');

        if (favorites.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2em; color: var(--text-light);">No favorite recipes yet. Start adding some!</p>';
            return;
        }

        const currentUser = this.dataManager.getCurrentUser();

        grid.innerHTML = favorites.map(recipe => {
            const isOwner = recipe.userId === currentUser.id;
            const isSampleRecipe = recipe.userId === null;
            return `
                    <div class="recipe-card" style="position: relative;">
                        <div class="favorite-badge active" onclick="app.toggleFavorite(${recipe.id}); event.stopPropagation();">
                            ❤️
                        </div>
                        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" 
                             onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
                        <div class="recipe-content">
                            <div class="recipe-category">${recipe.category}</div>
                            <h3 class="recipe-title">${recipe.title}</h3>
                            <p style="color: var(--text-light); font-size: 0.9em;">
                                ${recipe.ingredients.length} ingredients • ${recipe.steps.length} steps<br>
                                🔥 ${recipe.calories} cal • ⚡ ${recipe.energy} kJ
                            </p>
                            <div class="recipe-actions">
                                <button class="btn-small btn-view" onclick="app.viewRecipe(${recipe.id})">View</button>
                                ${(isOwner && !isSampleRecipe) ? `<button class="btn-small btn-edit" onclick="app.editRecipe(${recipe.id})">Edit</button>` : ''}
                                ${(isOwner && !isSampleRecipe) ? `<button class="btn-small btn-delete" onclick="app.deleteRecipe(${recipe.id})">Delete</button>` : ''}
                            </div>
                        </div>
                    </div>
                `}).join('');
    }

    renderProfile() {
        const user = this.dataManager.getCurrentUser();
        const recipes = this.dataManager.getRecipes();
        const userRecipes = recipes.filter(r => r.userId === user.id);
        const favoriteRecipes = this.dataManager.getFavoriteRecipes();
        const categories = [...new Set(userRecipes.map(r => r.category))];

        document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('statRecipes').textContent = userRecipes.length;
        document.getElementById('statFavorites').textContent = favoriteRecipes.length;
        document.getElementById('statCategories').textContent = categories.length;

        const myRecipesGrid = document.getElementById('myRecipesGrid');
        if (userRecipes.length === 0) {
            myRecipesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">You haven\'t created any recipes yet.</p>';
        } else {
            myRecipesGrid.innerHTML = userRecipes.slice(0, 6).map(recipe => `
                        <div class="recipe-card">
                            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" 
                                 onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
                            <div class="recipe-content">
                                <div class="recipe-category">${recipe.category}</div>
                                <h3 class="recipe-title">${recipe.title}</h3>
                                <p style="color: var(--text-light); font-size: 0.9em;">
                                    ${recipe.ingredients.length} ingredients • ${recipe.steps.length} steps
                                </p>
                                <div class="recipe-actions">
                                    <button class="btn-small btn-view" onclick="app.viewRecipe(${recipe.id})">View</button>
                                    <button class="btn-small btn-edit" onclick="app.editRecipe(${recipe.id})">Edit</button>
                                    <button class="btn-small btn-delete" onclick="app.deleteRecipe(${recipe.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    `).join('');
        }
    }

    toggleFavorite(id) {
        this.dataManager.toggleFavorite(id);
        if (this.currentPage === 'favorites') {
            this.renderFavorites();
        } else {
            this.renderRecipes();
        }
    }

    handleSearch(searchTerm) {
        this.renderRecipes(searchTerm);
    }

    viewRecipe(id) {
        this.currentRecipeId = id;
        const recipe = this.dataManager.getRecipeById(id);

        if (!recipe) return;

        const detailContent = document.getElementById('recipeDetailContent');
        detailContent.innerHTML = `
                    <div class="detail-header">
                        <img src="${recipe.image}" alt="${recipe.title}" class="detail-image"
                             onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
                        <h1 class="detail-title">${recipe.title}</h1>
                        <div class="recipe-category">${recipe.category}</div>
                        <div style="display: flex; gap: 20px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
                            <div style="background: var(--bg-light); padding: 12px 20px; border-radius: 10px;">
                                <strong style="color: var(--primary);">🔥 ${recipe.calories}</strong> calories
                            </div>
                            <div style="background: var(--bg-light); padding: 12px 20px; border-radius: 10px;">
                                <strong style="color: var(--secondary);">⚡ ${recipe.energy}</strong> kJ
                            </div>
                            <div style="background: var(--bg-light); padding: 12px 20px; border-radius: 10px;">
                                <strong style="color: var(--accent);">🍽️ ${recipe.servings}</strong> servings
                            </div>
                        </div>
                        <p style="margin-top: 15px; color: var(--text-light);">👨‍🍳 Created by: <strong>${recipe.createdBy || 'Unknown'}</strong></p>
                    </div>

                    <div class="ingredients-section">
                        <h2 class="section-title">🥘 Ingredients</h2>
                        ${recipe.ingredients.map(ing => `
                            <div class="ingredient-item">
                                <span>${ing.name}</span>
                                <strong>${ing.quantity}</strong>
                            </div>
                        `).join('')}
                    </div>

                    <div class="steps-section">
                        <h2 class="section-title">👨‍🍳 Cooking Steps</h2>
                        ${recipe.steps.map((step, idx) => `
                            <div class="step-item">
                                <div class="step-number">${idx + 1}</div>
                                <p>${step}</p>
                            </div>
                        `).join('')}
                    </div>

                    <button class="btn" onclick="app.startCookingMode(${id})" style="margin-top: 30px;">
                        Start Cooking Mode 🍳
                    </button>
                `;

        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        document.getElementById('detailPage').classList.remove('hidden');
    }

    startCookingMode(id) {
        const recipe = this.dataManager.getRecipeById(id);
        if (!recipe) return;

        this.currentStep = 0;
        this.currentRecipeId = id;
        document.getElementById('detailPage').classList.add('hidden');
        document.getElementById('cookingPage').classList.remove('hidden');
        this.renderCookingStep(recipe);
    }

    renderCookingStep(recipe) {
        const stepContent = document.getElementById('cookingStepContent');
        const controls = document.getElementById('cookingControls');

        if (this.currentStep < recipe.steps.length) {
            stepContent.innerHTML = `
                        <div class="cooking-step-number">Step ${this.currentStep + 1} of ${recipe.steps.length}</div>
                        <div class="cooking-step-text">${recipe.steps[this.currentStep]}</div>
                    `;

            controls.innerHTML = `
                        ${this.currentStep > 0 ? '<button class="btn-nav btn-prev" onclick="app.prevStep()">← Previous</button>' : ''}
                        ${this.currentStep < recipe.steps.length - 1 ?
                    '<button class="btn-nav btn-next" onclick="app.nextStep()">Next →</button>' :
                    '<button class="btn-nav btn-finish" onclick="app.finishCooking()">Finish! 🎉</button>'}
                    `;
        }
    }

    prevStep() {
        const recipe = this.dataManager.getRecipeById(this.currentRecipeId);
        this.currentStep--;
        this.renderCookingStep(recipe);
    }

    nextStep() {
        const recipe = this.dataManager.getRecipeById(this.currentRecipeId);
        this.currentStep++;
        this.renderCookingStep(recipe);
    }

    finishCooking() {
        alert('Congratulations! You completed the recipe! 🎉');
        this.exitCookingMode();
    }

    exitCookingMode() {
        document.getElementById('cookingPage').classList.add('hidden');
        document.getElementById('detailPage').classList.remove('hidden');
    }

    openRecipeModal(recipe = null) {
        this.editingRecipeId = recipe ? recipe.id : null;
        document.getElementById('modalTitle').textContent = recipe ? 'Edit Recipe' : 'Add Recipe';
        document.getElementById('recipeModal').classList.remove('hidden');

        if (recipe) {
            document.getElementById('recipeTitle').value = recipe.title;
            document.getElementById('recipeCategory').value = recipe.category;
            document.getElementById('recipeImage').value = recipe.image;
            document.getElementById('recipeCalories').value = recipe.calories || 0;
            document.getElementById('recipeEnergy').value = recipe.energy || 0;
            document.getElementById('recipeServings').value = recipe.servings || 1;

            const ingredientsContainer = document.getElementById('ingredientsContainer');
            ingredientsContainer.innerHTML = '';
            recipe.ingredients.forEach(ing => {
                this.addIngredientInput(ing.name, ing.quantity);
            });

            const stepsContainer = document.getElementById('stepsContainer');
            stepsContainer.innerHTML = '';
            recipe.steps.forEach(step => {
                this.addStepInput(step);
            });
        } else {
            document.getElementById('recipeForm').reset();
            document.getElementById('ingredientsContainer').innerHTML = '';
            document.getElementById('stepsContainer').innerHTML = '';
            this.addIngredientInput();
            this.addStepInput();
        }
    }

    closeRecipeModal() {
        document.getElementById('recipeModal').classList.add('hidden');
    }

    addIngredientInput(name = '', quantity = '') {
        const container = document.getElementById('ingredientsContainer');
        const div = document.createElement('div');
        div.className = 'ingredient-input-group';
        div.innerHTML = `
                    <input type="text" placeholder="Ingredient name" value="${name}" required>
                    <input type="text" placeholder="Quantity" value="${quantity}" required>
                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
                `;
        container.appendChild(div);
    }

    addStepInput(stepText = '') {
        const container = document.getElementById('stepsContainer');
        const div = document.createElement('div');
        div.className = 'ingredient-input-group';
        div.innerHTML = `
                    <textarea placeholder="Describe this cooking step..." required>${stepText}</textarea>
                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
                `;
        container.appendChild(div);
    }

    handleSaveRecipe() {
        const title = document.getElementById('recipeTitle').value;
        const category = document.getElementById('recipeCategory').value;
        const image = document.getElementById('recipeImage').value;
        const calories = parseInt(document.getElementById('recipeCalories').value);
        const energy = parseInt(document.getElementById('recipeEnergy').value);
        const servings = parseInt(document.getElementById('recipeServings').value);

        const ingredients = [];
        document.querySelectorAll('#ingredientsContainer .ingredient-input-group').forEach(group => {
            const inputs = group.querySelectorAll('input');
            ingredients.push({
                name: inputs[0].value,
                quantity: inputs[1].value
            });
        });

        const steps = [];
        document.querySelectorAll('#stepsContainer textarea').forEach(textarea => {
            steps.push(textarea.value);
        });

        const currentUser = this.dataManager.getCurrentUser();
        const recipeData = {
            title,
            category,
            image,
            calories,
            energy,
            servings,
            ingredients,
            steps,
            favorite: false,
            userId: currentUser.id,
            createdBy: currentUser.name
        };

        if (this.editingRecipeId) {
            const existingRecipe = this.dataManager.getRecipeById(this.editingRecipeId);

            if (existingRecipe.userId === null) {
                alert('Sample recipes cannot be edited!');
                return;
            }

            if (existingRecipe.userId !== currentUser.id) {
                alert('You can only edit recipes you created!');
                return;
            }
            this.dataManager.updateRecipe(this.editingRecipeId, recipeData);
        } else {
            recipeData.id = Date.now();
            this.dataManager.addRecipe(recipeData);
        }

        this.closeRecipeModal();
        this.renderRecipes();
        this.initCarousel();
        alert(this.editingRecipeId ? 'Recipe updated!' : 'Recipe added successfully!');
    }

    editRecipe(id) {
        const recipe = this.dataManager.getRecipeById(id);
        const currentUser = this.dataManager.getCurrentUser();

        if (!recipe) return;

        if (recipe.userId === null) {
            alert('Sample recipes cannot be edited!');
            return;
        }

        if (recipe.userId !== currentUser.id) {
            alert('You can only edit recipes you created!');
            return;
        }

        this.openRecipeModal(recipe);
    }

    deleteRecipe(id) {
        const recipe = this.dataManager.getRecipeById(id);
        const currentUser = this.dataManager.getCurrentUser();

        if (!recipe) return;

        if (recipe.userId === null) {
            alert('Sample recipes cannot be deleted!');
            return;
        }

        if (recipe.userId !== currentUser.id) {
            alert('You can only delete recipes you created!');
            return;
        }

        if (confirm('Are you sure you want to delete this recipe?')) {
            this.dataManager.deleteRecipe(id);
            this.renderRecipes();
            this.initCarousel();
            if (this.currentPage === 'favorites') {
                this.renderFavorites();
            } else if (this.currentPage === 'profile') {
                this.renderProfile();
            }
        }
    }

    exportData() {
        const recipes = this.dataManager.getRecipes();
        const dataStr = JSON.stringify(recipes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'recipe-box-data.json';
        link.click();
        alert('Data exported successfully!');
    }

    clearData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('Really sure? This will delete all your recipes!')) {
                localStorage.removeItem('recipes');
                localStorage.removeItem('users');
                alert('All data cleared! Please refresh the page.');
                location.reload();
            }
        }
    }
}

// Initialize app
const app = new RecipeApp();
