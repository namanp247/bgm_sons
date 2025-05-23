import { useState, useEffect } from 'react';
import { Package, Trash2, Edit, PlusCircle, Search, RefreshCw, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  created: string;
  description: string;
  specification: string;
  features: string;
}

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'branding', label: 'Branding' },
  { value: 'custom', label: 'Custom' },
];

const AdminDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; productId: string | null }>({ open: false, productId: null });
  
  const navigate = useNavigate();
  
  // Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    // Verify token with backend
    fetch('/api/admin/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      });
  }, [navigate]);
  
  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      }
      setIsLoading(false);
    };
    if (isAuthorized) fetchProducts();
  }, [isAuthorized]);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  // Handle edit product
  const handleEditProduct = (product: Product) => {
    navigate(`/admin/edit-product/${product.id}`);
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId: string) => {
    setSnackbar({ open: true, productId });
  };
  
  const confirmDeleteProduct = async () => {
    if (!snackbar.productId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/products/${snackbar.productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(product => product.id !== snackbar.productId));
      }
    } catch (err) {
      // Optionally show error
    }
    setSnackbar({ open: false, productId: null });
  };
  
  const cancelDeleteProduct = () => {
    setSnackbar({ open: false, productId: null });
  };
  
  // Placeholder for Edit Product Modal
  const EditProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Edit Product</h2>
        <p className="text-gray-600 mb-4">
          This is a placeholder for the edit product form. In a real application, this would be a form to edit product ID {editingProduct?.id}.
        </p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => setShowEditProductModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={() => setShowEditProductModal(false)}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!isAuthorized) return null;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Package size={24} />
              <h1 className="text-xl font-bold">BGM Sons Admin</h1>
              <User size={24} className="ml-4 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <User size={22} className="text-white" />
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-300"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="pt-0">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-3xl font-extrabold text-blue-900">Product Management</h2>
            <button 
              onClick={() => navigate('/admin/add-product')}
              className="flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow transition-colors duration-300"
            >
              <PlusCircle size={22} />
              <span>Add Product</span>
            </button>
          </div>
          
          {/* Improved Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
              className="flex items-center space-x-1 text-blue-900 hover:text-blue-700 border border-blue-900 rounded-md px-3 py-2 bg-white"
            >
              <RefreshCw size={16} />
              <span>Clear Filters</span>
            </button>
          </div>
          
          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-2"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-6 whitespace-normal align-top min-w-[300px]">
                          <div className="flex items-start">
                            <div className="flex flex-col items-center mr-6">
                              <div className="flex flex-row gap-2 mb-2">
                                {(product.images || []).map((img, i) => (
                                  <img
                                    key={i}
                                    className="h-16 w-16 rounded-md object-cover border border-gray-200"
                                    src={img}
                                    alt={product.name + ' image ' + (i + 1)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-blue-900 mb-1">{product.name}</div>
                              <div className="text-sm text-gray-500 mb-2">ID: {product.id}</div>
                              <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Description:</span> {product.description}</div>
                              <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Specification:</span> {product.specification}</div>
                              <div className="text-sm text-gray-700"><span className="font-medium">Features:</span> {product.features}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.created}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded shadow flex items-center transition"
                              title="Edit Product"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow flex items-center transition"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                  className="mt-2 text-blue-900 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {showEditProductModal && editingProduct && <EditProductModal />}
      
      {snackbar.open && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-lg px-6 py-4 flex items-center space-x-4 z-50 animate-fade-in">
          <span className="text-gray-900 font-medium">Are you sure you want to delete this product?</span>
          <button onClick={confirmDeleteProduct} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold">Yes</button>
          <button onClick={cancelDeleteProduct} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 font-medium">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;