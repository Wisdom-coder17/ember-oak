const host=document.querySelector("#cart-content");
const money=n=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(n)||0);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function render(){
 try{
  const response=await fetch("menu.json");if(!response.ok)throw new Error("Could not load menu");
  const data=await response.json();const menu=JSON.parse(localStorage.getItem("emberOakMenu")||"null")||data.items;
  let cart=JSON.parse(localStorage.getItem("emberOakCart")||"[]");
  cart=cart.filter(row=>menu.some(item=>item.id===row.id&&item.available!==false));
  localStorage.setItem("emberOakCart",JSON.stringify(cart));
  const detailed=cart.map(row=>({item:menu.find(x=>x.id===row.id),quantity:row.quantity}));
  if(!detailed.length){host.innerHTML='<div class="empty-cart"><h2>Your cart is waiting.</h2><p>Add a dish from our menu to get started.</p><a class="action-btn" href="menu.html">Explore the menu</a></div>';return;}
  const subtotal=detailed.reduce((sum,row)=>sum+row.item.price*row.quantity,0);
  host.innerHTML=`<div class="cart-layout"><section class="cart-list">${detailed.map(({item,quantity})=>`<article class="cart-row"><img src="${esc(item.image)}" alt="${esc(item.name)}"><div><h3>${esc(item.name)}</h3><p>${money(item.price)} each</p><div class="cart-controls"><button data-change="-1" data-id="${esc(item.id)}" aria-label="Decrease quantity">−</button><span>${quantity}</span><button data-change="1" data-id="${esc(item.id)}" aria-label="Increase quantity">＋</button><button class="remove-btn" data-remove="${esc(item.id)}">Remove</button></div></div><strong class="cart-price">${money(item.price*quantity)}</strong></article>`).join("")}</section><aside class="summary-card"><h2>Order summary</h2><div class="summary-line"><span>Items (${detailed.reduce((s,r)=>s+r.quantity,0)})</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><div class="summary-line summary-total"><span>Subtotal</span><span>${money(subtotal)}</span></div><p class="muted" style="font-size:11px;margin:18px 0">This demo cart does not process payments or submit orders.</p><button class="action-btn" id="demo-checkout" style="width:100%">Proceed to checkout ↗</button><p class="notice" id="cart-notice" aria-live="polite"></p></aside></div>`;
  host.querySelectorAll("[data-change]").forEach(btn=>btn.addEventListener("click",()=>{const row=cart.find(x=>x.id===btn.dataset.id);row.quantity=Math.max(1,Math.min(20,row.quantity+Number(btn.dataset.change)));localStorage.setItem("emberOakCart",JSON.stringify(cart));render();}));
  host.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart=cart.filter(x=>x.id!==btn.dataset.remove);localStorage.setItem("emberOakCart",JSON.stringify(cart));render();}));
  document.querySelector("#demo-checkout").addEventListener("click",()=>{document.querySelector("#cart-notice").textContent="Checkout is a front-end demo. Connect a secure backend and payment provider to accept real orders.";});
 }catch(e){host.innerHTML='<p class="muted">Could not load your cart. Run the website with Live Server.</p>';console.error(e);}
}
render();