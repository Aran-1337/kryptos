import { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, CourseGrade, CourseType, CourseStatus, CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';
import { coursesService } from '../services/courses.service';
import { filterCourses, calculateDiscountBadge } from '../utils/course.utils';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<CourseGrade>('أولى ثانوي');
  const [type, setType] = useState<CourseType>('شرح المنهج');
  const [originalPrice, setOriginalPrice] = useState('500');
  const [price, setPrice] = useState('350');
  const [hasDiscount, setHasDiscount] = useState(true);
  const [imageUrl, setImageUrl] = useState('/th1.webp');
  const [status, setStatus] = useState<CourseStatus>('مفعل');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await coursesService.getManageCourses();
      setCourses(data.courses);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'تعذر تحميل الكورسات من السيرفر';
      setError(msg);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    return filterCourses(courses, searchQuery);
  }, [courses, searchQuery]);

  const handleOpenNewModal = useCallback(() => {
    setEditingCourse(null);
    setTitle('');
    setDescription('');
    setGrade('أولى ثانوي');
    setType('شرح المنهج');
    setOriginalPrice('500');
    setPrice('350');
    setHasDiscount(true);
    setImageUrl('/th1.webp');
    setStatus('مفعل');
    setApiError('');
    setShowModal(true);
  }, []);

  const handleOpenEditModal = useCallback((course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description || course.title);
    setGrade(course.grade);
    setType(course.type);
    setOriginalPrice(
      course.originalPrice ? course.originalPrice.replace(' ج.م', '') : ''
    );
    setPrice(course.price.replace(' ج.م', ''));
    setHasDiscount(!!course.discountBadge);
    setImageUrl(course.image || '/th1.webp');
    setStatus(course.status);
    setApiError('');
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setApiError('');
  }, []);

  const handleSaveCourse = useCallback(async () => {
    if (!title.trim()) {
      setApiError('يرجى إدخال عنوان الكورس');
      return;
    }

    setSaveLoading(true);
    setApiError('');

    const origNum = Number(originalPrice) || 0;
    const priceNum = Number(price) || 0;
    const basePrice = hasDiscount && origNum > priceNum ? origNum : priceNum;
    const discountPrice = hasDiscount && origNum > priceNum ? priceNum : undefined;

    try {
      if (editingCourse) {
        const courseId = (editingCourse._id || editingCourse.id).toString();
        const updatePayload: UpdateCourseDTO = {
          title: title.trim(),
          description: (description || title).trim(),
          category: type || 'شرح المنهج',
          price: basePrice,
          discountPrice,
          grade,
          isFree: basePrice === 0,
        };

        await coursesService.updateCourse(courseId, updatePayload);

        // If status was changed to active and course is not yet published, publish it
        if (status === 'مفعل' && !editingCourse.isPublished) {
          await coursesService.publishCourse(courseId).catch(() => {});
        }
      } else {
        const createPayload: CreateCourseDTO = {
          title: title.trim(),
          description: (description || title).trim(),
          category: type || 'شرح المنهج',
          price: basePrice,
          discountPrice,
          grade,
          level: 'beginner',
          isFree: basePrice === 0,
        };

        const created = await coursesService.createCourse(createPayload);

        // If newly created course is set to 'مفعل', publish it
        if (status === 'مفعل' && created.id) {
          const createdId = (created._id || created.id).toString();
          await coursesService.publishCourse(createdId).catch(() => {});
        }
      }

      await fetchCourses();
      setShowModal(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'حدث خطأ أثناء حفظ الكورس';
      setApiError(msg);
    } finally {
      setSaveLoading(false);
    }
  }, [
    title,
    description,
    grade,
    type,
    originalPrice,
    price,
    hasDiscount,
    status,
    editingCourse,
    fetchCourses,
  ]);

  const handleDeleteCourse = useCallback(
    async (id: string | number) => {
      if (!confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) return;
      try {
        await coursesService.deleteCourse(id.toString());
        await fetchCourses();
      } catch (err: any) {
        alert(err.response?.data?.message || 'تعذر حذف الكورس من السيرفر');
      }
    },
    [fetchCourses]
  );

  return {
    courses,
    filteredCourses,
    loading,
    error,
    apiError,
    saveLoading,
    searchQuery,
    setSearchQuery,
    showModal,
    editingCourse,
    title,
    setTitle,
    description,
    setDescription,
    grade,
    setGrade,
    type,
    setType,
    originalPrice,
    setOriginalPrice,
    price,
    setPrice,
    hasDiscount,
    setHasDiscount,
    imageUrl,
    setImageUrl,
    status,
    setStatus,
    fetchCourses,
    handleOpenNewModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveCourse,
    handleDeleteCourse,
  };
}
