# 🤝 Contributing to DocMagic

<div align="center">

![Contributing](https://img.shields.io/badge/Contributing-Welcome-brightgreen?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=for-the-badge)
![Community](https://img.shields.io/badge/Community-Driven-blue?style=for-the-badge)

</div>

**Welcome to the DocMagic open source community!** 🎉

Thank you for your interest in contributing to DocMagic! We're excited to have you join our community of developers, designers, and users who are passionate about making document creation accessible to everyone through AI.

This guide will help you get started with contributing to our open source project, whether you're fixing a bug, adding a feature, improving documentation, or helping other community members.

## 🌟 Why Contribute to DocMagic?

- **🚀 Impact**: Help millions of users create professional documents
- **📚 Learn**: Gain experience with cutting-edge AI and web technologies
- **🤝 Community**: Join a welcoming, inclusive developer community
- **🏆 Recognition**: Get credited for your contributions and build your portfolio
- **💼 Career**: Showcase your skills to potential employers

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

## 🚀 How to Contribute

### 🐛 Reporting Bugs

Found a bug? Help us fix it! Please create a detailed bug report:

1. **Search existing issues** to avoid duplicates
2. **Use our bug report template** when creating a new issue
3. **Include the following information**:
   - 📝 Clear, descriptive title
   - 🔄 Step-by-step reproduction instructions
   - ✅ Expected behavior vs actual behavior
   - 📸 Screenshots or screen recordings (if applicable)
   - 🖥️ Environment details (browser, OS, Node.js version)
   - 📋 Console errors or logs
   - 🔗 Link to a minimal reproduction (if possible)

**Bug Report Template:**
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots to help explain the problem.

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 94]
- Node.js: [e.g. 18.0.0]
- DocMagic Version: [e.g. 0.3.0]
```

### ✨ Suggesting Features

Have an idea to make DocMagic better? We'd love to hear it!

1. **Check our [roadmap](./ROADMAP.md)** to see if it's already planned
2. **Search existing feature requests** to avoid duplicates
3. **Start a discussion** in [GitHub Discussions](https://github.com/docmagic-ai/docmagic/discussions)
4. **Create a detailed feature request** with:
   - 🎯 Clear, descriptive title
   - 📖 Detailed description of the proposed feature
   - 🎨 Mockups, wireframes, or examples (if applicable)
   - 💡 Explanation of why this feature would be valuable
   - 🔧 Technical considerations or implementation ideas
   - 👥 Target users who would benefit

### 🔧 Contributing Code

Ready to write some code? Here's how to get started:

#### 🍴 Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/yourusername/docmagic.git
   cd docmagic
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/docmagic-ai/docmagic.git
   ```

#### 🛠️ Set Up Development Environment

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

#### 🌿 Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

#### 📝 Make Your Changes

- **Follow our coding standards** (see below)
- **Write clear, descriptive commit messages**
- **Add tests** for new functionality
- **Update documentation** as needed
- **Test your changes thoroughly**

#### 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when available)
npm run test

# Build the project
npm run build
```

#### 📤 Submit Your Pull Request

1. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Create a pull request** on GitHub
3. **Fill out the PR template** with:
   - 📋 Description of changes
   - 🔗 Link to related issues
   - 📸 Screenshots (for UI changes)
   - ✅ Checklist confirmation

#### 📋 Pull Request Guidelines

- ✅ **One feature per PR** - keep changes focused
- ✅ **Clear commit messages** following conventional commits
- ✅ **Update documentation** for new features
- ✅ **Add tests** for new functionality
- ✅ **Follow coding standards** and pass linting
- ✅ **Link related issues** in the PR description
- ✅ **Be responsive** to code review feedback

## 📚 Documentation Contributions

Documentation is just as important as code! You can help by:

- 📝 **Improving existing docs** - fix typos, clarify instructions
- 📖 **Writing tutorials** - help new users get started
- 🎥 **Creating video guides** - visual learners will thank you
- 🌍 **Translating content** - make DocMagic accessible globally
- 📊 **Adding examples** - show real-world usage patterns

## 🎨 Design Contributions

Designers are welcome too! You can contribute:

- 🎨 **UI/UX improvements** - enhance user experience
- 🖼️ **New templates** - expand our template library
- 🎭 **Icons and graphics** - improve visual appeal
- ♿ **Accessibility features** - make DocMagic inclusive
- 📱 **Mobile optimizations** - improve responsive design

## 🏗️ Project Structure

```
docmagic/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API routes
│   ├── 📁 resume/            # Resume pages
│   ├── 📁 presentation/      # Presentation pages
│   └── 📁 auth/              # Authentication pages
├── 📁 components/            # React components
│   ├── 📁 ui/                # Reusable UI components
│   ├── 📁 resume/            # Resume-specific components
│   └── 📁 presentation/      # Presentation components
├── 📁 lib/                   # Utility libraries
│   ├── 📄 gemini.ts          # AI integration
│   ├── 📄 stripe.ts          # Payment processing
│   └── 📄 supabase.ts        # Database client
├── 📁 hooks/                 # Custom React hooks
├── 📁 types/                 # TypeScript definitions
└── 📁 public/                # Static assets
```

## 🎯 Coding Standards

### TypeScript Guidelines

```typescript
// Use descriptive names
const generateResumeContent = async (userInput: ResumeInput) => {
  // Implementation
};

// Prefer interfaces for object types
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to process request');
}
```

### React Component Guidelines

```tsx
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(resume): add new template selection
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): optimize document generation
test(resume): add unit tests for template engine
```

## 🔄 Versioning

We use [Semantic Versioning](http://semver.org/) (SemVer):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

## 🏷️ Issue Labels

We use labels to organize issues and PRs:

- 🐛 `bug` - Something isn't working
- ✨ `enhancement` - New feature or request
- 📚 `documentation` - Improvements to docs
- 🆘 `help wanted` - Extra attention is needed
- 🥇 `good first issue` - Good for newcomers
- 🔥 `priority: high` - High priority items
- 🎨 `design` - Design-related issues
- 🧪 `testing` - Testing-related issues

## 🎉 Recognition

We believe in recognizing our contributors! Here's how we show appreciation:

### 🏆 Contributor Levels

- **🌱 First-time Contributor**: Your first merged PR
- **🌿 Regular Contributor**: 5+ merged PRs
- **🌳 Core Contributor**: 20+ merged PRs or significant features
- **🏅 Maintainer**: Trusted with repository access

### 🎁 Rewards

- 📛 **GitHub badges** on your profile
- 🎽 **Exclusive swag** for significant contributions
- 📢 **Social media shoutouts** for major features
- 💼 **Portfolio showcase** opportunities
- 🎤 **Speaking opportunities** at events

## 📞 Getting Help

Need help contributing? We're here for you!

- 💬 **Discord**: [Join our community](https://discord.gg/docmagic)
- 📧 **Email**: `contributors@docmagic.com`
- 🐛 **Issues**: [GitHub Issues](https://github.com/docmagic-ai/docmagic/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/docmagic-ai/docmagic/discussions)

## 📜 License

By contributing to DocMagic, you agree that your contributions will be licensed under the same [MIT License](./LICENSE) that covers the project.

## 👥 Maintainers

This project is maintained by:

- **Xenonesis** - Lead Maintainer
  - GitHub: [@xenonesis](https://github.com/xenonesis)
  - Email: `maintainer@docmagic.com`

## 🙏 Thank You!

Every contribution, no matter how small, makes DocMagic better for everyone. Thank you for being part of our open source community!

---

<div align="center">

**Ready to contribute? We can't wait to see what you'll build! 🚀**

[![Start Contributing](https://img.shields.io/badge/Start-Contributing-brightgreen?style=for-the-badge)](https://github.com/docmagic-ai/docmagic/issues/labels/good%20first%20issue)

</div>