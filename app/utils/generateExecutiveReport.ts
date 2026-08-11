export interface ReportStat {
  title: string;
  value: string;
  trend?: string;
  color?: string;
}

export interface ReportTableColumn {
  header: string;
  accessor: string;
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface ReportOptions {
  reportTitle: string;
  subtitle: string;
  stats: ReportStat[];
  tables: ReportTable[];
}

export function generateExecutiveReport(options: ReportOptions) {
  const { reportTitle, subtitle, stats, tables } = options;
  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const serialNo = 'REP-' + Math.floor(100000 + Math.random() * 900000);

  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة (Popups) لعرض التقرير وتحميله.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${reportTitle} - ${serialNo}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Tajawal', sans-serif;
          background: #f8fafc;
          color: #0f172a;
          padding: 40px 20px;
          direction: rtl;
        }
        .report-card {
          max-width: 960px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .action-bar {
          background: #0f0c31;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-family: 'Tajawal', sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6C22F9, #4f46e5);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(108,34,249,0.35);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #16133a 0%, #2e266e 100%);
          padding: 40px 48px;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #6C22F9;
        }
        .brand-title {
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .report-subtitle {
          color: #a78bfa;
          font-size: 15px;
          font-weight: 700;
        }
        .meta-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
          font-size: 13px;
          line-height: 1.6;
        }
        .body-content {
          padding: 44px 48px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 20px;
          text-align: center;
        }
        .stat-val {
          font-size: 26px;
          font-weight: 900;
          color: #6C22F9;
          margin: 6px 0;
        }
        .stat-lbl {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
        }
        .stat-trend {
          font-size: 12px;
          font-weight: 800;
          color: #10b981;
        }
        .data-table-container {
          margin-bottom: 36px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        th {
          background: #0f0c31;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          padding: 14px 18px;
          text-align: right;
        }
        td {
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        .badge-active {
          background: #dcfce7;
          color: #15803d;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 2px dashed #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .seal-box {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
        }
        .seal-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #6C22F9;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(108,34,249,0.3);
        }
        @media print {
          .action-bar { display: none !important; }
          body { padding: 0; background: #fff; }
          .report-card { border: none; box-shadow: none; max-width: 100%; border-radius: 0; }
        }
      </style>
    </head>
    <body>
      
      <div class="report-card">
        
        <!-- Action Bar (Hidden when printing) -->
        <div class="action-bar">
          <div>
            <strong>📄 التقرير التنفيذي الرسمي المعتمد</strong>
          </div>
          <div style="display: flex; gap: 12px;">
            <button onclick="window.print()" class="btn btn-primary">
              🖨️ طباعة وحفظ كـ PDF
            </button>
            <button onclick="window.close()" class="btn btn-secondary">
              ✖️ إغلاق التقرير
            </button>
          </div>
        </div>

        <!-- Header -->
        <div class="header">
          <div>
            <div class="brand-title">منصة المهندس عبدالرحمن حامد</div>
            <div class="report-subtitle">البرمجة والذكاء الاصطناعي — ${reportTitle}</div>
          </div>
          <div class="meta-box">
            <div><strong>رقم الوثيقة:</strong> ${serialNo}</div>
            <div><strong>التاريخ:</strong> ${currentDate}</div>
            <div><strong>الوقت:</strong> ${currentTime}</div>
          </div>
        </div>

        <!-- Body Content -->
        <div class="body-content">
          
          <!-- Summary Stats -->
          <div class="section-title">📊 المؤشرات الكلية والأداء الرئيسي</div>
          <div class="stats-grid">
            ${stats.map(s => `
              <div class="stat-card">
                <div class="stat-lbl">${s.title}</div>
                <div class="stat-val">${s.value}</div>
                ${s.trend ? `<div class="stat-trend">${s.trend}</div>` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Tables -->
          ${tables.map(t => `
            <div class="data-table-container">
              <div class="section-title">📌 ${t.title}</div>
              <table>
                <thead>
                  <tr>
                    ${t.columns.map(c => `<th>${c}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${t.rows.map(row => `
                    <tr>
                      ${row.map(cell => `
                        <td>
                          ${cell === 'نشط' || cell === 'تم الرد' ? `<span class="badge-active">${cell}</span>` : cell}
                        </td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}

          <!-- Footer Stamp -->
          <div class="footer">
            <div class="seal-box">
              <div class="seal-icon">AH</div>
              <div>
                <div><strong>منصة المهندس عبدالرحمن حامد التعليمية</strong></div>
                <div style="color: #94a3b8; font-size: 12px;">تقرير تنفيذي رسمي معتمد أوتوماتيكياً عبر لوحة الإدارة</div>
              </div>
            </div>
            <div style="font-size: 12px; color: #94a3b8; font-weight: 700;">
              صفحة 1 من 1
            </div>
          </div>

        </div>

      </div>

      <script>
        // Auto trigger print dialog after loading styles
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  reportWindow.document.write(htmlContent);
  reportWindow.document.close();
}
