# Development Guide

This guide provides detailed information for developers working on the Fitness Analyzer app.

## Development Environment Setup

### Required Tools
1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **Xcode** (v15 or higher) - macOS only
   - Install from Mac App Store
   - Install Command Line Tools: `xcode-select --install`

3. **CocoaPods** - iOS dependency manager
   ```bash
   sudo gem install cocoapods
   ```

4. **Watchman** - File watching service
   ```bash
   brew install watchman
   ```

5. **Azure CLI** - For infrastructure deployment
   ```bash
   brew install azure-cli
   ```

### IDE Recommendations
- **VS Code** with extensions:
  - React Native Tools
  - ESLint
  - Prettier
  - TypeScript and JavaScript
  - Azure Account

- **Xcode** for iOS development

## Project Setup

### Initial Setup
```bash
# Clone repository
git clone https://github.com/aidenyoukhana/MicrosoftFoundryFitnessAnalyzer.git
cd MicrosoftFoundryFitnessAnalyzer

# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..

# Configure environment
cp .env.template .env
# Edit .env with your Azure credentials
```

### Running Development Server
```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS
npm run ios

# Or specify a device
npm run ios -- --device "iPhone 15 Pro"

# For release build
npm run ios -- --configuration Release
```

## Code Organization

### Directory Structure

```
src/
├── screens/           # Screen components (pages)
├── components/        # Reusable UI components
├── navigation/        # Navigation configuration
├── services/          # API and business logic
├── types/            # TypeScript definitions
├── theme/            # Design system (colors, typography)
└── utils/            # Helper functions
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `Card.tsx`)
- Screens: `ScreenNameScreen.tsx` (e.g., `DashboardScreen.tsx`)
- Services: `ServiceName.ts` (e.g., `HealthService.ts`)
- Types: `lowercase.ts` (e.g., `health.ts`)

**Components:**
- Use functional components with hooks
- Export default for screens
- Named exports for shared components

**Variables:**
- `camelCase` for variables and functions
- `PascalCase` for components and types
- `UPPER_CASE` for constants

## TypeScript Guidelines

### Type Safety
- Always define interfaces for props and state
- Use TypeScript strict mode
- Avoid `any` type - use `unknown` if type is truly unknown
- Define return types for functions

### Example Component
```typescript
interface MyComponentProps {
  title: string;
  value: number;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  value,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}: {value}</Text>
    </TouchableOpacity>
  );
};
```

## Styling Guidelines

### Theme System
Always use the theme system from `src/theme/`:
```typescript
import {colors, spacing, typography} from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
});
```

### StyleSheet Best Practices
- Create StyleSheet objects at the bottom of files
- Group related styles together
- Use theme constants instead of hardcoded values
- Keep inline styles minimal

## Component Development

### Creating a New Screen

1. Create file in `src/screens/`:
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../theme';

const NewScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.title,
  },
});

export default NewScreen;
```

2. Add to navigation in `src/navigation/BottomTabNavigator.tsx`

### Creating Reusable Components

```typescript
// src/components/Button.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
});
```

## Services and API Integration

### HealthService Pattern
```typescript
// Mock data for development
class MockHealthService {
  async getData() {
    return mockData;
  }
}

// Real implementation
class RealHealthService extends MockHealthService {
  async getData() {
    // Real API calls
  }
}

// Export based on condition
export const HealthService = __DEV__
  ? new MockHealthService()
  : new RealHealthService();
```

### Azure OpenAI Integration
```typescript
import {OpenAIClient} from '@azure/openai';

class AIService {
  private client: OpenAIClient;

  async generateTips(context: any) {
    const response = await this.client.getChatCompletions(
      deploymentName,
      messages
    );
    return response;
  }
}
```

## Testing

### Unit Tests
```bash
npm test
```

### Component Testing
```typescript
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Button title="Test" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Debugging

### React Native Debugger
```bash
# Enable debugging
# Shake device or Cmd+D in simulator
# Select "Debug" option
```

### Console Logging
```typescript
console.log('[Component] Message', data);
console.warn('[Warning] Something suspicious');
console.error('[Error] Something broke', error);
```

### React DevTools
```bash
npm install -g react-devtools
react-devtools
```

## Performance Optimization

### React.memo for Components
```typescript
export const ExpensiveComponent = React.memo(({data}) => {
  // Component logic
});
```

### useMemo and useCallback
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### FlatList for Lists
```typescript
<FlatList
  data={items}
  renderItem={({item}) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation

### Commit Messages
```
feat: Add sleep tracking chart
fix: Resolve heart rate calculation bug
refactor: Optimize dashboard data loading
docs: Update setup instructions
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Run linter: `npm run lint:fix`
4. Commit changes
5. Push to GitHub
6. Create PR with description
7. Wait for review

## Deployment

### iOS Build
```bash
# Archive build
xcodebuild archive \
  -workspace ios/FitnessAnalyzer.xcworkspace \
  -scheme FitnessAnalyzer \
  -archivePath ./build/FitnessAnalyzer.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/FitnessAnalyzer.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist exportOptions.plist
```

### TestFlight
1. Build archive in Xcode
2. Upload to App Store Connect
3. Add to TestFlight
4. Invite testers

## Troubleshooting

### Metro Bundler Issues
```bash
# Reset cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all
```

### CocoaPods Issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### Build Issues
1. Clean build folder in Xcode
2. Delete derived data
3. Clear npm cache: `npm cache clean --force`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

## Resources

- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Azure OpenAI Docs](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)
- [React Navigation Docs](https://reactnavigation.org/)
- [HealthKit Documentation](https://developer.apple.com/documentation/healthkit)

## Best Practices

1. **Code Quality**
   - Use ESLint and Prettier
   - Write meaningful comments
   - Keep functions small and focused
   - Follow DRY principle

2. **Performance**
   - Avoid unnecessary re-renders
   - Use FlatList for large lists
   - Optimize images
   - Profile with React DevTools

3. **Security**
   - Never commit secrets
   - Use environment variables
   - Validate user input
   - Keep dependencies updated

4. **Accessibility**
   - Add accessibility labels
   - Support screen readers
   - Ensure sufficient color contrast
   - Test with VoiceOver

## Getting Help

- Check documentation
- Search existing issues
- Ask in team chat
- Create GitHub issue with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
