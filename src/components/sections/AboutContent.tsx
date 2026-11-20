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
    <>
      <BioSection contentEn={en} contentZh={zh} />
      <EducationSection educationEn={en.education} educationZh={zh.education} />
      <BlogSection blogEn={en.blog} blogZh={zh.blog} />
      <SkillsSection skillsEn={en.skills} skillsZh={zh.skills} />
      <ExperienceSection experienceEn={en.experience} experienceZh={zh.experience} />
    </>
  );
}
