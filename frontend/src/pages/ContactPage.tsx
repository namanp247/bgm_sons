import React, { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    industry: 'Select Industry',
    productInterest: 'Select Product Interest'
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const industries = [
    'Automotive',
    'Solar Energy',
    'Furniture',
    'Electronics',
    'Food & Beverage',
    'Pharmaceutical',
    'Other'
  ];
  
  const productInterests = [
    'Warning & Safety Labels',
    'Product Branding Labels',
    'Equipment Tags',
    'Custom Die-Cut Labels',
    'Promotional Stickers',
    'QR Code Labels',
    'Eco-Friendly Solutions',
    'Other'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (formData.industry === 'Select Industry') {
      errors.industry = 'Please select an industry';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {

      const res = await fetch(`/api/mail/send-enquiry`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({...formData}),
      });

      if(!res.ok) throw new Error('Failed to send inquiry');

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        industry: 'Select Industry',
        productInterest: 'Select Product Interest'
      });
    } catch (error) {
      setSubmitError('There was a problem submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team for inquiries, custom solutions, and quotes. We're here to help you with all your labeling needs.
          </p>
        </div>
      </section>
      
      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <div className="bg-blue-900 text-white rounded-full p-4 mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Phone</h3>
              <p className="text-gray-700 mb-2">Sales & Support</p>
              <a href="tel:+917982845161" className="text-blue-700 hover:text-blue-900 font-semibold">+91 79828 45161</a>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <div className="bg-blue-900 text-white rounded-full p-4 mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Email</h3>
              <p className="text-gray-700 mb-2">Send us a message</p>
              <a href="mailto:bgmsons22@gmail.com" className="text-blue-700 hover:text-blue-900 font-semibold">bgmsons22@gmail.com</a>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <div className="bg-blue-900 text-white rounded-full p-4 mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Address</h3>
              <p className="text-gray-700 mb-2">Our Headquarters</p>
              <address className="not-italic text-blue-700">
                Plot No. 2, Shyam Vihar Phase 2<br />
                Main Dwarka Road, Najafgarh<br />
                New Delhi - 110043
              </address>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <div className="bg-blue-900 text-white rounded-full p-4 mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Hours</h3>
              <p className="text-gray-700 mb-2">Business Hours</p>
              <p className="text-blue-700">
                Monday - Saturday<br />
                9:00 AM - 10:00 PM IST
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="font-semibold">Thank you for your inquiry!</p>
                  <p>We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="industry" className="block text-gray-700 font-medium mb-2">Industry *</label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.industry ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option disabled>Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                      {formErrors.industry && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.industry}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="productInterest" className="block text-gray-700 font-medium mb-2">Product Interest</label>
                      <select
                        id="productInterest"
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option disabled>Select Product Interest</option>
                        {productInterests.map((product) => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your project or inquiry..."
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Visit Our Facility</h2>
              
              {/* Map Placeholder - In a real app, would use Google Maps or similar */}
              <div className="bg-gray-200 h-80 mb-8 rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/4481808/pexels-photo-4481808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Company location" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Factory Tours</h3>
                <p className="text-gray-700 mb-4">
                  Interested in seeing our manufacturing process? We offer guided tours of our facility for potential clients and partners.
                </p>
                <p className="text-gray-700">
                  Tours are available by appointment on Tuesdays and Thursdays. Please contact us at least 48 hours in advance to schedule.
                </p>
              </div>
              
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Request a Sample</h3>
                <p className="text-gray-700 mb-4">
                  Want to see the quality of our products firsthand? Request a free sample pack customized to your industry needs.
                </p>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                  Request Samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700">
              Find quick answers to common questions about our products and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  question: 'What is the minimum order quantity?',
                  answer: 'Our minimum order quantity varies by product type. For standard labels, we typically have a minimum of 500 pieces, while custom designs may require 1,000 pieces. Please contact us for specific requirements.'
                },
                {
                  question: 'How long does production take?',
                  answer: 'Production time depends on the complexity and quantity of your order. Standard products typically take 5-7 business days, while custom designs may take 10-14 business days. Rush orders are available for an additional fee.'
                },
                {
                  question: 'Do you offer design services?',
                  answer: 'Yes, we have an in-house design team that can help create custom labels and stickers based on your specifications. We provide initial design concepts and revisions until you\'re completely satisfied.'
                },
                {
                  question: 'What materials do you use?',
                  answer: 'We offer a wide range of materials including vinyl, polyester, polycarbonate, paper, and eco-friendly options. Our team can recommend the best material based on your application and environmental conditions.'
                },
                {
                  question: 'Do you ship internationally?',
                  answer: 'Yes, we ship worldwide. International shipping costs and delivery times vary by destination. Please contact us for a shipping quote to your location.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
