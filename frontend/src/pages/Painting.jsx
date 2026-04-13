import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Load GSAP from CDN once ─────────────────────────────── */
function loadScript(src) {
  return new Promise((res) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = res;
    document.head.appendChild(s);
  });
}

/* FIX: Detect touch/mobile devices to skip cursor & heavy parallax */
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const PHONE = '+919102740274';

export default function Painting() {
  const navigate = useNavigate();
  const [galleryActive, setGalleryActive] = useState('after');
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'),
    ]).then(() => {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      const touch = isTouchDevice();

      /* FIX: Only run custom cursor on non-touch devices */
      let cleanupCursor = () => { };
      if (!touch) {
        const cur = cursorRef.current;
        const fol = followerRef.current;
        let mx = 0, my = 0, fx = 0, fy = 0, active = false;
        const onMove = (e) => {
          if (!active) { gsap.to([cur, fol], { opacity: 1, duration: .3 }); active = true; }
          mx = e.clientX; my = e.clientY;
          gsap.to(cur, { x: mx, y: my, duration: .1, ease: 'power2.out' });
        };
        document.addEventListener('mousemove', onMove);
        let rafRunning = true;
        const raf = () => {
          if (!rafRunning) return;
          fx += (mx - fx) * .09; fy += (my - fy) * .09;
          gsap.set(fol, { x: fx, y: fy });
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        document.querySelectorAll('a,button,.color-card,.gitem,.process-card,.witem').forEach(el => {
          el.addEventListener('mouseenter', () => { document.body.classList.add('cursor-hover'); gsap.to(cur, { scale: .5, duration: .2 }); });
          el.addEventListener('mouseleave', () => { document.body.classList.remove('cursor-hover'); gsap.to(cur, { scale: 1, duration: .2 }); });
        });

        cleanupCursor = () => {
          document.removeEventListener('mousemove', onMove);
          rafRunning = false;
          document.body.classList.remove('cursor-hover');
        };
      }

      /* Scroll progress bar */
      const onScroll = () => {
        const p = (window.scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100;
        const bar = document.getElementById('paint-progress');
        if (bar) bar.style.width = p + '%';
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      /* Marquee */
      const mtrack = document.getElementById('paint-mtrack');
      let mpos = 0;
      let mrafRunning = true;
      const mraf = () => {
        if (!mrafRunning) return;
        mpos -= 0.6;
        if (mtrack) {
          const half = mtrack.scrollWidth / 2;
          if (Math.abs(mpos) >= half) mpos = 0;
          mtrack.style.transform = `translateX(${mpos}px)`;
        }
        requestAnimationFrame(mraf);
      };
      requestAnimationFrame(mraf);

      /* FIX: Respect prefers-reduced-motion */
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* Hero entrance */
      const heroTL = gsap.timeline({ delay: .25 });
      heroTL
        .to('.p-hero-badge', { opacity: 1, y: 0, duration: .65, ease: 'power3.out' })
        .to('.p-line-inner', { y: '0%', duration: prefersReduced ? .01 : .9, ease: 'power4.out', stagger: .14 }, '-=.3')
        .to('.p-hero-sub', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.45')
        .to('.p-service-selector', { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.4')
        .to('.p-hero-actions', { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.4')
        .to('.p-hero-rating', { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.3')
        .to('.p-hero-media', { opacity: 1, scale: 1, duration: .95, ease: 'power3.out' }, '-=.85');

      /* FIX: Only run parallax on desktop (mobile causes jank) */
      if (!touch && !prefersReduced) {
        gsap.to('#p-heroP', { y: '-20%', ease: 'none', scrollTrigger: { trigger: '.p-hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
        gsap.to('#p-whyImgP', { y: '-18%', ease: 'none', scrollTrigger: { trigger: '#p-whySec', start: 'top bottom', end: 'bottom top', scrub: 1.3 } });
        gsap.to('#p-iimg1 .p-intro-img-inner', { y: '-12%', ease: 'none', scrollTrigger: { trigger: '#p-introSec', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
        gsap.to('#p-iimg2 .p-intro-img-inner', { y: '-7%', ease: 'none', scrollTrigger: { trigger: '#p-introSec', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }

      gsap.to('#p-floatCard', { y: -20, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });

      /* Services strip */
      ScrollTrigger.create({ trigger: '#p-sstrip', start: 'top 85%', onEnter: () => gsap.to('.p-service-item', { opacity: 1, y: 0, stagger: .1, duration: .75, ease: 'power3.out' }) });

      /* Intro */
      ScrollTrigger.create({
        trigger: '#p-introSec', start: 'top 78%',
        onEnter: () => {
          gsap.fromTo('#p-iimg1', { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: .95, ease: 'power3.out' });
          gsap.fromTo('#p-iimg2', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .95, delay: .12, ease: 'power3.out' });
          gsap.to('#p-introText', { opacity: 1, x: 0, duration: .95, delay: .08, ease: 'power3.out' });
        }
      });

      /* Counters */
      let counted = false;
      ScrollTrigger.create({
        trigger: '#p-statsSec', start: 'top 82%',
        onEnter: () => {
          if (counted) return; counted = true;
          gsap.to('.p-stat', { opacity: 1, y: 0, stagger: .15, duration: .7, ease: 'power3.out' });
          document.querySelectorAll('.p-cnum').forEach(el => {
            const target = +el.dataset.target;
            const obj = { val: 0 };
            gsap.to(obj, { val: target, duration: 2.2, ease: 'power2.out', onUpdate() { el.textContent = Math.round(obj.val).toLocaleString('en-IN'); } });
          });
        }
      });

      /* Process */
      ScrollTrigger.create({ trigger: '#p-processSec', start: 'top 78%', onEnter: () => gsap.to('.process-card', { opacity: 1, y: 0, stagger: .13, duration: .85, ease: 'power3.out' }) });

      /* Gallery */
      ScrollTrigger.create({ trigger: '#p-gallery', start: 'top 82%', onEnter: () => gsap.to('.gitem', { opacity: 1, stagger: .1, duration: .75, ease: 'power3.out' }) });

      /* Testimonials */
      ScrollTrigger.create({ trigger: '#p-testSec', start: 'top 80%', onEnter: () => gsap.to('.p-tcard', { opacity: 1, y: 0, stagger: .13, duration: .8, ease: 'power3.out' }) });

      /* Why */
      ScrollTrigger.create({
        trigger: '#p-whySec', start: 'top 78%',
        onEnter: () => {
          gsap.to('.p-why-img-wrap', { opacity: 1, x: 0, duration: .95, ease: 'power3.out' });
          gsap.to('.p-why-text', { opacity: 1, x: 0, duration: .95, delay: .15, ease: 'power3.out' });
        }
      });

      /* CTA */
      ScrollTrigger.create({ trigger: '#p-ctaEl', start: 'top 88%', onEnter: () => gsap.to('#p-ctaEl', { opacity: 1, y: 0, duration: .95, ease: 'power3.out' }) });

      /* Section headings */
      document.querySelectorAll('.p-section-header').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 90%', onEnter: () => gsap.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }) });
      });

      return () => {
        cleanupCursor();
        window.removeEventListener('scroll', onScroll);
        mrafRunning = false;
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        /* ── RESET ── */
        .p-page *{box-sizing:border-box}

        /* ── BASE ── */
        .p-page{
          font-family:'DM Sans',sans-serif;
          background:#FAF8F4;
          color:#2B2B2B;
          overflow-x:hidden;
          position:relative;
          /* FIX: Only hide cursor on non-touch devices */
        }
        @media(hover:hover) and (pointer:fine){
          .p-page{cursor:none}
        }
        .p-page::before{content:'';position:absolute;inset:0;background:url(/texture.png);opacity:.4;pointer-events:none;z-index:1;mix-blend-mode:multiply}

        /* FIX: Define .mobile-only and .desktop-only */
        .mobile-only{display:none}
        .desktop-only{display:block}
        @media(max-width:768px){
          .mobile-only{display:block}
          .desktop-only{display:none}
        }

        /* ── PROGRESS ── */
        #paint-progress{position:fixed;top:0;left:0;height:3px;background:#C4825A;z-index:9999;width:0;pointer-events:none}

        /* ── CURSOR (desktop only) ── */
        #p-cursor,#p-follower{display:none}
        @media(hover:hover) and (pointer:fine){
          #p-cursor{display:block;position:fixed;width:12px;height:12px;border-radius:50%;background:#C4825A;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:multiply;opacity:0}
          #p-follower{display:block;position:fixed;width:36px;height:36px;border-radius:50%;border:1.5px solid #C4825A;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:0;transition:width .3s,height .3s}
          body.cursor-hover #p-cursor{background:#2B2B2B}
          body.cursor-hover #p-follower{width:54px;height:54px;opacity:.2}
        }

        /* ── HERO ── */
        /* FIX: Use 100svh with 100vh fallback for iOS Safari */
        .p-hero{
          min-height:100vh;
          min-height:100svh;
          padding:100px 5vw 60px;
          display:grid;
          grid-template-columns:1fr 1.2fr;
          gap:60px;
          align-items:center;
          background:url(/painting_banner.png) center/cover no-repeat;
          overflow:hidden;
          position:relative
        }
        .p-hero::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg, rgba(20,12,8,0.95) 0%, rgba(20,12,8,0.75) 45%, transparent 100%);z-index:0;pointer-events:none}
        .p-hero > div{position:relative;z-index:1}
        .p-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.25);border-radius:100px;padding:6px 14px;font-size:12px;font-weight:500;color:#fff;margin-bottom:24px;letter-spacing:.5px;text-transform:uppercase;opacity:0;transform:translateY(14px)}
        .p-hero h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5vw,62px);font-weight:700;line-height:1.1;letter-spacing:-1.5px;color:#fff;margin-bottom:24px}
        .p-hero h1 em{font-style:italic;color:#C4825A}
        .p-line-wrap{overflow:hidden;display:block}
        .p-line-inner{display:block;transform:translateY(110%)}
        .p-hero-sub{font-size:16px;color:rgba(255,255,255,0.85);line-height:1.7;max-width:460px;margin-bottom:32px;font-weight:300;opacity:0;transform:translateY(18px)}

        /* FIX: Service selector — horizontal scroll on mobile */
        .p-service-selector{
          display:flex;
          gap:10px;
          margin-bottom:32px;
          opacity:0;
          transform:translateY(14px);
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          scrollbar-width:none;
          padding-bottom:4px;
          scroll-snap-type:x mandatory;
        }
        .p-service-selector::-webkit-scrollbar{display:none}
        /* FIX: touch-action: manipulation removes 300ms tap delay on all buttons */
        .p-sel-btn{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.15);
          color:#fff;
          padding:10px 20px;
          border-radius:100px;
          font-size:13px;
          cursor:pointer;
          transition:all .3s cubic-bezier(.4,0,.2,1);
          backdrop-filter:blur(10px);
          display:flex;
          align-items:center;
          gap:8px;
          flex-shrink:0;
          scroll-snap-align:start;
          touch-action:manipulation;
          /* FIX: Minimum 44px touch target */
          min-height:44px;
        }
        .p-sel-btn span{font-size:10px;opacity:.6;text-transform:uppercase;letter-spacing:1px}
        @media(hover:hover){
          .p-sel-btn:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.3);transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.2)}
        }
        .p-sel-btn.active{background:#C4825A;border-color:#C4825A;box-shadow:0 12px 32px rgba(196,130,90,0.5)}
        .p-sel-btn.active span{opacity:.9;color:#fff}

        .p-hero-actions{display:flex;align-items:center;gap:16px;opacity:0;transform:translateY(18px);flex-wrap:wrap}
        .p-btn-primary{
          background:#fff;
          color:#2B2B2B;
          padding:14px 28px;
          border-radius:100px;
          font-size:14px;
          font-weight:700;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          gap:8px;
          position:relative;
          overflow:hidden;
          border:none;
          cursor:pointer;
          transition:color .3s;
          touch-action:manipulation;
          min-height:48px;
        }
        .p-btn-fill{position:absolute;inset:0;background:#C4825A;transform:scaleX(0);transform-origin:left;transition:transform .38s cubic-bezier(.76,0,.24,1);border-radius:inherit}
        @media(hover:hover){.p-btn-primary:hover{color:#fff}.p-btn-primary:hover .p-btn-fill{transform:scaleX(1)}}
        .p-btn-primary span,.p-btn-primary svg{position:relative;z-index:1}
        .p-btn-outline{
          color:#fff;
          padding:14px 24px;
          border-radius:100px;
          font-size:14px;
          text-decoration:none;
          border:1px solid rgba(255,255,255,0.3);
          transition:border-color .2s,background .2s;
          background:none;
          cursor:pointer;
          touch-action:manipulation;
          min-height:48px;
          display:inline-flex;
          align-items:center;
        }
        @media(hover:hover){.p-btn-outline:hover{border-color:#fff;background:rgba(255,255,255,0.05)}}
        .p-hero-rating{display:flex;align-items:center;gap:6px;margin-top:28px;opacity:0;transform:translateY(14px)}
        .p-stars{color:#D4A85A;font-size:14px;letter-spacing:1px}
        .p-hero-media{position:relative;opacity:0;transform:scale(.96)}

        /* ── MARQUEE ── */
        .p-marquee-wrap{overflow:hidden;background:#1a1a1a;padding:18px 0;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05)}
        .p-marquee-track{display:flex;white-space:nowrap;will-change:transform}
        .p-marquee-item{display:inline-flex;align-items:center;gap:14px;padding:0 28px;font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2.5px;flex-shrink:0}
        .p-mdot{width:4px;height:4px;border-radius:50%;background:#C4825A;flex-shrink:0}

        /* ── SERVICES STRIP ── */
        .p-services-strip{padding:48px 5vw;background:#2B2B2B;display:flex;position:relative;z-index:2;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
        .p-services-strip::-webkit-scrollbar{display:none}
        .p-service-item{flex:1;min-width:200px;padding:0 28px;border-right:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:14px;opacity:0;transform:translateY(22px);transition:all .4s cubic-bezier(.4,0,.2,1);cursor:pointer;touch-action:manipulation}
        @media(hover:hover){
          .p-service-item:hover{transform:translateY(-8px);background:rgba(255,255,255,0.03)}
          .p-service-item:hover .p-si-icon{background:#C4825A;transform:scale(1.1);box-shadow:0 0 25px rgba(196,130,90,0.6)}
          .p-service-item:hover .p-si-icon svg{stroke:#fff}
        }
        .p-service-item:last-child{border-right:none}
        .p-si-icon{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .4s cubic-bezier(.175,.885,.32,1.275)}
        .p-si-icon svg{width:24px;height:24px;stroke:#C4825A;fill:none;stroke-width:1.5}
        .p-service-info h3{font-size:14px;font-weight:600;color:#fff;margin-bottom:4px}
        .p-service-info p{font-size:12px;color:rgba(255,255,255,0.45);margin:0}

        /* ── INTRO ── */
        .p-intro{padding:100px 5vw;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;background:#fff;position:relative}
        .p-intro::after{content:'';position:absolute;top:0;right:0;width:30%;height:100%;background:linear-gradient(90deg,transparent,rgba(245,240,232,0.3));pointer-events:none}
        .p-intro-imgs{display:grid;grid-template-columns:1fr 1fr;gap:20px;position:relative}
        .p-intro-img{border-radius:20px;overflow:hidden;aspect-ratio:3/4;position:relative;box-shadow:0 50px 100px -20px rgba(0,0,0,0.25);transition:transform .6s}
        @media(hover:hover){.p-intro-img:hover{transform:translateY(-10px) rotate(1deg)}}
        .p-intro-img:nth-child(2){margin-top:80px;margin-left:-40%;z-index:2;border:10px solid #fff;box-shadow:0 60px 120px -20px rgba(0,0,0,0.3)}
        .p-intro-img-inner{position:absolute;width:100%;height:120%;top:-10%}
        .p-eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#C4825A;font-weight:600;display:inline-block;margin-bottom:16px;position:relative}
        .p-eyebrow::after{content:'';position:absolute;bottom:-4px;left:0;width:24px;height:2px;background:#C4825A}
        .p-intro-text p{font-size:15px;color:#666;line-height:1.8;margin-bottom:20px;font-weight:300}

        /* ── STATS ── */
        .p-stats{padding:80px 5vw;background:#3A5143;display:grid;grid-template-columns:repeat(3,1fr);position:relative}
        .p-stats-glow{position:absolute;inset:0;background:radial-gradient(circle at center, rgba(143,168,130,0.15), transparent);pointer-events:none}
        .p-stat{padding:36px 20px;border-right:1px solid rgba(255,255,255,0.1);text-align:center;opacity:0;transform:translateY(22px);position:relative;overflow:hidden}
        .p-stat:last-child{border-right:none}
        .p-stat .num{font-family:'Playfair Display',serif;font-size:clamp(40px,6vw,80px);font-weight:700;color:#fff;line-height:1;margin-bottom:10px}
        .p-stat .num .plus{color:#D4A85A;margin-left:4px}
        .p-stat .slabel{font-size:13px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1.5px;font-weight:500}

        /* ── PROCESS ── */
        .p-process{padding:100px 5vw;background:#F5F0E8;position:relative}
        .p-process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative}
        .p-process-grid::before{content:'';position:absolute;top:72px;left:80px;right:80px;height:2px;background:linear-gradient(90deg, rgba(196,130,90,0), rgba(196,130,90,0.4) 20%, rgba(196,130,90,0.4) 80%, rgba(196,130,90,0));z-index:0}
        .process-card{background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);border-radius:20px;padding:36px 28px;border:1px solid rgba(255,255,255,0.4);position:relative;z-index:1;overflow:hidden;opacity:0;transform:translateY(32px);transition:all .5s cubic-bezier(.175,.885,.32,1.275)}
        @media(hover:hover){.process-card:hover{transform:translateY(-12px) scale(1.02);box-shadow:0 40px 80px -20px rgba(196,130,90,0.2)}}
        .process-card::before{content:attr(data-num);position:absolute;right:16px;top:16px;font-family:'Playfair Display',serif;font-size:72px;font-weight:700;color:rgba(196,130,90,0.05);line-height:1}
        .p-picon{width:60px;height:60px;border-radius:16px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;transition:all .4s}
        @media(hover:hover){.process-card:hover .p-picon{transform:scale(1.1) rotate(-5deg)}}
        .p-picon svg{width:28px;height:28px;fill:none;stroke-width:1.5}
        .process-card h3{font-size:17px;font-weight:600;color:#2B2B2B;margin-bottom:10px}
        .process-card p{font-size:13px;color:#8C8679;line-height:1.7;font-weight:300;margin:0}

        /* ── SECTION HEADERS ── */
        .p-section-header{text-align:center;margin-bottom:48px}
        .p-section-header h2{font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,46px);font-weight:700;line-height:1.15;letter-spacing:-0.5px;color:#2B2B2B;margin:12px 0}
        .p-section-header p{font-size:16px;color:#8C8679;font-weight:300;max-width:480px;margin:12px auto 0}

        /* ── GALLERY ── */
        .p-gallery{padding:100px 5vw;background:#fff}
        .p-gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,280px);gap:16px;margin-top:48px}
        .gitem{border-radius:20px;overflow:hidden;position:relative;opacity:0;cursor:pointer}
        .gitem:nth-child(1){grid-column:span 2}
        .gitem:nth-child(4){grid-column:span 2}
        .p-gbg{position:absolute;inset:0;height:110%;top:-5%;transition:transform 1.2s cubic-bezier(.16,1,.3,1),filter .6s}
        @media(hover:hover){.gitem:hover .p-gbg{transform:scale(1.08)}}
        .p-goverlay{position:absolute;inset:0;background:rgba(20,12,8,0.4);opacity:0;transition:all .6s ease}
        @media(hover:hover){.gitem:hover .p-goverlay{opacity:1}}
        .p-glabel{position:absolute;bottom:0;left:0;right:0;padding:32px 24px 24px;background:linear-gradient(transparent,rgba(20,12,8,0.9));transform:translateY(20px);opacity:0;transition:all .5s cubic-bezier(.16,1,.3,1)}
        @media(hover:hover){.gitem:hover .p-glabel{transform:translateY(0);opacity:1}}
        /* FIX: Always show labels on touch (no hover available) */
        @media(hover:none){.p-glabel{transform:translateY(0);opacity:1;padding:20px 16px}}
        .p-glabel span{color:#fff;font-size:15px;font-weight:600;display:block}
        .p-glabel p{color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px}
        .p-g-badge{position:absolute;top:16px;right:16px;background:#fff;color:#2B2B2B;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;text-transform:uppercase}
        /* FIX: Gallery toggle tap target */
        .p-gallery-toggle{display:flex;justify-content:center;gap:8px;margin-top:20px}
        .p-gallery-toggle .p-sel-btn{padding:10px 20px;font-size:12px;min-height:44px}

        /* ── TESTIMONIALS ── */
        .p-testimonials{padding:100px 5vw;background:#FAF8F4}
        .p-tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
        .p-tcard{background:#fff;border-radius:20px;padding:36px;border:1px solid rgba(0,0,0,0.04);opacity:0;transform:translateY(28px);transition:all .4s}
        @media(hover:hover){.p-tcard:hover{transform:translateY(-8px);box-shadow:0 30px 60px rgba(0,0,0,0.06)}}
        .p-tcard-featured{grid-column:span 2;background:#2B2B2B;color:#fff}
        .p-tcard-featured .p-ttext{color:rgba(255,255,255,0.9);font-size:17px}
        .p-tcard-featured .p-tname{color:#fff}
        .p-tstars{color:#D4A85A;font-size:16px;letter-spacing:3px;margin-bottom:18px}
        .p-ttext{font-size:14px;color:#555;line-height:1.8;margin-bottom:28px;font-weight:300;font-style:italic}
        .p-tauthor{display:flex;align-items:center;gap:14px}
        .p-tavatar{width:48px;height:48px;border-radius:50%;overflow:hidden;background:#eee;flex-shrink:0}
        .p-tname{font-size:14px;font-weight:600;color:#2B2B2B}
        .p-trole{font-size:12px;color:#8C8679;margin-top:2px}

        /* ── WHY ── */
        .p-why{padding:100px 5vw;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;background:#fff}
        .p-why-img-wrap{border-radius:28px;overflow:hidden;aspect-ratio:1/1;max-width:480px;position:relative;opacity:0;transform:translateX(-32px);box-shadow:0 40px 80px rgba(0,0,0,0.15)}
        .p-why-img-para{position:absolute;width:100%;height:100%;top:0;background:linear-gradient(145deg,#2B2B2B,#1a1a1a)}
        .p-why-text{opacity:0;transform:translateX(32px)}
        .p-why-text h2{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,42px);font-weight:700;line-height:1.2;color:#2B2B2B;margin-bottom:32px}
        .p-wlist{display:grid;grid-template-columns:1fr 1fr;gap:28px}
        .p-witem{display:flex;flex-direction:column;gap:12px}
        .p-wdot{width:44px;height:44px;border-radius:12px;background:rgba(196,130,90,0.1);display:flex;align-items:center;justify-content:center;transition:all .3s}
        @media(hover:hover){.p-witem:hover .p-wdot{background:#C4825A;transform:scale(1.1) rotate(8deg)}.p-witem:hover .p-wdot svg{stroke:#fff}}
        .p-wdot svg{width:20px;height:20px;stroke:#C4825A;transition:all .3s}
        .p-wtext h4{font-size:14px;font-weight:600;color:#2B2B2B;margin-bottom:5px}
        .p-wtext p{font-size:13px;color:#777;line-height:1.6;font-weight:300;margin:0}

        /* ── CTA ── */
        .p-cta-wrap{padding:0 5vw 80px;background:#fff}
        #p-ctaEl{
          border-radius:32px;
          background:linear-gradient(135deg, #2B2B2B 0%, #1a1a1a 100%);
          padding:64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:40px;
          position:relative;
          overflow:hidden;
          opacity:0;
          transform:translateY(32px);
          box-shadow:0 40px 100px rgba(0,0,0,0.15)
        }
        .p-btn-cta{
          background:#C4825A;
          color:#fff;
          padding:16px 40px;
          border-radius:100px;
          font-size:16px;
          font-weight:600;
          text-decoration:none;
          display:inline-block;
          position:relative;
          overflow:hidden;
          border:none;
          cursor:pointer;
          box-shadow:0 0 40px rgba(196,130,90,0.4);
          transition:all .4s;
          animation:glowPulse 2s infinite alternate;
          touch-action:manipulation;
          min-height:52px;
          display:inline-flex;
          align-items:center;
          white-space:nowrap;
        }
        @keyframes glowPulse{from{box-shadow:0 0 20px rgba(196,130,90,0.3)}to{box-shadow:0 0 50px rgba(196,130,90,0.6)}}
        @media(hover:hover){.p-btn-cta:hover{transform:scale(1.05) translateY(-2px)}}
        .p-btn-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:translateX(-100%);transition:transform .6s}
        @media(hover:hover){.p-btn-cta:hover::after{transform:translateX(100%)}}

        /* ── FOOTER ── */
        .p-footer-lite{background:linear-gradient(180deg, #1a1a1a, #0a0a0a);padding:64px 5vw 32px;color:rgba(255,255,255,0.4)}
        .p-footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-bottom:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .p-footer-col h4{color:#fff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px}
        /* FIX: Footer links need adequate touch targets */
        .p-footer-col a{display:block;color:rgba(255,255,255,0.5);text-decoration:none;margin-bottom:4px;font-size:14px;transition:color .3s;padding:8px 0;min-height:44px;display:flex;align-items:center}
        @media(hover:hover){.p-footer-col a:hover{color:#C4825A}}

        /* ── MOBILE STICKY CTA ── */
        /* FIX: Proper sticky CTA — only on mobile */
        .p-sticky-cta{
          position:fixed;
          bottom:0;left:0;right:0;
          padding:12px 16px;
          background:rgba(255,255,255,0.96);
          backdrop-filter:blur(12px);
          -webkit-backdrop-filter:blur(12px);
          border-top:1px solid rgba(0,0,0,0.06);
          z-index:1050;
          padding-bottom:calc(12px + env(safe-area-inset-bottom));
          /* FIX: Only visible on mobile */
          display:none;
        }
        @media(max-width:768px){
          .p-sticky-cta{display:block}
          /* FIX: Add bottom padding to page so sticky CTA doesn't cover content */
          .p-page{padding-bottom:84px}
        }

        /* ── REDUCED MOTION ── */
        @media(prefers-reduced-motion:reduce){
          .p-hero-badge,.p-line-inner,.p-hero-sub,.p-service-selector,.p-hero-actions,.p-hero-rating,.p-hero-media,
          .p-service-item,.process-card,.gitem,.p-tcard,.p-stat,#p-ctaEl,.p-section-header{
            opacity:1 !important;
            transform:none !important;
          }
          .p-line-inner{transform:none !important}
        }

        /* ── RESPONSIVE ── */

        /* Large tablet */
        @media(max-width:1100px){
          .p-process-grid{grid-template-columns:repeat(2,1fr)}
          .p-process-grid::before{display:none}
          .p-wlist{grid-template-columns:1fr}
        }

        /* Tablet */
        @media(max-width:900px){
          .p-hero{grid-template-columns:1fr;min-height:auto;padding:90px 5vw 60px}
          .p-hero-media{display:none} /* hide decorative quote on mobile */
          .p-intro,.p-why{grid-template-columns:1fr;gap:48px}
          /* FIX: Fix overlapping intro images on mobile */
          .p-intro-imgs{display:flex;flex-direction:column;gap:16px}
          .p-intro-img:nth-child(2){margin-top:0;margin-left:0;border:6px solid #fff}
          .p-stats,.p-tgrid{grid-template-columns:1fr 1fr}
          .p-footer-grid{grid-template-columns:1fr 1fr}
          .p-process-grid{display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:16px;margin:0 -5vw;padding-left:5vw;scrollbar-width:none;gap:16px}
          .p-process-grid::-webkit-scrollbar{display:none}
          .process-card{min-width:260px}
          #p-ctaEl{flex-direction:column;align-items:flex-start;padding:40px 32px;gap:28px;border-radius:24px}
          .p-why-img-wrap{max-width:100%}
          .p-gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto;gap:12px}
          .gitem:nth-child(1),.gitem:nth-child(4){grid-column:span 2}
          .p-tcard-featured{grid-column:span 2}
        }

        /* Mobile */
        @media(max-width:600px){
          .p-hero{padding:80px 5vw 48px}
          .p-hero h1{letter-spacing:-0.5px}
          .p-hero-sub{font-size:14px}
          .p-stats,.p-footer-grid{grid-template-columns:1fr}
          .p-stat{border-right:none;border-bottom:1px solid rgba(255,255,255,0.1);padding:28px 20px}
          .p-stat:last-child{border-bottom:none}
          .p-gallery-grid{grid-template-columns:1fr;grid-template-rows:auto}
          .gitem:nth-child(1),.gitem:nth-child(4){grid-column:span 1}
          .gitem{height:240px}
          .p-tgrid{grid-template-columns:1fr}
          .p-tcard-featured{grid-column:span 1}
          .p-intro,.p-why,.p-process,.p-gallery,.p-testimonials{padding:72px 5vw}
          .p-stats{padding:60px 5vw}
          .p-cta-wrap{padding:0 4vw 72px}
          #p-ctaEl{padding:32px 24px;border-radius:20px}
          .p-btn-cta{width:100%;justify-content:center}
        }
      `}</style>

      <div id="paint-progress" />
      {/* FIX: Cursors hidden on touch via CSS, refs still attached for desktop */}
      <div id="p-cursor" ref={cursorRef} />
      <div id="p-follower" ref={followerRef} />

      <div className="p-page">

        {/* ── HERO ── */}
        <section className="p-hero">
          <div>
            <div className="p-hero-badge">✦ Professional Painting Services</div>
            <h1>
              <span className="p-line-wrap"><span className="p-line-inner">Colour Your</span></span>
              <span className="p-line-wrap"><em><span className="p-line-inner">Dream Space</span></em></span>
              <span className="p-line-wrap"><span className="p-line-inner">With Precision</span></span>
            </h1>
            <p className="p-hero-sub">Dhoond brings verified painting professionals to your doorstep — interior, exterior, and texture painting done right, in time.</p>

            {/* FIX: Scrollable service selector on mobile */}
            <div className="p-service-selector">
              {[
                { n: 'Painting', p: 'starts ₹99' },
                { n: 'AC Service', p: 'starts ₹449' },
                { n: 'Cleaning', p: 'starts ₹299' },
                { n: 'Electrical', p: 'starts ₹149' }
              ].map(s => (
                <button key={s.n} className={`p-sel-btn ${s.n === 'Painting' ? 'active' : ''}`}>
                  {s.n} <span>{s.p}</span>
                </button>
              ))}
            </div>

            <div className="p-hero-actions">
              <a href={`tel:${PHONE}`} className="p-btn-primary">
                <span className="p-btn-fill" />
                <span>Book a consultant</span>
                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="15" height="15"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
              </a>
              <a href="#p-gallery" className="p-btn-outline">View Our Work</a>
            </div>
            <div className="p-hero-rating">
              <div className="p-stars">★★★★★</div>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>4.9/5 · <strong style={{ color: '#fff' }}>1,200+</strong> verified reviews</span>
            </div>
          </div>

          {/* Hidden on mobile via CSS */}
          <div className="p-hero-media" aria-hidden="true">
            <p style={{ color: '#fff', fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,52px)', fontStyle: 'italic', fontWeight: 600, textAlign: 'right', margin: 0, textShadow: '0 8px 32px rgba(0,0,0,0.6)', lineHeight: 1.25 }}>
              "From bare walls<br />to breathtaking rooms"
            </p>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="p-marquee-wrap" aria-hidden="true">
          <div className="p-marquee-track" id="paint-mtrack">
            {['Interior Painting', 'Exterior Painting', 'Texture & Design', 'Waterproofing', 'Wood Finish', 'Commercial Painting', 'Wallpaper Install', 'Stencil Art',
              'Interior Painting', 'Exterior Painting', 'Texture & Design', 'Waterproofing', 'Wood Finish', 'Commercial Painting', 'Wallpaper Install', 'Stencil Art'].map((item, i) => (
                <div key={i} className="p-marquee-item"><span className="p-mdot" />{item}</div>
              ))}
          </div>
        </div>

        {/* ── SERVICES STRIP ── */}
        <div className="p-services-strip" id="p-sstrip">
          {[
            { icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>, title: 'Interior Painting', sub: 'Walls, ceilings & trims' },
            { icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, title: 'Exterior Painting', sub: 'Weather-resistant finishes' },
            { icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8" />, title: 'Texture & Design', sub: 'Unique wall textures' },
            { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: 'Waterproofing', sub: 'Damp & leak protection' },
          ].map(s => (
            <div key={s.title} className="p-service-item">
              <div className="p-si-icon"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
              <div className="p-service-info"><h3>{s.title}</h3><p>{s.sub}</p></div>
            </div>
          ))}
        </div>

        {/* ── INTRO ── */}
        <section className="p-intro" id="p-introSec">
          <div className="p-intro-imgs">
            <div className="p-intro-img" id="p-iimg1">
              <div className="p-intro-img-inner" style={{ background: 'url(/wall2.jpg) center/cover no-repeat' }} />
            </div>
            {/* FIX: Second image overlap only on desktop (handled via CSS media queries) */}
            <div className="p-intro-img" id="p-iimg2">
              <div className="p-intro-img-inner" style={{ background: 'url(/wall3.jpg) center/cover no-repeat' }} />
            </div>
          </div>
          <div className="p-intro-text" id="p-introText" style={{ opacity: 0, transform: 'translateX(32px)' }}>
            <span className="p-eyebrow">Our Story</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.5px', color: '#2B2B2B', marginBottom: '20px' }}>
              We Make Every Wall Tell A <em style={{ color: '#C4825A', fontStyle: 'italic' }}>Beautiful</em> Story
            </h2>
            <p>At Dhoond, we believe your home deserves more than just paint — it deserves craftsmanship. Founded in Nagpur, we've grown into India's fastest-growing home services network.</p>
            <p>Every project is handled by background-checked, trained professionals using premium paints and proven techniques that last for years.</p>
            <button onClick={() => navigate('/shop')} className="p-btn-primary" style={{ width: 'fit-content', marginTop: '12px' }}>
              <span className="p-btn-fill" />
              <span>Explore Services</span>
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="15" height="15"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="p-stats" id="p-statsSec">
          <div className="p-stats-glow" aria-hidden="true" />
          {[
            { target: 5200, label: 'Projects Completed' },
            { target: 1200, label: 'Happy Clients' },
            { target: 50, label: 'Expert Painters' }
          ].map(s => (
            <div key={s.label} className="p-stat">
              <div className="num"><span className="p-cnum" data-target={s.target}>0</span><span className="plus">+</span></div>
              <div className="slabel">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── PROCESS ── */}
        <section className="p-process" id="p-processSec">
          <div className="p-section-header">
            <span className="p-eyebrow">How It Works</span>
            <h2>Painting Made Simple</h2>
            <p>From booking to the final coat, we handle everything with care.</p>
          </div>
          <div className="p-process-grid">
            {[
              { num: '01', color: 'rgba(196,130,90,0.12)', stroke: '#C4825A', icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></>, title: 'Book Online', desc: 'Choose service & pickup time in 60 seconds.' },
              { num: '02', color: 'rgba(143,168,130,0.15)', stroke: '#8FA882', icon: <><circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" /></>, title: 'Expert Visit', desc: 'Verified pro assesses your space.' },
              { num: '03', color: 'rgba(58,81,67,0.12)', stroke: '#3A5143', icon: <path d="M3 6l3 1m0 0l-3 9a5 5 0 0 0 6 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5 5 0 0 0 6 0M18 7l3 9m-3-9l-6-2" />, title: 'Painting', desc: 'Premium colors, clean technique.' },
              { num: '04', color: 'rgba(212,168,90,0.12)', stroke: '#D4A85A', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, title: 'Final Walk', desc: 'Inspect, approve, 100% satisfaction.' },
            ].map(c => (
              <div key={c.num} className="process-card" data-num={c.num}>
                <div className="p-picon" style={{ background: c.color }}><svg viewBox="0 0 24 24" stroke={c.stroke}>{c.icon}</svg></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="p-gallery" className="p-gallery">
          <div className="p-section-header">
            <span className="p-eyebrow">Our Portfolio</span>
            <h2>Spaces We've Transformed</h2>
            {/* FIX: Proper toggle with min 44px tap targets */}
            <div className="p-gallery-toggle">
              <button
                onClick={() => setGalleryActive('before')}
                className={`p-sel-btn ${galleryActive === 'before' ? 'active' : ''}`}
                aria-pressed={galleryActive === 'before'}
              >Before</button>
              <button
                onClick={() => setGalleryActive('after')}
                className={`p-sel-btn ${galleryActive === 'after' ? 'active' : ''}`}
                aria-pressed={galleryActive === 'after'}
              >After</button>
            </div>
          </div>
          <div className="p-gallery-grid">
            {[
              { bg: 'url(/space.jpg) center/cover no-repeat', title: 'Living Room Makeover', loc: 'Nagpur', tag: 'Luxury' },
              { bg: galleryActive === 'before' ? 'url(/wall2.jpg) center/cover no-repeat' : 'url(/bedroom_painting.png) center/cover no-repeat', title: 'Bedroom Retreat', loc: 'Hyderabad', tag: galleryActive === 'before' ? 'Before' : 'After' },
              { bg: 'url(/interior.jpg) center/cover no-repeat', title: 'Full Home Painting', loc: 'Bengaluru', tag: 'Elite' },
              { bg: 'url(/exterior.jpg) center/cover no-repeat', title: 'Exterior Excellence', loc: 'Mumbai', tag: 'Premium' }
            ].map(g => (
              <div key={g.title} className="gitem">
                <div className="p-gbg" style={{ background: g.bg, filter: galleryActive === 'before' ? 'grayscale(0.3) contrast(1.1)' : 'none' }} />
                <div className="p-goverlay" aria-hidden="true" />
                <div className="p-g-badge">{g.tag}</div>
                <div className="p-glabel"><span>{g.title}</span><p>{g.loc}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="p-testimonials" id="p-testSec">
          <div className="p-section-header">
            <span className="p-eyebrow">Client Love</span>
            <h2>Loved by Thousands</h2>
          </div>
          <div className="p-tgrid">
            {[
              { initials: 'PS', color: '#C4825A', name: 'Priya Sharma', role: 'Homeowner, Nagpur', text: 'The painting team arrived exactly on time, covered all furniture, and the finish is just flawless. Our living room looks like a magazine spread now!', featured: true },
              { initials: 'RM', color: '#3A5143', name: 'Rahul Mehta', role: 'Business Owner', text: 'Booked a full house painting. The team was clean, fast, and the finish is just premium.' },
              { initials: 'SK', color: '#8C8679', name: 'Sunita Kapoor', role: 'Resident, Bengaluru', text: 'Waterproofing issue for 2 years — Dhoond fixed it instantly.' },
            ].map(t => (
              <div key={t.name} className={`p-tcard ${t.featured ? 'p-tcard-featured' : ''}`}>
                <div className="p-tstars">★★★★★</div>
                <p className="p-ttext">"{t.text}"</p>
                <div className="p-tauthor">
                  <div className="p-tavatar">
                    <div style={{ background: t.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 600 }}>{t.initials}</div>
                  </div>
                  <div>
                    <div className="p-tname">{t.name}</div>
                    <div className="p-trole">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY DHOOND ── */}
        <section className="p-why" id="p-whySec">
          <div className="p-why-img-wrap">
            <div className="p-why-img-para" id="p-whyImgP" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img loading="lazy" src="/website_ui.webp" alt="Dhoond App Preview" style={{ width: '90%', transform: 'translateX(5%) translateY(2%)', filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.4))' }} />
            </div>
          </div>
          <div className="p-why-text">
            <span className="p-eyebrow">Why Dhoond</span>
            <h2>Affordable Painting Without Compromising Quality</h2>
            <div className="p-wlist">
              {[
                { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />, title: 'Verified Pros', desc: 'Background-checked, trained experts.' },
                { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, title: 'On-Time', desc: 'Scheduled visits, zero delays.' },
                { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: 'Clear Pricing', desc: 'Transparent upfront quotes.' },
                { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, title: 'Clean-Up', desc: 'Professional post-job cleaning.' },
              ].map(w => (
                <div key={w.title} className="p-witem">
                  <div className="p-wdot"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2">{w.icon}</svg></div>
                  <div className="p-wtext"><h4>{w.title}</h4><p>{w.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="p-cta-wrap">
          <div id="p-ctaEl">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.1, color: '#fff', margin: 0 }}>
                Transform Your Home<br /><em style={{ color: '#D4A85A' }}>Today.</em>
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', marginTop: '16px', fontWeight: 300, margin: '16px 0 0' }}>Experience premium service that lasts a lifetime.</p>
            </div>
            <div>
              <a href={`tel:${PHONE}`} className="p-btn-cta">Book an Appointment ↗</a>
              <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                Call us: <a href={`tel:${PHONE}`} style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>+91 91027 40274</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="p-footer-lite">
          <div className="p-footer-grid">
            <div className="p-footer-col">
              <h4>Dhoond</h4>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Making home services premium, affordable, and accessible across India.</p>
            </div>
            <div className="p-footer-col">
              <h4>Services</h4>
              <a href="#">Painting</a><a href="#">AC Service</a><a href="#">Cleaning</a><a href="#">Electrical</a>
            </div>
            <div className="p-footer-col">
              <h4>Company</h4>
              <a href="#">About Us</a><a href="#">Careers</a><a href="#">Partner with us</a><a href="#">Contact</a>
            </div>
            <div className="p-footer-col">
              <h4>Support</h4>
              <a href="#">Help Center</a><a href="#">Privacy Policy</a><a href="#">Terms of Use</a>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
            &copy; 2026 Dhoond Home Services. All rights reserved.
          </div>
        </footer>

        {/* ── MOBILE STICKY CTA (FIX: now correctly mobile-only via CSS) ── */}
        <div className="p-sticky-cta" role="complementary" aria-label="Quick booking">
          <a
            href={`tel:${PHONE}`}
            style={{
              width: '100%',
              background: '#C4825A',
              color: '#fff',
              padding: '14px 20px',
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(196,130,90,0.45)',
              textDecoration: 'none',
              touchAction: 'manipulation',
            }}
            onTouchStart={e => e.currentTarget.style.opacity = '0.85'}
            onTouchEnd={e => e.currentTarget.style.opacity = '1'}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>Book a consultant</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>Tap to call now</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Starting</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹99</div>
            </div>
          </a>
        </div>

      </div>
    </>
  );
}