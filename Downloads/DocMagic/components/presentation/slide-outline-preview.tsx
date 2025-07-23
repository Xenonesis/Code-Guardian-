"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  List, 
  BarChart3, 
  Image, 
  Users, 
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Brain,
  Target,
  TrendingUp,
  Eye,
  PieChart,
  LineChart,
  Activity,
  Camera,
  Palette
} from "lucide-react";

interface SlideOutline {
  title: string;
  type: string;
  description: string;
  content?: string;
  bullets?: string[];
  chartData?: any;
  imageQuery?: string;
  imageUrl?: string;
}

interface SlideOutlinePreviewProps {
  outlines: SlideOutline[];
}

export function SlideOutlinePreview({ outlines }: SlideOutlinePreviewProps) {
  const getSlideIcon = (type: string) => {
    switch (type) {
      case 'cover':
        return <FileText className="h-4 w-4" />;
      case 'list':
        return <List className="h-4 w-4" />;
      case 'chart':
        return <BarChart3 className="h-4 w-4" />;
      case 'split':
        return <Image className="h-4 w-4" />;
      case 'process':
        return <ArrowRight className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case 'pie':
        return <PieChart className="h-3 w-3" />;
      case 'line':
        return <LineChart className="h-3 w-3" />;
      case 'area':
        return <Activity className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  const getSlideTypeLabel = (type: string) => {
    switch (type) {
      case 'cover':
        return 'Hero Slide';
      case 'list':
        return 'Key Points';
      case 'chart':
        return 'Data Visual';
      case 'split':
        return 'Split Layout';
      case 'process':
        return 'Process Flow';
      case 'text':
        return 'Content Focus';
      default:
        return 'Standard';
    }
  };

  const getSlideTypeColor = (type: string) => {
    switch (type) {
      case 'cover':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'list':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'chart':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'split':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      case 'process':
        return 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getAIInsights = () => {
    const chartSlides = outlines.filter(o => o.type === 'chart').length;
    const listSlides = outlines.filter(o => o.type === 'list').length;
    const splitSlides = outlines.filter(o => o.type === 'split').length;
    const imageSlides = outlines.filter(o => o.imageUrl || o.imageQuery).length;
    
    const insights = [];
    
    if (chartSlides > 0) {
      insights.push(`${chartSlides} professional chart${chartSlides > 1 ? 's' : ''} for data impact`);
    }
    if (listSlides > 0) {
      insights.push(`${listSlides} structured content slide${listSlides > 1 ? 's' : ''} for clarity`);
    }
    if (splitSlides > 0) {
      insights.push(`${splitSlides} visual layout${splitSlides > 1 ? 's' : ''} for engagement`);
    }
    if (imageSlides > 0) {
      insights.push(`${imageSlides} high-quality image${imageSlides > 1 ? 's' : ''} from Pexels`);
    }
    
    return insights;
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Summary */}
      <Card className="glass-effect border-yellow-400/20 p-6 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold bolt-gradient-text">AI Analysis Results</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 glass-effect rounded-xl hover:scale-105 transition-transform">
              <div className="bolt-gradient-text text-3xl font-bold">{outlines.length}</div>
              <div className="text-sm text-muted-foreground">Professional Slides</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-xl hover:scale-105 transition-transform">
              <div className="bolt-gradient-text text-3xl font-bold">
                {new Set(outlines.map(o => o.type)).size}
              </div>
              <div className="text-sm text-muted-foreground">Layout Types</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-xl hover:scale-105 transition-transform">
              <div className="bolt-gradient-text text-3xl font-bold">
                {outlines.filter(o => o.imageUrl || o.imageQuery).length}
              </div>
              <div className="text-sm text-muted-foreground">Pro Images</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-xl hover:scale-105 transition-transform">
              <div className="bolt-gradient-text text-3xl font-bold">
                {outlines.filter(o => o.chartData).length}
              </div>
              <div className="text-sm text-muted-foreground">Data Charts</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">AI Quality Insights:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getAIInsights().map((insight, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hover:scale-105 transition-transform">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {insight}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Slide Outline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlines.map((outline, index) => (
          <Card 
            key={index} 
            className="glass-effect border-yellow-400/20 hover:shadow-xl transition-all duration-300 group relative overflow-hidden hover:scale-105"
          >
            {/* Slide number indicator */}
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {index + 1}
            </div>

            {/* AI badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                <Brain className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>

            <CardContent className="p-6 pt-12">
              <div className="space-y-4">
                {/* Slide type badge */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSlideTypeColor(outline.type)} flex items-center gap-1 font-medium`}
                  >
                    {getSlideIcon(outline.type)}
                    {getSlideTypeLabel(outline.type)}
                  </Badge>
                </div>

                {/* Slide title */}
                <h3 className="font-bold text-lg group-hover:bolt-gradient-text transition-all leading-tight">
                  {outline.title}
                </h3>

                {/* Slide description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {outline.description}
                </p>

                {/* Content preview */}
                {outline.content && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <span className="font-medium">Content Preview: </span>
                    {outline.content.substring(0, 100)}...
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2">
                  {/* Bullets preview */}
                  {outline.bullets && outline.bullets.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <List className="h-3 w-3 text-green-500" />
                      <span className="font-medium">{outline.bullets.length} key points</span>
                    </div>
                  )}

                  {/* Chart preview */}
                  {outline.chartData && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getChartIcon(outline.chartData.type)}
                      <span className="font-medium">
                        {outline.chartData.type} chart ({outline.chartData.data?.length || 0} data points)
                      </span>
                    </div>
                  )}

                  {/* Image preview */}
                  {(outline.imageUrl || outline.imageQuery) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Camera className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">Professional image included</span>
                    </div>
                  )}
                </div>

                {/* Visual preview mockup */}
                <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-muted/50 to-muted/80 border border-border/50 flex items-center justify-center group-hover:from-yellow-50 group-hover:to-blue-50 transition-all relative overflow-hidden">
                  {/* Show actual image preview if available */}
                  {outline.imageUrl && (
                    <img 
                      src={outline.imageUrl} 
                      alt={outline.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity rounded-lg"
                    />
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors relative z-10">
                    {getSlideIcon(outline.type)}
                    <span className="text-sm font-medium">Canva-Style Design</span>
                    <Sparkles className="h-4 w-4 group-hover:text-yellow-500 transition-colors animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flow Visualization */}
      <Card className="glass-effect border-yellow-400/20 p-6 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">AI-Optimized Presentation Flow</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {outlines.map((outline, index) => (
              <div key={index} className="flex items-center">
                <div className="glass-effect px-4 py-3 rounded-xl text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2 border border-yellow-400/20">
                  {getSlideIcon(outline.type)}
                  <span className="max-w-[140px] truncate">{outline.title}</span>
                  {outline.chartData && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 ml-1">
                      Chart
                    </Badge>
                  )}
                  {(outline.imageUrl || outline.imageQuery) && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 ml-1">
                      Image
                    </Badge>
                  )}
                </div>
                {index < outlines.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
          
          <div className="glass-effect p-4 rounded-xl bg-green-50/50 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 mb-1">Professional Quality Guaranteed</p>
                <p className="text-sm text-green-700">
                  AI has optimized your presentation with Canva-style design, high-quality Pexels images, 
                  meaningful data visualizations, and logical content flow for maximum audience engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}