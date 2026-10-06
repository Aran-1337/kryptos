import { Section, Lesson } from '../types/course-content.types';

export function calculateCourseContentStats(sections: Section[]) {
  const totalLessons = sections.reduce(
    (acc, sec) => acc + (sec.lessons?.length || 0),
    0
  );
  const previewLessons = sections.reduce(
    (acc, sec) =>
      acc + (sec.lessons?.filter(l => l.isPreview)?.length || 0),
    0
  );

  return {
    totalSections: sections.length,
    totalLessons,
    previewLessons,
  };
}

export function filterLessons(lessons: Lesson[], query: string): Lesson[] {
  if (!query.trim()) return lessons;
  const q = query.toLowerCase().trim();
  return lessons.filter(l => l.title.toLowerCase().includes(q));
}
