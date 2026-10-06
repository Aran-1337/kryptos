'use client';
import React from 'react';
import { Sliders, Save } from 'lucide-react';

interface PointsConfigProps {
  pointsPerMinute: string;
  setPointsPerMinute: (val: string) => void;
  pointsPerExamScore: string;
  setPointsPerExamScore: (val: string) => void;
  pointsPerAssignment: string;
  setPointsPerAssignment: (val: string) => void;
  onSave: () => void;
}

export default function PointsConfig({
  pointsPerMinute,
  setPointsPerMinute,
  pointsPerExamScore,
  setPointsPerExamScore,
  pointsPerAssignment,
  setPointsPerAssignment,
  onSave,
}: PointsConfigProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 20,
        border: '2px solid #6C22F9',
        padding: 24,
        marginBottom: 32,
        boxShadow: '0 4px 20px rgba(108,34,249,0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: 'var(--text-main)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sliders size={20} color="#6C22F9" /> 1. قواعد واحتساب كسب النقاط للطلاب (Custom Points Rules)
        </h3>
        <span style={{ fontSize: 12.5, color: '#10b981', fontWeight: 800 }}>
          تحديد الأدمن للقيم ⚙️
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: 'var(--bg)',
            padding: 16,
            borderRadius: 14,
            border: '1px solid var(--border)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            🎥 نقاط مشاهدة الشرح والفيديوهات
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              value={pointsPerMinute}
              onChange={e => setPointsPerMinute(e.target.value)}
              style={{
                width: 90,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontWeight: 900,
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
              نقطة / لكل 1 دقيقة مشاهدة
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg)',
            padding: 16,
            borderRadius: 14,
            border: '1px solid var(--border)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            📝 نقاط درجات الاختبارات والامتحانات
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              value={pointsPerExamScore}
              onChange={e => setPointsPerExamScore(e.target.value)}
              style={{
                width: 90,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontWeight: 900,
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
              نقطة / لكل 1% درجة مئوية
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg)',
            padding: 16,
            borderRadius: 14,
            border: '1px solid var(--border)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            📤 نقاط تسليم الواجبات والتطبيقات
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              value={pointsPerAssignment}
              onChange={e => setPointsPerAssignment(e.target.value)}
              style={{
                width: 90,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontWeight: 900,
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
              نقطة / لكل واجب أو مشروع
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#6C22F9',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 10,
            fontWeight: 800,
            fontSize: 13.5,
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Save size={16} /> حفظ قواعد احتساب النقاط
        </button>
      </div>
    </div>
  );
}
