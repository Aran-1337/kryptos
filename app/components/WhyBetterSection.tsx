'use client';
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Rocket, Lightbulb, Wrench, ClipboardList,
  FolderKanban, BarChart3, Target, Globe, CodeXml,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.2, transition: { type: 'spring' as const, stiffness: 300 } },
};

const defaultBetterCards = [
  { Icon: Rocket,       color: '#6c63ff', image: '/b1.webp', title: 'ابدأ من الصفر',        sub: 'هنبدأ معاك خطوة بخطوة مهما كان مستواك، لحد ما تبقى فاهم كل جزء.' },
  { Icon: Lightbulb,    color: '#f59e0b', image: '/b2.webp', title: 'الفهم قبل الحفظ',       sub: 'هنبسط أصعب الأفكار بطريقة سهلة تخليك تفهم وتحفظ من غير تعقيد.' },
  { Icon: Wrench,       color: '#10b981', image: '/b3.webp', title: 'حل وتدريب مستمر',       sub: 'بعد كل شرح هتلاقي أسئلة وتطبيقات تثبت المعلومة وتزود ثقتك.' },
  { Icon: ClipboardList,color: '#ef4444', image: '/b4.webp', title: 'امتحانات على كل درس',   sub: 'اختبر نفسك بعد كل درس واعرف مستواك والأجزاء اللي محتاجة مراجعة.' },
  { Icon: FolderKanban, color: '#3b82f6', image: '/b5.webp', title: 'مراجعات شاملة',         sub: 'مراجعات منظمة تجمع المنهج بالكامل وتثبت أهم النقاط قبل الامتحان.' },
  { Icon: BarChart3,    color: '#8b5cf6', image: '/b6.webp', title: 'متابعة مستواك',         sub: 'اعرف تقدمك أول بأول وشوف نقاط القوة والأجزاء اللي محتاجة تحسين.' },
  { Icon: Target,       color: '#ec4899', image: '/b7.webp', title: 'استعداد للامتحانات',    sub: 'تدريب على شكل الامتحان وأسئلة متنوعة تساعدك تحقق أعلى الدرجات.' },
  { Icon: Globe,        color: '#f97316', image: '/b8.webp', title: 'دعم في أي وقت',         sub: 'ارجع للدروس في أي وقت وذاكر بالسرعة اللي تناسبك ومن أي مكان.' },
];

function TiltCard({ card }: { card: typeof defaultBetterCards[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = card.Icon || Rocket;
  const color = card.color || '#6C22F9';
  const image = card.image || '/b1.webp';

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        height: 220,
        borderRadius: 24,
        position: 'relative',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <motion.div
        variants={{
          rest: { opacity: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
          hover: { opacity: 1, boxShadow: `0 15px 45px ${color}aa` }
        }}
        style={{
          position: 'absolute', inset: 0, borderRadius: 24, zIndex: 0,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 24,
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.1) translateZ(-20px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 60%, ${color}cc 100%)`,
          transform: 'translateZ(-10px)',
        }} />
      </div>

      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 18px',
        textAlign: 'right',
        transform: 'translateZ(40px)',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {/* Icon box aligned on the LEFT side with internal icon centered */}
        <motion.div
          variants={iconVariants}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            marginRight: 'auto', // Pushes box to the left side
          }}>
          <Icon size={22} color="#fff" strokeWidth={1.8} style={{ display: 'block', margin: 'auto' }} />
        </motion.div>

        <div>
          <h3 style={{
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: 6,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {card.title}
          </h3>
          <p style={{
            fontSize: 'clamp(11px, 1.05vw, 12.5px)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 500,
          }}>
            {card.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyBetterSection() {
  const [sectionTitle, setSectionTitle] = useState('إيه اللي بيميزنا عن الباقيين؟');
  const [cards, setCards] = useState(defaultBetterCards);

  const loadCmsData = () => {
    try {
      const saved = localStorage.getItem('cms_homepage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whyBetter) {
          if (parsed.whyBetter.title) setSectionTitle(parsed.whyBetter.title);
          if (parsed.whyBetter.features && Array.isArray(parsed.whyBetter.features)) {
            const merged = parsed.whyBetter.features.map((f: any, idx: number) => ({
              ...defaultBetterCards[idx % defaultBetterCards.length],
              title: f.title,
              sub: f.desc
            }));
            setCards(merged);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCmsData();
    const handleCmsUpdate = () => loadCmsData();
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('cms_updated', handleCmsUpdate);
    return () => {
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('cms_updated', handleCmsUpdate);
    };
  }, []);

  return (
    <section style={{
      backgroundImage: 'url(/background-why.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)',
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }}>
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Header - Centered Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#fff',
            borderRadius: 30,
            padding: '7px 20px',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 20,
            letterSpacing: 0.5,
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          }}>
            <Target size={14} />
            ليه إحنا أفضل؟
          </motion.span>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 44px)',
            fontWeight: 900,
            color: 'var(--text-main)',
            marginBottom: 14,
            lineHeight: 1.4,
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <span>{sectionTitle}</span>
            <CodeXml size={36} color="#7c3aed" />
          </h2>

          <p style={{
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            color: 'var(--text-muted)',
            margin: 0,
            fontWeight: 500,
            maxWidth: 650,
            textAlign: 'center'
          }}>
            مش بس كورسات، ده نظام متكامل صُمم عشان يوصلك للنتيجة اللي بتحلم بيها
          </p>
        </motion.div>

        {/* Full Screen Width Grid: 4 Cards Per Row Across 100% Screen Width */}
        <motion.div
          className="why-better-fullwidth-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            width: '100%',
          }}>
          {cards.map((card, i) => (
            <TiltCard key={i} card={card} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .why-better-fullwidth-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .why-better-fullwidth-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
