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
| `packaging/cli-src/` | Unmodified snapshot of the `mycli` C# source, with SHA-256 hashes. |
| `packaging/installer/` | Inno Setup script (per-user install, adds `mycli` to PATH). |
| `packaging/scripts/` | Smoke tests run against the built executable and the installed command. |
| `.github/workflows/` | `pages.yml` deploys the site from `main`; `release.yml` builds, tests and drafts Windows releases. |

## Development

```sh
npm ci
npm run dev        # local server
npm test           # demo engine tests
npm run build      # type-check and production build into dist/
```

## Releasing

1. Update `RELEASE.version` in `src/config.ts` and add `packaging/release-notes/vX.Y.Z.md`.
2. Push a tag `vX.Y.Z`. The release workflow builds, tests, installs and uninstalls on a
   Windows runner, then creates a **draft** release.
3. Review the run and the draft, then publish it.

The installer is not code-signed, so Windows SmartScreen may warn on first run.
