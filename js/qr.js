/* ============================================================
   qr.js — компактный генератор QR-стиля для прототипа
   Детерминированный QR-подобный узор (finder-паттерны + модули
   по хешу строки) в виде SVG — демонстрация единой точки входа.
   ============================================================ */

function _hash(str){
  let h=2166136261>>>0;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0}
  return h>>>0;
}

function drawQR(el, text, size){
  if(!el) return;
  const N=25;
  size = size || 150;
  const cell = size/N;
  let seed=_hash(text||'agz');
  const rnd=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};

  const m=Array.from({length:N},()=>Array(N).fill(0));

  function finder(r,c){
    for(let i=-1;i<=7;i++)for(let j=-1;j<=7;j++){
      const rr=r+i,cc=c+j;if(rr<0||cc<0||rr>=N||cc>=N)continue;
      const onRing=(i>=0&&i<=6&&(j===0||j===6))||(j>=0&&j<=6&&(i===0||i===6));
      const center=(i>=2&&i<=4&&j>=2&&j<=4);
      m[rr][cc]=(onRing||center)?1:0;
    }
  }
  finder(0,0);finder(0,N-7);finder(N-7,0);
  for(let i=8;i<N-8;i++){m[6][i]=i%2?1:0;m[i][6]=i%2?1:0;}
  function inFinder(r,c){ return (r<8&&c<8)||(r<8&&c>=N-8)||(r>=N-8&&c<8); }
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    if(inFinder(r,c)||r===6||c===6)continue;
    m[r][c]=rnd()>0.5?1:0;
  }
  let rects='';
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    if(m[r][c])rects+=`<rect x="${(c*cell).toFixed(2)}" y="${(r*cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`;
  }
  el.innerHTML=`<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
    <rect width="${size}" height="${size}" fill="#fff"/>
    <g fill="#0D2A4F">${rects}</g></svg>`;
}
