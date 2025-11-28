# Microfrontend Upload Extension for Azure DevOps

This extension provides a custom task for Azure DevOps pipelines to upload microfrontend bundles to a specified domain.

## Features

- Zip and upload a file or directory to a microfrontend server
- Support for versioning
- Simple configuration through pipeline variables

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