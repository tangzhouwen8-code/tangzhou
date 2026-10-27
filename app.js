'use strict';
const dialog=document.querySelector('#viewer');
const body=document.querySelector('#viewer-body');
const title=document.querySelector('#viewer-title');
let restoreVideo=null;
let previousFocus=null;
function showViewer(label,content){previousFocus=document.activeElement;title.textContent=label;body.replaceChildren(content);dialog.showModal();document.body.classList.add('modal-open');}
function cleanup(){if(restoreVideo){restoreVideo();restoreVideo=null;}body.replaceChildren();document.body.classList.remove('modal-open');if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});}
dialog.addEventListener('close',cleanup);
document.querySelector('#close-viewer').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const videos=[...document.querySelectorAll('video')];
videos.forEach(video=>{
 video.addEventListener('play',()=>videos.forEach(other=>{if(other!==video)other.pause();}));
 const article=video.closest('article');
 const label=article.querySelector('h3').textContent;
 video.setAttribute('aria-label',label+'视频');
 const holder=document.createElement('div');holder.className='video-holder';video.replaceWith(holder);holder.append(video);
 const button=document.createElement('button');button.type='button';button.className='watch-large';button.textContent='放大观看 ↗';button.setAttribute('aria-label','放大观看《'+label+'》');holder.append(button);
 button.addEventListener('click',()=>{restoreVideo=()=>{video.pause();holder.prepend(video);};showViewer(label,video);});
});
document.querySelector('.writing-toolbar').hidden=false;
const details=[...document.querySelectorAll('.writing-list details')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 const filter=button.dataset.filter;let count=0;
 details.forEach(d=>{d.hidden=filter!=='all'&&d.dataset.category!==filter;if(!d.hidden)count++;else d.open=false;});
 document.querySelector('#filter-status').textContent=count+' 篇作品';
}));
details.forEach(item=>{
 const reading=item.querySelector('.reading');const prose=reading.querySelector('.prose');const pdf=reading.querySelector('a[href$=".pdf"]');
 const button=document.createElement('button');button.type='button';button.className='reading-action';button.textContent=prose?'专注阅读 ↗':'在此预览 ↗';
 reading.prepend(button);
 button.addEventListener('click',()=>{const label=item.querySelector('summary span:nth-child(2)').textContent;if(prose){showViewer(label,prose.cloneNode(true));}else if(pdf){const container=document.createElement('div');const link=pdf.cloneNode(true);link.textContent='打开完整 PDF ↗';container.append(link);const frame=document.createElement('iframe');frame.src=pdf.getAttribute('href');frame.title=label;container.append(frame);showViewer(label,container);}});
});
const links=[...document.querySelectorAll('nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
let scheduled=false;
function updatePosition(){scheduled=false;let current=null;sections.forEach(s=>{if(s.getBoundingClientRect().top<=160)current=s;});links.forEach(a=>{if(current&&a.hash==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});document.querySelector('.back-top').hidden=window.scrollY<600;}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updatePosition);}},{passive:true});updatePosition();

document.querySelectorAll('.image-preview').forEach(link=>{
 link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  const image=new Image();
  image.src=link.getAttribute('href');
  image.alt=link.querySelector('img').alt;
  image.className='expanded-artwork';
  showViewer(link.dataset.imageTitle,image);
 });
});
