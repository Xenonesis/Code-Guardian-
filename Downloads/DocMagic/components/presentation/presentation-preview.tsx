"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Quote, Maximize2, Minimize2, Play, Pause, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Legend
} from "recharts";

interface PresentationPreviewProps {
  slides: any[];
  template: string;
}

export function PresentationPreview({ slides, template }: PresentationPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: number]: boolean}>({});
  const { theme } = useTheme();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.getElementById('presentation-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    if (isPlaying) {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      setIsPlaying(false);
    } else {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      setAutoPlayInterval(interval);
      setIsPlaying(true);
    }
  }, [isPlaying, autoPlayInterval, nextSlide]);

  const resetPresentation = useCallback(() => {
    setCurrentSlide(0);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsPlaying(false);
  }, [autoPlayInterval]);

  const handleImageError = useCallback((slideIndex: number) => {
    setImageLoadErrors(prev => ({ ...prev, [slideIndex]: true }));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          setAutoPlayInterval(null);
        }
        setIsPlaying(false);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [nextSlide, prevSlide, toggleFullscreen, autoPlayInterval]);

  const renderChart = (chart: any) => {
    if (!chart || !chart.data) return null;

    const chartColors = chart.colors || ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    
    const chartTheme = {
      stroke: theme === 'dark' ? 'white' : 'black',
      fill: theme === 'dark' ? 'white' : 'black',
    };

    const commonProps = {
      data: chart.data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chart.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />}
              <XAxis 
                dataKey="name" 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
              />
              <YAxis 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
                label={{ value: chart.yAxis, angle: -90, position: 'insideLeft', style: chartTheme }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              {chart.showLegend && <Legend />}
              <Bar dataKey="value" fill={chartColors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={40}
                paddingAngle={2}
              >
                {chart.data.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              {chart.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />}
              <XAxis 
                dataKey="name" 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
              />
              <YAxis 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
                label={{ value: chart.yAxis, angle: -90, position: 'insideLeft', style: chartTheme }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              {chart.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors[0]} 
                strokeWidth={3}
                dot={{ fill: chartColors[0], strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: chartColors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />}
              <XAxis 
                dataKey="name" 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
              />
              <YAxis 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
                label={{ value: chart.yAxis, angle: -90, position: 'insideLeft', style: chartTheme }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              {chart.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors[0]} 
                fill={chartColors[0]}
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />}
              <XAxis 
                dataKey="name" 
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
              />
              <YAxis 
                dataKey="value"
                tick={{ ...chartTheme, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.stroke }}
                label={{ value: chart.yAxis, angle: -90, position: 'insideLeft', style: chartTheme }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                  color: theme === 'dark' ? 'white' : 'black',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              {chart.showLegend && <Legend />}
              <Scatter dataKey="value" fill={chartColors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  const getTemplateStyles = (template: string) => {
    const styles = {
      'modern-business': {
        background: 'bg-gradient-to-br from-blue-50 to-white',
        text: 'text-blue-900',
        accent: 'text-blue-600',
        border: 'border-blue-200',
        cardBg: 'bg-white/80 backdrop-blur-sm',
        shadow: 'shadow-blue-100'
      },
      'creative-gradient': {
        background: 'bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50',
        text: 'text-purple-900',
        accent: 'text-purple-600',
        border: 'border-purple-200',
        cardBg: 'bg-white/90 backdrop-blur-sm',
        shadow: 'shadow-purple-100'
      },
      'minimalist-pro': {
        background: 'bg-gradient-to-br from-gray-50 to-white',
        text: 'text-gray-800',
        accent: 'text-gray-600',
        border: 'border-gray-200',
        cardBg: 'bg-white/95 backdrop-blur-sm',
        shadow: 'shadow-gray-100'
      },
      'tech-modern': {
        background: 'bg-gradient-to-br from-slate-900 to-gray-900',
        text: 'text-white',
        accent: 'text-cyan-400',
        border: 'border-cyan-400',
        cardBg: 'bg-slate-800/80 backdrop-blur-sm',
        shadow: 'shadow-cyan-500/20'
      },
      'elegant-dark': {
        background: 'bg-gradient-to-br from-gray-900 to-black',
        text: 'text-white',
        accent: 'text-yellow-400',
        border: 'border-yellow-400',
        cardBg: 'bg-gray-800/80 backdrop-blur-sm',
        shadow: 'shadow-yellow-500/20'
      },
      'startup-pitch': {
        background: 'bg-gradient-to-br from-green-50 to-emerald-50',
        text: 'text-green-900',
        accent: 'text-green-600',
        border: 'border-green-200',
        cardBg: 'bg-white/90 backdrop-blur-sm',
        shadow: 'shadow-green-100'
      }
    };
    return styles[template as keyof typeof styles] || styles['modern-business'];
  };

  const renderSlideContent = (slide: any, slideIndex: number) => {
    const templateStyles = getTemplateStyles(template);
    
    const baseClasses = cn(
      "h-full w-full transition-all duration-300 ease-in-out relative overflow-hidden",
      templateStyles.background,
      templateStyles.text
    );

    const backgroundImage = slide.image && !imageLoadErrors[slideIndex] 
      ? `url(${slide.image})` 
      : undefined;

    switch (slide.layout) {
      case "cover":
        return (
          <div 
            className={baseClasses}
            style={{
              backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: slide.imagePosition || "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center text-white">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                {slide.content && (
                  <p className="text-xl sm:text-2xl lg:text-3xl opacity-90 max-w-4xl leading-relaxed mb-8">
                    {slide.content}
                  </p>
                )}
                <div className="w-24 h-1 bg-white/80 mx-auto"></div>
              </div>
            </div>
            {slide.image && imageLoadErrors[slideIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <ImageIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <img 
              src={slide.image} 
              alt={slide.imageAlt || slide.title}
              className="hidden"
              onError={() => handleImageError(slideIndex)}
            />
          </div>
        );

      case "split":
        return (
          <div className={baseClasses}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full p-8 sm:p-12">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight", templateStyles.accent)}>
                  {slide.title}
                </h2>
                {slide.content && (
                  <p className="text-lg sm:text-xl leading-relaxed opacity-90">
                    {slide.content}
                  </p>
                )}
                {slide.bullets && (
                  <ul className="space-y-4 text-lg">
                    {slide.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className={cn("w-3 h-3 rounded-full mt-2 flex-shrink-0", templateStyles.accent.replace('text-', 'bg-'))}></div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center justify-center">
                {slide.image && !imageLoadErrors[slideIndex] ? (
                  <div className={cn("rounded-2xl overflow-hidden", templateStyles.shadow, "shadow-2xl")}>
                    <img 
                      src={slide.image} 
                      alt={slide.imageAlt || slide.title}
                      className="max-w-full h-auto object-cover"
                      style={{ maxHeight: '500px' }}
                      onError={() => handleImageError(slideIndex)}
                    />
                  </div>
                ) : (
                  <div className={cn("w-full h-80 rounded-2xl flex items-center justify-center", templateStyles.border, "border-2 border-dashed", templateStyles.cardBg)}>
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "chart":
        return (
          <div className={cn(baseClasses, "p-8 sm:p-12")}>
            <div className="h-full flex flex-col">
              <div className="text-center mb-8">
                <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", templateStyles.accent)}>
                  {slide.title}
                </h2>
                {slide.content && (
                  <p className="text-lg sm:text-xl opacity-80 max-w-3xl mx-auto">
                    {slide.content}
                  </p>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center">
                {slide.charts ? (
                  <div className={cn("w-full max-w-4xl p-6 rounded-2xl", templateStyles.cardBg, templateStyles.shadow, "shadow-xl")}>
                    {slide.charts.title && (
                      <h3 className="text-xl font-semibold text-center mb-6">{slide.charts.title}</h3>
                    )}
                    {renderChart(slide.charts)}
                  </div>
                ) : (
                  <div className={cn("w-full h-80 rounded-2xl flex items-center justify-center", templateStyles.border, "border-2 border-dashed", templateStyles.cardBg)}>
                    <span className="text-muted-foreground text-lg">Chart Visualization</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "list":
        return (
          <div className={cn(baseClasses, "p-8 sm:p-12")}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              <div className="lg:col-span-2 flex flex-col justify-center">
                <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight", templateStyles.accent)}>
                  {slide.title}
                </h2>
                {slide.content && (
                  <p className="text-lg sm:text-xl mb-8 leading-relaxed opacity-90">
                    {slide.content}
                  </p>
                )}
                {slide.bullets && (
                  <ul className="space-y-6 text-lg sm:text-xl">
                    {slide.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className={cn("w-4 h-4 rounded-full mt-2 flex-shrink-0 group-hover:scale-110 transition-transform", templateStyles.accent.replace('text-', 'bg-'))}></div>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center justify-center">
                {slide.image && !imageLoadErrors[slideIndex] ? (
                  <div className={cn("rounded-2xl overflow-hidden", templateStyles.shadow, "shadow-xl")}>
                    <img 
                      src={slide.image} 
                      alt={slide.imageAlt || slide.title}
                      className="max-w-full h-auto object-cover"
                      style={{ maxHeight: '400px' }}
                      onError={() => handleImageError(slideIndex)}
                    />
                  </div>
                ) : (
                  <div className={cn("w-full h-64 rounded-2xl flex items-center justify-center", templateStyles.border, "border-2 border-dashed", templateStyles.cardBg)}>
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "process":
        return (
          <div className={cn(baseClasses, "p-8 sm:p-12")}>
            <div className="h-full flex flex-col">
              <div className="text-center mb-12">
                <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", templateStyles.accent)}>
                  {slide.title}
                </h2>
                {slide.content && (
                  <p className="text-lg sm:text-xl opacity-80 max-w-3xl mx-auto">
                    {slide.content}
                  </p>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="text-center group">
                      <div className={cn("w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform shadow-lg", templateStyles.accent.replace('text-', 'bg-'))}>
                        {step}
                      </div>
                      <h3 className="font-semibold text-xl mb-3">Step {step}</h3>
                      <p className="text-sm opacity-80 leading-relaxed">
                        {slide.bullets && slide.bullets[step - 1] 
                          ? slide.bullets[step - 1] 
                          : `Process description for step ${step}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={cn(baseClasses, "p-8 sm:p-12")}>
            <div className="h-full flex flex-col justify-center max-w-4xl mx-auto">
              <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight", templateStyles.accent)}>
                {slide.title}
              </h2>
              <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed space-y-6">
                {slide.content && (
                  <p className="opacity-90">{slide.content}</p>
                )}
                {slide.bullets && (
                  <ul className="space-y-4">
                    {slide.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className={cn("w-3 h-3 rounded-full mt-3 flex-shrink-0", templateStyles.accent.replace('text-', 'bg-'))}></div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  if (!slides.length) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No slides to display
      </div>
    );
  }

  return (
    <div 
      id="presentation-container" 
      className={cn(
        "relative h-full min-h-[500px] sm:min-h-[600px]",
        isFullscreen && "fixed inset-0 z-50 bg-black"
      )}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={resetPresentation}
          className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAutoPlay}
          className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Slide Content */}
      <div className={cn(
        "h-full overflow-hidden rounded-lg",
        isFullscreen && "rounded-none"
      )}>
        {renderSlideContent(slides[currentSlide], currentSlide)}
      </div>

      {/* Navigation */}
      <div className={cn(
        "absolute inset-x-0 bottom-4 flex justify-between items-center px-4",
        isFullscreen && "px-8"
      )}>
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlide 
                  ? "bg-white" 
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Help */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
          <div className="space-y-1">
            <div>← → Space: Navigate</div>
            <div>F: Fullscreen</div>
            <div>Esc: Exit</div>
          </div>
        </div>
      )}
    </div>
  );
}