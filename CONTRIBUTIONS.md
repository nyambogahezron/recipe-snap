# Contributing to Bite

Thank you for your interest in contributing to Bite! We welcome contributions from developers of all skill levels. This document provides guidelines and information you need to contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read and follow our Code of Conduct:

- **Be respectful**: Treat all community members with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together towards common goals
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different levels of experience

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.16.1+)
- Git
- Google AI API key (for AI features)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bite.git
   cd bite
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/nyambogahezron/bite.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Set up environment variables**:
   ```bash
   # Create .env file in api/ directory
   cp api/.env.example api/.env
   # Edit api/.env with your Google AI API key
   ```
6. **Start development servers**:
   ```bash
   pnpm dev
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug fixes**: Fix issues and improve stability
- **✨ New features**: Add new functionality to the app
- **📚 Documentation**: Improve or add documentation
- **🎨 UI/UX improvements**: Enhance user experience
- **🔧 Refactoring**: Improve code quality and structure
- **🧪 Testing**: Add or improve tests
- **🚀 Performance**: Optimize performance and efficiency

### Finding Something to Work On

1. **Check existing issues**: Browse [GitHub Issues](https://github.com/nyambogahezron/bite/issues)
2. **Look for "good first issue"** labels for beginner-friendly tasks
3. **Check "help wanted"** labels for issues that need attention
4. **Propose new features**: Open an issue to discuss new ideas

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation changes
- `refactor/description` - for code refactoring

Examples:
- `feature/recipe-search`
- `fix/image-upload-error`
- `docs/api-documentation`

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Commit your changes** with clear commit messages:
   ```bash
   git add .
   git commit -m "feat: add recipe search functionality"
   ```
5. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows our coding standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #issue_number
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** and merge

## Coding Standards

### General Principles

- **Write clean, readable code**
- **Follow existing patterns** in the codebase
- **Use meaningful variable and function names**
- **Add comments for complex logic**
- **Keep functions small and focused**

### TypeScript Guidelines

```typescript
// Use proper typing
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
}

// Use async/await instead of promises
async function generateRecipe(image: string): Promise<Recipe> {
  try {
    const result = await aiService.generateRecipe(image);
    return result;
  } catch (error) {
    throw new Error(`Recipe generation failed: ${error.message}`);
  }
}
```

### React Native Guidelines

```tsx
// Use functional components with hooks
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
    </View>
  );
};

// Use StyleSheet for styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### API Guidelines

```typescript
// Use proper error handling
app.use('/api/ai', (req, res, next) => {
  try {
    // Route logic
  } catch (error) {
    next(error);
  }
});

// Use zod for validation
const RecipeSchema = z.object({
  photoDataUri: z.string().startsWith('data:image/'),
});
```

## Testing

### Writing Tests

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test component interactions
- **E2E tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific workspace
pnpm --filter api test
pnpm --filter mobile test

# Run tests in watch mode
pnpm test:watch
```

### Test Structure

```typescript
describe('Recipe Service', () => {
  it('should generate recipe from image', async () => {
    const mockImage = 'data:image/jpeg;base64,mockdata';
    const result = await recipeService.generateRecipe(mockImage);
    
    expect(result).toBeDefined();
    expect(result.title).toBeTruthy();
    expect(result.ingredients).toBeInstanceOf(Array);
  });
});
```

## Documentation

### Types of Documentation

- **Code comments**: Explain complex logic
- **README files**: Project and component overviews
- **API documentation**: Endpoint specifications
- **User guides**: How-to instructions

### Writing Good Documentation

- **Be clear and concise**
- **Use examples** to illustrate points
- **Keep it up to date** with code changes
- **Use proper Markdown** formatting

## Getting Help

### Where to Ask Questions

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Code Reviews**: For implementation feedback

### Response Times

- **Bug reports**: Within 24-48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 3-5 days

## Recognition

Contributors are recognized in our:
- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub releases** for major features

## License

By contributing to Bite, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Bite! Your efforts help make this project better for everyone. 🚀
