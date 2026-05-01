import { useEffect, useState } from 'react';

interface Attribute { id:number; code:string; label:string; data_type:string; filterable:number; searchable:number; }

const emptyAttr: Partial<Attribute> = { code:'', label:'', data_type:'string', filterable:1, searchable:1 };

export const AttributeManager = () => {
  const [attrs,setAttrs]=useState<Attribute[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [form,setForm]=useState<Partial<Attribute>>(emptyAttr);
  const [editingId,setEditingId]=useState<number|null>(null);
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);

  const load=async()=>{ setLoading(true); setError(null); try { const res=await fetch('/backend/api/attributes/list.php'); const j=await res.json(); if(j.success) setAttrs(j.data||[]); else setError(j.error||'Failed'); }catch(e:any){ setError(e.message);} setLoading(false); };
  useEffect(()=>{ load(); },[]);

  const edit=(a:Attribute)=>{ setEditingId(a.id); setForm(a); setShowForm(true); };
  const submit=async()=>{ setSaving(true); setError(null); try { if(editingId){ const res=await fetch('/backend/api/attributes/update.php?id='+editingId,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await res.json(); if(!j.success) throw new Error(j.error||'Update failed'); } else { const res=await fetch('/backend/api/attributes/create.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await res.json(); if(!j.success) throw new Error(j.error||'Create failed'); } setForm(emptyAttr); setEditingId(null); setShowForm(false); load(); }catch(e:any){ setError(e.message);} setSaving(false); };
  const del=async(id:number)=>{ if(!confirm('Delete attribute?')) return; await fetch('/backend/api/attributes/delete.php?id='+id); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Attributes</h2>
        <button onClick={()=>{ setShowForm(s=>!s); setEditingId(null); setForm(emptyAttr); }} className="text-sm px-3 py-1 bg-[#101c34] text-white rounded">{showForm? 'Close':'New Attribute'}</button>
      </div>
      {showForm && (
        <div className="border rounded p-4 space-y-3 bg-white">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium">Code</label>
              <input disabled={!!editingId} className="w-full border rounded px-2 py-1" value={form.code||''} onChange={e=>setForm(f=>({...f,code:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Label</label>
              <input className="w-full border rounded px-2 py-1" value={form.label||''} onChange={e=>setForm(f=>({...f,label:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Data Type</label>
              <select className="w-full border rounded px-2 py-1" value={form.data_type||'string'} onChange={e=>setForm(f=>({...f,data_type:e.target.value}))}>
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                <option value="json">json</option>
              </select>
            </div>
            <div className="col-span-3 flex space-x-4 text-xs">
              <label className="flex items-center space-x-1"><input type="checkbox" checked={!!form.filterable} onChange={e=>setForm(f=>({...f,filterable:e.target.checked?1:0}))}/><span>Filterable</span></label>
              <label className="flex items-center space-x-1"><input type="checkbox" checked={!!form.searchable} onChange={e=>setForm(f=>({...f,searchable:e.target.checked?1:0}))}/><span>Searchable</span></label>
            </div>
          </div>
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <button disabled={saving} onClick={submit} className="px-4 py-1 bg-green-600 text-white rounded text-sm">{saving? 'Saving...':'Save'}</button>
        </div>
      )}
      <div className="border rounded bg-white overflow-auto max-h-96">
        {loading && <div className="p-4 text-sm">Loading...</div>}
        {!loading && (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Label</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Filt</th>
                <th className="p-2 text-left">Search</th>
                <th className="p-2"/>
              </tr>
            </thead>
            <tbody>
              {attrs.map(a=> (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.code}</td>
                  <td className="p-2">{a.label}</td>
                  <td className="p-2">{a.data_type}</td>
                  <td className="p-2">{a.filterable? 'Y':'-'}</td>
                  <td className="p-2">{a.searchable? 'Y':'-'}</td>
                  <td className="p-2 space-x-2 text-right">
                    <button onClick={()=>edit(a)} className="text-blue-600 text-xs">Edit</button>
                    <button onClick={()=>del(a.id)} className="text-red-600 text-xs">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
