import { useEffect, useState } from 'react';

interface Category { id:number; parent_id:number|null; name:string; slug:string; description?:string|null; sort_order:number; }

const emptyCat: Partial<Category> = { parent_id:null, name:'', description:'', sort_order:0 };

function buildTree(list:Category[]): (Category & {children:Category[]})[] {
  const map:Record<number,(Category & {children:Category[]})>={};
  const roots: (Category & {children:Category[]})[] = [];
  list.forEach(c=> map[c.id] = {...c, children:[]});
  list.forEach(c=> { if(c.parent_id && map[c.parent_id]) map[c.parent_id].children.push(map[c.id]); else if(!c.parent_id) roots.push(map[c.id]); });
  return roots.sort((a,b)=> a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export const CategoryManager = () => {
  const [cats,setCats]=useState<Category[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [form,setForm]=useState<Partial<Category>>(emptyCat);
  const [editingId,setEditingId]=useState<number|null>(null);
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);

  const load=async()=>{
    setLoading(true); setError(null);
    try { const res = await fetch('/backend/api/categories/list.php'); const j=await res.json(); if(j.success) setCats(j.data||[]); else setError(j.error||'Failed'); }catch(e:any){ setError(e.message);} setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const edit=(c:Category)=>{ setEditingId(c.id); setForm(c); setShowForm(true); };
  const submit=async()=>{
    setSaving(true); setError(null);
    try {
      if(editingId){
        const res=await fetch('/backend/api/categories/update.php?id='+editingId,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await res.json(); if(!j.success) throw new Error(j.error||'Update failed');
      } else {
        const res=await fetch('/backend/api/categories/create.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await res.json(); if(!j.success) throw new Error(j.error||'Create failed');
      }
      setForm(emptyCat); setEditingId(null); setShowForm(false); load();
    }catch(e:any){ setError(e.message);} setSaving(false);
  };
  const del=async(id:number)=>{ if(!confirm('Delete category?')) return; await fetch('/backend/api/categories/delete.php?id='+id); load(); };

  const tree = buildTree(cats);

  const renderNode = (node:Category & {children:Category[]}, depth=0)=> (
    <div key={node.id} style={{marginLeft: depth*12}} className="py-1 flex items-center justify-between group">
      <div>
        <span className="font-medium text-sm">{node.name}</span>
        {node.children.length>0 && <span className="text-xs text-gray-500 ml-2">({node.children.length})</span>}
      </div>
      <div className="space-x-2 opacity-0 group-hover:opacity-100 transition">
        <button onClick={()=>edit(node)} className="text-blue-600 text-xs">Edit</button>
        <button onClick={()=>del(node.id)} className="text-red-600 text-xs">Del</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button onClick={()=>{ setShowForm(s=>!s); setEditingId(null); setForm(emptyCat); }} className="text-sm px-3 py-1 bg-[#101c34] text-white rounded">{showForm? 'Close':'New Category'}</button>
      </div>
      {showForm && (
        <div className="border rounded p-4 space-y-3 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Name</label>
              <input className="w-full border rounded px-2 py-1" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Parent</label>
              <select className="w-full border rounded px-2 py-1" value={form.parent_id??''} onChange={e=>setForm(f=>({...f,parent_id:e.target.value? Number(e.target.value): null}))}>
                <option value="">(root)</option>
                {cats.filter(c=>!c.parent_id).map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Sort Order</label>
              <input type="number" className="w-full border rounded px-2 py-1" value={form.sort_order||0} onChange={e=>setForm(f=>({...f,sort_order:parseInt(e.target.value)||0}))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Description</label>
            <textarea className="w-full border rounded px-2 py-1" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          </div>
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <button disabled={saving} onClick={submit} className="px-4 py-1 bg-green-600 text-white rounded text-sm">{saving? 'Saving...':'Save'}</button>
        </div>
      )}
      <div className="border rounded bg-white p-3 max-h-96 overflow-auto text-sm">
        {loading && <div>Loading...</div>}
        {!loading && tree.map(r => (
          <div key={r.id}>
            {renderNode(r)}
            {r.children.map(ch => renderNode(ch, 1))}
          </div>
        ))}
      </div>
    </div>
  );
};
