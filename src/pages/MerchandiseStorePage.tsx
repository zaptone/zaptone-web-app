import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Star, 
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Truck,
  Shield,
  Zap,
  Package,
  Shirt,
  Disc,
  Image,
  Gift
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for merchandise
const merchandise = [
  {
    id: 1,
    name: 'ZapTone Logo T-Shirt',
    artist: 'ZapTone Official',
    price: 25000, // sats
    priceUSD: 25,
    category: 'Clothing',
    type: 'T-Shirt',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stock: 50,
    images: [''],
    description: 'Premium cotton t-shirt with embroidered ZapTone logo',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Purple'],
    isLimited: false,
    artist_verified: true
  },
  {
    id: 2,
    name: 'Electronic Dreams Vinyl',
    artist: 'Synthwave Master',
    price: 45000, // sats
    priceUSD: 45,
    category: 'Music',
    type: 'Vinyl',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    stock: 25,
    images: [''],
    description: 'Limited edition 180g vinyl pressing of the acclaimed album',
    sizes: [],
    colors: ['Clear Purple', 'Black'],
    isLimited: true,
    artist_verified: true
  },
  {
    id: 3,
    name: 'Jazz Trio Poster Set',
    artist: 'Jazz Collective',
    price: 15000,
    priceUSD: 15,
    category: 'Art',
    type: 'Poster',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    stock: 100,
    images: [''],
    description: 'Set of 3 high-quality art prints from live performances',
    sizes: ['A3', 'A2', 'A1'],
    colors: [],
    isLimited: false,
    artist_verified: true
  },
  {
    id: 4,
    name: 'Signed Album Cover',
    artist: 'Folk Wanderer',
    price: 75000,
    priceUSD: 75,
    category: 'Collectibles',
    type: 'Signed Item',
    rating: 5.0,
    reviews: 23,
    inStock: true,
    stock: 5,
    images: [''],
    description: 'Hand-signed album cover with certificate of authenticity',
    sizes: [],
    colors: [],
    isLimited: true,
    artist_verified: true
  },
  {
    id: 5,
    name: 'Electronic Beats Hoodie',
    artist: 'Electronic Dreams',
    price: 55000,
    priceUSD: 55,
    category: 'Clothing',
    type: 'Hoodie',
    rating: 4.7,
    reviews: 156,
    inStock: false,
    stock: 0,
    images: [''],
    description: 'Comfortable hoodie with unique sound wave design',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy'],
    isLimited: false,
    artist_verified: true
  },
  {
    id: 6,
    name: 'Mystery Box - Artist Pack',
    artist: 'Various Artists',
    price: 100000,
    priceUSD: 100,
    category: 'Special',
    type: 'Mystery Box',
    rating: 4.9,
    reviews: 45,
    inStock: true,
    stock: 15,
    images: [''],
    description: 'Curated collection of exclusive items from top artists',
    sizes: [],
    colors: [],
    isLimited: true,
    artist_verified: false
  }
];

const categories = ['All', 'Clothing', 'Music', 'Art', 'Collectibles', 'Special'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Best Selling'];

export function MerchandiseStorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);

  const filteredMerchandise = merchandise
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Clothing': return <Shirt className="w-4 h-4" />;
      case 'Music': return <Disc className="w-4 h-4" />;
      case 'Art': return <Image className="w-4 h-4" />;
      case 'Collectibles': return <Star className="w-4 h-4" />;
      case 'Special': return <Gift className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

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
            Support your favorite artists by purchasing official merchandise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Package className="w-3 h-3 mr-1" />
            Official Store
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search merchandise, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`gap-2 ${selectedCategory === category ? 
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                ""
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{merchandise.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {merchandise.filter(item => item.artist_verified).length}
                </p>
                <p className="text-xs text-muted-foreground">Verified Artists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {merchandise.filter(item => item.isLimited).length}
                </p>
                <p className="text-xs text-muted-foreground">Limited Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{cart.length}</p>
                <p className="text-xs text-muted-foreground">Items in Cart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMerchandise.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="relative">
                {/* Product Image */}
                <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {getCategoryIcon(item.category)}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isLimited && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                        Limited
                      </Badge>
                    )}
                    {item.artist_verified && (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive">Sold Out</Badge>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Product Info */}
                <div>
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({item.reviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{item.price.toLocaleString()} sats</span>
                    </div>
                    <span className="text-xs text-muted-foreground">${item.priceUSD}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                {/* Stock Info */}
                {item.inStock && (
                  <div className="text-xs text-muted-foreground">
                    {item.stock} in stock
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  onClick={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item.id)}
                  disabled={!item.inStock}
                  className={`w-full ${
                    isInCart(item.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInCart(item.id) ? 'Remove from Cart' : 'Add to Cart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="sticky bottom-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <div>
                  <p className="font-semibold">{cart.length} items in cart</p>
                  <p className="text-sm text-white/80">
                    Total: {merchandise
                      .filter(item => cart.includes(item.id))
                      .reduce((total, item) => total + item.price, 0)
                      .toLocaleString()} sats
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-purple-600 border-white/20">
                  View Cart
                </Button>
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  <Zap className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">Lightning Payments</h3>
              <p className="text-sm text-muted-foreground">
                Pay instantly with Bitcoin Lightning Network
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free worldwide shipping on orders over $50
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">Authentic Products</h3>
              <p className="text-sm text-muted-foreground">
                All items are official and artist-verified
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
