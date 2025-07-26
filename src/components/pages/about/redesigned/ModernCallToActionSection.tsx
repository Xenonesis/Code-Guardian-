import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users, Star, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ModernCallToActionSection: React.FC = () => {
  const benefits = [
    { icon: Shield, text: "Enterprise-grade security", color: "text-red-500" },
    { icon: Zap, text: "Lightning-fast analysis", color: "text-yellow-500" },
    { icon: Users, text: "Trusted by 25,000+ developers", color: "text-blue-500" },
    { icon: Star, text: "98% accuracy rate", color: "text-purple-500" }
  ];

  const features = [
    "No registration required",
    "Free forever",
    "Instant results",
    "AI-powered insights",
    "Multiple export formats",
    "Team collaboration"
  ];

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse delay-4000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <div className="text-center mb-12">
                {/* Badge */}
                <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ready to Get Started?
                </Badge>

                {/* Main Heading */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Secure Your Code
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                    In Minutes
                  </span>
                </h2>

                {/* Description */}
                <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
                  Join thousands of developers who trust Code Guardian for comprehensive 
                  security analysis. Start protecting your codebase today.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="p-3 bg-white/20 rounded-full">
                        <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <span className="text-sm font-medium text-white text-center">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Features List */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    What You Get:
                  </h3>
                  <div className="grid gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center lg:text-left space-y-8">
                  <div className="space-y-6">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl hover:shadow-2xl text-lg px-8 py-6 rounded-2xl font-bold hover:scale-105 transition-all duration-300"
                    >
                      <Link to="/" className="flex items-center gap-3">
                        <Shield className="w-6 h-6" />
                        Start Free Analysis
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm text-lg px-8 py-6 rounded-2xl font-bold"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      View Demo
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">Trusted by developers worldwide</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-white">25K+</div>
                        <div className="text-xs text-blue-200">Developers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">150K+</div>
                        <div className="text-xs text-blue-200">Issues Found</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">98%</div>
                        <div className="text-xs text-blue-200">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="text-center mt-12 pt-8 border-t border-white/20">
                <p className="text-blue-100 text-sm">
                  No credit card required • No installation needed • Start in seconds
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};