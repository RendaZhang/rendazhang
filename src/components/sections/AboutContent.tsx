import { ABOUT_CONTENT } from '../../content';
import BioSection from './BioSection';
import EducationSection from './EducationSection';
import BlogSection from './BlogSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import type { ReactElement } from 'react';

export default function AboutContent(): ReactElement {
  const { en, zh } = ABOUT_CONTENT;

  return (
    <div className="c-home-notes">
      <BioSection contentEn={en} contentZh={zh} />
      <ExperienceSection experienceEn={en.experience} experienceZh={zh.experience} />
      <EducationSection educationEn={en.education} educationZh={zh.education} />
      <SkillsSection />
      <BlogSection blogEn={en.blog} blogZh={zh.blog} />
    </div>
  );
}
