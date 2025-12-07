# Azure Infrastructure Deployment Guide

This folder contains Infrastructure as Code (IaC) templates for deploying the required Azure resources for the Fitness Analyzer mobile app.

## Resources Deployed

The main.bicep template deploys the following Azure resources:

1. **Azure OpenAI Service**
   - GPT-4 model deployment for AI-powered health tips
   - Used by the mobile app to generate personalized fitness recommendations

2. **Storage Account**
   - Blob storage for health data exports
   - Secure backup and archival of user health data

3. **Key Vault**
   - Secure storage for API keys and connection strings
   - Stores OpenAI API key, storage connection strings

4. **Application Insights**
   - Application monitoring and analytics
   - Performance tracking and error logging

5. **Log Analytics Workspace**
   - Centralized logging
   - Query and analyze application logs

## Prerequisites

- Azure subscription
- Azure CLI installed and configured
- Appropriate permissions to create resources in your subscription

## Deployment Instructions

### 1. Login to Azure

```bash
az login
```

### 2. Set your subscription

```bash
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### 3. Create a resource group

```bash
az group create --name fitness-analyzer-rg --location eastus
```

### 4. Deploy the infrastructure

```bash
az deployment group create \
  --resource-group fitness-analyzer-rg \
  --template-file main.bicep \
  --parameters main.parameters.json
```

Or with custom parameters:

```bash
az deployment group create \
  --resource-group fitness-analyzer-rg \
  --template-file main.bicep \
  --parameters environmentName=prod location=westus2
```

### 5. Retrieve deployment outputs

```bash
az deployment group show \
  --resource-group fitness-analyzer-rg \
  --name main \
  --query properties.outputs
```

## Configuration

After deployment, configure your mobile app with the following environment variables:

```bash
# Get the OpenAI endpoint
export AZURE_OPENAI_ENDPOINT=$(az deployment group show \
  --resource-group fitness-analyzer-rg \
  --name main \
  --query properties.outputs.openAIEndpoint.value -o tsv)

# Get the OpenAI API key from Key Vault
export AZURE_OPENAI_KEY=$(az keyvault secret show \
  --vault-name $(az deployment group show \
    --resource-group fitness-analyzer-rg \
    --name main \
    --query properties.outputs.keyVaultName.value -o tsv) \
  --name openai-api-key \
  --query value -o tsv)

# Get the deployment name
export AZURE_OPENAI_DEPLOYMENT=$(az deployment group show \
  --resource-group fitness-analyzer-rg \
  --name main \
  --query properties.outputs.openAIDeploymentName.value -o tsv)
```

## Cost Estimation

Estimated monthly costs (as of 2024):
- Azure OpenAI (S0): ~$0.03 per 1K tokens
- Storage Account (LRS): ~$0.02 per GB
- Key Vault: ~$0.03 per 10K operations
- Application Insights: First 5GB free, then ~$2.30 per GB
- Log Analytics: First 5GB free, then ~$2.30 per GB

Total estimated cost: $10-50/month depending on usage

## Security Considerations

- All secrets are stored in Azure Key Vault
- Storage account has public access disabled
- TLS 1.2 minimum encryption enforced
- RBAC enabled on Key Vault
- Soft delete enabled on Key Vault with 7-day retention

## Cleanup

To delete all resources:

```bash
az group delete --name fitness-analyzer-rg --yes --no-wait
```

## Monitoring

Monitor your deployment:

```bash
# View Application Insights metrics
az monitor app-insights component show \
  --app $(az deployment group show \
    --resource-group fitness-analyzer-rg \
    --name main \
    --query properties.outputs.appInsightsName.value -o tsv) \
  --resource-group fitness-analyzer-rg

# Query logs
az monitor log-analytics query \
  --workspace $(az deployment group show \
    --resource-group fitness-analyzer-rg \
    --name main \
    --query properties.outputs.logAnalyticsName.value -o tsv) \
  --analytics-query "traces | limit 10"
```

## Support

For issues with deployment, please check:
1. Azure CLI version: `az --version`
2. Subscription quotas and limits
3. Regional availability of services
4. Azure OpenAI service availability (requires application approval)
