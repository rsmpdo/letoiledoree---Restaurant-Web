import React, { useState } from 'react';

const MENU_ITEMS = [
  {
    id: 'm1',
    category: 'starters',
    name: 'Fleurs de Courgette Farcies',
    price: 28,
    description: 'Crispy zucchini blossoms filled with artisanal ricotta, wild truffle honey, and toasted pine nuts.',
    dietary: ['Vegetarian'],
    image: '/assets/starter_zucchini.svg'
  },
  {
    id: 'm2',
    category: 'starters',
    name: 'Carpaccio de Saint-Jacques',
    price: 32,
    description: 'Thinly sliced Hokkaido scallops, finger lime caviar, white truffle oil, and sea bean emulsion.',
    dietary: ['Gluten-Free'],
    image: '/assets/starter_scallops.svg'
  },
  {
    id: 'm3',
    category: 'mains',
    name: 'Filet de Boeuf au Foie Gras',
    price: 68,
    description: 'Prime dry-aged beef tenderloin topped with seared foie gras, potato fondant, and Périgueux truffle jus.',
    dietary: [],
    image: '/assets/main_beef.svg'
  },
  {
    id: 'm4',
    category: 'mains',
    name: 'Halibut en Croûte d\'Herbes',
    price: 54,
    description: 'Wild-caught halibut, garden herb crust, saffron-infused fennel purée, and champagne velouté.',
    dietary: ['Gluten-Free'],
    image: '/assets/main_halibut.svg'
  },
  {
    id: 'm5',
    category: 'mains',
    name: 'Risotto aux Morilles et Asperges',
    price: 46,
    description: 'Acquerello carnaroli rice, wild morels, green asparagus, and 36-month aged Parmigiano Reggiano.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    image: '/assets/main_risotto.svg'
  },
  {
    id: 'm6',
    category: 'desserts',
    name: 'Soufflé au Chocolat Grand Cru',
    price: 24,
    description: 'Baked Valrhona dark chocolate soufflé, Madagascar vanilla bean gelato, and 24k edible gold leaf.',
    dietary: ['Vegetarian'],
    image: '/assets/dessert_souffle.svg'
  },
  {
    id: 'm7',
    category: 'desserts',
    name: 'Tarte au Citron Déconstruite',
    price: 22,
    description: 'Meyer lemon curd, toasted Italian meringue, buttery sarrasin crumble, and fresh basil gel.',
    dietary: ['Vegetarian'],
    image: '/assets/dessert_lemon.svg'
  },
  {
    id: 'm8',
    category: 'drinks',
    name: 'L\'Étoile Royale',
    price: 26,
    description: 'Vintage Champagne, Chambord black raspberry liqueur, artisanal gold leaf flakes, and fresh blackberry.',
    dietary: ['Vegan', 'Gluten-Free'],
    image: '/assets/drink_royale.svg'
  },
  {
    id: 'm9',
    category: 'drinks',
    name: 'Smoked Rosemary Old Fashioned',
    price: 24,
    description: 'Premium Kentucky Bourbon, orange bitters, charred rosemary sprig, served under applewood smoke.',
    dietary: ['Vegan', 'Gluten-Free'],
    image: '/assets/drink_oldfashioned.svg'
  }
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Main Courses' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Signature Drinks' }
  ];

  const diets = [
    { id: 'all', label: 'All Options' },
    { id: 'Vegetarian', label: 'Vegetarian' },
    { id: 'Vegan', label: 'Vegan' },
    { id: 'Gluten-Free', label: 'Gluten-Free' }
  ];

  const filteredItems = MENU_ITEMS.filter(item => {
    const categoryMatch = activeTab === 'all' || item.category === activeTab;
    const dietMatch = dietFilter === 'all' || item.dietary.includes(dietFilter);
    return categoryMatch && dietMatch;
  });

  return (
    <section id="menu" className="section menu-section">
      <div className="container">
        <h2>The Culinary Creations</h2>
        <p className="menu-intro text-center">
          Our menu changes with the seasons, showcasing premium ingredients sourced from local organic farms and world-class culinary artisans.
        </p>

        {/* Categories Tab */}
        <div className="menu-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="diet-filters">
          <span className="filter-label">Dietary:</span>
          {diets.map((diet) => (
            <button
              key={diet.id}
              className={`diet-filter-btn ${dietFilter === diet.id ? 'active' : ''}`}
              onClick={() => setDietFilter(diet.id)}
            >
              {diet.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card glass-panel">
              <div className="menu-item-image-wrapper">
                <img src={item.image} alt={item.name} className="menu-item-img" onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23121212%22/><text x=%2250%%22 y=%2250%%22 fill=%22%23c5a880%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22>Gourmet Creation</text></svg>";
                }} />
                {item.dietary.map(diet => (
                  <span key={diet} className={`dietary-tag dietary-${diet.toLowerCase().replace(' ', '-')}`}>
                    {diet}
                  </span>
                ))}
              </div>
              <div className="menu-item-info">
                <div className="menu-item-header">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <span className="menu-item-price">${item.price}</span>
                </div>
                <p className="menu-item-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="menu-no-results text-center">
            <p>No culinary creations match your selected combinations.</p>
          </div>
        )}
      </div>
    </section>
  );
}
