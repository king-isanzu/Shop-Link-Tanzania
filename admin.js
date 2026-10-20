const $ = id => document.getElementById(id);
const statuses = [
 ['pending','Pending'],['confirmed','Confirmed'],['preparing','Preparing'],['ready_for_pickup','Ready for pickup'],['picked_up','Picked up'],['on_the_way','On the way'],['delivered','Delivered'],['cancelled','Cancelled']
];
const money = n => 'TZS ' + Number(n || 0).toLocaleString('en-US');
async function api(url, options={}) {
 const response = await fetch(url, {credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
 const data = await response.json().catch(()=>({}));
 if (!response.ok) throw new Error(data.error || 'Request failed');
 return data;
}
function showError(text){$('loginError').textContent=text;}
async function checkSession(){try{const r=await api('/api/me');if(r.user?.role==='admin') showDashboard();}catch(e){}}
async function login(event){event.preventDefault();showError('');try{await api('/api/login',{method:'POST',body:JSON.stringify({email:$('email').value,password:$('password').value})});showDashboard();}catch(e){showError(e.message);}}
function showDashboard(){$('loginPanel').hidden=true;$('dashboard').hidden=false;$('logoutBtn').hidden=false;loadAll();}
async function loadAll(){try{const [summary,orders]=await Promise.all([api('/api/admin/summary'),api('/api/orders?status='+encodeURIComponent($('statusFilter').value))]);$('totalOrders').textContent=summary.total_orders;$('completedOrders').textContent=summary.completed_orders;$('activeOrders').textContent=summary.active_orders;$('paidRevenue').textContent=Number(summary.paid_revenue_tzs).toLocaleString('en-US');renderOrders(orders);}catch(e){$('adminMessage').textContent=e.message;if(e.message.includes('login')){$('dashboard').hidden=true;$('loginPanel').hidden=false;}}}
function renderOrders(orders){const body=$('ordersBody');if(!orders.length){body.innerHTML='<tr><td colspan="6">No orders found for this filter.</td></tr>';return;}body.innerHTML=orders.map(o=>`<tr data-id="${o.id}"><td><b>${o.order_code}</b><small>${o.created_at}</small><small>${o.item_summary}</small></td><td><b>${o.customer_name}</b><small>${o.customer_phone}</small><small>Shop: ${o.shop_name}</small></td><td><small><b>Pickup:</b> ${o.pickup_address}</small><small><b>Drop:</b> ${o.dropoff_address}</small><small><b>Rider:</b> ${o.rider_name||'Not assigned'} ${o.rider_phone||''}</small></td><td><b>${money(o.total_tzs)}</b><small>Payment: ${escapeHtml(o.payment_status||'unpaid')}</small><small>Method: ${escapeHtml(o.payment_method||'cash_on_delivery')}</small><small>Ref: ${escapeHtml(o.payment_reference||'—')}</small></td><td><span class="status-pill status-${o.status}">${o.status_en}</span><small>${o.status_sw}</small></td><td><select class="row-status" aria-label="Status for ${o.order_code}">${statuses.map(([v,l])=>`<option value="${v}" ${o.status===v?'selected':''}>${l}</option>`).join('')}</select><input class="rider-name" placeholder="Rider name" value="${escapeHtml(o.rider_name||'')}"><input class="rider-phone" placeholder="Rider phone" value="${escapeHtml(o.rider_phone||'')}"><input class="rider-note" placeholder="Update note" value=""><button class="save-status primary" data-id="${o.id}">Save update</button></td></tr>`).join('');document.querySelectorAll('.save-status').forEach(btn=>btn.addEventListener('click',()=>saveOrder(btn.dataset.id,btn.closest('tr'))));}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function saveOrder(id,row){const button=row.querySelector('.save-status');button.disabled=true;try{await api('/api/orders/'+id,{method:'PATCH',body:JSON.stringify({status:row.querySelector('.row-status').value,rider_name:row.querySelector('.rider-name').value,rider_phone:row.querySelector('.rider-phone').value,note:row.querySelector('.rider-note').value})});$('adminMessage').textContent='Order updated successfully. Status history saved.';await loadAll();}catch(e){$('adminMessage').textContent=e.message;}finally{button.disabled=false;}}
$('loginForm').addEventListener('submit',login);$('refreshBtn').addEventListener('click',loadAll);$('statusFilter').addEventListener('change',loadAll);$('logoutBtn').addEventListener('click',async()=>{await api('/api/logout',{method:'POST'});$('dashboard').hidden=true;$('loginPanel').hidden=false;$('logoutBtn').hidden=true;});checkSession();

function fmtTZS(n){return 'TZS '+Number(n||0).toLocaleString('en-US');}
async function loadProfit(){try{const d=await api('/api/admin/rewards-profit');$('profitSales').textContent=fmtTZS(d.paid_delivered_sales_tzs);$('profitCommission').textContent=fmtTZS(d.commission_income_tzs);$('profitRewards').textContent=fmtTZS(d.planned_reward_budget_tzs);$('profitEstimate').textContent=fmtTZS(d.estimated_profit_tzs);$('profitEstimate').style.color=d.estimated_profit_tzs<0?'#b42318':'#067647';$('commissionPercent').value=d.settings.commission_percent;$('rewardBudgetPercent').value=d.settings.reward_budget_percent;$('maxDiscountPercent').value=d.settings.max_discount_percent;$('otherCostPerOrder').value=d.settings.estimated_other_cost_per_order;$('profitNotice').textContent=d.notice;}catch(e){$('profitNotice').textContent=e.message;}}
$('refreshProfitBtn')?.addEventListener('click',loadProfit);
$('rewardSettingsForm')?.addEventListener('submit',async e=>{e.preventDefault();$('rewardSettingsMessage').textContent='Saving…';try{await api('/api/admin/rewards-settings',{method:'POST',body:JSON.stringify({commission_percent:Number($('commissionPercent').value),reward_budget_percent:Number($('rewardBudgetPercent').value),max_discount_percent:Number($('maxDiscountPercent').value),estimated_other_cost_per_order:Number($('otherCostPerOrder').value)})});$('rewardSettingsMessage').textContent='Safety settings saved.';await loadProfit();}catch(err){$('rewardSettingsMessage').textContent=err.message;}});
const oldShowDashboard=showDashboard;showDashboard=function(){oldShowDashboard();loadProfit();};


async function loadAdminChat(){
 try{
  const messages=await api('/api/admin/chat/messages');
  const box=$('adminChatMessages');
  if(!messages.length){box.textContent='No support messages yet.';return;}
  box.innerHTML=messages.map(m=>`<article class="admin-chat-message"><b>${escapeHtml(m.sender==='admin'?'ShopLink Support':m.customer_name)} · ${escapeHtml(m.created_at)}</b><p>${escapeHtml(m.message)}</p><small>Thread: ${escapeHtml(m.thread_id)} · ${escapeHtml(m.customer_phone||'')}</small><button type="button" class="secondary-btn choose-chat-thread" data-thread="${escapeHtml(m.thread_id)}">Reply to this chat</button></article>`).join('');
  document.querySelectorAll('.choose-chat-thread').forEach(btn=>btn.addEventListener('click',()=>{$('adminChatThread').value=btn.dataset.thread;$('adminChatNotice').textContent='Replying to thread '+btn.dataset.thread;}));
  box.scrollTop=box.scrollHeight;
 }catch(e){$('adminChatNotice').textContent=e.message;}
}
$('refreshChatBtn')?.addEventListener('click',loadAdminChat);
$('adminChatForm')?.addEventListener('submit',async e=>{
 e.preventDefault();const input=$('adminChatReply');if(!input.value.trim())return;
 try{await api('/api/admin/chat/messages',{method:'POST',body:JSON.stringify({thread_id:$('adminChatThread').value.trim(),message:input.value.trim()})});input.value='';$('adminChatNotice').textContent='Reply sent.';await loadAdminChat();}
 catch(err){$('adminChatNotice').textContent=err.message;}
});
const priorLoadAll=loadAll;
loadAll=async function(){await priorLoadAll();await loadAdminChat();};
