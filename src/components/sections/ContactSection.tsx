import type { ReactElement } from 'react';
import ContactForm from '../forms/ContactForm/ContactForm';
import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_INTL } from '../../constants/meta';
import { ABOUT_CONTENT } from '../../content/aboutContent';
import LocalizedSection from '../ui/data-display/LocalizedSection';

export default function ContactSection(): ReactElement {
  const contactZh = ABOUT_CONTENT.zh.contact;
  const contactEn = ABOUT_CONTENT.en.contact;
  const formTexts = { zh: contactZh.form, en: contactEn.form };

  return (
    <section className="c-contact-section" id="contact" aria-labelledby="contact-title">
      <header className="c-contact-heading">
        <h2 id="contact-title" tabIndex={-1}>
          <LocalizedSection zhContent={contactZh.title} enContent={contactEn.title} />
        </h2>
        <p>
          <LocalizedSection zhContent={contactZh.purpose} enContent={contactEn.purpose} />
        </p>
      </header>

      <div className="c-contact-letter">
        <ContactForm texts={formTexts} />
      </div>

      <dl className="c-contact-channels">
        {contactZh.info.map((info, index) => {
          const infoEn = contactEn.info[index];
          const href = [`tel:${CONTACT_PHONE_INTL}`, `mailto:${CONTACT_EMAIL_PRIMARY}`][index];
          const value = <LocalizedSection zhContent={info.value} enContent={infoEn.value} />;
          return (
            <div key={info.label}>
              <dt>
                <LocalizedSection zhContent={info.label} enContent={infoEn.label} />
              </dt>
              <dd>{href ? <a href={href}>{value}</a> : value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
