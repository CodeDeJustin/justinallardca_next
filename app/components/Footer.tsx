import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <Link href="/details" passHref>
          <Image
            className={styles["footer-profile"]}
            src="/media/profile.png"
            alt="Justin Allard"
            id="profilePic"
            width={100}
            height={100}
            priority
          />
        </Link>
        <div className={styles["footer-text"]}>
          <p>
            Besoin de discuter de vos projets pour une future collaboration?
            <br />
            <Link href="/contact" passHref>
              <b> 😊 Contactez-moi ! 😊</b>
            </Link>
            <br />
            <br />
            <Link href="/confidentialite-ca" passHref>
              Politique de confidentialité
            </Link>
            <br />
            <br />© Justin Allard 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
