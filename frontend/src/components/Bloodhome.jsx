import React, { useState, useEffect, useRef } from 'react';
import { Heart, Phone, Mail, Facebook, Instagram, Twitter, Users, Droplet, ChevronDown, Award, Shield, Clock, MapPin, Calendar, ArrowRight, Star, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Bloodhome = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    donors: 0,
    donations: 0,
    lives: 0,
    total_savers: 0,
    satisfaction_rate: 0
  });
  const [announcements, setAnnouncements] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', review: '', rating: 5 });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch and animate counters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/public-home-data/');
        if (response.ok) {
          const data = await response.json();
          const targets = data.stats;
          setAnnouncements(data.announcements);
          setFeedbacks(data.feedbacks || []);

          // Animation logic
          const duration = 2000;
          const steps = 60;
          const increment = duration / steps;
          let current = { donors: 0, donations: 0, lives: 0, total_savers: 0, satisfaction_rate: 0 };

          const timer = setInterval(() => {
            let updated = false;
            Object.keys(targets).forEach(key => {
              if (current[key] < targets[key]) {
                const stepChange = key === 'satisfaction_rate'
                  ? targets[key] / steps
                  : Math.ceil(targets[key] / steps);
                current[key] = Math.min(current[key] + stepChange, targets[key]);
                updated = true;
              }
            });

            setStats({ ...current });
            if (!updated) clearInterval(timer);
          }, increment);

          setLoading(false);
          return () => clearInterval(timer);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        // Fallback to static numbers if API fails to keep UI clean
        const targets = { donors: 5000, donations: 100, lives: 10000 };
        setStats(targets);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Testimonial rotation
  useEffect(() => {
    if (feedbacks.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % feedbacks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [feedbacks]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/submit-feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm)
      });

      if (response.ok) {
        setFormMessage({ type: 'success', text: 'Thank you! Your feedback has been submitted for approval.' });
        setFeedbackForm({ name: '', review: '', rating: 5 });
      } else {
        const data = await response.json();
        setFormMessage({ type: 'error', text: data.error || 'Failed to submit feedback. Please try again.' });
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setFormSubmitting(false);
    }
  };



  const bloodTypes = [
    { type: 'O-', label: 'Universal Donor', color: 'from-[#900000] to-[#700000]', description: 'Can donate to all blood types' },
    { type: 'O+', label: 'Most Common', color: 'from-orange-500 to-[#900000]', description: '37% of population' },
    { type: 'A-', label: 'Rare Type', color: 'from-blue-500 to-blue-700', description: 'Only 6% have this' },
    { type: 'A+', label: 'Common Type', color: 'from-blue-400 to-blue-600', description: '34% of population' },
    { type: 'B-', label: 'Rare Type', color: 'from-green-500 to-green-700', description: 'Only 2% have this' },
    { type: 'B+', label: 'Common Type', color: 'from-green-400 to-green-600', description: '9% of population' },
    { type: 'AB-', label: 'Rarest Type', color: 'from-purple-500 to-purple-700', description: 'Less than 1%' },
    { type: 'AB+', label: 'Universal Receiver', color: 'from-purple-400 to-purple-600', description: 'Can receive all types' }
  ];

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Round-the-clock service to ensure blood is available when needed most"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Safe",
      description: "Certified facilities with strict hygiene and safety protocols"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Multiple Locations",
      description: "Convenient donation centers across the city for easy access"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Team",
      description: "Trained medical professionals ensuring quality care"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'
        }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo size={scrolled ? 40 : 48} color={scrolled ? '#900000' : '#ffffff'} />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#900000]' : 'text-white hover:text-red-200'}`}
              >
                Home
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#900000]' : 'text-white hover:text-red-200'}`}
              >
                About
              </button>
              <button
                onClick={() => document.getElementById('types')?.scrollIntoView({ behavior: 'smooth' })}
                className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#900000]' : 'text-white hover:text-red-200'}`}
              >
                Blood Types
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#900000]' : 'text-white hover:text-red-200'}`}
              >
                Contact
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#900000] to-[#b00000] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Completely New Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#900000] via-[#700000] to-[#500000]">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: Math.random() * 300 + 50 + 'px',
                  height: Math.random() * 300 + 50 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 3 + 's',
                  animationDuration: Math.random() * 4 + 3 + 's'
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-8">
              

              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Every Drop
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Counts
                </span>
              </h1>

              <p className="text-xl text-white/90 leading-relaxed">
                Be the reason someone smiles today. Your single donation can save up to three lives.
                Join our community of heroes making a real difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Learn More
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300">{stats.donations}+</div>
                  <div className="text-sm text-white/80">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300">{stats.donors}+</div>
                  <div className="text-sm text-white/80">Active Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300">
                    {stats.lives}+
                  </div>
                  <div className="text-sm text-white/80">Lives Saved</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className="relative">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Announcements Banner / Alerts if any */}
                {announcements.length > 0 && (
                  <div className="absolute -top-10 left-0 right-0 z-20 animate-bounce">
                    <div className="bg-yellow-400 text-[#500000] px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>Active Campaign: {announcements[0].title}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Central Blood Drop */}
                <div className="absolute w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Heart className="w-32 h-32 text-[#900000] fill-current" />
                </div>

                {/* Orbiting Elements */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full animate-spin"
                    style={{
                      animationDuration: `${10 + i * 2}s`,
                      animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                    }}
                  >
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <Droplet className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-[#900000]">LifeFlow?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making blood donation safe, easy, and impactful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#900000] to-[#700000] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Recent <span className="text-[#900000]">Announcements</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stay updated with our latest blood camps and emergency requirements
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {announcements.map((ann, index) => (
                <div
                  key={ann.id}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${ann.campaign_type === 'Emergency' ? 'bg-[#900000]/10 text-[#900000]' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {ann.campaign_type}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Expires: {ann.expiry_date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{ann.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {ann.description}
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[#900000] font-bold flex items-center hover:translate-x-2 transition-transform"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blood Types Section - Card Grid Design */}
      <section id="types" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Know Your <span className="text-[#900000]">Blood Type</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding blood compatibility can help save lives
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {bloodTypes.map((blood, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${blood.color} p-8 text-white min-h-[200px] flex flex-col justify-between`}>
                  <div>
                    <div className="text-5xl font-bold mb-2">{blood.type}</div>
                    <div className="text-sm font-semibold opacity-90">{blood.label}</div>
                  </div>
                  <div className="text-xs opacity-80 pt-4 border-t border-white/30">
                    {blood.description}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Split Design */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800&h=600&fit=crop"
                  alt="Blood Donation"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="text-5xl font-bold mb-2">10+</div>
                  <div className="text-xl">Years of Service</div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stats.satisfaction_rate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#900000]/10 text-[#900000] rounded-full text-sm font-semibold">
                About LifeFlow
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Connecting Hearts,
                <span className="block text-[#900000]">Saving Lives</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                LifeFlow has been at the forefront of blood donation services for over a decade.
                We've built a trusted network that ensures no patient suffers due to blood shortage.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Certified & Safe</h4>
                    <p className="text-gray-600">State-of-the-art facilities with highest safety standards</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Community Driven</h4>
                    <p className="text-gray-600">{Math.floor(stats.total_savers || 5000)}+ active donors creating real impact together</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Always Available</h4>
                    <p className="text-gray-600">24/7 emergency support when you need it most</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-[#900000] to-[#b00000] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center space-x-2"
              >
                <span>Join Our Mission</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Feedback Form Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-red-100">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Dynamic Testimonials */}
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Stories That <span className="text-[#900000]">Inspire</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Hear from our amazing community of donors and recipients
                </p>
              </div>

              {feedbacks.length > 0 ? (
                <div className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden h-[400px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -translate-y-24 translate-x-24 opacity-50" />

                  {feedbacks.map((fb, index) => (
                    <div
                      key={fb.id}
                      className={`transition-all duration-500 absolute inset-y-10 inset-x-10 flex flex-col justify-center text-center space-y-6 ${index === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                        }`}
                    >
                      <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                        <Users className="w-10 h-10 text-red-600" />
                      </div>

                      <div className="flex justify-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-6 h-6 ${i < fb.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>

                      <p className="text-xl text-gray-700 italic leading-relaxed">
                        "{fb.review}"
                      </p>

                      <div>
                        <div className="text-lg font-bold text-gray-800">{fb.name}</div>
                      </div>
                    </div>
                  ))}

                  {/* Indicators for testimonial carousel */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                    {feedbacks.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === activeTestimonial ? 'bg-[#900000] w-6' : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-gray-500 flex flex-col items-center justify-center h-[400px]">
                  <Star className="w-12 h-12 mb-4 text-gray-300" />
                  <p>Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Right: Submit Feedback Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-white/50 backdrop-blur-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Story</h3>
                <p className="text-gray-600">Tell us about your donation experience and inspire others</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[#900000] focus:ring-4 focus:ring-[#900000]/10 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: num })}
                        className={`transition-all ${num <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      >
                        <Star className={`w-8 h-8 ${num <= feedbackForm.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    required
                    value={feedbackForm.review}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, review: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[#900000] focus:ring-4 focus:ring-[#900000]/10 outline-none transition-all h-32 resize-none"
                    placeholder="Tell us what you think..."
                  />
                </div>

                {formMessage.text && (
                  <div className={`p-4 rounded-2xl text-sm font-medium ${formMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {formMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#900000] to-[#b00000] text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Modern Card Design */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Get In <span className="text-[#900000]">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Email Card */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
              <a href="mailto:lifelow.noreply@gmail.com" className="text-blue-600 font-semibold hover:underline">
                lifelow.noreply@gmail.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Available 24/7 for emergencies</p>
              <a href="tel:+917025068237" className="text-green-600 font-semibold hover:underline">
                +91 7025068237
              </a>
            </div>

            {/* Social Card */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Follow Us</h3>
              <p className="text-gray-600 mb-4">Join our community</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#900000] via-[#700000] to-[#500000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of heroes making a difference. Your journey starts with a single donation.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-12 py-5 bg-white text-[#900000] rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-3"
          >
            <span>Start Your Journey</span>
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4 leading-none">
                <Logo size={40} color="#ffffff" />
              </div>
              <p className="text-gray-400 text-sm">
                Connecting donors with those in need since 2014
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">Stay updated with our latest news</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500 text-sm"
                />
                <button className="px-6 py-2 bg-red-600 rounded-r-full hover:bg-red-700 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 LifeFlow. All rights reserved. Every drop counts.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Bloodhome;
