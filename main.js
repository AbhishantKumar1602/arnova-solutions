/* ── SKILL BARS — animate on scroll ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.transition = 'width 1s ease'; bar.style.width = w; }, 100);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-categories').forEach(el => skillObserver.observe(el));

/* ─────────────────────────────────────────── */

(function(){
  function dismissLoader(){
    var loader = document.getElementById('loader');
    if(!loader) return;
    if(typeof gsap !== 'undefined'){
      gsap.to(loader, {opacity:0, duration:0.6, onComplete: function(){ loader.style.display='none'; }});
    } else {
      loader.style.transition = 'opacity 0.6s';
      loader.style.opacity = '0';
      setTimeout(function(){ loader.style.display='none'; }, 650);
    }
  }
  if(document.readyState === 'complete'){ dismissLoader(); }
  else {
    window.addEventListener('load', dismissLoader);
    setTimeout(dismissLoader, 3000);
  }
})();

/* ─────────────────────────────────────────── */

// AOS scroll animations
if(typeof AOS !== 'undefined') AOS.init({ duration: 900, once: true, offset: 60 });

// Particle background
if(typeof particlesJS !== 'undefined') particlesJS('particles-js', {
  particles: {
    number: { value: 55 },
    color: { value: '#00e5ff' },
    shape: { type: 'circle' },
    opacity: { value: 0.35 },
    size: { value: 2.5 },
    line_linked: { enable: true, distance: 150, color: '#00e5ff', opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1.8 }
  }
});

// VanillaTilt on cards
if(typeof VanillaTilt !== 'undefined'){
  VanillaTilt.init(document.querySelectorAll('.service-card, .product-card, .fraud-card, .stack-pill'), {
    max: 5, speed: 400, glare: true, 'max-glare': 0.15
  });
}

// CountUp — hero stat numbers, preserves +/% suffix
if(typeof CountUp !== 'undefined'){
  document.querySelectorAll('.stat-num').forEach(function(el){
    var raw    = el.innerText.trim();
    var suffix = raw.replace(/[\d,]/g, '');
    var end    = parseInt(raw.replace(/\D/g, ''));
    if(!isNaN(end)){
      try {
        var Ctor    = CountUp.CountUp || CountUp;
        var counter = new Ctor(el, end, { suffix: suffix, duration: 2.5 });
        if(!counter.error) counter.start();
      } catch(e){}
    }
  });
}

// GSAP scroll reveal for sections
if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('section').forEach(function(sec){
    gsap.from(sec, {
      opacity: 0, y: 60, duration: 1,
      scrollTrigger: { trigger: sec, start: 'top 82%' }
    });
  });
}

/* ─────────────────────────────────────────── */

if(typeof THREE !== 'undefined'){
  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;z-index:-3;pointer-events:none;';
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.IcosahedronGeometry(2, 0);
  var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00e5ff, opacity: 0.35, transparent: true });
  var mesh     = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  camera.position.z = 5;

  window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  (function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.004;
    renderer.render(scene, camera);
  })();
}

/* ─────────────────────────────────────────── */

(function(){
  function initDashboard(){
    var canvas = document.getElementById('fraudChart');
    if(!canvas || typeof Chart === 'undefined') return;
    var labels    = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];
    var fraudBase = [12,8,5,3,18,42,67,89,74,55,38,21];
    var cleanBase = [88,92,95,97,82,58,33,11,26,45,62,79];
    var chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label:'Fraud Signals',  data: fraudBase.slice(), borderColor:'rgba(244,63,94,0.9)',  backgroundColor:'rgba(244,63,94,0.08)',  tension:0.45, fill:true, pointRadius:3, borderWidth:2 },
          { label:'Clean Sessions', data: cleanBase.slice(), borderColor:'rgba(34,211,164,0.9)', backgroundColor:'rgba(34,211,164,0.06)', tension:0.45, fill:true, pointRadius:3, borderWidth:2 }
        ]
      },
      options: {
        responsive: true, animation: { duration: 600 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6b7a99', font:{ size:10, family:'Space Mono' } } },
          y: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6b7a99', font:{ size:10 } }, min:0, max:110 }
        }
      }
    });
    // Counters
    function countUp(el, target, suffix){
      if(!el) return;
      var cur = 0, step = Math.ceil(target / 40);
      var t = setInterval(function(){ cur = Math.min(cur+step, target); el.textContent = cur+suffix; if(cur >= target) clearInterval(t); }, 40);
    }
    setTimeout(function(){
      countUp(document.getElementById('dash-blocked'), 247, '');
      countUp(document.getElementById('dash-clean'),   1893, '');
      countUp(document.getElementById('dash-score'),   97,   '%');
    }, 400);
    // Live update every 2s
    setInterval(function(){
      chart.data.datasets[0].data = fraudBase.map(function(v){ return Math.max(0,   v + Math.round(Math.random()*14-7)); });
      chart.data.datasets[1].data = cleanBase.map(function(v){ return Math.min(110, v + Math.round(Math.random()*14-7)); });
      chart.update('none');
      var b = document.getElementById('dash-blocked');
      var c = document.getElementById('dash-clean');
      if(b) b.textContent = 247  + Math.round(Math.random()*10-3);
      if(c) c.textContent = 1893 + Math.round(Math.random()*20-8);
    }, 2000);
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initDashboard); }
  else { initDashboard(); }
})();

/* ─────────────────────────────────────────── */

// Cursor spotlight
document.addEventListener('mousemove', function(e){
  document.documentElement.style.setProperty('--x', e.clientX + 'px');
  document.documentElement.style.setProperty('--y', e.clientY + 'px');
});

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(function(btn){
  btn.addEventListener('mousemove', function(e){
    var rect = btn.getBoundingClientRect();
    var x = e.clientX - rect.left - rect.width  / 2;
    var y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = 'translate(' + (x*0.2) + 'px,' + (y*0.2) + 'px)';
  });
  btn.addEventListener('mouseleave', function(){
    btn.style.transform = 'translate(0,0)';
  });
});

// Hamburger mobile menu
var hamburger = document.getElementById('hamburger');
var navLinks  = document.querySelector('.nav-links');
if(hamburger && navLinks){
  hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* Setup (one-time, 2 min):
   1. emailjs.com → sign up free
   2. Add Gmail service → copy Service ID → replace YOUR_SERVICE_ID
   3. Create template with {{from_name}} {{from_email}} {{subject}} {{message}}
      → copy Template ID → replace YOUR_TEMPLATE_ID
   4. Account → Public Key → replace YOUR_PUBLIC_KEY  */

var EMAILJS_PUBLIC_KEY  = 'nmRcMh7mTaf_ZBOve';
var EMAILJS_SERVICE_ID  = 'service_3fsrn7p';
var EMAILJS_TEMPLATE_ID = 'template_jebkbnq';

if(typeof emailjs !== 'undefined') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

var cfSend = document.getElementById('cf-send');
if(cfSend){
  cfSend.addEventListener('click', function(){
    var name    = (document.getElementById('cf-name').value    || '').trim();
    var email   = (document.getElementById('cf-email').value   || '').trim();
    var subject = (document.getElementById('cf-subject').value || '').trim();
    var message = (document.getElementById('cf-message').value || '').trim();
    var status  = document.getElementById('cf-status');
    var btn     = cfSend;

    function showStatus(type, text){
      var map = {
        success:{ bg:'rgba(34,211,164,0.08)',  border:'rgba(34,211,164,0.25)',  color:'var(--c4)' },
        error:  { bg:'rgba(244,63,94,0.08)',   border:'rgba(244,63,94,0.25)',   color:'var(--c6)' },
        warn:   { bg:'rgba(250,204,21,0.08)',  border:'rgba(250,204,21,0.25)',  color:'var(--c5)' }
      };
      var s = map[type];
      status.style.cssText = 'display:block;background:'+s.bg+';border:1px solid '+s.border+';color:'+s.color+';font-family:var(--font-mono);font-size:0.78rem;padding:10px 14px;border-radius:8px;text-align:center;margin-top:4px;';
      status.textContent = text;
    }

    if(!name || !email || !message){
      showStatus('error', '\u26a0 Please fill in your name, email, and message.'); return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showStatus('error', '\u26a0 Please enter a valid email address.'); return;
    }

    // Not configured yet — fallback to mailto
    if(EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
      var sub  = subject || 'Message from ' + name + ' via ArNova Site';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      window.open('mailto:official.abhishant.kumar@gmail.com?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body));
      showStatus('warn', '\u2139 EmailJS not configured \u2014 opened your email client instead.');
      return;
    }

    // Send via EmailJS
    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name, from_email: email,
      subject:   subject || 'Message from ' + name + ' via ArNova Site',
      message:   message, reply_to: email
    })
    .then(function(){
      showStatus('success', '\u2713 Message sent! We\'ll get back to you soon.');
      ['cf-name','cf-email','cf-subject','cf-message'].forEach(function(id){ document.getElementById(id).value=''; });
      btn.textContent = 'Send Message \u2192';
      btn.disabled = false;
    })
    .catch(function(err){
      showStatus('error', '\
❌ Failed to send. Email: official.abhishant.kumar@gmail.com');
      console.error('EmailJS:', err);
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    });
  });
}
