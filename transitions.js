(() => {
 if(document.querySelector('.page-transition')) return;
 const overlay=document.createElement('div'); overlay.className='page-transition'; overlay.innerHTML='<div class="cooking-loader"><div class="pan" aria-hidden="true">🍳</div><p>Something delicious is on its way</p></div>'; document.body.appendChild(overlay);
 document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||link.target==='_blank'||link.hasAttribute('download'))return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search)return;link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();overlay.classList.add('is-visible');setTimeout(()=>location.href=url.href,260)});});
 window.addEventListener('pageshow',()=>overlay.classList.remove('is-visible'));
})();