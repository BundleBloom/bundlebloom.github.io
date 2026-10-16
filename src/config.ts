// Public release information. The download URL points at a GitHub Releases asset.
export const RELEASE = {
  version: '1.0.0',
  repoUrl: 'https://github.com/BundleBloom/bundlebloom.github.io',
  installerName: 'BundleBloom-Setup-1.0.0-win-x64.exe',
  zipName: 'BundleBloom-1.0.0-win-x64.zip',
  get tagUrl() {
    return `${this.repoUrl}/releases/tag/v${this.version}`;
  },
  get installerUrl() {
    return `${this.repoUrl}/releases/download/v${this.version}/${this.installerName}`;
  },
  get zipUrl() {
    return `${this.repoUrl}/releases/download/v${this.version}/${this.zipName}`;
  },
} as const;
