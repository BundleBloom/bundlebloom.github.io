import { useI18n } from './i18n/index.tsx';
import { RELEASE } from './config.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Features } from './components/Features.tsx';
import { Demo } from './components/Demo.tsx';
import { Install } from './components/Install.tsx';
import { Faq } from './components/Faq.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingDownload } from './components/FloatingDownload.tsx';

export function App() {
  const { t } = useI18n();
  // Header and hero buttons jump to the download card, which links to the actual release asset.
  const downloadHref = '#download';
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>
      <Header downloadUrl={downloadHref} />
      <main id="main" tabIndex={-1}>
        <Hero downloadUrl={RELEASE.installerUrl} />
        <Features />
        <Demo />
        <Install />
        <Faq />
      </main>
      <Footer />
      <FloatingDownload href={RELEASE.installerUrl} />
    </>
  );
}
