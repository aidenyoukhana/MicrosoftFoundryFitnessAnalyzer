# Quick Start Guide

Get the Microsoft Foundry Fitness Analyzer up and running in minutes!

## Prerequisites Checklist

- [ ] macOS computer (for iOS development)
- [ ] Node.js 18+ installed
- [ ] Xcode 15+ installed
- [ ] CocoaPods installed
- [ ] Azure subscription (optional, for AI features)

## Installation (5 minutes)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/aidenyoukhana/MicrosoftFoundryFitnessAnalyzer.git
cd MicrosoftFoundryFitnessAnalyzer

# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

### Step 2: Run the App
```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS simulator
npm run ios
```

That's it! The app should launch in the iOS simulator. 🎉

## Optional: Enable AI Features (10 minutes)

To get AI-powered health tips, you need to set up Azure OpenAI:

### Step 1: Deploy Azure Infrastructure
```bash
cd infra

# Login to Azure
az login

# Create resource group
az group create --name fitness-analyzer-rg --location eastus

# Deploy resources (takes ~5 minutes)
az deployment group create \
  --resource-group fitness-analyzer-rg \
  --template-file main.bicep \
  --parameters main.parameters.json
```

### Step 2: Configure Environment Variables
```bash
# Copy template
cp .env.template .env

# Get your Azure OpenAI endpoint
az deployment group show \
  --resource-group fitness-analyzer-rg \
  --name main \
  --query properties.outputs.openAIEndpoint.value

# Get your API key
VAULT_NAME=$(az deployment group show \
  --resource-group fitness-analyzer-rg \
  --name main \
  --query properties.outputs.keyVaultName.value -o tsv)

az keyvault secret show \
  --vault-name $VAULT_NAME \
  --name openai-api-key \
  --query value -o tsv

# Edit .env with these values
nano .env
```

### Step 3: Restart the App
```bash
npm start
```

Now you'll get personalized AI-generated health tips! 🤖

## Testing HealthKit (Real Device)

HealthKit only works on physical iOS devices, not simulators.

### Step 1: Connect iPhone
- Connect your iPhone via USB
- Trust the computer on your device

### Step 2: Set up Signing
- Open `ios/FitnessAnalyzer.xcworkspace` in Xcode
- Select your development team
- Change bundle identifier if needed

### Step 3: Run on Device
```bash
npm run ios -- --device "Your iPhone Name"
```

### Step 4: Grant Permissions
- Open the app
- Go to Settings tab
- Tap "HealthKit Permissions"
- Grant all requested permissions

## Common Issues

### Metro bundler won't start
```bash
npm start -- --reset-cache
```

### CocoaPods errors
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Build fails in Xcode
1. Clean Build Folder (Cmd+Shift+K)
2. Close Xcode
3. Delete `ios/build` folder
4. Reopen Xcode and build

### HealthKit not working
- Ensure you're using a real device (not simulator)
- Check that HealthKit capability is enabled in Xcode
- Verify Info.plist has usage descriptions

## Next Steps

1. **Explore the app** - Check out all 5 tabs
2. **Add health data** - Use Apple Health app to add sample data
3. **Customize theme** - Edit `src/theme/index.ts`
4. **Add features** - See [CONTRIBUTING.md](CONTRIBUTING.md)
5. **Deploy Azure** - Follow [infra/README.md](infra/README.md)

## Getting Help

- 📖 **Full documentation**: [README.md](README.md)
- 👨‍💻 **Development guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- 🏗️ **Infrastructure guide**: [infra/README.md](infra/README.md)
- 🤝 **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 **Report issues**: [GitHub Issues](https://github.com/aidenyoukhana/MicrosoftFoundryFitnessAnalyzer/issues)

## What's Included

✅ 5 beautiful dark-mode screens
✅ Real-time health metrics
✅ Interactive charts and graphs
✅ AI-powered health tips
✅ HealthKit integration
✅ Azure OpenAI support
✅ Complete infrastructure as code
✅ Comprehensive documentation

Happy tracking! 💪📊
