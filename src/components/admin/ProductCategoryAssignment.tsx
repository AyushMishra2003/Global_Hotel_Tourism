import { useEffect, useState } from 'react';

interface Category { id:number; name:string; parent_id:number|null; slug:string; }
interface ProdCat { category_id:number; name:string; slug:string; parent_id:number|null; is_primary:number; }

export const ProductCategoryAssignment = ({ productId }:{productId:number}) => {
  const [allCats,setAllCats]=useState<Category[]>([]);
  const [assigned,setAssigned]=useState<ProdCat[]>([]);
  const [loading,setLoading]=useState(false);
  const [catId,setCatId]=useState('');
  const [isPrimary,setIsPrimary]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load = async ()=>{
    setLoading(true); setError(null);
    try {
      const [catsRes, assignedRes] = await Promise.all([
        fetch('/backend/api/categories/list.php').then(r=>r.json()),
        fetch('/backend/api/products/categories/list.php?product_id='+productId).then(r=>r.json())
      ]);
      if(catsRes.success) setAllCats(catsRes.data||[]); else setError(catsRes.error||'Failed cats');
      if(assignedRes.success) setAssigned(assignedRes.data||[]); else setError(assignedRes.error||'Failed assigned');
    }catch(e:any){ setError(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[productId]);

  const assign = async ()=>{
    if(!catId) return;
    const res = await fetch('/backend/api/products/categories/assign.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:productId,category_id:Number(catId),is_primary:isPrimary?1:0})});
    await res.json(); setCatId(''); setIsPrimary(false); load();
  };
  const removeCat = async (cid:number)=>{
    await fetch(`/backend/api/products/categories/remove.php?product_id=${productId}&category_id=${cid}`);
    load();
  };
  const setPrimary = async (cid:number)=>{
    await fetch('/backend/api/products/categories/set_primary.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:productId,category_id:cid})});
    load();
  };

  const available = allCats.filter(c => !assigned.find(a=>a.category_id===c.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Categories</h3>
        <button onClick={load} className="text-xs text-blue-600">Refresh</button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <div className="flex space-x-2 items-center text-xs">
        <select value={catId} onChange={e=>setCatId(e.target.value)} className="border rounded px-2 py-1 text-xs">
          <option value="">Select category</option>
          {available.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center space-x-1"><input type="checkbox" checked={isPrimary} onChange={e=>setIsPrimary(e.target.checked)} /><span>Primary</span></label>
        <button onClick={assign} disabled={!catId} className="bg-[#101c34] text-white px-2 py-1 rounded disabled:opacity-40">Add</button>
      </div>
      <div className="text-xs border rounded bg-white divide-y">
        {loading && <div className="p-2">Loading...</div>}
        {!loading && assigned.length===0 && <div className="p-2 text-gray-500">No categories assigned</div>}
        {!loading && assigned.map(c => (
          <div key={c.category_id} className="p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{c.name}</span>
              {c.is_primary ? <span className="text-[10px] px-1 py-0.5 bg-green-100 text-green-700 rounded">PRIMARY</span> : <button onClick={()=>setPrimary(c.category_id)} className="text-[10px] text-blue-600 underline">make primary</button>}
            </div>
            <button onClick={()=>removeCat(c.category_id)} className="text-red-600">x</button>
          </div>
        ))}
      </div>
    </div>
  );
};
