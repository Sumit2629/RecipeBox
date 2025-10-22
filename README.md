# Recipe Box - Digital Kitchen Management System

A modern, responsive web application for managing and discovering recipes with an interactive 3D carousel, step-by-step cooking mode, and full CRUD operations.

## ✨ Features

###  Authentication System
- **User Registration** with comprehensive validation
- **Secure Login** with email/password
- **Session Management** using sessionStorage
- Password strength meter with real-time feedback

###  Recipe Management (CRUD)
- **Create**: Add new recipes with detailed information
- **Read**: View recipes in grid or detailed view
- **Update**: Edit your own recipes
- **Delete**: Remove recipes you created
- User-specific permissions (edit/delete only your recipes)

###  Category-Based Organization
- **Categories**: Breakfast, Lunch, Dinner, Dessert, Snacks, Beverages
- Quick filter by category
- "All" view to see everything

###  Smart Search
- Real-time recipe search
- Search by recipe title
- Instant filtering

###  Step-by-Step Cooking Mode
- Interactive cooking guide
- Navigate through steps one by one
- Clear instructions at each step
- Previous/Next controls
- Completion celebration

###  Nutritional Information
- Calories per serving
- Energy in kilojoules (kJ)
- Servings count
- Displayed on cards and detail pages

###  Modern UI/UX
- Beautiful kitchen-inspired color scheme
- Smooth animations and hover effects
- Fully responsive design (mobile, tablet, desktop)
- Card-based layout
- Modal dialogs for forms

###  Data Persistence
- LocalStorage for recipes and users
- SessionStorage for current user session
- Data survives page refreshes
- Sample recipes included

---

##  Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation

1. **Download the HTML file**
   ```bash
   # Save the HTML file as index.html
   ```

2. **Open in browser**
   ```bash
   # Simply double-click index.html
   # OR
   # Right-click → Open with → Your Browser
   ```

3. **Start using!**
   - Create an account on the signup page
   - Login with your credentials
   - Start adding your favorite recipes!

---

##  User Guide

### Getting Started

#### 1. **Sign Up**
- Click "Sign up" on the login page
- Fill in your details:
  - **Name**: At least 3 characters, letters and spaces only
  - **Email**: Valid email format
  - **Password**: Must include:
    - At least 8 characters
    - One uppercase letter
    - One lowercase letter
    - One number
    - One special character (@$!%*?&)
  - **Confirm Password**: Must match password
- Watch the password strength meter
- Submit to create account

#### 2. **Login**
- Enter your registered email and password
- Click "Login"

#### 3. **Browse Recipes**
- Use search bar to find specific recipes

#### 4. **Add a Recipe**
- Click "+ Add Recipe" button
- Fill in recipe details:
  - Title
  - Category
  - Image URL
  - Calories, Energy, Servings
  - Ingredients (name + quantity)
  - Cooking steps
- Click "+ Add Ingredient" or "+ Add Step" for more fields
- Submit to save

#### 5. **View Recipe Details**
- Click "View" button on any recipe card
- See full ingredients list
- Read cooking steps
- View nutritional information

#### 6. **Start Cooking Mode**
- Open recipe details
- Click "Start Cooking Mode 🍳"
- Follow step-by-step instructions
- Use Previous/Next buttons
- Complete and celebrate!

#### 7. **Edit/Delete Recipes**
- Only visible for recipes YOU created
- Click "Edit" to modify
- Click "Delete" to remove (with confirmation)

---

##  Technical Architecture

### File Structure
```
Recipe-Box/
│
├── index.html          # Single HTML file containing everything
│   ├── <style>         # All CSS styles
│   └── <script>        # All JavaScript code
│
└── README.md           # This file
```

### Technology Stack
- **HTML5**: Semantic markup, forms, validation
- **CSS3**: Flexbox, Grid, animations, transforms, 3D effects
- **Vanilla JavaScript**: ES6+, Classes, LocalStorage API

### Key Classes

#### `DataManager`
Handles all data operations:
- User management (CRUD)
- Recipe management (CRUD)
- LocalStorage operations
- Session management

#### `RecipeApp`
Main application controller:
- UI rendering
- Event handling
- Navigation
- Form validation
- Carousel management
- Authentication flow

### Data Structure

#### User Object
```javascript
{
  id: 1234567890,
  name: "bhumi Sachdeva",
  email: "Bhumi@example.com",
  password: "Pass123!"
}
```

#### Recipe Object
```javascript
{
  id: 1234567890,
  title: "Classic Pancakes",
  category: "Breakfast",
  image: "https://...",
  calories: 350,
  energy: 1465,
  servings: 4,
  ingredients: [
    { name: "Flour", quantity: "2 cups" }
  ],
  steps: [
    "Mix dry ingredients...",
    "Add wet ingredients..."
  ],
  favorite: false,
  userId: 1234567890,
  createdBy: "Bhumi Sachdeva"
}
```

### Storage Keys
- `users` → Array of user objects
- `recipes` → Array of recipe objects
- `currentUser` → Currently logged-in user (sessionStorage)

---

##  Design System

### Color Palette
```css
--primary: #ff6b6b        /* Coral Red - Main actions */
--primary-dark: #ee5a52   /* Darker Red - Hover states */
--secondary: #4ecdc4      /* Teal - Secondary actions */
--accent: #ffd93d         /* Yellow - Highlights */
--bg-light: #f8f9fa       /* Light Gray - Backgrounds */
--text-dark: #2d3436      /* Dark Gray - Text */
--text-light: #636e72     /* Light Gray - Secondary text */
--white: #ffffff          /* White - Cards */
```

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headers: Bold, larger sizes
- Body: Regular weight, readable sizes

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: < 480px

---

##  Security & Privacy

### Data Security
- **Note**: This is a client-side demo application
- Passwords stored in plain text in localStorage
- **NOT suitable for production use**
- No server-side validation or encryption

### Recommended for Production
- Server-side authentication
- Password hashing (bcrypt, Argon2)
- HTTPS encryption
- Database storage (MongoDB, PostgreSQL)
- JWT tokens for sessions
- Input sanitization

---

## Known Limitations

1. **No Server**: All data stored locally in browser
2. **No Multi-Device Sync**: Data doesn't sync across devices
3. **Clear Data**: Clearing browser data deletes all recipes
4. **No Image Upload**: Must provide external image URLs
5. **Plain Text Passwords**: Not encrypted (demo only)
6. **Single Browser**: Data tied to specific browser

---

## Future Enhancements

### Planned Features
- [ ] Export/Import recipes as JSON
- [ ] Print recipe functionality
- [ ] Shopping list generator
- [ ] Cooking timer integration
- [ ] Recipe ratings and reviews
- [ ] Social sharing
- [ ] Dark mode toggle
- [ ] Recipe tags system
- [ ] Advanced filtering (calories, time, difficulty)
- [ ] Recipe favorites/bookmarks
- [ ] User profile customization
- [ ] Multi-language support

### Technical Improvements
- [ ] Backend API integration
- [ ] Real database (MongoDB/PostgreSQL)
- [ ] User authentication (OAuth, JWT)
- [ ] Image upload to cloud storage
- [ ] PWA (Progressive Web App) support
- [ ] Offline functionality
- [ ] Unit testing
- [ ] Performance optimization

---

##  Browser Compatibility

### Fully Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features Used
- CSS Grid & Flexbox
- CSS Transforms & 3D
- LocalStorage API
- ES6+ JavaScript
- Arrow Functions
- Template Literals
- Classes

---

##  Contributing

This is a demo project, but improvements are welcome!

### How to Contribute
1. Fork the project
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Maintain responsive design
- Test on multiple browsers

---

##  Developer Information

### Project Details
- **Version**: 1.0.0
- **Created**: 2025
- **Type**: Single Page Application (SPA)
- **Dependencies**: None (Pure HTML/CSS/JS)

### Development Notes
- Single HTML file for easy deployment
- No build process required
- No npm packages or dependencies
- Works offline after first load
- Mobile-first responsive design

---

##  Acknowledgments

- **Unsplash**: For recipe placeholder images
- **Google Fonts**: For web fonts (if used)
- **Community**: For feedback and testing

---

##  Support & Contact

### Need Help?
- 📧 Open an issue on GitHub
- 💬 Check existing issues for solutions
- 📖 Read this README thoroughly

### Found a Bug?
Please report with:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable

---

##  Thank You!

Thank you for using Recipe Box! We hope this helps you organize and enjoy your favorite recipes. Happy cooking! 🍳👨‍🍳

---

**Made with ❤️ and JavaScript**