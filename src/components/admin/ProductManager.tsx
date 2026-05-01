import { useEffect, useState } from 'react';
import { ProductCategoryAssignment } from './ProductCategoryAssignment';
import { ProductAttributeValues } from './ProductAttributeValues';

interface Product {
  id:number; sku:string; name:string; slug:string; base_price:number; status:string;
}

interface ProductDetail extends Product {
  short_description?: string|null; long_description?: string|null; currency?: string; primary_category_id?: number|null;
}

const emptyForm: Partial<ProductDetail> = { sku:'', name:'', base_price:0, status:'draft', currency:'INR' };

export const ProductManager = () => {
  const [items,setItems]=useState<Product[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [form,setForm]=useState<Partial<ProductDetail>>(emptyForm);
  const [editingId,setEditingId]=useState<number|null>(null);
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);

  const load = async ()=>{
    setLoading(true); setError(null);
    try {
      const res = await fetch('/backend/api/products/list.php');
      const j = await res.json();
      if(j.success) setItems(j.data.items || j.data || []); else setError(j.error||'Failed');
    } catch(e:any){ setError(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const edit = async (id:number)=>{
    setEditingId(id); setShowForm(true); setSaving(false);
    try {
      const res = await fetch('/backend/api/products/get.php?id='+id);
      const j = await res.json();
      if(j.success) setForm(j.data); else setForm(emptyForm);
    }catch(e){/* ignore */}
  };

  const submit = async ()=>{
    setSaving(true); setError(null);
    try {
      if(editingId){
        const res = await fetch('/backend/api/products/update.php?id='+editingId,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
        const j=await res.json(); if(!j.success) throw new Error(j.error||'Update failed');
      } else {
        const res = await fetch('/backend/api/products/create.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
        const j=await res.json(); if(!j.success) throw new Error(j.error||'Create failed');
      }
      setForm(emptyForm); setEditingId(null); setShowForm(false); load();
    }catch(e:any){ setError(e.message); }
    setSaving(false);
  };

  const del = async (id:number)=>{
    if(!confirm('Delete product '+id+'?')) return;
    await fetch('/backend/api/products/delete.php?id='+id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <button onClick={()=>{ setShowForm(s=>!s); setEditingId(null); setForm(emptyForm); }} className="text-sm px-3 py-1 bg-[#101c34] text-white rounded">{showForm? 'Close':'New Product'}</button>
      </div>
      {showForm && (
        <div className="border rounded p-4 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Name</label>
              <input className="w-full border rounded px-2 py-1" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">SKU</label>
              <input className="w-full border rounded px-2 py-1" value={form.sku||''} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Base Price</label>
              <input type="number" className="w-full border rounded px-2 py-1" value={form.base_price as number||0} onChange={e=>setForm(f=>({...f,base_price:parseFloat(e.target.value)}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Currency</label>
              <input className="w-full border rounded px-2 py-1" value={form.currency||'INR'} onChange={e=>setForm(f=>({...f,currency:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium">Status</label>
              <select className="w-full border rounded px-2 py-1" value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium">Short Description</label>
            <textarea className="w-full border rounded px-2 py-1" value={form.short_description||''} onChange={e=>setForm(f=>({...f,short_description:e.target.value}))} />
          </div>
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <button disabled={saving} onClick={submit} className="px-4 py-1 bg-green-600 text-white rounded text-sm">{saving? 'Saving...':'Save'}</button>
          {editingId && (
            <div className="grid grid-cols-2 gap-8 pt-4 border-t">
              <ProductCategoryAssignment productId={editingId} />
              <ProductAttributeValues productId={editingId} />
            </div>
          )}
        </div>
      )}
      <div className="border rounded bg-white overflow-auto">
        {loading && <div className="p-4 text-sm">Loading...</div>}
        {!loading && (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">SKU</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Status</th>
                <th className="p-2"/>
              </tr>
            </thead>
            <tbody>
              {items.map(p=> (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.sku}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.base_price}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2 space-x-2 text-right">
                    <button onClick={()=>edit(p.id)} className="text-blue-600 text-xs">Edit</button>
                    <button onClick={()=>del(p.id)} className="text-red-600 text-xs">Del</button>
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
