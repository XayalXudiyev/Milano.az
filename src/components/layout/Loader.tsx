/**
 * Giriş ekranı: tünd pərdə üzərində hərf-hərf qalxan "Milano", qızılı proqres xətti,
 * sonra iki qatlı (qara → çəhrayı) əyri pərdə yuxarı qalxır.
 *
 * React state istifadə olunmur — inline skript `<html>`-ə ilk boyamadan əvvəl `is-loading`
 * sinfi qoyur, `load` hadisəsindən sonra `is-loaded`-a keçir. JS yoxdursa loader görünmür.
 * Eyni sessiyada təkrar tam yükləmədə göstərilmir.
 */

const WORD = "Milano";
const MIN_MS = 1650; // hərflər və proqres xətti tamamlansın
const MAX_MS = 4000; // yavaş şəbəkədə belə istifadəçini saxlamırıq

const script = `(function(){
var d=document.documentElement;
try{if(sessionStorage.getItem('nv-intro'))return;sessionStorage.setItem('nv-intro','1')}catch(e){}
d.classList.add('is-loading');
var t0=performance.now(),f=0,c=document.getElementById('nv-count');
function tick(now){var t=Math.min(1,Math.max(0,(now-t0-150)/1500));var e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;if(c)c.textContent=Math.round(e*100);if(t<1&&!f)requestAnimationFrame(tick)}
requestAnimationFrame(tick);
function done(){if(f)return;f=1;setTimeout(function(){if(c)c.textContent='100';d.classList.remove('is-loading');d.classList.add('is-loaded');window.dispatchEvent(new Event('nv:loaded'))},Math.max(0,${MIN_MS}-(performance.now()-t0)))}
if(document.readyState==='complete')done();else addEventListener('load',done);
setTimeout(done,${MAX_MS});
})();`;

export default function Loader() {
  return (
    <>
      <div className="nv-loader" aria-hidden>
        <div className="nv-loader__layer nv-loader__under" />
        <div className="nv-loader__layer nv-loader__panel">
          <div className="nv-loader__orb" />
          <div className="nv-loader__content">
            <p className="nv-loader__word">
              {WORD.split("").map((ch, i) => (
                <span key={i} style={{ ["--i" as string]: i }}>
                  {ch}
                </span>
              ))}
            </p>
            <p className="nv-loader__tag" lang="en">
              Milano.az
            </p>
            <div className="nv-loader__progress">
              <span className="nv-loader__bar" />
              {/* rəqəmi inline skript yeniləyir — hidrasiya fərqi gözləniləndir */}
              <span id="nv-count" className="nv-loader__count" suppressHydrationWarning>
                0
              </span>
            </div>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
