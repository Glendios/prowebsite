/* The complete snapshot stays in memory; only the selected page is rendered. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), model = window.MarketModel;
  const snapshot = window.MARKET_SNAPSHOT;
  if (!snapshot) { $('dates').textContent = 'Price snapshot could not load. Reload this page.'; return; }
  const rows = model.buildRows(snapshot), number = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});
  const ids = ['query','min','max','basis','metric','category','rarity','source','trade','observations','priced','unknown'];
  let page = 1, filtered = [];
  const initial = {query:'', min:'1', max:'40', basis:'Combat', metric:'average_price', category:'', rarity:'', source:'', trade:'', observations:'0', priced:false, unknown:false, sort:'price:desc'};
  for (const [id, field] of [['category','category'],['rarity','rarity'],['source','source']]) {
    const values = [...new Set(rows.map(r => field === 'source' ? r.source.kind : r[field]))].sort();
    values.forEach(value => { const o = document.createElement('option'); o.value = value; o.textContent = value.replaceAll('_',' '); $(id).append(o); });
  }
  function apply(values) { for (const [id, value] of Object.entries(values)) if ($(id)) $(id).type === 'checkbox' ? $(id).checked = !!value : $(id).value = value; }
  const params = new URLSearchParams(location.hash.slice(1));
  const restored = {...initial};
  for (const [key, value] of params) if (key in initial) restored[key] = typeof initial[key] === 'boolean' ? value === 'true' : value;
  if (/^(price|level|observations|name):(asc|desc)$/.test(restored.sort) && !$('sort').querySelector(`option[value="${restored.sort}"]`)) {
    const option=document.createElement('option');option.value=restored.sort;option.textContent=restored.sort.replace(':',': ');$('sort').append(option);
  }
  apply(restored);
  function state() {
    const values = Object.fromEntries(ids.map(id => [id, $(id).type === 'checkbox' ? $(id).checked : $(id).value]));
    const [sort,direction] = $('sort').value.split(':'); return {...values, sort, direction};
  }
  function el(tag, text, className) {const n = document.createElement(tag); if (text != null) n.textContent = text; if (className) n.className = className; return n;}
  function link(text, url, className) {const a=el('a',text,className); a.href=url; a.target='_blank'; a.rel='noopener'; return a;}
  const format = n => n == null ? '—' : number.format(n);
  function render() {
    const f = state();
    filtered = model.select(rows, f);
    const size = +$('page-size').value, pages = Math.max(1,Math.ceil(filtered.length / size));
    page = Math.min(page,pages);
    $('result-count').textContent = `${format(filtered.length)} matching items`;
    const priced = filtered.filter(r => r[f.metric] != null).length;
    $('coverage').textContent = `${format(priced)} with this price · ${format(filtered.length-priced)} without · ${format(rows.length-filtered.length)} excluded by filters`;
    const tbody = $('rows'); tbody.replaceChildren();
    for (const row of filtered.slice((page-1)*size,page*size)) {
      const tr=el('tr'); tr.dataset.id=row.id;
      const name=el('td'); name.append(link(row.name,row.url,'name'));
      const meta=el('span',null,'meta'); meta.append(el('span',row.rarity.replaceAll('_',' '),'rarity '+row.rarity),document.createTextNode(' · '+row.type));name.append(meta);
      if (row.tier != null) name.append(el('span','Market tier '+row.tier,'sub'));
      if(row.variants>1) name.append(el('span',`${row.variants} variants share this price · ${row.internalName}`,'warning'));
      const lvl=el('td',row.level ?? 'Unknown'); lvl.append(el('span',row.basis,'sub'));
      const price=el('td',null,'number');price.append(el('span',row[f.metric]==null?'No price':format(row[f.metric]),'price'+(row[f.metric]==null?' no-price':'')));
      if(row.lowest_price!=null || row.highest_price!=null)price.append(el('span',`${format(row.lowest_price)} – ${format(row.highest_price)}`,'sub'),el('span','Observed low – high','sub'));
      const observations=el('td',format(row.observations),'number');
      if(row.dailyListings!=null) observations.append(el('span',`${format(row.dailyListings)} / observed day`,'sub'));
      const source=el('td');source.append(el('span',row.source.kind,'acquisition-title'),el('span',row.source.text,'sub'));
      if(row.quest)source.append(el('span','Quest requirement: '+row.quest,'sub'));
      if(!['none','Not reported'].includes(row.restriction))source.append(el('span','Trade: '+row.restriction,'warning'));
      else if(row.restriction==='Not reported')source.append(el('span','Trade restriction not reported','sub'));
      if(row.source.url)source.append(link('Acquisition source ↗',row.source.url,'source-link'));
      else source.append(link('Item wiki lookup ↗',row.url,'source-link'));
      tr.append(name,lvl,price,observations,source);tbody.append(tr);
    }
    $('empty').hidden=filtered.length>0;
    $('page').textContent=`Page ${page} of ${pages} · ${filtered.length ? (page-1)*size+1 : 0}–${Math.min(page*size,filtered.length)} of ${format(filtered.length)}`;
    $('previous').disabled=page<=1;$('next').disabled=page>=pages;
    document.querySelectorAll('th[data-sort]').forEach(th=>{
      if(th.dataset.sort===f.sort){th.setAttribute('aria-sort',f.direction==='asc'?'ascending':'descending');th.querySelector('span').textContent=f.direction==='asc'?'↑':'↓';}
      else{th.removeAttribute('aria-sort');th.querySelector('span').textContent='↕';}
    });
    const hash=new URLSearchParams();for(const id of [...ids,'sort']){const value=$(id).type==='checkbox'?$(id).checked:$(id).value;if(value!==initial[id])hash.set(id,value);}
    try {history.replaceState(null,'',location.pathname+location.search+(hash.size?'#'+hash:''));}catch(_){}
  }
  for(const id of [...ids,'sort','page-size']) $(id).addEventListener('input',()=>{page=1;render();});
  document.querySelectorAll('th[data-sort]').forEach(th=>th.querySelector('button').addEventListener('click',()=>{
    const f=state(), key=th.dataset.sort;const direction=f.sort===key&&f.direction==='desc'?'asc':'desc';
    let val=key+':'+direction;if(!$('sort').querySelector(`option[value="${val}"]`)){const o=el('option',key+': '+direction);o.value=val;$('sort').append(o);} $('sort').value=val;page=1;render();
  }));
  $('low').addEventListener('click',()=>{apply({min:'1',max:'40',basis:'Combat',unknown:false,sort:'price:desc'});page=1;render();});
  $('all').addEventListener('click',()=>{apply({...initial,min:'',max:'',basis:'All',unknown:true});page=1;render();});
  $('reset').addEventListener('click',()=>{apply(initial);page=1;render();});
  $('previous').addEventListener('click',()=>{page--;render();});$('next').addEventListener('click',()=>{page++;render();});
  $('export').addEventListener('click',()=>{const blob=new Blob(['\uFEFF'+model.csv(filtered,state().metric)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download='wynncraft-market-'+snapshot.endDate+'.csv';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);});
  $('dates').textContent=`${snapshot.startDate} → ${snapshot.endDate} UTC\nCollected ${new Date(snapshot.collectedAt).toLocaleDateString()}`;
  $('dates').style.whiteSpace='pre-line';
  $('source-links').append(link('Wynnventory price API',snapshot.marketUrl),link('Official item database',snapshot.itemUrl),link('API v2 documentation','https://github.com/Wynnventory/WynnVentory_Web/blob/main/docs/API_V2.md'),document.createTextNode(`Snapshot source: ${snapshot.marketVersion}.`));
  render();
})();
