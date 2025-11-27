# Microfrontend Upload Extension for Azure DevOps

This extension provides a custom task for Azure DevOps pipelines to upload microfrontend bundles to a specified domain.

## Features

- Zip and upload a file or directory to a microfrontend server
- Support for versioning
- Simple configuration through pipeline variables

## Prerequisites

- Node.js 16.x or later
- Azure DevOps organization
- Personal Access Token (PAT) with appropriate permissions

## Installation

1. Package the extension:
   ```bash
   npm install
   npm run build
   ```

2. Create the VSIX package:
   ```bash
   npm install -g tfx-cli
   tfx extension create --manifest-globs vss-extension.json
   ```

3. Upload the generated VSIX file to the [Azure DevOps Marketplace](https://marketplace.visualstudio.com/azuredevops).

## Usage in Pipeline

Add the following task to your Azure DevOps pipeline:

```yaml
- task: microfrontend-upload@1
  displayName: 'Upload Microfrontend'
  inputs:
    apiKey: '$(API_KEY)'
    microfrontendSlug: 'your-microfrontend-slug'
    domain: 'https://your-domain.com'
    filePath: '$(Build.ArtifactStagingDirectory)/your-app'
    version: '$(Build.BuildNumber)'
```

## Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| apiKey | Yes | The API key for authentication |
| microfrontendSlug | Yes | The slug identifier for the microfrontend |
| domain | Yes | The base domain where the microfrontend will be uploaded |
| filePath | Yes | The path to the file or directory to be zipped and uploaded |
| version | Yes | The version of the microfrontend (e.g., 1.0.0) |

## Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the project: `npm run build`
4. Test the task locally (see below)

## Testing Locally

You can test the task locally without installing it on Azure DevOps by using environment variables to simulate task inputs:

```bash
# 1. Build the project
npm run build

# 2. Create test files (optional)
mkdir -p test-files
echo "Test microfrontend content" > test-files/index.html
echo "console.log('test');" > test-files/app.js

# 3. Run the task with environment variables
INPUT_APIKEY="test-api-key-123" \
INPUT_MICROFRONTENDSLUG="test-mfe" \
INPUT_DOMAIN="https://test-domain.com" \
INPUT_FILEPATH="$(pwd)/test-files" \
INPUT_VERSION="1.0.0-test" \
node dist/index.js
```

This will:
- Load all inputs from environment variables (pattern: `INPUT_<PARAMETER_NAME>`)
- Create a zip file from the specified directory/file
- Attempt to upload to the specified domain

**Expected Output:**
- The task will create a zip file named `<microfrontendSlug>-<version>.zip`
- It will show debug information about the upload attempt
- If using a test domain, you'll get a connection error (which is expected)

**Testing with a real server:**
Replace the environment variables with your actual API key, domain, and microfrontend slug.

## Publishing Updates

1. Update the version in `package.json` and `vss-extension.json`
2. Create a new release in GitHub
3. The GitHub Action will automatically package and publish the extension

## License

MIT
