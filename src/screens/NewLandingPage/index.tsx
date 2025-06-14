import React, { useState, useEffect } from 'react';
import { Heart, Star, Users, BookOpen, Play, ArrowRight, Sparkles } from 'lucide-react';

// TypeScript interfaces
interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  theme: string;
  image: string;
  rating: number;
  readers: number;
  hasSession: boolean;
  sessionCount: number;
  completionRate: number;
}

interface Testimonial {
  id: string;
  name: string;
  story: string;
  rating: number;
  text: string;
  avatar: string;
}

// Mock data
const mockStories: Story[] = [
  {
    id: '1',
    title: 'A Christmas Gift',
    description: 'The Christmas party glitters with possibility, but when your eyes meet across the crowded room, will you risk everything for a moment of forbidden passion?',
    duration: '30 minutes',
    theme: 'hotwife/cuckold',
    image: 'https://images.unsplash.com/photo-1544273677-6e4f999de2a7?w=400&h=300&fit=crop',
    rating: 4.8,
    readers: 15420,
    hasSession: true,
    sessionCount: 2,
    completionRate: 89
  },
  {
    id: '2',
    title: 'Midnight Confessions',
    description: 'Late-night texts turn into something more dangerous. When secrets surface, will your heart survive the truth?',
    duration: '45 minutes',
    theme: 'contemporary romance',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    rating: 4.9,
    readers: 23150,
    hasSession: false,
    sessionCount: 0,
    completionRate: 92
  },
  {
    id: '3',
    title: 'The Art of Seduction',
    description: 'In the world of high-stakes art dealing, passion and power collide. Every negotiation is a dance of desire.',
    duration: '60 minutes',
    theme: 'billionaire romance',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    rating: 4.7,
    readers: 18900,
    hasSession: false,
    sessionCount: 0,
    completionRate: 85
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    story: 'A Christmas Gift',
    rating: 5,
    text: 'I never thought I could feel so connected to characters in a story. The choices felt real and meaningful.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Emma K.',
    story: 'Midnight Confessions',
    rating: 5,
    text: 'The interactive elements made me feel like I was living the romance, not just reading it.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=50&h=50&fit=crop&crop=face'
  }
];

const RomanceLandingPage: React.FC = () => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartStory = async (storyId: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log(`Starting story: ${storyId}`);
  };

  const handleContinueStory = async (storyId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    console.log(`Continuing story: ${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Romance Stories
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-rose-600 transition-colors">
                My Library
              </button>
              <button className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105">
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-amber-100/50"></div>
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-rose-300" />
        </div>
        <div className="absolute bottom-20 right-20 animate-pulse delay-1000">
          <Heart className="w-8 h-8 text-amber-300" fill="currentColor" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Your Next Great
                  <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent block">
                    Love Story
                  </span>
                  <span className="text-4xl lg:text-5xl">Awaits</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Interactive romance where every choice shapes your destiny. 
                  Experience love stories that respond to your heart's desires.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleStartStory('demo')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" fill="currentColor" />
                      <span>Start Your Journey</span>
                    </>
                  )}
                </button>
                <button className="border-2 border-rose-300 text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-50 transition-all duration-300 flex items-center justify-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Browse Stories</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-rose-500" />
                  <span>50K+ Active Readers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Marcus</p>
                      <p className="text-sm text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <p className="text-gray-700">
                      "The way you looked at me across the room... I can't stop thinking about it."
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-600 transition-colors">
                      "I was hoping you'd notice..."
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">
                      "We should talk privately."
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-rose-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Shape Your Destiny</h3>
              <p className="text-gray-600">Every choice you make influences the story's direction and your romantic journey.</p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-amber-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Endless Possibilities</h3>
              <p className="text-gray-600">Multiple story paths and endings ensure every reading experience is unique.</p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-rose-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Emotional Connection</h3>
              <p className="text-gray-600">Deep, meaningful relationships that respond to your choices and emotions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Stories</h2>
            <p className="text-xl text-gray-600">Discover your next romantic adventure</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockStories.map((story) => (
              <div
                key={story.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
                  activeStory === story.id ? 'ring-2 ring-rose-500' : ''
                }`}
                onMouseEnter={() => setActiveStory(story.id)}
                onMouseLeave={() => setActiveStory(null)}
              >
                <div className="relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                    <span className="text-sm font-semibold">{story.rating}</span>
                  </div>
                  {story.hasSession && (
                    <div className="absolute top-4 left-4 bg-rose-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                      In Progress
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{story.description}</p>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Duration: {story.duration}</span>
                    <span>{story.readers.toLocaleString()} readers</span>
                  </div>

                  <div className="flex space-x-2">
                    {story.hasSession ? (
                      <>
                        <button
                          onClick={() => handleContinueStory(story.id)}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Play className="w-4 h-4" fill="currentColor" />
                          <span>Continue</span>
                        </button>
                        <button
                          onClick={() => handleStartStory(story.id)}
                          className="px-6 py-3 border-2 border-rose-300 text-rose-600 rounded-full font-semibold hover:bg-rose-50 transition-all duration-300"
                        >
                          Restart
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartStory(story.id)}
                        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Start Reading</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">What Readers Are Saying</h2>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-8 transition-all duration-500">
              <div className="flex items-center justify-center mb-6">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-4">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500" fill="currentColor" />
                ))}
              </div>
              <p className="font-semibold text-gray-900">
                {testimonials[currentTestimonial].name}
              </p>
              <p className="text-sm text-gray-600">
                Reader of "{testimonials[currentTestimonial].story}"
              </p>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  title={`Show testimonial ${index + 1}`}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-rose-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Write Your Love Story?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of readers who have found their perfect romantic escape.
          </p>
          <button 
            onClick={() => handleStartStory('signup')}
            className="bg-white text-rose-600 px-12 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Start Reading Free
          </button>
          <p className="text-sm mt-4 opacity-75">No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

export default RomanceLandingPage;