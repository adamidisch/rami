(function(){
 const el=document.documentElement.lang==='el';
 const labels=el?{home:'Αρχική',series:'Η σειρά',artist:'Ο πιανίστας',concerts:'Συναυλίες',tickets:'Εισιτήρια',language:'Γλώσσα',close:'Κλείσιμο',menu:'Άνοιγμα μενού',menuClose:'Κλείσιμο μενού'}:{home:'Home',series:'The series',artist:'The pianist',concerts:'Concerts',tickets:'Tickets',language:'Language',close:'Close',menu:'Open menu',menuClose:'Close menu'};
 const base=el?'/el.html':'/';const menuBtn=document.querySelector('.menu-button');let panel=null,overlay=null;
 function closeMenu(){panel?.remove();overlay?.remove();panel=overlay=null;menuBtn.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label',labels.menu)}
 menuBtn.addEventListener('click',()=>{if(panel){closeMenu();return}overlay=document.createElement('button');overlay.className='menu-scrim';overlay.setAttribute('aria-label',labels.close);overlay.addEventListener('click',closeMenu);panel=document.createElement('div');panel.className='menu-panel';panel.id='site-menu';panel.innerHTML=`<a href="${base}">${labels.home}</a><a href="#series">${labels.series}</a><a href="#artist">${labels.artist}</a><a href="#concerts">${labels.concerts}</a><a href="/tickets.html">${labels.tickets}</a>`;document.querySelector('.site-header').append(overlay,panel);menuBtn.classList.add('open');menuBtn.setAttribute('aria-expanded','true');menuBtn.setAttribute('aria-label',labels.menuClose);panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu()}});
 document.querySelectorAll('.language button').forEach(b=>b.addEventListener('click',()=>{const dest=b.textContent.trim()==='ΕΛ'?'/el.html':'/';if(location.pathname!==dest)location.href=dest}));
 document.querySelector('.brand').setAttribute('href',base);
 const style=document.createElement('style');style.textContent='.language.large a{font-size:14px;color:#817a8b}.language.large a[aria-current="page"]{color:#211d29;font-weight:600}';document.head.append(style);
})();
