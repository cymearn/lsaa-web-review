/* Lemon Sky AI Academy v8: shared behaviour. No tracking, no cookies, no third-party calls. */
(function(){
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav: shadow line on scroll + mobile drawer */
  var top=d.querySelector('.top');
  function onScroll(){ if(top) top.classList.toggle('scrolled', window.scrollY>12); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  var burger=d.querySelector('.burger');
  if(burger){
    burger.addEventListener('click', function(){
      var open=root.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open?'true':'false');
    });
    d.querySelectorAll('.drawer a').forEach(function(a){ a.addEventListener('click', function(){ root.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); }); });
  }

  /* count-up for stats (final value already in the HTML, so no-JS readers see it) */
  function countUp(el){
    var to=parseInt(el.getAttribute('data-to'),10); if(!to||reduce) return;
    var numNode=el.firstChild, t0=null, dur=1400;
    function step(ts){ if(!t0) t0=ts; var p=Math.min((ts-t0)/dur,1); var e=1-Math.pow(1-p,3);
      numNode.nodeValue=String(Math.round(to*e)); if(p<1) requestAnimationFrame(step); }
    numNode.nodeValue='0'; requestAnimationFrame(step);
  }

  /* reveal on scroll */
  var targets=d.querySelectorAll('.rv,.day,[data-to]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target; el.classList.add('on');
        if(el.hasAttribute('data-to')) countUp(el);
        io.unobserve(el);
      });
    },{threshold:.18, rootMargin:'0px 0px -6% 0px'});
    targets.forEach(function(el){ io.observe(el); });
  } else { targets.forEach(function(el){ el.classList.add('on'); }); }

  /* programme chooser */
  var FORM="https://docs.google.com/forms/d/e/1FAIpQLScz2-eGKvVYdhhIBnqzO9bbS5nLTeCYvKzPNlAs9FSd_yxiXQ/viewform";
  var picks={
    start:{e:"Start here",t:"AI for Business",l:"Your everyday work, automated.",d:"1 Day",p:"RM 2,500",r:FORM,b:"https://lemonskyacademy.ai/ai-for-business-brochure.html"},
    marketing:{e:"For marketing teams",t:"AI Marketing",l:"A content engine your team runs.",d:"2 Days",p:"RM 4,000",r:FORM,b:"https://lemonskyacademy.ai/advanced-marketing-brochure.html"},
    finance:{e:"For finance & ops teams",t:"AI for Finance & Ops",l:"Reporting and reconciliation, off your desk.",d:"1 Day",p:"RM 2,500",r:FORM,b:"https://lemonskyacademy.ai/ai-for-finance-operations-brochure.html"},
    hr:{e:"For HR & finance teams",t:"AI Agents for Finance & HR",l:"Onboarding, support and finance workflows, automated.",d:"2 Days",p:"RM 4,000",r:FORM,b:"https://lemonskyacademy.ai/advanced-ai-agentic-finance-hr-brochure.html"},
    strategy:{e:"For leadership",t:"AI Transformation",l:"Leave with a board-ready roadmap.",d:"2 Days",p:"RM 4,000",r:FORM,b:"https://lemonskyacademy.ai/advanced-ai-business-transformation-brochure.html"}
  };
  var box=d.getElementById('intents'), pick=d.getElementById('pick');
  if(box&&pick){
    box.addEventListener('click', function(ev){
      var btn=ev.target.closest('.chip'); if(!btn||btn.classList.contains('on')) return;
      box.querySelectorAll('.chip').forEach(function(b){ b.classList.remove('on'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('on'); btn.setAttribute('aria-pressed','true');
      var v=picks[btn.getAttribute('data-k')]; if(!v) return;
      function fill(){
        d.getElementById('pk-eyebrow').textContent=v.e;
        d.getElementById('pk-title').textContent=v.t;
        d.getElementById('pk-line').textContent=v.l;
        d.getElementById('pk-dur').textContent=v.d;
        d.getElementById('pk-price').textContent=v.p;
        d.getElementById('pk-register').setAttribute('href',v.r);
        d.getElementById('pk-brochure').setAttribute('href',v.b);
      }
      if(reduce){ fill(); return; }
      pick.classList.add('swap');
      setTimeout(function(){ fill(); pick.classList.remove('swap'); }, 260);
    });
  }

  /* gallery: arrows + progress + drag */
  var g=d.querySelector('.gallery');
  if(g){
    var prog=d.querySelector('.gprog i');
    function upd(){ if(!prog) return; var max=g.scrollWidth-g.clientWidth; var w=g.clientWidth/g.scrollWidth*100;
      prog.style.width=w+'%'; prog.style.left=(max>0? g.scrollLeft/max*(100-w):0)+'%'; }
    g.addEventListener('scroll', upd, {passive:true}); window.addEventListener('resize', upd); upd();
    var step=function(dir){ var f=g.querySelector('figure'); g.scrollBy({left:dir*(f?f.offsetWidth+18:400), behavior:reduce?'auto':'smooth'}); };
    var pv=d.querySelector('[data-g="prev"]'), nx=d.querySelector('[data-g="next"]');
    if(pv) pv.addEventListener('click', function(){ step(-1); });
    if(nx) nx.addEventListener('click', function(){ step(1); });
    var down=false, sx=0, sl=0;
    g.addEventListener('mousedown', function(e){ down=true; sx=e.pageX; sl=g.scrollLeft; g.style.scrollSnapType='none'; g.style.cursor='grabbing'; });
    window.addEventListener('mouseup', function(){ if(!down) return; down=false; g.style.scrollSnapType=''; g.style.cursor=''; });
    g.addEventListener('mousemove', function(e){ if(!down) return; e.preventDefault(); g.scrollLeft=sl-(e.pageX-sx); });
  }

  /* FAQ: one open at a time */
  var faqs=d.querySelectorAll('.faqs details');
  faqs.forEach(function(x){ x.addEventListener('toggle', function(){ if(x.open) faqs.forEach(function(o){ if(o!==x) o.open=false; }); }); });
})();
