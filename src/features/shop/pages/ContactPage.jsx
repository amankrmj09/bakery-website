import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex flex-col bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-[#eab308] pt-12 pb-24 px-6 relative overflow-hidden rounded-b-[3rem] shadow-sm">
        <div className="max-w-7xl mx-auto w-full relative z-10 text-center text-white">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            We'd Love to Hear<br/>From You!
          </h1>
          <p className="text-white/90 max-w-lg mx-auto text-lg">
            Have a question about our baked goods, a special order, or just want to say hi? Send us a message!
          </p>
        </div>
        <img src="/images/bakery_chef.png" alt="Chef" className="absolute -left-10 md:left-10 bottom-0 h-[80%] opacity-20 object-contain" />
        <img src="/images/hero_cake.png" alt="Cake" className="absolute -right-10 md:right-10 top-10 h-[60%] opacity-20 object-contain rotate-12" />
      </section>

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
                <p className="text-muted-foreground text-sm">123 Bakery Street, Sweet Town<br/>NY 10001, USA</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Call Us</h3>
                <p className="text-muted-foreground text-sm">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Email Us</h3>
                <p className="text-muted-foreground text-sm">hello@blubugbakery.com<br/>support@blubugbakery.com</p>
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
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Your Message</label>
                <textarea 
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you today?"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl w-full sm:w-auto transition-colors flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
