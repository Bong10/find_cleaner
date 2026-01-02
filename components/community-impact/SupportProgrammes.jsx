"use client";
import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import FooterDefault from "../footer/common-footer";
import styles from "@/styles/SupportedCleaning.module.scss";

const SupportProgrammes = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}
      {/* Header spacer to offset fixed header height */}
      <span className="header-span"></span>

      {/* Supported Cleaning Landing - custom UI */}
      <div className={styles.scRoot}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container + " " + styles.heroContent}>
            <div className={styles.heroText}>
              <h1>
                Supporting vulnerable people with <strong>discreet</strong> cleaning.
              </h1>
              <p>
                Find-Cleaner offers subsidised cleaning for elderly, disabled, and
                low-income households, helping maintain safe and comfortable homes.
                Compassionate, discreet, and free from stigma.
              </p>
              <a href="/check-eligibility" className={styles.btn}>
                Check Eligibility
              </a>
            </div>
            <div className={styles.heroImage} aria-hidden="true" />
          </div>
        </section>

        {/* Trust banner */}
        <div className={styles.container}>
          <div className={styles.trustBanner}>
            <div className={styles.trustIcon}>
              <i className="la la-hands-helping" />
            </div>
            <div className={styles.trustText}>
              <p>
                <strong>Find-Cleaner is a UK Community Interest Company (CIC).</strong>
                <br />
                Profits from regular bookings fund this supported cleaning program.
              </p>
            </div>
          </div>
        </div>

        {/* Split section */}
        <div className={styles.container + " " + styles.splitSection}>
          <div>
            <h2 className={styles.sectionTitle}>Who is it for?</h2>
            <div className={styles.cardList}>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-user-shield" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Over 65 or disabled</h3>
                  <p>
                    For elderly, disabled, or those with long-term health conditions.
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-coins" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Low income household</h3>
                  <p>For pensioners, or those receiving benefits.</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-broom" />
                </div>
                <div className={styles.cardContent}>
                  <h3>In need of cleaning help</h3>
                  <p>Difficulty maintaining a safe, clean living environment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.howItWorksPanel}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.cardList}>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-clipboard-list" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Check Your Eligibility</h3>
                  <p>
                    Fill out our simple eligibility form to see if you qualify.
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-user-friends" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Set Up Your Clean</h3>
                  <p>
                    We discreetly discuss your cleaning needs and match you with the right cleaner.
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <i className="la la-smile" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Enjoy Assisted Cleaning</h3>
                  <p>
                    A trusted cleaner will arrive regularly to clean your home, offering dignified, discreet support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower feature section */}
        <section className={styles.featureSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.featureGrid}>
              <div className={styles.cardList}>
                <div className={styles.infoCard}>
                  <div className={styles.iconBox}>
                    <i className="la la-clipboard-check" />
                  </div>
                  <div className={styles.cardContent}>
                    <h3>Check Your Eligibility</h3>
                    <p>Fill out our simple eligibility form to see if you qualify.</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.iconBox}>
                    <i className="la la-users" />
                  </div>
                  <div className={styles.cardContent}>
                    <h3>Set Up Your Clean</h3>
                    <p>
                      We discreetly discuss your cleaning needs and match you with the right cleaner.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.featureImage} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className={styles.footerCta}>
          <div className={styles.footerDecoLeft} aria-hidden="true" />
          <div className={styles.footerDecoRight} aria-hidden="true" />
          <div className={styles.container}>
            <h2>Let's make things a little easier</h2>
            <p>
              Check if you or a loved one are eligible for supported cleaning.
            </p>
            <a href="/check-eligibility" className={styles.btn}>
              Check Eligibility
            </a>
          </div>
        </div>
      </div>

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default SupportProgrammes;
