import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LuMail as Mail, LuPhone as Phone, LuMapPin as MapPin, LuSend as Send, LuStar as Star, LuMessageSquare as MessageSquare, LuMessageCircle as MessageCircle, LuTag as Tag } from 'react-icons/lu';
import api from '../../../lib/axios';
import SleekDropdown from '../../../components/ui/SleekDropdown';

export default function ContactPage() {
  const { user } = useSelector((state) => state.auth);

  const [formType, setFormType] = useState('contact'); // 'contact', 'feedback', 'testimonial'
  const [formData, setFormData] = useState({ 
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '' : '', 
    email: user?.email || '', 
    message: '', 
    type: 'GENERAL', 
    rating: 5 
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const [contactInfo, setContactInfo] = useState(null);
  const [fetchingInfo, setFetchingInfo] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await api.get('/api/v1/engagement/contact-details');
        setContactInfo(res.data);
      } catch (err) {
        console.error('Failed to fetch contact info', err);
      } finally {
        setFetchingInfo(false);
      }
    };
    fetchContactInfo();
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formType === 'testimonial') {
        await api.post('/api/v1/engagement/testimonials', {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          rating: formData.rating,
          profileImageUrl: ''
        });
      } else {
        await api.post('/api/v1/engagement/feedback', {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          type: formType === 'feedback' ? formData.type : 'CONTACT_US'
        });
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ 
        name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '' : '', 
        email: user?.email || '', 
        message: '', 
        type: 'GENERAL', 
        rating: 5 
      });
    } catch (err) {
      console.error('Failed to submit form', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-transparent w-full pb-20">
      {/* Hero Background - FIXED */}
      <div className="fixed top-20 left-0 right-0 h-[45vh] min-h-[300px] flex-shrink-0 overflow-hidden shadow-sm z-0 rounded-b-[3rem] bg-[#eab308]">
        <img src="/images/bakery_chef.png" alt="Chef" className="absolute -left-10 md:left-10 bottom-0 h-[80%] opacity-20 object-contain" />
        <img src="/images/hero_cake.png" alt="Cake" className="absolute -right-10 md:right-10 top-10 h-[60%] opacity-20 object-contain rotate-12" />
      </div>

      {/* Hero Content - Scrolls with the page */}
      <div className="relative z-10 h-[45vh] min-h-[300px] flex-shrink-0 w-full flex flex-col items-center justify-center pb-20">
        <div className="max-w-7xl mx-auto w-full text-center text-white px-6">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            We'd Love to Hear<br/>From You!
          </h1>
          <p className="text-white/90 max-w-lg mx-auto text-lg">
            Have a question about our baked goods, a special order, or just want to say hi? Send us a message!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto w-full px-6 -mt-16 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Info Cards */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Our Location</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {fetchingInfo ? 'Loading...' : contactInfo?.address || 'Address not configured'}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Call Us</h3>
                <p className="text-muted-foreground text-sm">
                  {fetchingInfo ? 'Loading...' : (contactInfo?.phoneNumbers?.length > 0 ? contactInfo.phoneNumbers.map((p, i) => <React.Fragment key={i}>{p}<br/></React.Fragment>) : 'Phone not configured')}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Email Us</h3>
                <p className="text-muted-foreground text-sm">
                  {fetchingInfo ? 'Loading...' : (contactInfo?.emails?.length > 0 ? contactInfo.emails.map((e, i) => <React.Fragment key={i}>{e}<br/></React.Fragment>) : 'Email not configured')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-card border border-border rounded-[2.5rem] p-10 shadow-xl">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Send a Message</h2>
            <p className="text-muted-foreground mb-8">We will get back to you as soon as possible.</p>

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl p-4 mb-6 font-medium flex items-center">
                <Send className="w-5 h-5 mr-3" />
                Message sent successfully! We'll be in touch soon.
              </div>
            )}

            <div className="flex bg-muted/50 p-1 rounded-xl mb-8">
              <button
                type="button"
                onClick={() => setFormType('contact')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${formType === 'contact' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Mail className="w-4 h-4" /> Message
              </button>
              <button
                type="button"
                onClick={() => setFormType('feedback')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${formType === 'feedback' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <MessageCircle className="w-4 h-4" /> Feedback
              </button>
              <button
                type="button"
                onClick={() => setFormType('testimonial')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${formType === 'testimonial' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Star className="w-4 h-4" /> Testimonial
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    disabled={!!user}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-muted/70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    disabled={!!user}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-muted/70"
                  />
                </div>
              </div>

              {formType === 'feedback' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Feedback Type</label>
                  <SleekDropdown
                    icon={Tag}
                    iconColor="text-primary-500"
                    headerTitle="Select Feedback Type"
                    fullWidth
                    options={[
                      { value: 'GENERAL',  label: 'General' },
                      { value: 'DELIVERY', label: 'Delivery' },
                      { value: 'PRODUCT',  label: 'Product Quality' },
                      { value: 'APP',      label: 'App Experience' },
                    ]}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                  />
                </div>
              )}

              {formType === 'testimonial' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${formData.rating >= star ? 'fill-[#eab308] text-[#eab308]' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">{formType === 'testimonial' ? 'Your Testimonial' : 'Your Message'}</label>
                <textarea 
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you today?"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl w-full sm:w-auto transition-colors flex items-center justify-center">
                {loading ? <span className="animate-spin mr-2 border-b-2 border-white w-4 h-4 rounded-full"></span> : <Send className="w-5 h-5 mr-2" />}
                Submit {formType === 'testimonial' ? 'Testimonial' : formType === 'feedback' ? 'Feedback' : 'Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto w-full px-6 mt-24 mb-24">
        <div className="bg-card border border-border rounded-[2.5rem] p-10 lg:p-16 shadow-xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="md:w-1/2 z-10">
            <span className="text-[#eab308] font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">About Blu's Bakery</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded with a passion for bringing the finest, freshest baked goods to your table, Blu's Bakery started as a small dream and has grown into a beloved destination for pastry lovers.
              </p>
              <p>
                We believe in using only the highest quality ingredients, traditional baking methods, and a lot of love. From our artisanal sourdough breads to our decadent custom cakes, every item is crafted to perfection to ensure you get the best experience in every bite.
              </p>
              <p className="font-semibold text-foreground pt-2">
                "Baking the world a better place, one treat at a time."
              </p>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-64 md:h-[400px] rounded-3xl overflow-hidden shadow-lg relative">
            <img src="/images/bakery_chef.png" alt="Our Baker" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
