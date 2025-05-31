import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  images: string[];
  created: string;
  description: string;
  specification: string;
  features: string;
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

useEffect(() => {
    const fetchProduct = async () => {
       setLoading(true);
       setError('');
       try {
        const res = await fetch(`/api/products/${id}`);
         if (!res.ok) throw new Error('Product not found');
         const data = await res.json();
        setProduct(data);
       } catch (err: any) {
         setError(err.message || 'Error loading product');
       } finally {
        setLoading(false);
       }
     };
    if (id) fetchProduct();
   }, [id]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!form.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if(formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm()){
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      
      const res = await fetch(`/api/mail/send-product-enquiry`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...form, "productId": id}),
      });

      if(!res.ok) throw new Error('Failed to send product enquiry');

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });

    } catch (error) {
      setSubmitError('There was a problem submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-16 text-center text-xl">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-16 text-center text-red-600 text-xl">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Images */}
        <div className="md:w-1/2">
          {product.images && product.images.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={product.name + ' image ' + (idx + 1)}
                  className="rounded-xl border border-gray-200 h-64 w-auto object-cover"
                  style={{ minWidth: '16rem' }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        {/* Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">{product.name}</h1>
            <div className="text-blue-700 font-semibold mb-4">{product.category}</div>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>
            {product.features && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-blue-900 mb-1">Features</h2>
                <ul className="list-disc list-inside text-gray-700">
 {product.features
     .split('\n')
     .filter(Boolean)
     .map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
            {product.specification && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-blue-900 mb-1">Specifications</h2>
                <div className="text-gray-700 whitespace-pre-line">{product.specification}</div>
</div>
            )}
          </div>
        </div>
      </div>
      {/* Enquiry Form */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Enquire about this product</h2>
        {submitted ? (
          <div className="text-green-700 font-semibold text-lg">Thank you! We have received your enquiry.</div>
        ) : (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {submitError}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  formErrors.name ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  formErrors.email ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  formErrors.message ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.message && (
                <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              >
              {isSubmitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage; 
