/* Shared pure data model: browser + Node tests. No fuzzy identity matching. */
(function (root) {
  'use strict';
  const norm = s => String(s ?? '').normalize('NFKC').toLowerCase().trim();
  const words = s => String(s ?? '').replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
  const numeric = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
  const wiki = name => 'https://wynncraft.wiki.gg/wiki/' + encodeURIComponent(name.replaceAll(' ', '_'));
  const priceFields = ['average_price', 'average_mid_80_percent_price', 'lowest_price', 'highest_price', 'unidentified_average_mid_80_percent_price'];
  function acquisition(item, overrides) {
    if (!item) return {kind: 'Unknown', text: 'No matching item record; acquisition unknown.'};
    const name = item.displayName, meta = item.dropMeta;
    if (overrides[name]) return overrides[name];
    if (/ Wynnter Sweater$/.test(name)) return {
      kind: 'Seasonal', text: 'Souvenir Sweater Merchant during Festival of the Blizzard. Available colours vary by year.',
      url: wiki('Wynnter Sweater')};
    if (meta?.name) {
      const types = Array.isArray(meta.type) ? meta.type : [meta.type];
      const type = types.map(words).join(' / ');
      const kind = types.includes('event') ? 'Seasonal' : types.some(t => /merchant/i.test(t)) ? 'Merchant' :
        types.includes('altar') ? 'Boss altar' : types.includes('miniboss') ? 'Mob' : words(meta.type) || 'Special';
      let text = `${meta.name} — ${type}`;
      if (meta.coordinates) text += ` · ${meta.coordinates.join(', ')}`;
      if (meta.event) text += ` · ${words(meta.event)} festival`;
      return {kind, text, coordinates: meta.coordinates || null};
    }
    if (item.type === 'material') return {kind: 'Gathering', text: `${words(item.subType)} material. Exact node location not supplied.`};
    if (item.dropRestriction === 'normal') return {kind: 'Normal drops', text: 'Random mob / loot-chest drop near the item level.'};
    if (item.dropRestriction === 'lootchest') return {kind: 'Loot chests', text: 'Loot-chest drop near the item level.'};
    if (item.dropRestriction === 'dungeon') return {kind: 'Dungeon', text: 'Dungeon source; exact dungeon not supplied.'};
    if (item.sets?.includes('Corrupted')) return {kind: 'World event', text: 'World-event reward; exact event not resolved.'};
    return {kind: 'Unknown', text: item.dropRestriction === 'never' ?
      'Excluded from ordinary drops. Special / legacy acquisition not supplied.' : 'Acquisition not supplied by the item database.'};
  }
  function compatible(market, item) {
    const type = norm(market.itemType || market.item_type);
    const map = {gearitem: ['weapon', 'armour', 'accessory', 'tome', 'charm'], gear: ['weapon', 'armour', 'accessory'],
      ingredientitem: ['ingredient'], ingredient: ['ingredient'], materialitem: ['material'], material: ['material'],
      gatheringtoolitem: ['tool']};
    if (map[type] && !map[type].includes(item.type)) return false;
    if (item.type === 'ingredient' && market.tier != null && item.tier?.startsWith('TIER_'))
      return Number(item.tier.substring(5)) === market.tier;
    return true;
  }
  function buildRows(snapshot) {
    const index = new Map(), matched = new Set(), rows = [];
    snapshot.items.forEach((item, i) => {
      for (const name of new Set([norm(item.displayName), norm(item.internalName)])) {
        if (!index.has(name)) index.set(name, []);
        index.get(name).push(i);
      }
    });
    function make(m, item, id, variants) {
      const rawLevel = item?.requirements?.level;
      const level = numeric(rawLevel);
      const basis = !item ? 'Unknown' : item.type === 'ingredient' ? 'Crafting' :
        ['material', 'tool'].includes(item.type) ? 'Gathering' : 'Combat';
      const source = acquisition(item, snapshot.overrides || {});
      const row = {id, name: item?.displayName || m.name, internalName: item?.internalName || null,
        type: item?.subType || item?.type || words(m.itemType || m.item_type || 'Unknown'),
        category: item?.type || 'Unknown', rarity: item?.tier || 'Unknown', tier: m.tier ?? null,
        level, basis, source, restriction: item?.restriction || 'Not reported',
        quest: item?.requirements?.quest || null, variants, marketName: m.name || null,
        observations: numeric(m.total_count), dailyListings: numeric(m.average_total_count),
        unidentifiedObservations: numeric(m.unidentified_count), url: wiki(item?.displayName || m.name)};
      priceFields.forEach(field => row[field] = numeric(m[field]));
      return row;
    }
    snapshot.market.forEach((market, i) => {
      const candidates = (index.get(norm(market.name)) || []).filter(j => compatible(market, snapshot.items[j]));
      if (!candidates.length) rows.push(make(market, null, `market-${i}`, 0));
      for (const j of candidates) {
        matched.add(j);
        rows.push(make(market, snapshot.items[j], `market-${i}-${j}`, candidates.length));
      }
    });
    snapshot.items.forEach((item, i) => {
      if (!matched.has(i)) rows.push(make({}, item, `item-${i}`, 1));
    });
    return rows;
  }
  function select(rows, f) {
    const needle = norm(f.query);
    const selected = rows.filter(r => {
      if (needle && !norm(`${r.name} ${r.type} ${r.source.text} ${r.quest || ''}`).includes(needle)) return false;
      if (f.basis && f.basis !== 'All' && r.basis !== f.basis) return false;
      if (r.level == null ? !f.unknown : ((f.min !== '' && r.level < +f.min) || (f.max !== '' && r.level > +f.max))) return false;
      if (f.category && r.category !== f.category) return false;
      if (f.rarity && r.rarity !== f.rarity) return false;
      if (f.source && r.source.kind !== f.source) return false;
      if (f.trade === 'tradable' && !['none', 'Not reported'].includes(r.restriction)) return false;
      if (f.trade === 'restricted' && ['none', 'Not reported'].includes(r.restriction)) return false;
      if (f.priced && r[f.metric] == null) return false;
      if (+f.observations > 0 && (r.observations == null || r.observations < +f.observations)) return false;
      return true;
    });
    const field = f.sort === 'price' ? f.metric : f.sort;
    const sign = f.direction === 'asc' ? 1 : -1;
    return selected.sort((a, b) => {
      const x = a[field], y = b[field];
      if (x == null || y == null) return x == null && y == null ? a.name.localeCompare(b.name) : x == null ? 1 : -1;
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * sign || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
    });
  }
  function csv(rows, metric) {
    const fields = ['name', 'level', 'basis', 'type', 'rarity', metric, 'lowest_price', 'highest_price', 'observations', 'dailyListings', 'restriction', 'quest'];
    const quote = value => '"' + String(value ?? '').replace(/^[=+@\-]/, "'$&").replaceAll('"', '""') + '"';
    return [fields.concat(['acquisition', 'source_url']).map(quote).join(','), ...rows.map(r =>
      [...fields.map(f => r[f]), r.source.text, r.source.url || r.url].map(quote).join(','))].join('\r\n');
  }
  const api = {buildRows, select, csv, numeric, acquisition, priceFields};
  if (typeof module !== 'undefined') module.exports = api;
  root.MarketModel = api;
})(typeof window !== 'undefined' ? window : globalThis);
