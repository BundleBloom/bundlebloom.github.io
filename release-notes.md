BundleBloom 1.0.0 — the first public release of the `mycli` command for Windows.

### Downloads
- **BundleBloom-Setup-1.0.0-win-x64.exe** — installer for Windows 10 and 11 (64-bit). Installs for your user account only (no administrator rights) and adds `mycli` to your PATH. Uninstall from Settings › Apps.
- **BundleBloom-1.0.0-win-x64.zip** — portable `mycli.exe`; add its folder to your PATH yourself.
- **SHA256SUMS.txt** — checksums for both files.

Both are self-contained: .NET does not need to be installed.

### What mycli does
- `mycli bundle` gathers source files from the current folder and its subfolders into one file.
  - `-l, --language` CSharp, Java, Python, JavaScript, TypeScript, Cpp, Go or `all` (required)
  - `-o, --output` output file
  - `-n, --note` relative path comment above each file
  - `-s, --sort` `name` (default) or `code`
  - `-r, --remove-empty-lines`
  - `-a, --author` author comment on the first line
- `mycli create-rsp` saves a bundle command to a response file; run it with `mycli @file.rsp`.

### Notes
- The installer is not code-signed, so Windows SmartScreen may show "Windows protected your PC". Choose **More info › Run anyway** if you trust this download, and compare the file with SHA256SUMS.txt.
- Built and tested automatically on GitHub Actions: the raw executable and the installed command (from PATH) both pass the smoke tests, and uninstalling removes the files and the PATH entry.
