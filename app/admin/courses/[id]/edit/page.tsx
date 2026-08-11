'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '../../../../lib/adminApi';
import CourseForm from '../../CourseForm';

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`).then(r => setCourse(r.data?.data?.course || r.data?.course));
  }, [id]);

  if (!course) return <div style={{ padding: 40, textAlign: 'center', color: '#7c7a9a' }}>جاري التحميل...</div>;
  return <CourseForm initial={course} />;
}
