import { Section } from '../types/course-content.types';

export const initialSections: Section[] = [
  {
    id: 'sec-1',
    title: 'الباب الأول: أساسيات التفكير البرمجي والخوارزميات',
    lessons: [
      {
        id: 'les-1',
        title: 'مقدمة في علوم الحاسب والبرمجة',
        duration: '18:40 دقيقة',
        isPreview: true,
        videoProvider: 'Bunny.net HLS (محمي ضد السرقة)',
        videoUrl: 'https://iframe.mediadelivery.net/embed/12345/abcde',
        pdfUrl: '/memento1.pdf',
      },
      {
        id: 'les-2',
        title: 'فهم خرائط التدفق (Flowcharts) بالتفصيل',
        duration: '25:10 دقيقة',
        isPreview: false,
        videoProvider: 'Vimeo Private Stream',
        videoUrl: 'https://player.vimeo.com/video/987654321',
        pdfUrl: '',
      },
    ],
  },
  {
    id: 'sec-2',
    title: 'الباب الثاني: المتغيرات وبنية البيانات في بايثون',
    lessons: [
      {
        id: 'les-3',
        title: 'المتغيرات وأنواع البيانات (Variables & Types)',
        duration: '30:00 دقيقة',
        isPreview: false,
        videoProvider: 'Bunny.net HLS',
        videoUrl: 'https://iframe.mediadelivery.net/embed/12345/xyz',
        pdfUrl: '/memento2.pdf',
      },
    ],
  },
];
