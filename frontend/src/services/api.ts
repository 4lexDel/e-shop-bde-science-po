const API=import.meta.env.VITE_API_URL||'http://localhost:4242/api';
async function req(path:string,options?:RequestInit){const r=await fetch(`${API}${path}`,options);if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||'Erreur serveur');return r;}
export async function getProducts(){return (await req('/products')).json()}
export async function checkout(body:unknown){return (await req('/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json()}
export async function getOrder(sessionId:string){return (await req(`/orders/session/${encodeURIComponent(sessionId)}`)).json()}
export function invoiceUrl(sessionId:string){return `${API}/orders/session/${encodeURIComponent(sessionId)}/invoice`}
export async function adminProducts(token:string){return (await req('/products/admin',{headers:{'x-admin-token':token}})).json()}
export async function saveProduct(token:string,id:string|undefined,data:unknown){return (await req(id?`/products/admin/${id}`:'/products/admin',{method:id?'PUT':'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(data)})).json()}
export async function deleteProduct(token:string,id:string){await req(`/products/admin/${id}`,{method:'DELETE',headers:{'x-admin-token':token}})}

export async function downloadSalesCsv(token:string){const r=await fetch(`${API}/orders/admin/sales.csv`,{headers:{'x-admin-token':token}});if(!r.ok)throw new Error('Export impossible');const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sales.csv';a.click();URL.revokeObjectURL(url)}
