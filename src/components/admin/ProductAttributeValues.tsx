import { useEffect, useState } from 'react';

interface Attribute { id:number; code:string; label:string; data_type:string; }
interface ValueRow { attribute_id:number; code:string; label:string; data_type:string; value_text?:string|null; value_number?:number|null; value_boolean?:number|null; value_json?:string|null; }

export const ProductAttributeValues = ({ productId }:{productId:number}) => {
  const [attrs,setAttrs]=useState<Attribute[]>([]);
  const [values,setValues]=useState<ValueRow[]>([]);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState<number|null>(null);
  const [error,setError]=useState<string|null>(null);

  const load = async ()=>{
    setLoading(true); setError(null);
    try {
      const [aRes,vRes] = await Promise.all([
        fetch('/backend/api/attributes/list.php').then(r=>r.json()),
        fetch('/backend/api/products/attributes/list.php?product_id='+productId).then(r=>r.json())
      ]);
      if(aRes.success) setAttrs(aRes.data||[]); else setError(aRes.error||'Attr load fail');
      if(vRes.success) setValues(vRes.data||[]); else setError(vRes.error||'Val load fail');
    }catch(e:any){ setError(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[productId]);

  const currentValue = (attr:Attribute) => values.find(v=>v.attribute_id===attr.id);
  const displayValue = (v?:ValueRow) => {
    if(!v) return '';
    if(v.value_text!==null && v.value_text!==undefined) return v.value_text;
    if(v.value_number!==null && v.value_number!==undefined) return String(v.value_number);
    if(v.value_boolean!==null && v.value_boolean!==undefined) return v.value_boolean? 'true':'false';
    if(v.value_json) return v.value_json;
    return '';
  };

  const setLocalValue = (attr:Attribute, raw:string) => {
    setValues(vs => {
      const existing = vs.find(v=>v.attribute_id===attr.id);
      if(existing){ return vs.map(v=> v.attribute_id===attr.id ? {...v, value_text: raw, value_number:null, value_boolean:null, value_json:null}: v); }
      return [...vs, {attribute_id:attr.id, code:attr.code, label:attr.label, data_type:attr.data_type, value_text:raw}];
    });
  };

  const saveValue = async (attr:Attribute) => {
    const val = displayValue(currentValue(attr));
    setSaving(attr.id); setError(null);
    try {
      const res = await fetch('/backend/api/attributes/assign_value.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:productId,attribute_id:attr.id,value: coerce(attr,val) })});
      const j = await res.json(); if(!j.success) throw new Error(j.error||'Save failed');
      load();
    }catch(e:any){ setError(e.message);} setSaving(null);
  };
  const removeValue = async (attr:Attribute) => {
    await fetch(`/backend/api/attributes/remove_value.php?product_id=${productId}&attribute_id=${attr.id}`);
    load();
  };

  const coerce = (attr:Attribute, val:string) => {
    switch(attr.data_type){
      case 'number': return parseFloat(val);
      case 'boolean': return val==='true' || val==='1' ? 1 : 0;
      case 'json': try { return JSON.parse(val); } catch { return val; }
      default: return val;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Attributes</h3>
        <button onClick={load} className="text-xs text-blue-600">Refresh</button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      {loading && <div className="text-xs">Loading...</div>}
      {!loading && (
        <div className="space-y-2 text-xs">
          {attrs.map(a=> {
            const v = currentValue(a);
            return (
              <div key={a.id} className="border rounded p-2 bg-white flex items-center space-x-2">
                <div className="w-32 font-medium truncate" title={a.label}>{a.label}</div>
                {a.data_type==='boolean' ? (
                  <select value={displayValue(v)||''} onChange={e=>setLocalValue(a,e.target.value)} className="border rounded px-2 py-1">
                    <option value="">(none)</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : a.data_type==='json' ? (
                  <input value={displayValue(v)} onChange={e=>setLocalValue(a,e.target.value)} placeholder='{"key":"val"}' className="flex-1 border rounded px-2 py-1" />
                ) : (
                  <input value={displayValue(v)} onChange={e=>setLocalValue(a,e.target.value)} className="flex-1 border rounded px-2 py-1" />
                )}
                <button disabled={saving===a.id} onClick={()=>saveValue(a)} className="px-2 py-1 bg-green-600 text-white rounded">Save</button>
                {v && <button onClick={()=>removeValue(a)} className="px-2 py-1 bg-red-600 text-white rounded">X</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
