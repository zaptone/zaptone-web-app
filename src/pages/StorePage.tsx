import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Heart,
  Star,
  CreditCard,
  Search,
  Grid,
  List,
  Package
} from 'lucide-react';

// Mock merchandise data
const merchandise = [
  {
    id: 1,
    name: 'ZapTone Logo T-Shirt',
    artist: 'ZapTone Official',
    price: 25.99,
    category: 'Clothing',
    type: 'T-Shirt',
    image: '',
    description: 'Premium cotton t-shirt with ZapTone logo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Purple'],
    inStock: true,
    rating: 4.8,
    reviews: 124,
    isExclusive: false
  },
  {
    id: 2,
    name: 'Limited Edition Vinyl Record',
    artist: 'Electronic Dreams',
    price: 34.99,
    category: 'Music',
    type: 'Vinyl',
    image: '',
    description: 'Limited edition vinyl of the hit album Digital Future',
    sizes: [],
    colors: ['Translucent Purple'],
    inStock: true,
    rating: 4.9,
    reviews: 89,
    isExclusive: true
  },
  {
    id: 3,
    name: 'Artist Signature Hoodie',
    artist: 'Chill Collective',
    price: 45.99,
    category: 'Clothing',
    type: 'Hoodie',
    image: '',
    description: 'Cozy hoodie with artist signature design',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy'],
    inStock: true,
    rating: 4.7,
    reviews: 76,
    isExclusive: false
  },
  {
    id: 4,
    name: 'Signed Poster Collection',
    artist: 'Various Artists',
    price: 19.99,
    category: 'Art',
    type: 'Poster',
    image: '',
    description: 'Set of 3 signed posters from top ZapTone artists',
    sizes: ['A3'],
    colors: [],
    inStock: false,
    rating: 4.6,
    reviews: 34,
    isExclusive: true
  },
  {
    id: 5,
    name: 'Premium Headphones',
    artist: 'ZapTone Official',
    price: 149.99,
    category: 'Accessories',
    type: 'Headphones',
    image: '',
    description: 'High-quality studio headphones with ZapTone branding',
    sizes: [],
    colors: ['Black', 'Purple'],
    inStock: true,
    rating: 4.9,
    reviews: 203,
    isExclusive: false
  },
  {
    id: 6,
    name: 'Coffee Mug Set',
    artist: 'Various Artists',
    price: 16.99,
    category: 'Accessories',
    type: 'Mug',
    image: '',
    description: 'Set of 2 ceramic mugs with artist designs',
    sizes: ['11oz'],
    colors: ['White', 'Black'],
    inStock: true,
    rating: 4.4,
    reviews: 67,
    isExclusive: false
  }
];

const categories = ['All', 'Clothing', 'Music', 'Art', 'Accessories'];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Selling'];

export function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);

  const filteredItems = merchandise.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (itemId: number) => {
    setCart(prev => [...prev, itemId]);
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(id => id !== itemId));
  };

  const isInCart = (itemId: number) => cart.includes(itemId);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Merchandise Store
          </h1>
          <p className="text-muted-foreground mt-2">
            Support your favorite artists with exclusive merchandise and collectibles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-600" />
          {cart.length > 0 && (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
              {cart.length} items
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                  ""
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Featured Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchandise.filter(item => item.isExclusive).slice(0, 3).map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative mb-3">
                    <Package className="w-8 h-8 text-purple-600/60" />
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                      Exclusive
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold truncate mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.artist}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">${item.price}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Merchandise Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative mb-4">
                  <Package className="w-12 h-12 text-purple-600/60" />
                  
                  {item.isExclusive && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                      Exclusive
                    </Badge>
                  )}
                  
                  {!item.inStock && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                      Sold Out
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({item.reviews} reviews)</span>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-purple-600">${item.price}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      {item.inStock ? (
                        <Button
                          size="sm"
                          onClick={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item.id)}
                          className={isInCart(item.id) ? 
                            "bg-green-600 hover:bg-green-700" : 
                            "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          }
                        >
                          {isInCart(item.id) ? 'Added' : 'Add to Cart'}
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          Sold Out
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative flex-shrink-0">
                    <Package className="w-8 h-8 text-purple-600/60" />
                    {item.isExclusive && (
                      <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                        E
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                        <span className="text-xs text-muted-foreground">({item.reviews})</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xl font-bold text-purple-600">${item.price}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      {item.inStock ? (
                        <Button
                          size="sm"
                          onClick={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item.id)}
                          className={isInCart(item.id) ? 
                            "bg-green-600 hover:bg-green-700" : 
                            "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          }
                        >
                          {isInCart(item.id) ? 'Added' : 'Add to Cart'}
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          Sold Out
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Shopping Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total: ${cart.reduce((total, itemId) => {
                    const item = merchandise.find(m => m.id === itemId);
                    return total + (item?.price || 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCart([])}>
                  Clear Cart
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
