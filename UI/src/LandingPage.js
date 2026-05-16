import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
/* ─────────────────────────────────────────────
   EmpNest Landing Page
   Stack: React + inline styles (no MUI / Tailwind dependency)
   Drop-in replacement for the old MUI version.
   Import your own logo/animation if needed.
───────────────────────────────────────────── */

// ── Tokens ──────────────────────────────────
const T = {
  navy:   '#0f1629',
  navy2:  '#1a2540',
  blue:   '#2563eb',
  blueL:  '#eff6ff',
  green:  '#22c55e',
  muted:  '#64748b',
  border: 'rgba(15,22,41,0.08)',
  white:  '#ffffff',
  bg:     '#f8fafc',
  radius: { sm: '8px', md: '12px', lg: '18px', xl: '24px', full: '999px' },
  shadow: {
    sm:  '0 1px 3px rgba(15,22,41,0.06), 0 1px 2px rgba(15,22,41,0.04)',
    md:  '0 4px 16px rgba(15,22,41,0.08)',
    lg:  '0 16px 48px rgba(15,22,41,0.10)',
  },
};

// ── Data ──────────────────────────────────────
const NAV_LINKS = ['Home', 'Features', 'How it works', 'Contact'];

const FEATURES = [
  {
    icon: '👥',
    color: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Smart Recruitment',
    desc: 'AI-scored applicants, interview scheduling, offer letters, and onboarding workflows — end to end.',
  },
  {
    icon: '✨',
    color: '#f0fdf4',
    iconColor: '#16a34a',
    title: 'AI HR Assistant',
    desc: 'Employees get instant answers about policies, payslips, and leave balances. No tickets needed.',
  },
  {
    icon: '📊',
    color: '#fefce8',
    iconColor: '#ca8a04',
    title: 'Analytics Dashboard',
    desc: 'Live attendance, payroll costs, headcount trends, and performance metrics with one-click exports.',
  },
  {
    icon: '🔒',
    color: '#fdf2f8',
    iconColor: '#9333ea',
    title: 'Enterprise Security',
    desc: 'RBAC, SSO, audit logs, and SOC 2-ready infrastructure. Built for enterprise compliance from day one.',
  },
];

const STEPS = [
  { n: '01', title: 'Connect your org', desc: 'Import your team via CSV or SSO. EmpNest auto-maps roles and departments in minutes.' },
  { n: '02', title: 'Configure policies', desc: 'Set leave rules, payroll cycles, attendance policies, and multi-level approval chains.' },
  { n: '03', title: 'Enable AI assistant', desc: 'Upload your company handbook. The AI learns your context and handles employee queries instantly.' },
  { n: '04', title: 'Track & grow', desc: 'Live dashboards let you monitor performance, forecast hiring needs, and reduce attrition.' },
];

const TESTIMONIALS = [
  // {
  //   stars: 5,
  //   text: 'EmpNest cut our time-to-hire by 60%. What used to take two weeks now takes two days.',
  //   name: 'Rahul Sharma',
  //   role: 'HR Director · TechNova',
  //   initials: 'RS',
  //   avatarBg: '#eff6ff',
  //   avatarColor: '#1d4ed8',
  // },
  // {
  //   stars: 5,
  //   text: 'The AI assistant reduced our HR support tickets by 70%. Employees just ask it directly now.',
  //   name: 'Priya Reddy',
  //   role: 'People Ops · CloudPeak',
  //   initials: 'PR',
  //   avatarBg: '#f0fdf4',
  //   avatarColor: '#15803d',
  // },
  // {
  //   stars: 5,
  //   text: 'Clean UI, fast workflows, and the analytics are genuinely impressive. Best HR tool we\'ve used.',
  //   name: 'Arjun Verma',
  //   role: 'Founder · ScaleFlow',
  //   initials: 'AV',
  //   avatarBg: '#fdf2f8',
  //   avatarColor: '#7e22ce',
  // },
];

// ── Reusable primitives ──────────────────────
const Btn = ({ children, variant = 'primary', onClick, style = {} }) => {
  const [hov, setHov] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '11px 22px', borderRadius: T.radius.md,
    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
    transition: 'all .18s', border: 'none', ...style,
  };
  const variants = {
    primary: {
      background: hov ? '#1d4ed8' : T.blue, color: '#fff',
      boxShadow: hov ? T.shadow.md : 'none',
    },
    secondary: {
      background: hov ? T.bg : T.white,
      color: T.navy, border: `1px solid ${T.border}`,
    },
    ghost: {
      background: 'none', color: 'rgba(255,255,255,.85)',
      border: '1px solid rgba(255,255,255,.25)',
      ...(hov ? { background: 'rgba(255,255,255,.08)' } : {}),
    },
    white: {
      background: hov ? '#f1f5f9' : T.white, color: T.navy, border: 'none',
    },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: T.white,
    border: `1px solid ${T.border}`,
    borderRadius: T.radius.lg,
    padding: '24px',
    boxShadow: T.shadow.sm,
    ...style,
  }}>
    {children}
  </div>
);

// ── Section: Navbar ──────────────────────────
const Navbar = ({ active, onNav }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const sectionMap = { Home: 'home', Features: 'features', 'How it works': 'howitworks', Contact: 'contact' };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.92)' : T.white,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${T.border}`,
        transition: 'all .2s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: T.radius.md, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>
              🪺
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: T.navy, letterSpacing: '-0.3px' }}>EmpNest</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {NAV_LINKS.map(link => (
              <NavLink key={link} label={link} active={active === sectionMap[link]} onClick={() => onNav(sectionMap[link])} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
<Btn
  variant="secondary"
  style={{
    padding: '10px 18px',
    fontSize: 13,
    borderRadius: '10px',
    fontWeight: 600,
  }}
  onClick={() => navigate('/login')}
>
  Login →
</Btn>            <Btn onClick={() => onNav('contact')} style={{ padding: '8px 18px', fontSize: 13 }}>Get started →</Btn>
          </div>
        </div>
      </nav>
      <div style={{ height: 64 }} />
    </>
  );
};

const NavLink = ({ label, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bg : 'none',
        border: 'none',
        padding: '7px 14px',
        borderRadius: T.radius.md,
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? T.blue : T.muted,
        cursor: 'pointer',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  );
};

// ── Section: Hero ────────────────────────────
const Hero = ({ onNav }) => (
  <section id="home" style={{
    background: T.navy,
    padding: '88px 32px 80px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Subtle grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      pointerEvents: 'none',
    }} />
    {/* Blue glow */}
    <div style={{
      position: 'absolute', width: 500, height: 500, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
      top: -180, right: -100, pointerEvents: 'none',
    }} />

    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
            borderRadius: T.radius.full, padding: '6px 14px',
            fontSize: 12, color: 'rgba(255,255,255,.75)',
            marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
            Now with AI-powered HR assistant
          </div>

          <h1 style={{
            fontSize: 56, fontWeight: 800, lineHeight: 1.08,
            color: '#fff', letterSpacing: '-2px',
            marginBottom: 24,
          }}>
            Modern HR<br />
            <span style={{ color: 'rgba(255,255,255,.45)' }}>for modern</span><br />
            teams
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,.65)',
            lineHeight: 1.75, maxWidth: 440, marginBottom: 40,
          }}>
            Unify recruitment, onboarding, payroll, and performance in one clean platform.
            Powered by AI, built for scale.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 56 }}>
            <Btn onClick={() => onNav('contact')}>Start free trial →</Btn>
            <Btn variant="ghost">▶ Watch demo</Btn>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 32 }}>
            {[['98%', 'Onboarding efficiency'], ['3.2×', 'Faster hiring'], ['99.9%', 'Uptime SLA']].map(([val, lbl], i) => (
              <div key={i} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? '1px solid rgba(255,255,255,.1)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div>
          <div style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: T.radius.xl,
            padding: 3,
            boxShadow: '0 32px 80px rgba(0,0,0,.4)',
          }}>
            <div style={{ background: '#1e2d4d', borderRadius: 'calc(18px - 3px)', overflow: 'hidden' }}>
              {/* Mockup header */}
              <div style={{ background: '#243157', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.08)', borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>app.empnest.io/dashboard</span>
                </div>
              </div>
              {/* Mockup body */}
              <div style={{ padding: 20 }}>
                {/* Top row */}
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)', marginBottom: 14 }}>Workforce overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[['1,284', 'Employees', '+12'], ['94%', 'Attendance', '+2%'], ['18', 'Open roles', '3 new']].map(([v, l, s], i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{l}</div>
                      <div style={{ fontSize: 11, color: T.green, marginTop: 6 }}>↑ {s}</div>
                    </div>
                  ))}
                </div>
                {/* Bar chart */}
                <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 10 }}>Headcount · last 7 months</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 56 }}>
                    {[40, 55, 48, 70, 62, 82, 88].map((h, i) => (
                      <div key={i} style={{
                        flex: 1, height: `${h}%`,
                        background: i >= 5 ? T.blue : 'rgba(255,255,255,.12)',
                        borderRadius: '3px 3px 0 0',
                      }} />
                    ))}
                  </div>
                </div>
                {/* AI chat chip */}
                <div style={{ background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>✨</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>"What's my leave balance?"</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 3 }}>You have 8 earned leaves remaining this quarter.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Section: Features ────────────────────────
const Features = () => (
  <section id="features" style={{ padding: '96px 32px', background: T.bg }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8, color: T.navy }}>
        Everything HR needs
      </h2>
      <p style={{ fontSize: 16, color: T.muted, marginBottom: 56 }}>One platform. Zero silos. Total visibility.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, color, iconColor, title, desc }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.white, border: `1px solid ${T.border}`,
        borderRadius: T.radius.lg, padding: '28px 28px',
        boxShadow: hov ? T.shadow.md : T.shadow.sm,
        transition: 'all .2s',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: T.radius.md, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
        {icon}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
};

// ── Section: How it Works ────────────────────
const HowItWorks = () => (
  <section id="howitworks" style={{ padding: '96px 32px', background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel>How it works</SectionLabel>
      <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8, color: T.navy }}>
        Up and running in minutes
      </h2>
      <p style={{ fontSize: 16, color: T.muted, marginBottom: 64 }}>Simple setup, zero migration headaches.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, overflow: 'hidden' }}>
        {STEPS.map((s, i) => (
          <StepCard key={i} {...s} last={i === STEPS.length - 1} />
        ))}
      </div>
    </div>
  </section>
);

const StepCard = ({ n, title, desc, last }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '32px 28px',
        borderRight: last ? 'none' : `1px solid ${T.border}`,
        background: hov ? T.bg : T.white,
        transition: 'background .15s',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: T.radius.md,
        background: hov ? T.blue : T.bg,
        border: `1px solid ${hov ? T.blue : T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        color: hov ? '#fff' : T.muted,
        marginBottom: 20, transition: 'all .15s',
      }}>
        {n}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{desc}</div>
    </div>
  );
};

// ── Section: Testimonials ────────────────────
const Testimonials = () => (
  <section style={{ padding: '96px 32px', background: T.bg }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel>Testimonials</SectionLabel>
      <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8, color: T.navy }}>
        Loved by HR teams
      </h2>
      <p style={{ fontSize: 16, color: T.muted, marginBottom: 56 }}>Hear from companies already using EmpNest.</p>
        <p style={{ fontSize: 16, color: T.muted, marginBottom: 56 }}>Coming Soon...</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {TESTIMONIALS.map((t, i) => <TestiCard key={i} {...t} />)}
      </div>
    </div>
  </section>
);

const TestiCard = ({ stars, text, name, role, initials, avatarBg, avatarColor }) => (
  <Card>
    <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
      {Array.from({ length: stars }).map((_, i) => (
        <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
      ))}
    </div>
    <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginBottom: 24 }}>"{text}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: avatarBg, color: avatarColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>{initials}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{name}</div>
        <div style={{ fontSize: 12, color: T.muted }}>{role}</div>
      </div>
    </div>
  </Card>
);

// ── Section: Contact ─────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" style={{ padding: '96px 32px', background: T.white, borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 64, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 16, color: T.navy }}>Get in touch</h2>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 40 }}>
              Have questions or want a demo? Reach out — our team gets back within 24 hours.
            </p>
            <Card style={{ padding: '24px 28px' }}>
              {[
                ['📍', 'Office', 'Hyderabad, India'],
                ['📞', 'Phone', '+91 99595 57710'],
                ['✉️', 'Email', 'dk2chat@gmail.com'],
              ].map(([icon, label, val], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 20 : 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: T.radius.md, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.navy }}>{val}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Right: Form */}
          <Card style={{ padding: '36px 40px' }}>
            {sent && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: T.radius.md, padding: '12px 16px',
                fontSize: 14, color: '#15803d', marginBottom: 24,
              }}>
                ✓ Message sent successfully! We'll be in touch soon.
              </div>
            )}
            <form onSubmit={submit} noValidate>
              {[
                { name: 'name', label: 'Full name', type: 'text', placeholder: 'Rahul Sharma' },
                { name: 'email', label: 'Email address', type: 'email', placeholder: 'rahul@company.com' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 6 }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); }}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 14,
                      border: `1px solid ${errors[name] ? '#ef4444' : T.border}`,
                      borderRadius: T.radius.md, outline: 'none',
                      color: T.navy, background: T.white,
                      boxSizing: 'border-box',
                    }}
                  />
                  {errors[name] && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>{errors[name]}</div>}
                </div>
              ))}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 6 }}>Your message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your team size and what you need..."
                  value={form.message}
                  onChange={e => { setForm(p => ({ ...p, message: e.target.value })); if (errors.message) setErrors(p => ({ ...p, message: '' })); }}
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 14,
                    border: `1px solid ${errors.message ? '#ef4444' : T.border}`,
                    borderRadius: T.radius.md, outline: 'none', resize: 'vertical',
                    color: T.navy, background: T.white, fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.message && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>{errors.message}</div>}
              </div>
              <Btn style={{ width: '100%', justifyContent: 'center', padding: '13px 24px', fontSize: 15 }}>
                Send message →
              </Btn>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

// ── Section: CTA Banner ──────────────────────
const CTABanner = ({ onNav }) => (
  <section style={{ background: T.navy, padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', width: 600, height: 600, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
      top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }} />
    <div style={{ position: 'relative', zIndex: 2 }}>
      <h2 style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', marginBottom: 16 }}>
        Ready to transform<br />your HR?
      </h2>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', marginBottom: 40 }}>
        Join forward-thinking companies building better teams with EmpNest.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Btn variant="white" onClick={() => onNav('contact')}>Start free trial →</Btn>
        <Btn variant="ghost">Book a demo</Btn>
      </div>
    </div>
  </section>
);

// ── Footer ───────────────────────────────────
const Footer = () => (
  <footer style={{ background: T.white, borderTop: `1px solid ${T.border}`, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🪺</div>
      <span style={{ fontWeight: 700, fontSize: 15, color: T.navy }}>EmpNest</span>
    </div>
    <span style={{ fontSize: 13, color: T.muted }}>© {new Date().getFullYear()} EmpNest Technologies Pvt. Ltd. All rights reserved.</span>
    <div style={{ display: 'flex', gap: 20 }}>
      {['Privacy', 'Terms', 'Contact'].map(l => (
        <span key={l} style={{ fontSize: 13, color: T.muted, cursor: 'pointer' }}>{l}</span>
      ))}
    </div>
  </footer>
);

// ── Helper ───────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
    {children}
  </div>
);

// ── Scroll-spy hook ──────────────────────────
const useSectionSpy = (ids) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      let current = ids[0];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [ids]);
  return active;
};

// ── Root ─────────────────────────────────────
const HrLandingPage = () => {
  const sectionIds = ['home', 'features', 'howitworks', 'contact'];
  const active = useSectionSpy(sectionIds);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: T.navy }}>
      <Navbar active={active} onNav={scrollTo} />
      <Hero onNav={scrollTo} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner onNav={scrollTo} />
      <Contact />
      <Footer />
    </div>
  );
};

export default HrLandingPage;