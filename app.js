const data=[
{id:1,sw:"Mafuta ya Kupikia - 1L",en:"Cooking Oil - 1L",price:12500,shop:"Mama Aisha · Kariakoo",icon:"🫒",cat:"Vyakula",rating:"4.8 (324)"},
{id:2,sw:"Mchele wa Pishori - 2kg",en:"Pishori Rice - 2kg",price:8000,shop:"Kariakoo Fresh Mart",icon:"🍚",cat:"Vyakula",rating:"4.7 (98)"},
{id:3,sw:"Kanzu ya Kiunde",en:"Men's Kanzu",price:48000,shop:"Kanga & Style",icon:"👔",cat:"Nguo",rating:"4.8 (132)"},
{id:4,sw:"Gauni la Kanga",en:"Kanga Dress",price:34500,shop:"Malkia Fashion",icon:"👗",cat:"Nguo",rating:"4.9 (95)"},
{id:5,sw:"Sabuni ya Ndoo - 500g",en:"Laundry Soap - 500g",price:4200,shop:"Sinza Home Store",icon:"🧼",cat:"Nyumbani",rating:"4.6 (204)"},
{id:6,sw:"Ndizi - 1kg",en:"Bananas - 1kg",price:1600,shop:"Mama Neema Produce",icon:"🍌",cat:"Matunda",rating:"4.7 (76)"},
{id:7,sw:"T-Shirt ya Pamba",en:"Cotton T-Shirt",price:22000,shop:"Kariakoo Fashion",icon:"👕",cat:"Nguo",rating:"4.6 (204)"},
{id:8,sw:"Ice cream",en:"Ice cream",price:3500,shop:"Cool Treats",icon:"🍦",cat:"Vyakula",rating:"4.9 (87)"}];
const cats=[["Vyakula","Groceries","🥬"],["Nguo","Clothing","👕"],["Matunda","Fruits","🍌"],["Nyumbani","Home care","🧼"],["Vinywaji","Drinks","🥤"],["Maduka","Local shops","🏪"]];
let lang="sw",cart=[],points=450,filter="";
const tr=(sw,en)=>lang==="sw"?sw:en, cash=n=>"TZS "+n.toLocaleString("en-US");
function toast(s){let e=document.getElementById("toast");e.textContent=s;e.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove("show"),2400)}
function renderCats(){document.getElementById("categories").innerHTML=cats.map(c=>`<button class="category" data-cat="${c[0]}"><span>${c[2]}</span><b>${tr(c[0],c[1])}</b></button>`).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{filter=b.dataset.cat;renderProducts()})}
function renderProducts(){let q=document.getElementById("search").value.toLowerCase();let list=data.filter(p=>(!filter||filter==="Maduka"||p.cat===filter)&&(`${p.sw} ${p.en} ${p.shop}`.toLowerCase().includes(q)));document.getElementById("products").innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-art">${p.icon}</div><h3>${lang==="sw"?p.sw:p.en}</h3><div class="shop">${p.shop}</div><div class="rating">★★★★★ ${p.rating}</div><div class="price-row"><span class="price">${cash(p.price)}</span><button class="add" onclick="add(${p.id})">+</button></div></article>`).join(""):`<p>No products found.</p>`}
function add(id){cart.push(data.find(p=>p.id===id));document.getElementById("count").textContent=cart.length;toast(tr("Bidhaa imeongezwa kikapuni.","Product added to cart."))}
function language(next){lang=next;document.documentElement.lang=next;document.querySelectorAll("[data-sw][data-en]").forEach(e=>e.textContent=e.dataset[next]);document.getElementById("lang").textContent=next==="sw"?"Kiswahili ✓ | English":"Kiswahili | English ✓";document.getElementById("search").placeholder=tr("Tafuta bidhaa, duka...","Search products, shops...");document.getElementById("value").textContent="≈ "+cash(points*10)+" "+tr("punguzo","discount");renderCats();renderProducts()}
document.getElementById("lang").onclick=()=>language(lang==="sw"?"en":"sw");
document.getElementById("searchBtn").onclick=()=>renderProducts();
document.getElementById("search").addEventListener("input",renderProducts);
function showCart(){const box=document.getElementById("cartSummary");if(!cart.length){box.textContent=tr("Kikapu kiko tupu. Ongeza bidhaa kwanza.","Your cart is empty. Add products first.");return;}const total=cart.reduce((sum,p)=>sum+p.price,0);box.innerHTML=`<ul>${cart.map(p=>`<li>${lang==="sw"?p.sw:p.en} — ${cash(p.price)}</li>`).join("")}</ul><b>${tr("Jumla ya mfano","Estimated total")}: ${cash(total)}</b>`;}
function openCheckout(){document.getElementById("checkoutPanel").hidden=false;showCart();document.getElementById("checkoutPanel").scrollIntoView({behavior:"smooth"});}
document.getElementById("cartBtn").onclick=openCheckout;
document.getElementById("checkoutBtn").onclick=openCheckout;
document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutPanel").hidden=true;
document.getElementById("locBtn").onclick=()=>{
 const l=prompt(tr("Andika eneo la delivery:","Enter delivery address:"),document.getElementById("loc").textContent);
 if(l){document.getElementById("loc").textContent=l;document.getElementById("deliveryArea").value=l;document.getElementById("locationMethod").value="manual";document.getElementById("gpsLat").value="";document.getElementById("gpsLng").value="";}
};
function getCustomerGps(){
 if(!navigator.geolocation){toast(tr("Browser hii haiungi mkono GPS.","This browser does not support GPS."));return;}
 navigator.geolocation.getCurrentPosition(pos=>{
  const lat=pos.coords.latitude, lng=pos.coords.longitude;
  document.getElementById("gpsLat").value=lat;
  document.getElementById("gpsLng").value=lng;
  document.getElementById("locationMethod").value="gps";
  const gpsText=`GPS ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  document.getElementById("loc").textContent=gpsText;
  const area=document.getElementById("deliveryArea");
  if(!area.value || area.value.startsWith("GPS ")) area.value=gpsText;
  document.getElementById("mapLink").href=`https://www.google.com/maps?q=${lat},${lng}`;
  document.getElementById("locationHelp").textContent=tr("GPS imepatikana. Link ya Google Maps iko tayari; ongeza maelezo ya mtaa.","GPS captured. Google Maps link is ready; add street details.");
  window.open(`https://www.google.com/maps?q=${lat},${lng}`,"_blank","noopener");
  toast(tr("Location imepatikana.","Location captured."));
 },()=>toast(tr("GPS haikupatikana. Ruhusu location au tumia anwani ya kawaida.","GPS unavailable. Allow location or use a typed address.")),{enableHighAccuracy:true,timeout:15000});
}
document.getElementById("gpsBtn").onclick=()=>{document.getElementById("checkoutPanel").hidden=false;document.getElementById("checkoutPanel").scrollIntoView({behavior:"smooth"});getCustomerGps();};
document.getElementById("getGpsBtn").onclick=getCustomerGps;
document.getElementById("locationMethod").addEventListener("change",e=>{
 const gps=e.target.value==="gps";
 document.getElementById("locationHelp").textContent=gps?tr("Bonyeza Pata GPS yangu. Browser itaomba ruhusa ya location.","Press Get my GPS. Your browser will ask permission."):tr("Andika anwani kamili ya delivery kwenye kisanduku hapa chini.","Type the full delivery address below.");
 if(gps)getCustomerGps();else{document.getElementById("gpsLat").value="";document.getElementById("gpsLng").value="";}
});
document.getElementById("orderForm").addEventListener("submit",async e=>{e.preventDefault();if(!cart.length){toast(tr("Ongeza bidhaa kikapuni kwanza.","Add products to your cart first."));return;}const payload={customer_name:document.getElementById("customerName").value.trim(),customer_phone:document.getElementById("customerPhone").value.trim(),dropoff_address:document.getElementById("deliveryArea").value.trim(),gps_lat:document.getElementById("gpsLat").value||null,gps_lng:document.getElementById("gpsLng").value||null,payment_method:document.getElementById("paymentMethod").value,payment_reference:document.getElementById("paymentReference").value.trim(),items:cart.map(p=>({id:p.id,name:lang==="sw"?p.sw:p.en,shop_name:p.shop,price_tzs:p.price})),total_tzs:cart.reduce((sum,p)=>sum+p.price,0)};try{const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const body=await res.json();if(!res.ok)throw new Error(body.error||"Could not place order");document.getElementById("orderResult").textContent=tr("Oda imepokelewa! Namba: ","Order received! Code: ")+body.order_code+" · "+tr("Malipo: ","Payment: ")+(body.payment_method||payload.payment_method)+" · "+tr("Hali ya malipo: ","Payment status: ")+(body.payment_status||"pending")+" · "+tr("Hifadhi namba hii kufuatilia oda. Malipo hayathibitishwi moja kwa moja kwenye demo.","Save this code to track your order. Payments are not automatically verified in this demo.");document.getElementById("code").value=body.order_code;document.getElementById("trackResult").textContent=tr("Oda imepokelewa. Bonyeza Fuatilia ili kuona hali.","Order received. Press Track to see its status.");cart=[];document.getElementById("count").textContent="0";showCart();toast(tr("Oda imetumwa.","Order placed."));}catch(err){document.getElementById("orderResult").textContent=tr("Imeshindikana kutuma oda: ","Could not place order: ")+err.message;}});
document.getElementById("track").onclick=async()=>{const code=document.getElementById("code").value.trim();if(!code)return toast(tr("Weka namba ya oda kwanza.","Enter an order number first."));try{const res=await fetch("/api/orders/track/"+encodeURIComponent(code));const order=await res.json();if(!res.ok)throw new Error(order.error||"Order not found");const labels={pending:tr("Inasubiri","Pending"),confirmed:tr("Imethibitishwa","Confirmed"),preparing:tr("Duka linaandaa","Shop preparing"),ready_for_pickup:tr("Tayari kuchukuliwa","Ready for pickup"),picked_up:tr("Imechukuliwa","Picked up"),on_the_way:tr("Ipo njiani","On the way"),delivered:tr("Imewasilishwa","Delivered"),cancelled:tr("Imeghairiwa","Cancelled")};document.getElementById("trackResult").textContent=tr("Oda ","Order ")+order.order_code+" · "+(labels[order.status]||order.status)+" · "+tr("Eneo: ","Address: ")+(order.dropoff_address||"-")+(order.rider_name?" · "+tr("Dereva: ","Rider: ")+order.rider_name+(order.rider_phone?" ("+order.rider_phone+")":""):"");toast(tr("Hali ya oda imepatikana.","Order status loaded."));}catch(e){toast(e.message)}};
document.getElementById("redeem").onclick=()=>{let n=Math.floor(points/100)*100;if(!n)return toast("Need 100 points.");if(confirm(tr(`Komboa ${n} points kwa TZS ${(n*10).toLocaleString()}?`,`Redeem ${n} points for TZS ${(n*10).toLocaleString()}?`))){points-=n;document.getElementById("points").textContent=points;document.getElementById("value").textContent="≈ "+cash(points*10)+" "+tr("punguzo","discount");toast(tr("Mfano wa kukomboa umekamilika.","Demo redemption complete."))}};
document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{const r=b.dataset.role;const text={Customer:tr("Mteja: oda, anwani, pointi na reviews.","Customer: orders, addresses, points and reviews."),Shop:tr("Duka: bidhaa, bei, stock, oda na ofa za Ijumaa.","Shop: products, prices, stock, orders and Friday offers."),Delivery:tr("Dereva: pickup, drop-off, taarifa za mteja na hali ya mzigo.","Rider: pickup, drop-off, customer contact and parcel status."),Admin:tr("Admin: watumiaji, maduka, madereva, oda, matangazo, punguzo na pointi. Ruhusa lazima zilindwe server-side.","Admin: users, shops, riders, orders, ads, discounts and points. Permissions must be enforced server-side.")};document.getElementById("roleResult").textContent=text[r]+" "+tr("Hii ni preview, si login salama.","This is a preview, not secure login.");toast(r+" demo")});
renderCats();renderProducts();

function enterApp(next){language(next);document.getElementById("languageGate").style.display="none";}
document.getElementById("chooseSw").onclick=()=>enterApp("sw");
document.getElementById("chooseEn").onclick=()=>enterApp("en");


// In-app support chat: messages are saved in the backend and available to Admin.
const chatPanel=document.getElementById("chatPanel");
const chatMessages=document.getElementById("chatMessages");
const chatThreadId=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():("slchat-"+Date.now()+"-"+Math.random().toString(36).slice(2));
function addChatLine(sender,message){
 const line=document.createElement("p");
 line.className="chat-line "+(sender==="customer"?"chat-customer":"chat-admin");
 const label=document.createElement("b");label.textContent=sender==="admin"?"ShopLink Support: ":"Wewe / You: ";
 const text=document.createElement("span");text.textContent=message;
 line.append(label,text);chatMessages.appendChild(line);chatMessages.scrollTop=chatMessages.scrollHeight;
}
async function loadCustomerChat(){
 try{const r=await fetch("/api/chat/messages?thread_id="+encodeURIComponent(chatThreadId));const rows=await r.json();if(!r.ok)throw new Error(rows.error||"Could not load chat");chatMessages.innerHTML="";if(!rows.length){chatMessages.textContent=tr("Andika ujumbe wako hapa.","Write your message here.");return;}rows.forEach(m=>addChatLine(m.sender,m.message));}catch(e){document.getElementById("voiceNotice").textContent=e.message;}
}
document.getElementById("refreshCustomerChat").onclick=loadCustomerChat;
document.getElementById("openChat").onclick=()=>{chatPanel.hidden=false;loadCustomerChat();chatPanel.scrollIntoView({behavior:"smooth",block:"center"});};
document.getElementById("closeChat").onclick=()=>{chatPanel.hidden=true;};
document.getElementById("chatForm").addEventListener("submit",async e=>{
 e.preventDefault();const input=document.getElementById("chatInput");const message=input.value.trim();if(!message)return;
 try{
  const response=await fetch("/api/chat/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({thread_id:chatThreadId,customer_name:document.getElementById("chatName").value.trim()||"ShopLink customer",customer_phone:document.getElementById("chatPhone").value.trim(),message})});
  const result=await response.json();if(!response.ok)throw new Error(result.error||"Chat message failed");
  input.value="";await loadCustomerChat();
  if(window.speechSynthesis){const utter=new SpeechSynthesisUtterance(tr("Ujumbe wako umetumwa kwa ShopLink Support.","Your message was sent to ShopLink Support."));utter.lang=lang==="sw"?"sw-TZ":"en-US";speechSynthesis.speak(utter);}
 }catch(err){toast(err.message);}
});
document.getElementById("voiceInput").onclick=()=>{
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){document.getElementById("voiceNotice").textContent=tr("Browser hii haina voice typing. Tumia Chrome na ruhusu microphone.","Voice typing is not supported by this browser. Try Chrome and allow microphone access.");return;}
 const recognition=new Recognition();recognition.lang=lang==="sw"?"sw-TZ":"en-US";recognition.interimResults=false;recognition.maxAlternatives=1;
 document.getElementById("voiceNotice").textContent=tr("Sikiliza... ongea sasa.","Listening... speak now.");
 recognition.onresult=event=>{document.getElementById("chatInput").value=event.results[0][0].transcript;document.getElementById("voiceNotice").textContent=tr("Maneno yameandikwa. Bonyeza Tuma.","Speech transcribed. Press Send.");};
 recognition.onerror=()=>{document.getElementById("voiceNotice").textContent=tr("Microphone haikupatikana au ruhusa imekataliwa.","Microphone unavailable or permission denied.");};
 recognition.start();
};
document.getElementById("voiceMode").onclick=()=>{chatPanel.hidden=false;loadCustomerChat();chatPanel.scrollIntoView({behavior:"smooth",block:"center"});document.getElementById("voiceInput").click();};
