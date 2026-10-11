const APP_HTML = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sincho Dropship — BodyWorld</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f4f6fb}*{box-sizing:border-box}body{margin:0}.wrap{max-width:1200px;margin:auto;padding:24px}.top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.brand{display:flex;align-items:center;gap:12px}.logo{width:46px;height:46px;border-radius:14px;background:#172554;color:white;display:grid;place-items:center;font-weight:900;font-size:20px}.muted{color:#6b7280;font-size:13px}.card{background:white;border:1px solid #e5e9f2;border-radius:18px;padding:20px;margin-bottom:16px;box-shadow:0 4px 16px #15234a08}.hrow{display:flex;gap:10px;flex-wrap:wrap}.grow{flex:1;min-width:220px}label{display:block;font-size:12px;font-weight:700;color:#536078;margin:0 0 6px}input,textarea,select{width:100%;border:1px solid #dce2ee;border-radius:10px;padding:11px 12px;font:inherit;background:#fff;color:#172033}textarea{min-height:94px;resize:vertical}button{border:0;border-radius:10px;padding:11px 15px;font:inherit;font-weight:700;cursor:pointer;background:#172554;color:#fff}button.secondary{background:#edf1f8;color:#24304a}button.danger{background:#fff0f0;color:#a32121}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.status{padding:10px 12px;border-radius:10px;background:#f0f5ff;color:#28437c;font-size:13px;margin-top:12px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.stat{background:#f7f9fd;border-radius:12px;padding:14px}.stat strong{display:block;font-size:23px}.tablewrap{overflow:auto}table{border-collapse:collapse;width:100%;min-width:900px}th,td{text-align:left;border-bottom:1px solid #edf0f5;padding:11px 9px;font-size:13px;vertical-align:top}th{font-size:11px;text-transform:uppercase;color:#6b7280;background:#fafbfe}td input,td textarea{min-width:100px;padding:8px;font-size:12px}td textarea{min-width:180px;min-height:64px}.thumb{width:48px;height:48px;object-fit:contain;background:#f6f7fa;border-radius:8px}.pill{font-size:11px;border-radius:20px;padding:5px 8px;background:#eaf8ef;color:#197341}.small{font-size:12px}.footer{color:#697386;font-size:12px;padding:8px 2px}@media(max-width:650px){.wrap{padding:14px}.stats{grid-template-columns:1fr 1fr}.top{align-items:flex-start;flex-direction:column}.card{padding:15px}}
</style></head>
<body><main class="wrap">
<header class="top"><div class="brand"><div class="logo">S</div><div><h1 style="font-size:22px;margin:0">Sincho Dropship</h1><div class="muted">BodyWorld ürün içe aktarıcı · eBay.it taslakları</div></div></div><span class="pill">CSV hazır</span></header>
<section class="card"><h2 style="margin:0 0 5px;font-size:18px">Kaynak kategori</h2><p class="muted" style="margin:0 0 16px">Ürünleri içe aktar, bilgileri düzenle ve CSV indir. Otomatik ilan yayınlanmaz.</p><div class="hrow"><div class="grow"><label>Kaynak URL</label><input id="source" value="https://www.bodyworld.eu/it/it/proteine-c2"></div><div style="align-self:end"><button id="scan">Siteyi tara</button></div></div><div id="status" class="status">Hazır. Tarayıcıların güvenlik politikası (CORS) harici sitelerin doğrudan okunmasını engelleyebilir. Bu durumda ürünleri CSV/manuel ekleme veya sunucu tarafı tarayıcı gerekir.</div><div class="actions"><button class="secondary" id="add">+ Ürün ekle</button><button class="secondary" id="paste">HTML kaynağını içe aktar</button><button id="export">CSV indir</button><button class="secondary" id="json">JSON yedeği</button><input type="file" id="htmlfile" accept=".html,.htm,.txt" hidden></div><p class="muted">İpucu: HTML kaynağını dosya olarak seçmek, tarayıcının izin verdiği ürün kartı verilerini çıkarmayı dener. Site erişimi veya ürün verileri garanti edilmez.</p></section>
<section class="card"><div class="stats"><div class="stat"><span class="muted">Toplam ürün</span><strong id="total">0</strong></div><div class="stat"><span class="muted">Fiyatı bulunan</span><strong id="priced">0</strong></div><div class="stat"><span class="muted">eBay başlığı hazır</span><strong id="titles">0</strong></div></div></section>
<section class="card"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><h2 style="font-size:18px;margin:0">Ürün kataloğu</h2><input id="search" placeholder="Ürünlerde ara…" style="max-width:280px"></div><div class="tablewrap" style="margin-top:14px"><table><thead><tr><th>Fotoğraf URL</th><th>Ürün adı</th><th>Kaynak fiyat (€)</th><th>Stok</th><th>Varyantlar</th><th>Kaynak URL</th><th>eBay.it başlık (80)</th><th>İtalyanca açıklama taslağı</th><th></th></tr></thead><tbody id="rows"></tbody></table></div><p id="empty" class="muted" style="padding:20px;text-align:center">Henüz ürün yok. “Ürün ekle” ile başlayabilir veya erişilebilir HTML kaynağını içe aktarabilirsin.</p></section>
<div class="footer">Veriler bu tarayıcıda saklanır. Kaynak fiyat/stok değişebilir; satıştan önce tedarikçide doğrula. Fotoğraf ve açıklamaların yeniden kullanım haklarını kontrol et.</div>
</main>
<script>
const $=s=>document.querySelector(s);let products=[];try{products=JSON.parse(localStorage.getItem('sincho-bodyworld-products')||'[]')}catch{}
const save=()=>{localStorage.setItem('sincho-bodyworld-products',JSON.stringify(products));render()};const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ebayTitle(p){let s=(p.ebayTitle||p.name||'').trim();return [...s].slice(0,80).join('')}
function render(){let q=$('#search').value.toLowerCase();let shown=products.map((p,i)=>({...p,_i:i})).filter(p=>[p.name,p.description,p.url].join(' ').toLowerCase().includes(q));$('#rows').innerHTML=shown.map(p=>\`<tr><td><input data-i="\${p._i}" data-k="image" value="\${esc(p.image)}" placeholder="https://…"><div style="margin-top:6px">\${p.image?\`<img class="thumb" src="\${esc(p.image)}" onerror="this.style.display='none'">\`:''}</div></td><td><input data-i="\${p._i}" data-k="name" value="\${esc(p.name)}" placeholder="Ürün adı"><textarea data-i="\${p._i}" data-k="description" placeholder="Kaynak açıklama">\${esc(p.description)}</textarea></td><td><input data-i="\${p._i}" data-k="price" value="\${esc(p.price)}" placeholder="Örn. 29,90"></td><td><input data-i="\${p._i}" data-k="stock" value="\${esc(p.stock)}" placeholder="Bilinmiyor"></td><td><input data-i="\${p._i}" data-k="variants" value="\${esc(p.variants)}" placeholder="Aroma / gramaj"></td><td><input data-i="\${p._i}" data-k="url" value="\${esc(p.url)}" placeholder="Ürün URL"></td><td><input data-i="\${p._i}" data-k="ebayTitle" maxlength="80" value="\${esc(ebayTitle(p))}" placeholder="İtalyanca başlık"><div class="muted">\${[...(p.ebayTitle||p.name||'')].length}/80</div></td><td><textarea data-i="\${p._i}" data-k="ebayDescription" placeholder="İtalyanca açıklama taslağı">\${esc(p.ebayDescription)}</textarea><button class="secondary small" data-generate="\${p._i}" style="margin-top:5px">Taslak oluştur</button></td><td><button class="danger" data-delete="\${p._i}">Sil</button></td></tr>\`).join('');$('#empty').style.display=shown.length?'none':'block';$('#total').textContent=products.length;$('#priced').textContent=products.filter(p=>String(p.price||'').trim()).length;$('#titles').textContent=products.filter(p=>String(p.ebayTitle||p.name||'').trim()).length;}
function addProduct(p={}){products.unshift({image:'',name:'',description:'',price:'',stock:'Bilinmiyor',variants:'',url:$('#source').value,ebayTitle:'',ebayDescription:'',...p});save()}
$('#add').onclick=()=>addProduct();$('#search').oninput=render;$('#rows').addEventListener('change',e=>{let el=e.target;if(el.dataset.i!==undefined&&el.dataset.k){products[+el.dataset.i][el.dataset.k]=el.value;if(el.dataset.k==='name'&&!products[+el.dataset.i].ebayTitle)products[+el.dataset.i].ebayTitle=[...el.value].slice(0,80).join('');save()}});$('#rows').addEventListener('click',e=>{if(e.target.dataset.delete!==undefined){products.splice(+e.target.dataset.delete,1);save()}if(e.target.dataset.generate!==undefined){let p=products[+e.target.dataset.generate];p.ebayTitle=[...(p.ebayTitle||p.name||'')].slice(0,80).join('');p.ebayDescription=\`Prodotto: \${p.name||'Da verificare'}\\n\\n\${p.description||'Descrizione da completare sulla base delle informazioni ufficiali del produttore.'}\\n\\nControllare formato, gusto, ingredienti, disponibilità e data di scadenza prima della pubblicazione. Immagini e dettagli soggetti a verifica.\\n\\nFonte: \${p.url||$('#source').value}\`;save()}});
function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}$('#export').onclick=()=>{let headers=['Nome prodotto','Descrizione originale','Prezzo EUR','Stock','Varianti','URL immagine','URL sorgente','Titolo eBay IT (max 80)','Descrizione eBay IT'];let lines=[headers,...products.map(p=>[p.name,p.description,p.price,p.stock,p.variants,p.image,p.url,ebayTitle(p),p.ebayDescription])].map(row=>row.map(csvCell).join(';'));let blob=new Blob(['\\ufeff'+lines.join('\\r\\n')],{type:'text/csv;charset=utf-8;'});download(blob,'sincho-bodyworld-products.csv')};$('#json').onclick=()=>download(new Blob([JSON.stringify(products,null,2)],{type:'application/json'}),'sincho-bodyworld-backup.json');function download(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$('#scan').onclick=async()=>{let url=$('#source').value.trim();$('#status').textContent='Sunucu üzerinden kaynak kontrol ediliyor…';$('#scan').disabled=true;try{let r=await fetch('/api/scrape?url='+encodeURIComponent(url));let data=await r.json();if(!r.ok)throw new Error(data.error||('HTTP '+r.status));if(!data.products?.length)throw new Error(data.message||'Kaynak sayfada tanınan ürün verisi bulunamadı.');let existing=new Set(products.map(p=>p.url));let added=0;for(const x of data.products){if(x.url&&existing.has(x.url))continue;addProduct({name:x.name||'',description:x.description||'',price:x.price??'',image:x.image||'',url:x.url||url,stock:x.stock||'Bilinmiyor',variants:(x.variants||[]).join(' | '),ebayTitle:[...(x.name||'')].slice(0,80).join('')});added++;}$('#status').textContent=\`Tarama tamamlandı. \${added} yeni ürün eklendi. Kaynakta bulunmayan stok/varyant bilgileri tahmin edilmedi.\`}catch(e){$('#status').textContent='Tarama başarısız: '+e.message+' Kaynak bot koruması uyguluyor veya yapılandırılmış ürün verisi sunmuyor olabilir. Ürün uydurulmadı.'}finally{$('#scan').disabled=false}};
$('#paste').onclick=()=>$('#htmlfile').click();$('#htmlfile').onchange=async e=>{let f=e.target.files[0];if(!f)return;let html=await f.text();parseHTML(html,$('#source').value);$('#status').textContent='HTML dosyası işlendi. '+products.length+' kayıt mevcut; çıkarılan alanları kontrol et.';e.target.value=''};
function parseHTML(html,base){let doc=new DOMParser().parseFromString(html,'text/html');let nodes=[...doc.querySelectorAll('[itemscope][itemtype*="Product"], .product-item, .product-card, li.product, article.product, [data-product-id]')];let seen=new Set();let added=0;for(let n of nodes){let name=n.querySelector('[itemprop="name"],h2,h3,.product-name,.product-title,a[title]')?.textContent?.trim()||n.querySelector('a[title]')?.getAttribute('title')||'';if(!name||seen.has(name))continue;seen.add(name);let image=n.querySelector('img')?.getAttribute('src')||n.querySelector('img')?.getAttribute('data-src')||n.querySelector('[itemprop="image"]')?.getAttribute('content')||'';let price=n.querySelector('[itemprop="price"]')?.getAttribute('content')||n.querySelector('.price,.product-price,[data-price]')?.textContent?.trim()||'';let desc=n.querySelector('[itemprop="description"],.description,.product-description')?.textContent?.trim()||'';let a=n.querySelector('a[href]');let href='';try{href=a?new URL(a.getAttribute('href'),base).href:base;image=image?new URL(image,base).href:''}catch{}addProduct({name,image,price:price.replace(/[^\\d,.]/g,'').trim(),description:desc,url:href,stock:'Bilinmiyor'});added++}if(!added)$('#status').textContent='HTML içinde tanınan ürün kartı bulunamadı. Site farklı bir yapı kullanıyor olabilir; boş veya tahmini ürün oluşturulmadı.'}
render();
</script></body></html>
`;
const ALLOWED_HOST = "www.bodyworld.eu";
const CORS_HEADERS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const json = (obj, status=200) => new Response(JSON.stringify(obj), {status, headers:{"content-type":"application/json; charset=utf-8", ...CORS_HEADERS}});
function absUrl(value, base) { try { return new URL(value, base).href; } catch { return ""; } }
function cleanText(v) { return typeof v === "string" ? v.replace(/<[^>]*>/g," ").replace(/\\s+/g," ").trim() : ""; }
function productFrom(obj, pageUrl) {
  if (!obj || typeof obj !== "object") return null;
  const types = Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]];
  if (!types.some(t => String(t||"").toLowerCase() === "product")) return null;
  const offersRaw = obj.offers;
  const offers = Array.isArray(offersRaw) ? offersRaw : (offersRaw ? [offersRaw] : []);
  const offer = offers.find(x => x && typeof x === "object") || {};
  const price = offer.price ?? offer.lowPrice ?? offer.priceSpecification?.price ?? "";
  let availability = offer.availability || "";
  availability = String(availability).split("/").pop().replace(/([A-Z])/g," $1").trim();
  const imgs = Array.isArray(obj.image) ? obj.image : [obj.image];
  const variants = [];
  for (const x of (Array.isArray(obj.hasVariant) ? obj.hasVariant : obj.hasVariant ? [obj.hasVariant] : [])) {
    if (x && typeof x === "object") variants.push(cleanText(x.name));
  }
  const url = absUrl(obj.url || obj['@id'] || pageUrl, pageUrl);
  return {name:cleanText(obj.name), description:cleanText(obj.description), price:price === "" ? "" : String(price), image:absUrl(imgs.find(Boolean), pageUrl), url, stock:availability || "Bilinmiyor", variants:variants.filter(Boolean)};
}
function walk(obj, pageUrl, out) {
  if (!obj || typeof obj !== "object") return;
  const p = productFrom(obj, pageUrl);
  if (p && p.name && p.url) out.push(p);
  if (Array.isArray(obj)) { for (const x of obj) walk(x,pageUrl,out); return; }
  for (const [k,v] of Object.entries(obj)) if (k !== "offers" || Array.isArray(v)) walk(v,pageUrl,out);
}
function extractProducts(html, pageUrl) {
  const out=[]; const re=/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi; let m;
  while ((m=re.exec(html))) { try { walk(JSON.parse(m[1].trim()),pageUrl,out); } catch {} }
  const seen=new Set(); return out.filter(p=>{const k=p.url; if(seen.has(k)) return false; seen.add(k); return true;});
}
export default {
 async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null,{headers:CORS_HEADERS});
  if (url.pathname === "/api/health") return json({ok:true,service:"Sincho BodyWorld importer",mode:"server-side-fetch"});
  if (url.pathname === "/api/scrape") {
   const source = url.searchParams.get("url") || "https://www.bodyworld.eu/it/it/proteine-c2";
   let target; try { target=new URL(source); } catch { return json({error:"Geçersiz URL"},400); }
   if (target.protocol !== "https:" || target.hostname !== ALLOWED_HOST || !target.pathname.startsWith("/it/it/")) return json({error:"Güvenlik nedeniyle yalnızca BodyWorld İtalya sayfaları taranabilir."},400);
   try {
    const res=await fetch(target.href,{headers:{"User-Agent":"Mozilla/5.0 (compatible; SinchoProductImporter/1.0)","Accept":"text/html,application/xhtml+xml"},redirect:"follow"});
    if (!res.ok) return json({error:`BodyWorld HTTP ${res.status} yanıtı verdi. Site erişimi engelliyor veya geçici olarak kullanılamıyor olabilir.`},502);
    const finalUrl=new URL(res.url); if(finalUrl.hostname!==ALLOWED_HOST) return json({error:"Kaynak beklenmeyen bir adrese yönlendirildi; istek durduruldu."},502);
    const html=await res.text();
    if (/captcha|access denied|verify you are human|cloudflare ray id/i.test(html) && !html.includes('"@type":"Product"')) return json({error:"BodyWorld bot doğrulaması veya erişim koruması gösterdi. Bu koruma aşılmadı; izin verilen bir feed/API ya da tedarikçi izni gerekiyor."},502);
    const products=extractProducts(html,target.href);
    return json({products, count:products.length, source:target.href, message:products.length?"":"Bu sayfada okunabilir Product yapılandırılmış verisi bulunamadı. Otomatik olarak ürün tahmin edilmedi."});
   } catch(e) { return json({error:"BodyWorld sayfasına sunucu bağlantısı başarısız: "+String(e?.message||e)},502); }
  }
  if (url.pathname === "/" || url.pathname === "/index.html") return new Response(APP_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
  return new Response("Not found",{status:404});
 }
};
