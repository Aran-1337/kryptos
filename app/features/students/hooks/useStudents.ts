import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Student,
  GradeFilter,
  StudentTeacherNote,
  StudentNotesMap,
} from '../types/student.types';
import { initialStudents, initialStudentNotes } from '../mocks/student.mock';
import { studentsService } from '../services/students.service';
import { filterStudents } from '../utils/student.utils';

export function useStudents() {
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('all');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingNoteStudent, setEditingNoteStudent] = useState<Student | null>(null);

  const [noteText, setNoteText] = useState('');
  const [strengthsText, setStrengthsText] = useState(
    'التفكير المنطقي في الخوارزميات، سرعة حل امتحانات الخوارزميات (0 إنذارات غش)، الانضباط في مواعيد المشاهدة'
  );
  const [improvementText, setImprovementText] = useState(
    'التركيز على تطبيقات Loops التكرارية في بايثون'
  );

  const [toastMsg, setToastMsg] = useState('');
  const [studentNotes, setStudentNotes] = useState<StudentNotesMap>(initialStudentNotes);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    const timer = setTimeout(() => setToastMsg(''), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Hydrate from service on client mount
  useEffect(() => {
    const loadedStudents = studentsService.getStudents();
    setStudentsList(loadedStudents);
    const loadedNotes = studentsService.getTeacherNotes();
    setStudentNotes(loadedNotes);
  }, []);

  const filteredStudents = useMemo(() => {
    return filterStudents(studentsList, searchQuery, selectedGrade);
  }, [studentsList, searchQuery, selectedGrade]);

  const handleToggleBlock = useCallback(
    (studentId: number, currentStatus: string) => {
      const newStatus = currentStatus === 'نشط' ? 'محظور' : 'نشط';
      setStudentsList(prev => {
        const updated = prev.map(s =>
          s.id === studentId ? { ...s, status: newStatus as any } : s
        );
        studentsService.saveStudents(updated);
        return updated;
      });
      showToast(
        `✅ تم ${newStatus === 'محظور' ? 'حظر' : 'إلغاء حظر'} الطالب بنجاح!`
      );
    },
    [showToast]
  );

  const handleUnbindDevice = useCallback(
    (devId: string) => {
      if (!selectedStudent) return;
      const updatedDevices = selectedStudent.devices.filter(d => d.id !== devId);
      const updatedStudent: Student = {
        ...selectedStudent,
        devices: updatedDevices,
        devicesCount: updatedDevices.length,
      };
      setSelectedStudent(updatedStudent);
      setStudentsList(prev => {
        const updated = prev.map(s =>
          s.id === selectedStudent.id ? updatedStudent : s
        );
        studentsService.saveStudents(updated);
        return updated;
      });
      showToast('✅ تم فك ارتباط الجهاز بالحساب بنجاح!');
    },
    [selectedStudent, showToast]
  );

  const openNoteEditor = useCallback(
    (student: Student) => {
      setEditingNoteStudent(student);
      const existing = studentNotes[String(student.id)];
      if (existing && typeof existing === 'object') {
        setNoteText(existing.note || '');
        if (existing.strengths) setStrengthsText(existing.strengths);
        if (existing.improvement) setImprovementText(existing.improvement);
      } else if (typeof existing === 'string') {
        setNoteText(existing);
      } else {
        setNoteText(
          'أحمد من الطلاب المتميزين جداً هذا الأسبوع. التزامه بمشاهدة الحصص وحل الامتحانات في مواعيدها يعكس تفوقه وحصوله على المركز الأول في الدفعة.'
        );
      }
    },
    [studentNotes]
  );

  const handleSaveNote = useCallback(() => {
    if (!editingNoteStudent) return;
    const noteData: StudentTeacherNote = {
      note: noteText,
      strengths: strengthsText,
      improvement: improvementText,
    };
    const updatedMap = studentsService.saveTeacherNote(
      editingNoteStudent.id,
      noteData
    );
    setStudentNotes(updatedMap);
    const studentName = editingNoteStudent.name;
    setEditingNoteStudent(null);
    showToast(
      `✅ تم حفظ التوجيه ونقاط التميز والتوصيات للطالب (${studentName}) بنجاح!`
    );
  }, [editingNoteStudent, noteText, strengthsText, improvementText, showToast]);

  const closeNoteModal = useCallback(() => {
    setEditingNoteStudent(null);
  }, []);

  const closeDevicesModal = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  return {
    studentsList,
    filteredStudents,
    searchQuery,
    setSearchQuery,
    selectedGrade,
    setSelectedGrade,
    selectedStudent,
    setSelectedStudent,
    editingNoteStudent,
    setEditingNoteStudent,
    noteText,
    setNoteText,
    strengthsText,
    setStrengthsText,
    improvementText,
    setImprovementText,
    toastMsg,
    handleToggleBlock,
    handleUnbindDevice,
    openNoteEditor,
    handleSaveNote,
    closeNoteModal,
    closeDevicesModal,
  };
}
