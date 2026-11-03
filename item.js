const target = document.querySelector("#item-detail");
const money = n => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(n)||0);
const esc = v => String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function start(){
  try{
    const response=await fetch("menu.json"); if(!response.ok) throw new Error("Menu data unavailable");
    const data=await response.json();
    const stored=JSON.parse(localStorage.getItem("emberOakMenu")||"null");
    const items=stored||data.items;
    const id=new URLSearchParams(location.search).get("id");
    const item=items.find(x=>x.id===id && x.available!==false);
    if(!item){target.innerHTML='<div class="empty-cart"><h2>Dish not found</h2><a class="action-btn" href="menu.html">Return to menu</a></div>';return;}
    target.innerHTML=`<div class="detail-layout"><img class="detail-photo" src="${esc(item.image)}" alt="${esc(item.alt||item.name)}" onerror="this.src='https://placehold.co/900x600/25241e/d5ad68?text=Ember+%26+Oak'"><section class="detail-info"><p class="page-kicker">${esc(item.category)} · EMBER & OAK</p><h1>${esc(item.name)}</h1><div class="detail-price">${money(item.price)}</div><p class="detail-description">${esc(item.description)}</p><p class="muted">Prepared with care using thoughtfully selected ingredients. Please tell our team about any allergies before ordering.</p><div class="detail-actions"><label class="muted">Qty <input id="item-qty" class="quantity-input" type="number" min="1" max="20" value="1"></label><button class="action-btn" id="add-item">Add to cart <span>＋</span></button><a class="action-btn secondary" href="cart.html">Go to cart</a></div><p class="notice" id="item-notice" aria-live="polite"></p></section></div>`;
    document.querySelector("#add-item").addEventListener("click",()=>{
      const qty=Math.max(1,Math.min(20,Number(document.querySelector("#item-qty").value)||1));
      const cart=JSON.parse(localStorage.getItem("emberOakCart")||"[]");
      const found=cart.find(x=>x.id===item.id);
      if(found) found.quantity+=qty; else cart.push({id:item.id,quantity:qty});
      localStorage.setItem("emberOakCart",JSON.stringify(cart));
      document.querySelector("#item-notice").textContent=`${item.name} added to your cart.`;
    });
  }catch(e){target.innerHTML='<p class="muted">Could not load this item. Please open the project with Live Server.</p>';console.error(e);}
}
start();