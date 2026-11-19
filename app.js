let orders=[];
async function load(){ const r=await fetch('/api/orders'); orders=await r.json(); render(); }
function render(){
  const q=document.getElementById('search').value.toLowerCase();
  const list=orders.filter(o=>(o.customer+o.phone).toLowerCase().includes(q));
  document.getElementById('total').textContent=orders.length;
  document.getElementById('income').textContent='KES '+orders.reduce((s,o)=>s+o.price,0).toLocaleString();
  document.getElementById('ready').textContent=orders.filter(o=>o.status==='Ready').length;
  document.getElementById('tbody').innerHTML=list.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.phone}</td><td>${o.service}</td><td>${o.kilos} kg</td><td>KES ${o.price}</td><td><select class="status" onchange="updateStatus(${o.id},this.value)">${['Received','Washing','Ironing','Ready','Delivered'].map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${o.date}</td><td><button class="del" onclick="del(${o.id})">Delete</button></td></tr>`).join('') || '<tr><td colspan="9">No orders yet. Add one above.</td></tr>';
}
async function updateStatus(id,status){ await fetch('/api/update?id='+id+'&status='+status,{method:'POST'}); load(); }
async function del(id){ if(confirm('Delete this order?')){ await fetch('/api/delete?id='+id,{method:'POST'}); load(); } }
document.getElementById('orderForm').addEventListener('submit', async e=>{
  e.preventDefault(); const fd=new FormData(e.target);
  await fetch('/api/orders',{method:'POST', body:new URLSearchParams(fd)}); e.target.reset(); load();
});
load();
