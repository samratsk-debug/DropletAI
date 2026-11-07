import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, BadgeCheck, BookOpenCheck, Check,
  CircleAlert, ClipboardCheck, Droplet, FileCheck2, FileText, LockKeyhole,
  MessageSquareText, ScanSearch, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const reviewChecks = [
  { icon: Check, title: 'Claims checked', detail: 'Product statements match approved facts.', status: 'Clear' },
  { icon: CircleAlert, title: 'One phrase needs a look', detail: '“Completely risk-free” may overpromise.', status: 'Review' },
  { icon: Check, title: 'Brand voice on track', detail: 'Tone and language fit your guidelines.', status: 'Clear' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const openAuth = (mode: 'login' | 'register') => navigate(`/${mode}`, { state: { fromLanding: true } });

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -32px 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['how-it-works', 'what-you-get', 'built-for-teams']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .25, .5, .75] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-page">
      <a className="lp-skip" href="#main">Skip to content</a>
      <header className="lp-header">
        <a href="#top" className="lp-brand" aria-label="Droplet AI home">
          <span className="lp-mark"><Droplet size={21} strokeWidth={2.2} /></span>
          <span>droplet<span className="lp-brand-ai">AI</span></span>
        </a>
        <nav className="lp-nav" aria-label="Main navigation">
          <a href="#how-it-works" aria-current={activeSection === 'how-it-works' ? 'location' : undefined}>How it works</a>
          <a href="#what-you-get" aria-current={activeSection === 'what-you-get' ? 'location' : undefined}>What you get</a>
          <a href="#built-for-teams" aria-current={activeSection === 'built-for-teams' ? 'location' : undefined}>For teams</a>
        </nav>
        <div className="lp-header-actions">
          <ThemeToggle compact />
          <button className="lp-signin" type="button" onClick={() => openAuth('login')}>Sign in</button>
          <button className="lp-button lp-button-small" type="button" onClick={() => openAuth('register')}>
            <span>Get started</span><ArrowRight size={15} />
          </button>
        </div>
      </header>

      <div id="main">
        <section className="lp-hero" id="top">
          <div className="lp-hero-copy" data-reveal>
            <p className="lp-eyebrow"><span className="lp-eyebrow-dot" /> A clearer way to protect your brand</p>
            <h1>Your brand has a voice.<br /><em>Keep every message true to it.</em></h1>
            <p className="lp-lede">Droplet AI helps your team check the details, catch risky claims, and keep every piece of content on brand—before it goes out into the world.</p>
            <div className="lp-hero-actions">
              <a className="lp-button" href="#how-it-works">See how it works <ArrowDown size={16} /></a>
            </div>
            <div className="lp-proof"><span className="lp-proof-icon"><ShieldCheck size={15} /></span> Your team stays in control at every step.</div>
          </div>

          <div className="lp-hero-art" data-reveal>
            <div className="lp-orbit lp-orbit-one" /><div className="lp-orbit lp-orbit-two" />
            <div className="lp-review-card">
              <div className="lp-review-top">
                <div className="lp-review-file"><FileText size={17} /></div>
                <div><span className="lp-overline">CONTENT CHECK</span><h2>Spring product launch</h2></div>
                <span className="lp-live"><span /> In review</span>
              </div>
              <div className="lp-review-divider" />
              <div className="lp-copy-preview">
                <span className="lp-overline">DRAFT COPY</span>
                <p>Meet the everyday essentials made to <mark>work beautifully</mark>, with materials chosen for comfort and built to last.</p>
              </div>
              <div className="lp-check-list">
                {reviewChecks.map((check) => {
                  const Icon = check.icon;
                  return <div className="lp-check-row" key={check.title}>
                    <span className={`lp-check-icon ${check.status === 'Review' ? 'is-review' : ''}`}><Icon size={15} /></span>
                    <div className="lp-check-copy"><strong>{check.title}</strong><span>{check.detail}</span></div>
                    <span className={`lp-check-status ${check.status === 'Review' ? 'is-review' : ''}`}>{check.status}</span>
                  </div>;
                })}
              </div>
              <div className="lp-review-foot"><span><Sparkles size={14} /> AI-assisted first pass</span><span>People make the call</span></div>
            </div>
            <div className="lp-float-note"><span className="lp-float-check"><Check size={15} /></span><span><strong>Guidelines applied</strong><small>Brand facts · Tone · Claims</small></span></div>
            <span className="lp-hero-caption">A steady voice, wherever your work goes.</span>
          </div>
          <a className="lp-scroll-cue" href="#the-challenge"><span>Take a look around</span><ArrowDown size={15} /></a>
        </section>

        <section className="lp-intro-section" id="the-challenge">
          <div className="lp-section-wrap lp-intro-grid" data-reveal>
            <p className="lp-eyebrow">WHEN THE WORK GROWS</p>
            <div><h2>More people making more content.<br /><em>One brand to keep together.</em></h2>
              <p>As teams grow, the little details get harder to keep track of. Which product facts are current? Is that claim approved? Does this still sound like us? Droplet brings the answers into one shared place.</p></div>
          </div>
        </section>

        <section className="lp-work-section">
          <div className="lp-section-wrap">
            <div className="lp-section-heading" id="how-it-works" data-reveal>
              <p className="lp-eyebrow">A SIMPLE WAY THROUGH</p>
              <h2>From first draft<br /><em>to ready to share.</em></h2>
              <p>Give your team helpful checks and a clear path to a human decision.</p>
            </div>
            <div className="lp-steps">
              <article className="lp-step" data-reveal>
                <div className="lp-step-number">01 <span>SET THE STANDARD</span></div>
                <div className="lp-step-icon"><BookOpenCheck size={22} /></div>
                <h3>Put your brand knowledge in one place.</h3>
                <p>Add the language, product details, and guidance your team needs to get it right. Everyone starts from the same source.</p>
                <div className="lp-step-foot"><Check size={14} /> One shared source of truth</div>
              </article>
              <div className="lp-step-connector" aria-hidden="true"><ArrowRight size={17} /></div>
              <article className="lp-step" data-reveal>
                <div className="lp-step-number">02 <span>CHECK THE DETAILS</span></div>
                <div className="lp-step-icon"><ScanSearch size={22} /></div>
                <h3>Catch questions while there’s still time.</h3>
                <p>AI checks a draft against your guidance and points out claims or wording that may need a closer look.</p>
                <div className="lp-step-foot"><Sparkles size={14} /> Helpful flags, with context</div>
              </article>
              <div className="lp-step-connector" aria-hidden="true"><ArrowRight size={17} /></div>
              <article className="lp-step" data-reveal>
                <div className="lp-step-number">03 <span>MAKE THE CALL</span></div>
                <div className="lp-step-icon"><ClipboardCheck size={22} /></div>
                <h3>Let people decide what’s ready.</h3>
                <p>Your reviewers can resolve open questions, give clear feedback, and move approved work forward.</p>
                <div className="lp-step-foot"><Users size={14} /> Your team stays in control</div>
              </article>
            </div>
            <div className="lp-work-note" data-reveal><LockKeyhole size={15} /><span>AI helps people see what to check. Your team makes the final decision.</span></div>
          </div>
        </section>

        <section className="lp-capabilities">
          <div className="lp-section-wrap">
            <div className="lp-cap-head" id="what-you-get" data-reveal><div><p className="lp-eyebrow">THE THINGS THAT KEEP YOU ALIGNED</p><h2>Less second-guessing.<br /><em>More good work.</em></h2></div><p>Everything your team needs to keep the right details close, and the right people in the loop.</p></div>
            <div className="lp-cap-grid">
              <article className="lp-cap lp-cap-large" data-reveal>
                <div className="lp-cap-icon"><FileCheck2 size={20} /></div><span className="lp-cap-label">01 / GUIDANCE</span>
                <h3>Know what’s true<br />about your brand.</h3>
                <p>Keep product facts, approved claims, and brand guidance together so your team knows what they can confidently say.</p>
                <div className="lp-mini-doc"><span><BookOpenCheck size={14} /> Product facts</span><span className="lp-mini-status">Up to date <Check size={12} /></span></div>
              </article>
              <article className="lp-cap" data-reveal>
                <div className="lp-cap-icon"><MessageSquareText size={20} /></div><span className="lp-cap-label">02 / CLEAR FEEDBACK</span>
                <h3>Make every review useful.</h3>
                <p>Show what needs attention and why, so writers can make a good fix without guesswork.</p>
                <div className="lp-comment"><span className="lp-comment-dot" /><span>Could we support this claim with a source?</span></div>
              </article>
              <article className="lp-cap" data-reveal>
                <div className="lp-cap-icon"><BadgeCheck size={20} /></div><span className="lp-cap-label">03 / APPROVALS</span>
                <h3>See what’s ready to go.</h3>
                <p>Give reviewers a shared queue and a simple way to approve, request a change, or leave a note.</p>
                <div className="lp-approval"><span><Check size={13} /> Approved by Maya</span><small>Today, 10:42 AM</small></div>
              </article>
            </div>
          </div>
        </section>

        <section className="lp-team-section">
          <div className="lp-section-wrap lp-team-grid" data-reveal>
            <div className="lp-team-visual"><div className="lp-team-window"><div className="lp-window-bar"><span /><span /><span /><small>YOUR WORKSPACE</small></div><div className="lp-window-content"><div className="lp-window-title"><span>Review queue</span><span className="lp-window-count">03 open</span></div><div className="lp-queue-row"><span className="lp-avatar lp-avatar-one">AL</span><span><strong>Launch announcement</strong><small>Claims check · Alex Lee</small></span><span className="lp-queue-dot" /></div><div className="lp-queue-row"><span className="lp-avatar lp-avatar-two">MK</span><span><strong>Product page update</strong><small>Brand review · Maya K.</small></span><span className="lp-queue-dot lp-queue-dot-warm" /></div><div className="lp-queue-row"><span className="lp-avatar lp-avatar-three">JR</span><span><strong>Spring campaign</strong><small>Awaiting approval · Jo R.</small></span><span className="lp-queue-dot" /></div></div></div><div className="lp-team-stamp"><Users size={16} /><span>Everyone knows<br />what happens next.</span></div></div>
            <div className="lp-team-copy" id="built-for-teams"><p className="lp-eyebrow">MADE FOR THE WHOLE TEAM</p><h2>Good work takes a few people.<br /><em>Keep them moving together.</em></h2><p>Writers, brand owners, and reviewers can each see what they need and where things stand. Fewer lost threads. Clearer handoffs. More time for the work itself.</p><ul><li><Check size={15} /> Shared workspace for your brand</li><li><Check size={15} /> Clear roles for the people involved</li><li><Check size={15} /> A visible path from draft to decision</li></ul></div>
          </div>
        </section>

      </div>

      <footer className="lp-footer"><a href="#top" className="lp-brand"><span className="lp-mark"><Droplet size={18} /></span><span>droplet<span className="lp-brand-ai">AI</span></span></a><span>Thoughtful checks. Clear decisions. Better brand work.</span><a href="#top" className="lp-back-top">Back to top ↑</a></footer>
    </div>
  );
};
