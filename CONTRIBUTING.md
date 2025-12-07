# Contributing to Fitness Analyzer

Thank you for your interest in contributing to the Microsoft Foundry Fitness Analyzer! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, React Native version, device)
- **Error messages** and stack traces

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** and motivation
- **Expected behavior**
- **Mockups or examples** if applicable
- **Impact** on existing functionality

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Follow the coding style**
   - Use TypeScript
   - Follow ESLint rules
   - Use the theme system
   - Write meaningful comments
   - Keep functions small and focused

3. **Write or update tests** if applicable
   ```bash
   npm test
   ```

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments to functions
   - Update CHANGELOG.md

5. **Ensure code quality**
   ```bash
   npm run lint
   npm run lint:fix
   ```

6. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     ```
     feat: Add sleep quality chart
     fix: Resolve heart rate calculation bug
     docs: Update setup instructions
     refactor: Optimize data loading
     test: Add workout service tests
     ```

7. **Push to your fork** and submit a pull request
   ```bash
   git push origin feature/my-new-feature
   ```

8. **Wait for review**
   - Address any feedback
   - Keep the PR updated with main branch
   - Be responsive to comments

## Development Setup

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup instructions.

Quick start:
```bash
git clone https://github.com/aidenyoukhana/MicrosoftFoundryFitnessAnalyzer.git
cd MicrosoftFoundryFitnessAnalyzer
npm install
cd ios && pod install && cd ..
npm start
```

## Coding Guidelines

### TypeScript

- Always define types and interfaces
- Avoid `any` - use `unknown` if needed
- Use type inference where possible
- Define return types for functions

```typescript
interface ComponentProps {
  title: string;
  value: number;
}

const MyComponent: React.FC<ComponentProps> = ({title, value}) => {
  return <Text>{title}: {value}</Text>;
};
```

### React Native

- Use functional components with hooks
- Avoid inline styles - use StyleSheet
- Use theme constants
- Optimize performance with memo, useMemo, useCallback

```typescript
import {colors, spacing} from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
});
```

### File Organization

- Group related code together
- One component per file
- Co-locate styles with components
- Use index files for cleaner imports

### Naming Conventions

- Components: `PascalCase.tsx`
- Files: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`

## Testing

### Running Tests
```bash
npm test
npm test -- --coverage
```

### Writing Tests
```typescript
import {render, fireEvent} from '@testing-library/react-native';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const {getByText} = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

## Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- [ ] Android support with Google Fit
- [ ] Additional chart types and visualizations
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Unit test coverage
- [ ] Integration tests

### Medium Priority
- [ ] Apple Watch companion app
- [ ] Nutrition tracking
- [ ] Workout planning features
- [ ] Social features
- [ ] Multi-language support
- [ ] Dark/light theme toggle

### Low Priority
- [ ] Custom workout types
- [ ] Export to different formats
- [ ] Advanced analytics
- [ ] Third-party integrations
- [ ] Widget support

## Feature Development Process

1. **Discuss** - Open an issue to discuss the feature
2. **Design** - Create mockups or detailed specifications
3. **Implement** - Write code following guidelines
4. **Test** - Add tests and manual testing
5. **Document** - Update documentation
6. **Review** - Submit PR for review
7. **Iterate** - Address feedback
8. **Merge** - Merged by maintainers

## Azure Infrastructure Contributions

When contributing to infrastructure:

1. Test Bicep templates locally
   ```bash
   az bicep build --file infra/main.bicep
   ```

2. Validate deployments in test environment
3. Update documentation
4. Consider cost implications
5. Ensure security best practices

## Documentation

Good documentation is crucial. When contributing:

- Update README.md if user-facing changes
- Update docs/DEVELOPMENT.md for dev changes
- Add JSDoc comments to functions
- Include examples in documentation
- Update CHANGELOG.md

## Questions?

- Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Review existing issues and PRs
- Open a new issue for questions
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments

Thank you for contributing to making fitness tracking better! 🏃‍♂️💪
