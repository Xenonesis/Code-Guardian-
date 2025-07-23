import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Sparkles, Palette, Zap, Star, Crown } from "lucide-react";

interface PresentationTemplatesProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

export function PresentationTemplates({
  selectedTemplate,
  onSelectTemplate,
}: PresentationTemplatesProps) {
  const templates = [
    {
      id: "modern-business",
      name: "Modern Business",
      description: "Clean corporate design with blue gradients and professional layouts",
      preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
      accentColor: "from-blue-600 to-indigo-700",
      textColor: "text-blue-900",
      bgColor: "bg-white",
      borderColor: "border-blue-200",
      isPremium: false,
      features: ["Professional Charts", "Corporate Colors", "Clean Typography"]
    },
    {
      id: "creative-gradient",
      name: "Creative Gradient",
      description: "Vibrant gradients with modern layouts perfect for creative presentations",
      preview: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
      accentColor: "from-purple-600 via-pink-600 to-orange-600",
      textColor: "text-purple-900",
      bgColor: "bg-white",
      borderColor: "border-purple-200",
      isPremium: false,
      features: ["Gradient Backgrounds", "Creative Layouts", "Bold Typography"]
    },
    {
      id: "minimalist-pro",
      name: "Minimalist Pro",
      description: "Ultra-clean design with subtle shadows and perfect spacing",
      preview: "bg-gradient-to-br from-gray-50 to-slate-100",
      accentColor: "from-gray-700 to-slate-800",
      textColor: "text-gray-800",
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      isPremium: false,
      features: ["Minimal Design", "Perfect Spacing", "Subtle Shadows"]
    },
    {
      id: "tech-modern",
      name: "Tech Modern",
      description: "Futuristic design with neon accents and tech-inspired layouts",
      preview: "bg-gradient-to-br from-cyan-50 to-blue-100",
      accentColor: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-900",
      bgColor: "bg-slate-900",
      borderColor: "border-cyan-300",
      isPremium: true,
      features: ["Neon Accents", "Dark Theme", "Tech Graphics"]
    },
    {
      id: "elegant-dark",
      name: "Elegant Dark",
      description: "Sophisticated dark theme with gold accents and luxury feel",
      preview: "bg-gradient-to-br from-gray-800 to-gray-900",
      accentColor: "from-yellow-400 to-amber-500",
      textColor: "text-white",
      bgColor: "bg-gray-900",
      borderColor: "border-yellow-400",
      isPremium: true,
      features: ["Dark Luxury", "Gold Accents", "Premium Feel"]
    },
    {
      id: "startup-pitch",
      name: "Startup Pitch",
      description: "Dynamic design perfect for startup presentations and pitch decks",
      preview: "bg-gradient-to-br from-green-50 to-emerald-100",
      accentColor: "from-green-600 to-emerald-700",
      textColor: "text-green-900",
      bgColor: "bg-white",
      borderColor: "border-green-200",
      isPremium: true,
      features: ["Pitch Optimized", "Growth Charts", "Investor Ready"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
          <Palette className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Professional Templates</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 bolt-gradient-text">Choose Your Style</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a professional template that matches your presentation style. Each template includes 
          optimized layouts, color schemes, and visual elements.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "cursor-pointer group relative transition-all duration-300",
              selectedTemplate === template.id 
                ? "ring-2 ring-yellow-400 ring-offset-2 rounded-lg scale-105" 
                : "hover:scale-102"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 z-10 bg-yellow-400 rounded-full p-1 shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            )}

            {template.isPremium && (
              <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1 shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            
            <Card className="overflow-hidden h-full border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
              {/* Template Preview */}
              <div className={cn(
                "h-48 relative overflow-hidden transition-all",
                template.preview
              )}>
                {/* Mock slide layout */}
                <div className="absolute inset-0 p-4 flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className={cn(
                      "h-8 w-32 rounded-lg bg-gradient-to-r opacity-90",
                      template.accentColor
                    )} />
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {/* Left side - text content */}
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-white/60 rounded-full" />
                      <div className="h-3 w-4/5 bg-white/40 rounded-full" />
                      <div className="h-3 w-3/5 bg-white/40 rounded-full" />
                      
                      {/* Bullet points */}
                      <div className="space-y-1 mt-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full bg-gradient-to-r",
                              template.accentColor
                            )} />
                            <div className="h-2 w-16 bg-white/50 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right side - chart/visual */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 rounded flex items-end justify-center gap-1 p-2">
                        {[60, 80, 45, 90, 70].map((height, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-2 rounded-t bg-gradient-to-t",
                              template.accentColor
                            )}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer indicators */}
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i === 1 ? "bg-white" : "bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
              </div>
              
              <CardContent className="p-4 bg-background">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={cn(
                    "font-semibold text-lg group-hover:bolt-gradient-text transition-all",
                    selectedTemplate === template.id ? "bolt-gradient-text" : ""
                  )}>
                    {template.name}
                  </h3>
                  {template.isPremium && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium">
                      <Crown className="h-3 w-3" />
                      Pro
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {template.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Template Features */}
      <div className="text-center">
        <div className="glass-effect p-6 rounded-xl border border-yellow-400/20 max-w-4xl mx-auto">
          <h3 className="font-semibold mb-4 bolt-gradient-text text-lg">All Templates Include:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2 p-3 glass-effect rounded-lg">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>AI-Generated Content</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 glass-effect rounded-lg">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Interactive Charts</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 glass-effect rounded-lg">
              <Star className="h-4 w-4 text-purple-500" />
              <span>Professional Images</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 glass-effect rounded-lg">
              <Palette className="h-4 w-4 text-green-500" />
              <span>Consistent Branding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}