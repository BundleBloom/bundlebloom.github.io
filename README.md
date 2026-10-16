# BundleBloom

BundleBloom is a free Windows command-line tool that gathers the source files of a project
into one organized text file. The command it installs is `mycli`.

- Website: https://bundlebloom.github.io/
- Downloads: [Releases](https://github.com/BundleBloom/bundlebloom.github.io/releases)

```powershell
mycli bundle --language all --output bundle.txt
mycli bundle -l CSharp Python -o review.txt -n -s code -r -a "Your Team"
mycli create-rsp
mycli @mybundle.rsp
```

## Repository layout

| Path | Contents |
| --- | --- |
| `src/` | Website (React, TypeScript, Vite). `src/sim/` is the deterministic in-browser demo. |
| `src/i18n/` | English and Hebrew text. |
| `src/config.ts` | Release version and download links (GitHub Releases of this repository). |
| `.github/workflows/pages.yml` | Builds, tests and deploys the site to GitHub Pages on every push to `main`. |

## Development

```sh
npm ci
npm run dev        # local server
npm test           # demo engine tests
npm run build      # type-check and production build into dist/
```

## Releases

Windows downloads are published as assets of this repository's
[Releases](https://github.com/BundleBloom/bundlebloom.github.io/releases). They are built from
source, installed and tested on a Windows runner before being attached. To point the website at
a new version, update `RELEASE.version` in `src/config.ts`.

The installer is not code-signed, so Windows SmartScreen may warn on first run. Each release
includes `SHA256SUMS.txt` for verification.
