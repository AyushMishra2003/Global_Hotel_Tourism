import { useEffect, useState, useCallback } from 'react';

export interface AuthState {
  loading: boolean;
  authenticated: boolean;
  email?: string;
  role?: string;
  error?: string;
}

export function useAuth(auto=true){
  const [state,setState] = useState<AuthState>({loading: !!auto, authenticated:false});

  const refresh = useCallback(async ()=>{
    setState(s=>({...s, loading:true}));
    try{
      const res = await fetch('/backend/api/auth/whoami.php', { credentials:'include' });
      const json = await res.json();
      const data = json.data || json; // support envelope
      setState({
        loading:false,
        authenticated: !!data.authenticated,
        email:data.email,
        role:data.role
      });
    }catch(e:any){
      setState({loading:false, authenticated:false, error:e?.message});
    }
  },[]);

  useEffect(()=>{ if(auto) refresh(); },[auto,refresh]);

  return { ...state, refresh };
}
