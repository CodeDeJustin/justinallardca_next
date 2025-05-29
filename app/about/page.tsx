import Script from "next/script";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Script src="/js/script.js" strategy="afterInteractive" />

      <header className="cover">
        {/* Place ici ton Particle Slider ou ton Header en composant si possible */}
        <a href="/" className="header-link">
          <p>
            Développeur Full Stack | Automatisation CAO & PLM | PMP<sup>®</sup>,
            PSM™ II, PSPO™ I
          </p>
        </a>
      </header>

      <main>
        <section className="section-polygone-haut">
          <div className="separateur"></div>
          <p>
            Ensemble, <b>nous donnons vie</b> à vos projets{" "}
            <b>les plus innovants</b> et audacieux!
          </p>
        </section>

        <section className="section">
          <h2>En savoir plus</h2>
          <div className="col-contenu-img">
            <a
              href="https://www.linkedin.com/in/justin-allard-prog"
              target="_blank"
            >
              <Image
                src="/media/profile2.jpg"
                alt="Photo de Justin"
                width={250}
                height={250}
                className="profile-pic"
              />
            </a>
          </div>

          <div className="col-contenu float-right">
            <div className="texte-avec-ligne-verticale">
              {/* Copie ici ton contenu HTML converti en JSX */}
              <p>En constant développement professionnel ...</p>
              <p>En plus de mes compétences en tant que programmeur CAO ...</p>
              {/* etc. */}
              <a
                href="https://www.linkedin.com/in/justin-allard-prog"
                target="_top"
              >
                En savoir plus sur mon profil
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <a href="/details" target="_top">
            <Image
              src="/media/profile.png"
              alt="Justin Allard"
              width={120}
              height={120}
              className="footer-profile"
            />
          </a>
          <div className="footer-text">
            <p>
              Besoin de discuter de vos projets ?
              <br />
              <a href="/contact" target="_top">
                <b> 😊 Contactez-moi ! 😊</b>
              </a>
              <br />
              <br />
              <a href="/confidentialite-ca" target="_top">
                Politique de confidentialité
              </a>
              <br />
              <br />© Justin Allard 2025
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
