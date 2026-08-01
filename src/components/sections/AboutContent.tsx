import { ABOUT_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import HeroSection from './HeroSection';
import HomepageProofPathSection from './HomepageProofPathSection';
import BioSection from './BioSection';
import EducationSection from './EducationSection';
import BlogSection from './BlogSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';
import type { ReactElement } from 'react';

export default function AboutContent(): ReactElement {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const contentEn = ABOUT_CONTENT.en;
  const contentZh = ABOUT_CONTENT.zh;
  const isZh = langKey === 'zh';

  return (
    <div id="content">
      <HeroSection
        heroKickerEn={contentEn.heroKicker}
        heroKickerZh={contentZh.heroKicker}
        heroHeadingEn={contentEn.heroHeading}
        heroHeadingZh={contentZh.heroHeading}
        heroSummaryEn={contentEn.heroSummary}
        heroSummaryZh={contentZh.heroSummary}
      />
      <HomepageProofPathSection
        proofPathEn={contentEn.proofPath}
        proofPathZh={contentZh.proofPath}
      />
      <BioSection contentEn={contentEn} contentZh={contentZh} isZh={isZh} />
      <EducationSection educationEn={contentEn.education} educationZh={contentZh.education} />
      <BlogSection blogEn={contentEn.blog} blogZh={contentZh.blog} isZh={isZh} />
      <SkillsSection skillsEn={contentEn.skills} skillsZh={contentZh.skills} />
      <ExperienceSection experienceEn={contentEn.experience} experienceZh={contentZh.experience} />
      <ContactSection />
    </div>
  );
}
