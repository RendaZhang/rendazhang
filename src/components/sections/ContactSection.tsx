import { ContactForm } from '../forms';
import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_LOCAL } from '../../constants';
import { ABOUT_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

export default function ContactSection(): ReactElement {
  useLanguage();
  const contactZh = ABOUT_CONTENT.zh.contact;
  const contactEn = ABOUT_CONTENT.en.contact;
  const infosZh = contactZh.info || [];
  const infosEn = contactEn.info || [];
  const formTexts = { zh: contactZh.form, en: contactEn.form };
  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title">
        <LocalizedSection zhContent={contactZh.title} enContent={contactEn.title} />
      </h2>
      <div className="grid-row">
        <div className="grid-col-md-4">
          <div className="contact-info">
            <strong>
              <LocalizedSection zhContent={infosZh[0]?.label} enContent={infosEn[0]?.label} />
            </strong>
            <div>
              <LocalizedSection
                zhContent={infosZh[0]?.value || CONTACT_PHONE_LOCAL}
                enContent={infosEn[0]?.value || CONTACT_PHONE_LOCAL}
              />
            </div>
          </div>
          <div className="contact-info">
            <strong>
              <LocalizedSection zhContent={infosZh[1]?.label} enContent={infosEn[1]?.label} />
            </strong>
            <div>
              <LocalizedSection
                zhContent={infosZh[1]?.value || CONTACT_EMAIL_PRIMARY}
                enContent={infosEn[1]?.value || CONTACT_EMAIL_PRIMARY}
              />
            </div>
          </div>
          <div className="contact-info">
            <strong>
              <LocalizedSection zhContent={infosZh[2]?.label} enContent={infosEn[2]?.label} />
            </strong>
            <div>
              <LocalizedSection
                zhContent={infosZh[2]?.value || '广东省深圳市'}
                enContent={infosEn[2]?.value || 'Shenzhen, Guangdong, China'}
              />
            </div>
          </div>
        </div>
        <div className="grid-col-md-8">
          <ContactForm texts={formTexts} />
        </div>
      </div>
    </section>
  );
}
