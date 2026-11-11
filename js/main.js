/* ============================================================
   Wedding Invitation — Dharmik & Ankita
   Pure JavaScript: Animations, Countdown, LocalStorage DB
   Gujarati Tradition · Bhavnagar · 26 Jan 2027
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== PRELOADER ====================
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    launchConfetti(60);
                }, 1000);
            }
        }, 2600);
    });

    // ==================== FLOATING PETALS ====================
    const petalContainer = document.querySelector('.floating-petals');
    const PETALS = ['🌸', '🌺', '✿', '❀', '🪷', '🌼', '💮'];
    if (petalContainer) {
        setInterval(() => {
            const el = document.createElement('div');
            el.className = 'petal-float';
            el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
            el.style.cssText = `
                left: ${Math.random() * 100}%;
                font-size: ${(Math.random() * 1.4 + 0.7).toFixed(1)}rem;
                animation-duration: ${(Math.random() * 7 + 7).toFixed(1)}s;
                animation-delay: ${(Math.random() * 2).toFixed(1)}s;
            `;
            petalContainer.appendChild(el);
            setTimeout(() => el.remove(), 16000);
        }, 900);
    }

    // ==================== SPARKLE CURSOR TRAIL ====================
    const SPARKLE_CHARS = ['✦', '✧', '❋', '✵', '❈', '✺', '⊹', '✼'];
    const SPARKLE_COLORS = ['#D4A843', '#E8B4B8', '#FFD700', '#F0D48A', '#FF8FA3'];
    let sparkleThrottle = false;

    document.addEventListener('mousemove', (e) => {
        if (sparkleThrottle) return;
        sparkleThrottle = true;
        setTimeout(() => sparkleThrottle = false, 90);

        const sp = document.createElement('div');
        sp.className = 'sparkle';
        sp.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
        sp.style.left = `${e.clientX}px`;
        sp.style.top  = `${e.clientY}px`;
        sp.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 1000);
    });

    // ==================== SCROLL REVEAL ====================
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));

    // ==================== NAVBAR SCROLL ====================
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // ==================== MOBILE MENU ====================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks   = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // ==================== COUNTDOWN TIMER ====================
    const WEDDING = new Date('2027-01-26T11:00:00+05:30');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now  = new Date();
        const diff = WEDDING - now;

        if (diff <= 0) {
            ['days','hours','minutes','seconds'].forEach(id => {
                const el = document.getElementById(`countdown-${id}`);
                if (el) el.textContent = '00';
            });
            return;
        }

        const days    = Math.floor(diff / 86400000);
        const hours   = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000)  / 60000);
        const seconds = Math.floor((diff % 60000)    / 1000);

        setNum('countdown-days',    days);
        setNum('countdown-hours',   pad(hours));
        setNum('countdown-minutes', pad(minutes));
        setNum('countdown-seconds', pad(seconds));
    }

    function setNum(id, val) {
        const el = document.getElementById(id);
        if (!el || el.textContent === String(val)) return;
        el.style.transform = 'scale(1.25)';
        el.style.color = 'var(--gold-light)';
        el.textContent = val;
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.color = '';
        }, 250);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==================== GOOGLE SHEETS RSVP DATABASE ====================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw936Vfg2BRnJhpP4cEGMEOCBQ-kx8f0106NfQcVAVldVHu8HZpNIwtRiZ2W72IZEJMwg/exec";

    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = rsvpForm.querySelector('[name="name"]').value.trim();
            const guests  = parseInt(rsvpForm.querySelector('[name="guests"]').value) || 1;
            const message = rsvpForm.querySelector('[name="message"]').value.trim();

            if (!name) {
                showMsg('rsvp-message', 'કૃપા કરીને આપનું નામ આપો.', 'error');
                return;
            }

            const btn = rsvpForm.querySelector('.submit-btn');
            const originalBtnText = btn.textContent;
            btn.textContent = 'મોકલી રહ્યા છીએ...';
            btn.disabled = true;

            const payload = {
                name: name,
                guests: guests,
                message: message
            };

            try {
                // Send directly to your Google Sheet webhook
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // standard for Google Apps Script Webhooks
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                showMsg('rsvp-message', `🙏 આભાર ${name}! આપનો RSVP Google Sheet માં નોંધાઈ ગયો છે. અમે આપની સાથે ઉજવણી કરવા ઉત્સુક છીએ! 🎊`, 'success');
                launchConfetti(80);
                rsvpForm.reset();
            } catch (err) {
                showMsg('rsvp-message', 'ક્ષમા કરો, ફરીથી પ્રયત્ન કરો.', 'error');
            } finally {
                btn.textContent = originalBtnText;
                btn.disabled = false;
            }
        });
    }

    function showMsg(id, text, type) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
        el.className = `form-message ${type}`;
        setTimeout(() => el.classList.add('show'), 20);
        setTimeout(() => el.classList.remove('show'), 6000);
    }

    // ==================== CONFETTI ====================
    function launchConfetti(count = 70) {
        const COLORS = ['#D4A843','#800020','#E8B4B8','#FFD700','#FF6B6B','#FFA500','#FF8FA3'];
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const c = document.createElement('div');
                c.className = 'confetti-piece';
                const size = (Math.random() * 10 + 5).toFixed(1);
                c.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    width: ${size}px;
                    height: ${(Math.random() > .5 ? size : (Math.random()*5+3).toFixed(1))}px;
                    background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
                    border-radius: ${Math.random() > .5 ? '50%' : '2px'};
                    animation-duration: ${(Math.random() * 3 + 2).toFixed(1)}s;
                    animation-delay: ${(Math.random() * .6).toFixed(1)}s;
                `;
                document.body.appendChild(c);
                setTimeout(() => c.remove(), 5500);
            }, i * 25);
        }
    }

    // ==================== PARTICLES ====================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;
                this.vx = (Math.random() - .5) * .5;
                this.vy = (Math.random() - .5) * .5;
                this.r  = Math.random() * 1.8 + .4;
                this.a  = Math.random() * .45 + .05;
                this.c  = Math.random() > .5 ? '212,168,67' : '232,180,184';
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.c},${this.a})`;
                ctx.fill();
            }
        }

        const count = Math.min(90, Math.floor(window.innerWidth * window.innerHeight / 14000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        (function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d  = Math.hypot(dx, dy);
                    if (d < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(212,168,67,${.07 * (1 - d / 110)})`;
                        ctx.lineWidth = .5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(loop);
        })();
    }

    // ==================== PARALLAX HERO ====================
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-content');
        if (hero) {
            const s = window.scrollY;
            hero.style.transform = `translateY(${s * 0.28}px)`;
            hero.style.opacity   = Math.max(0, 1 - s / 700);
        }
    }, { passive: true });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==================== MUSIC TOGGLE ====================
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic  = document.getElementById('bg-music');
    let playing = false;
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (playing) { bgMusic.pause(); musicBtn.classList.remove('playing'); }
            else         { bgMusic.play().catch(() => {}); musicBtn.classList.add('playing'); }
            playing = !playing;
        });
    }

    // ==================== 3D TILT on CARDS ====================
    document.querySelectorAll('.event-card, .countdown-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top)  / r.height - .5) * 14;
            const ry = ((e.clientX - r.left) / r.width  - .5) * -14;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==================== SECTION TITLE GLOW ON ENTER ====================
    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                el.style.textShadow = '0 0 50px rgba(212,168,67,.7)';
                setTimeout(() => { el.style.transition = 'text-shadow 2.5s ease'; el.style.textShadow = 'none'; }, 400);
                titleObserver.unobserve(el);
            }
        });
    }, { threshold: .5 });
    document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

    console.log('💍 Dharmik & Ankita — Shubh Vivah 2027 (Pure JS) 🎊');
});
