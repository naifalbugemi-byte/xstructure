import { useState } from "react";
import { 
  Store, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Download, 
  Heart, 
  Share2, 
  Edit, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Image, 
  Video, 
  FileText, 
  Palette, 
  MoreVertical,
  Upload,
  Tag,
  Globe,
  Lock,
  Infinity,
  BarChart3
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'image' | 'video' | 'preset';
  category: string;
  price: number;
  thumbnail: string;
  previewUrl?: string;
  tags: string[];
  createdBy: string;
  createdAt: number;
  totalViews: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  isPublic: boolean;
  salesLimit: number | 'unlimited';
  remainingSales: number | 'unlimited';
}

const categories = [
  'All', 'Templates', 'Images', 'Videos', 'Presets', 'Graphics', 'Fonts', 'Effects'
];

const mockProducts: MarketplaceProduct[] = [
  {
    id: '1',
    title: 'Modern Instagram Story Template',
    description: 'Professional Instagram story template with animated elements',
    type: 'template',
    category: 'Templates',
    price: 9.99,
    thumbnail: 'https://picsum.photos/300/400?random=1',
    tags: ['instagram', 'story', 'modern', 'animated'],
    createdBy: 'DesignPro',
    createdAt: Date.now() - 86400000,
    totalViews: 1250,
    totalSales: 89,
    rating: 4.8,
    reviewCount: 23,
    isPublic: true,
    salesLimit: 'unlimited',
    remainingSales: 'unlimited'
  },
  {
    id: '2',
    title: 'Cinematic Video Preset Pack',
    description: 'Collection of 15 cinematic color grading presets',
    type: 'preset',
    category: 'Presets',
    price: 24.99,
    thumbnail: 'https://picsum.photos/300/400?random=2',
    tags: ['cinematic', 'color', 'grading', 'pack'],
    createdBy: 'ColorMaster',
    createdAt: Date.now() - 172800000,
    totalViews: 890,
    totalSales: 45,
    rating: 4.9,
    reviewCount: 18,
    isPublic: true,
    salesLimit: 100,
    remainingSales: 55
  },
  {
    id: '3',
    title: 'Minimalist Logo Collection',
    description: 'Set of 20 minimalist logo designs for various industries',
    type: 'image',
    category: 'Graphics',
    price: 19.99,
    thumbnail: 'https://picsum.photos/300/400?random=3',
    tags: ['logo', 'minimalist', 'collection', 'branding'],
    createdBy: 'LogoCraft',
    createdAt: Date.now() - 259200000,
    totalViews: 2100,
    totalSales: 156,
    rating: 4.7,
    reviewCount: 67,
    isPublic: true,
    salesLimit: 500,
    remainingSales: 344
  }
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-products' | 'create'>('browse');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products] = useState<MarketplaceProduct[]>(mockProducts);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    type: 'template' as const,
    category: 'Templates',
    price: 0,
    tags: [] as string[],
    salesLimit: 'unlimited' as number | 'unlimited',
    isPublic: true
  });

  const profile = useQuery(api.profiles.getCurrentProfile);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
      default:
        return b.totalSales - a.totalSales;
    }
  });

  const handleCreateProduct = async () => {
    if (!newProduct.title || !newProduct.description || newProduct.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Mock product creation
      toast.success("Product created successfully!");
      setShowCreateModal(false);
      setNewProduct({
        title: '',
        description: '',
        type: 'template',
        category: 'Templates',
        price: 0,
        tags: [],
        salesLimit: 'unlimited',
        isPublic: true
      });
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handlePurchase = async (product: MarketplaceProduct) => {
    if (!profile || profile.credits < Math.ceil(product.price)) {
      toast.error(`Insufficient credits. You need ${Math.ceil(product.price)} credits to purchase this item.`);
      return;
    }

    try {
      // Mock purchase logic
      toast.success(`Successfully purchased "${product.title}"!`);
    } catch (error) {
      toast.error("Purchase failed");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'preset': return Palette;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter flex items-center">
                <Store className="w-8 h-8 mr-3 text-blue-400" />
                Marketplace
              </h1>
              <p className="text-slate-300 mt-1 font-inter">
                Discover and sell creative assets
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 font-inter">Credits: {profile?.credits || 0}</span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all flex items-center font-inter font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Sell Product
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1 max-w-md">
            {[
              { id: 'browse', label: 'Browse', icon: Search },
              { id: 'my-products', label: 'My Products', icon: Store },
              { id: 'create', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors font-inter ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-inter"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-inter"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-inter"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                  const TypeIcon = getTypeIcon(product.type);
                  return (
                    <div key={product.id} className="glass-morphism rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/30 transition-all group">
                      <div className="relative">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
                            <TypeIcon className="w-4 h-4 text-blue-400" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 text-white hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-semibold font-inter">
                            ${product.price}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 font-inter line-clamp-1">{product.title}</h3>
                        <p className="text-slate-400 text-sm mb-3 font-inter line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white text-sm ml-1 font-inter">{product.rating}</span>
                              <span className="text-slate-400 text-sm ml-1 font-inter">({product.reviewCount})</span>
                            </div>
                          </div>
                          <div className="text-slate-400 text-sm font-inter">by {product.createdBy}</div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-slate-400 text-sm">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {product.totalViews}
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {product.totalSales}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs font-inter">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePurchase(product)}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-inter font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 inline mr-2" />
                          Purchase ({Math.ceil(product.price)} credits)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* My Products Tab */}
          {activeTab === 'my-products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white font-inter">My Products</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center font-inter"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {/* My Products List */}
              <div className="glass-morphism rounded-2xl border border-slate-700/50">
                <div className="p-6">
                  <div className="space-y-4">
                    {products.slice(0, 2).map((product) => (
                      <div key={product.id} className="flex items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold font-inter">{product.title}</h3>
                          <p className="text-slate-400 text-sm font-inter">{product.category}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-green-400 font-inter">${product.price}</span>
                            <span className="text-slate-400 font-inter">{product.totalViews} views</span>
                            <span className="text-slate-400 font-inter">{product.totalSales} sales</span>
                            <div className="flex items-center">
                              {product.salesLimit === 'unlimited' ? (
                                <Infinity className="w-4 h-4 text-blue-400 mr-1" />
                              ) : (
                                <span className="text-slate-400 font-inter">{product.remainingSales}/{product.salesLimit} left</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded text-xs font-inter ${
                            product.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {product.isPublic ? 'Public' : 'Private'}
                          </div>
                          <button className="text-slate-400 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white font-inter">Sales Analytics</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-inter">Total Sales</p>
                      <p className="text-2xl font-bold text-white font-inter">$1,234</p>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="glass-morphism rounded-2xl p-6 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-inter">Products Sold</p>
                      <p className="text-2xl font-bold text-white font-inter">89</p>
                    </div>
                    <div className="bg-cyan-500/20 p-3 rounded-xl">
                      <ShoppingCart className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="glass-morphism rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-inter">Total Views</p>
                      <p className="text-2xl font-bold text-white font-inter">4,567</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <Eye className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="glass-morphism rounded-2xl p-6 border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-inter">Active Products</p>
                      <p className="text-2xl font-bold text-white font-inter">12</p>
                    </div>
                    <div className="bg-orange-500/20 p-3 rounded-xl">
                      <Store className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="glass-morphism rounded-2xl border border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white font-inter">Top Performing Products</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-slate-400 font-bold text-lg">#{index + 1}</div>
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="text-white font-medium font-inter">{product.title}</h4>
                            <p className="text-slate-400 text-sm font-inter">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold font-inter">${(product.price * product.totalSales).toFixed(2)}</p>
                          <p className="text-slate-400 text-sm font-inter">{product.totalSales} sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white font-inter">Create New Product</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1 font-inter">Product Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-inter"
                  placeholder="Enter product title..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1 font-inter">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-inter"
                  rows={3}
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-inter">Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-inter"
                  >
                    <option value="template">Template</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="preset">Preset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1 font-inter">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-inter"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1 font-inter">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-inter"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1 font-inter">Sales Limit</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newProduct.salesLimit === 'unlimited'}
                      onChange={() => setNewProduct({ ...newProduct, salesLimit: 'unlimited' })}
                      className="mr-2"
                    />
                    <span className="text-white font-inter">Unlimited</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={typeof newProduct.salesLimit === 'number'}
                      onChange={() => setNewProduct({ ...newProduct, salesLimit: 1 })}
                      className="mr-2"
                    />
                    <span className="text-white font-inter">Limited</span>
                  </label>
                  {typeof newProduct.salesLimit === 'number' && (
                    <input
                      type="number"
                      min="1"
                      value={newProduct.salesLimit}
                      onChange={(e) => setNewProduct({ ...newProduct, salesLimit: parseInt(e.target.value) })}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white w-20"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isPublic}
                    onChange={(e) => setNewProduct({ ...newProduct, isPublic: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-white font-inter">Make product public</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-inter"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-inter"
                >
                  Create Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
