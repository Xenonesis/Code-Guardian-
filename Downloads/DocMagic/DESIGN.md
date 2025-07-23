# 🎨 DocMagic Design System

<div align="center">

![Design System](https://img.shields.io/badge/Design-System-FF6B6B?style=for-the-badge)
![Glass Morphism](https://img.shields.io/badge/Glass-Morphism-4ECDC4?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Mobile-First-45B7D1?style=for-the-badge)

</div>

## 🌟 Design Philosophy

DocMagic's design system is built around the concept of **"Magical Professionalism"** - combining cutting-edge visual effects with professional usability. Our interface creates a sense of wonder while maintaining the trust and reliability users expect from a professional document creation platform.

### Core Principles

1. **✨ Magical Yet Professional**: Visual effects that inspire without overwhelming
2. **🎯 User-Centric**: Every design decision prioritizes user experience
3. **♿ Accessible First**: WCAG 2.1 AA compliance built into every component
4. **📱 Mobile-First**: Responsive design that works beautifully on all devices
5. **⚡ Performance-Focused**: Beautiful animations that don't compromise speed

## 🎨 Visual Identity

### Color Palette

#### Primary Colors
```css
/* Bolt Gradient - Our signature gradient */
--bolt-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--bolt-gradient-hover: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);

/* Glass Effect Colors */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

#### Semantic Colors
```css
/* Success */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

#### Document Type Colors
```css
/* Resume */
--resume-primary: #fbbf24; /* Yellow */
--resume-secondary: #f59e0b;

/* Presentation */
--presentation-primary: #3b82f6; /* Blue */
--presentation-secondary: #2563eb;

/* CV */
--cv-primary: #8b5cf6; /* Purple */
--cv-secondary: #7c3aed;

/* Letter */
--letter-primary: #10b981; /* Green */
--letter-secondary: #059669;
```

### Typography

#### Font Stack
```css
/* Primary Font - Inter */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace Font - JetBrains Mono */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Type Scale
```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
```

## 🔮 Glass Morphism System

### Glass Effect Implementation

Our signature glass morphism effect creates depth and sophistication:

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 16px;
}

.glass-effect-strong {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}
```

### Gradient System

```css
/* Bolt Gradient - Primary */
.bolt-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bolt-gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Mesh Gradient - Background */
.mesh-gradient {
  background: radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #f093fb 0%, transparent 50%);
}
```

## ✨ Animation System

### Floating Elements

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

.floating-orb {
  animation: float 6s ease-in-out infinite;
  border-radius: 50%;
  filter: blur(1px);
}
```

### Shimmer Effect

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 2s infinite;
}
```

### Glow Effects

```css
.bolt-glow {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  transition: box-shadow 0.3s ease;
}

.bolt-glow:hover {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.7);
}
```

## 📱 Responsive Design System

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

### Container System

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; padding: 0 1.5rem; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

## 🎯 Component Design Patterns

### Button System

#### Primary Button
```tsx
<Button className="bolt-gradient text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 bolt-glow">
  Primary Action
</Button>
```

#### Glass Button
```tsx
<Button className="glass-effect border-2 border-yellow-400/30 px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 hover:border-yellow-400/60">
  Secondary Action
</Button>
```

### Card System

#### Glass Card
```tsx
<Card className="glass-effect border-0 hover:shadow-xl transition-all duration-300 group">
  <CardHeader>
    <CardTitle className="group-hover:bolt-gradient-text transition-all duration-300">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    Card content with glass morphism effect
  </CardContent>
</Card>
```

### Input System

#### Glass Input
```tsx
<Input className="glass-effect border-yellow-400/20 focus:border-yellow-400/60 focus:ring-yellow-400/20 bg-transparent placeholder:text-muted-foreground/60" />
```

## 🌓 Theme System

### Dark Mode Implementation

```css
/* Light Theme */
:root {
  --background: 255 255 255;
  --foreground: 15 23 42;
  --muted: 248 250 252;
  --muted-foreground: 100 116 139;
}

/* Dark Theme */
.dark {
  --background: 2 6 23;
  --foreground: 248 250 252;
  --muted: 15 23 42;
  --muted-foreground: 148 163 184;
}
```

### Theme-Aware Components

```tsx
// Theme toggle with smooth transitions
const ThemeToggle = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="glass-effect hover:scale-110 transition-all duration-300"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};
```

## ♿ Accessibility Guidelines

### Color Contrast
- All text maintains a minimum contrast ratio of 4.5:1
- Interactive elements have a minimum contrast ratio of 3:1
- Focus indicators are clearly visible with 2px outline

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus order follows logical tab sequence
- Skip links provided for main content areas

### Screen Reader Support
- Semantic HTML structure throughout
- ARIA labels for complex interactions
- Alt text for all meaningful images

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .shimmer,
  .animate-pulse,
  .animate-bounce {
    animation: none;
  }
  
  .transition-all {
    transition: none;
  }
}
```

## 📐 Layout Patterns

### Hero Section Layout
```tsx
<section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
  {/* Animated background */}
  <div className="absolute inset-0 mesh-gradient opacity-30" />
  
  {/* Floating orbs */}
  <div className="floating-orb w-72 h-72 bolt-gradient opacity-20 top-10 -left-36" />
  
  {/* Content */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Hero content */}
  </div>
</section>
```

### Document Generator Layout
```tsx
<div className="glass-effect p-6 sm:p-8 rounded-2xl border border-yellow-400/20 relative overflow-hidden">
  {/* Background shimmer */}
  <div className="absolute inset-0 shimmer opacity-20" />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Generator content */}
  </div>
</div>
```

## 🎨 Icon System

### Icon Usage Guidelines
- Use Lucide React icons for consistency
- Standard sizes: 16px (sm), 20px (base), 24px (lg), 32px (xl)
- Apply semantic colors based on context
- Animate icons for interactive feedback

```tsx
// Example icon usage
<Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
<Zap className="h-5 w-5 text-blue-500" />
<Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
```

## 🚀 Performance Considerations

### Animation Performance
- Use `transform` and `opacity` for animations
- Leverage `will-change` property for complex animations
- Implement `prefers-reduced-motion` support

### Glass Effect Optimization
- Use `backdrop-filter` with fallbacks
- Limit blur radius for better performance
- Consider disabling on low-end devices

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Provide appropriate alt text

## 📚 Design Resources

### Figma Design System
- Component library with all design tokens
- Responsive breakpoint examples
- Animation specifications

### Design Tools
- **Figma**: Primary design tool
- **Framer**: Prototyping and animation
- **Coolors**: Color palette generation
- **Type Scale**: Typography scale calculator

---

<div align="center">
  <p><strong>DocMagic Design System v1.0</strong></p>
  <p>Built with ❤️ for magical user experiences</p>
</div>