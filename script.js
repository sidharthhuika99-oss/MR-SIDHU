const $=id=>document.getElementById(id);
function openModal(id){$(id).classList.add('show')}
function closeModal(id){$(id).classList.remove('show')}
function openBooking(service=''){ 
  const user=JSON.parse(localStorage.getItem('psUser')||'null');
  if(user){$('bname').value=user.name||'';$('bphone').value=user.phone||'';}
  $('service').value=service;
  openModal('bookingModal');
}
function bookFor(s){openBooking(s)}
function submitBooking(e){
  e.preventDefault();
  const user=JSON.parse(localStorage.getItem('psUser')||'null');
  const booking={id:Date.now(),service:$('service').value,name:$('bname').value,phone:$('bphone').value,date:$('bdate').value,time:$('btime').value,address:$('baddress').value,note:$('bnote').value,status:'Pending'};
  const arr=JSON.parse(localStorage.getItem('psBookings')||'[]'); arr.push(booking); localStorage.setItem('psBookings',JSON.stringify(arr));
  alert('Booking submitted successfully! Your booking status is Pending.');
  closeModal('bookingModal'); $('bookingForm').reset();
}
function openAuth(type){
  $('authContent').innerHTML= type==='login' ? `
    <h2>Customer Login</h2><form onsubmit="login(event)">
      <input id="loginPhone" required placeholder="Mobile Number" type="tel">
      <input id="loginPass" required placeholder="Password" type="password">
      <button class="btn gold big">Login</button>
    </form><div class="auth-switch">New customer? <a href="#" onclick="openAuth('register');return false">Register</a></div>`
  : `<h2>Create Customer Account</h2><form onsubmit="register(event)">
      <input id="regName" required placeholder="Full Name">
      <input id="regPhone" required placeholder="Mobile Number" type="tel">
      <input id="regPass" required placeholder="Create Password" type="password">
      <button class="btn gold big">Register</button>
    </form><div class="auth-switch">Already registered? <a href="#" onclick="openAuth('login');return false">Login</a></div>`;
  openModal('authModal');
}
function register(e){
  e.preventDefault();
  const user={name:$('regName').value,phone:$('regPhone').value,password:$('regPass').value};
  localStorage.setItem('psUser',JSON.stringify(user));
  alert('Registration successful. You are now logged in.');
  closeModal('authModal'); showUserBar();
}
function login(e){
  e.preventDefault();
  const saved=JSON.parse(localStorage.getItem('psUser')||'null');
  if(!saved || saved.phone!==$('loginPhone').value || saved.password!==$('loginPass').value){alert('Invalid login details. Please register first.');return}
  closeModal('authModal'); alert('Login successful.'); showUserBar();
}
function logout(){localStorage.removeItem('psUser');location.reload()}
function showUserBar(){
  const user=JSON.parse(localStorage.getItem('psUser')||'null'); if(!user)return;
  const bar=document.createElement('div'); bar.className='userbar';
  bar.innerHTML=`<span>👤 Welcome, <b>${escapeHtml(user.name)}</b></span><span><button class="btn" onclick="viewBookings()">My Bookings</button> <button class="btn" onclick="logout()">Logout</button></span>`;
  document.body.insertBefore(bar,document.querySelector('main'));
}
function viewBookings(){
  const user=JSON.parse(localStorage.getItem('psUser')||'null'); const all=JSON.parse(localStorage.getItem('psBookings')||'[]');
  const mine=all.filter(x=>x.phone===user.phone);
  $('authContent').innerHTML=`<h2>My Bookings</h2>${mine.length?'<div class="booking-list">'+mine.map(x=>`<div class="booking-item"><b>${escapeHtml(x.service)}</b><br>📅 ${x.date} ${x.time}<br>📍 ${escapeHtml(x.address)}<br><span class="badge">${x.status}</span></div>`).join('')+'</div>':'<p class="muted">No bookings yet.</p>'}`;
  openModal('authModal');
}
const ADMIN_PHONE='8144722094';
const ADMIN_PASSWORD='PS@2026';

function openAdminLogin(){
  $('adminContent').innerHTML=`<h2>Owner / Admin Login</h2><p class="muted">Manage customer bookings and update their status.</p><form onsubmit="adminLogin(event)"><input id="adminPhone" required type="tel" placeholder="Admin Mobile Number"><input id="adminPass" required type="password" placeholder="Admin Password"><button class="btn gold big">Login to Dashboard</button></form><p class="muted small">Default demo credentials: ${ADMIN_PHONE} / ${ADMIN_PASSWORD}</p>`;
  openModal('adminModal');
}
function adminLogin(e){
  e.preventDefault();
  if($('adminPhone').value!==ADMIN_PHONE || $('adminPass').value!==ADMIN_PASSWORD){alert('Invalid admin login details.');return}
  localStorage.setItem('psAdminSession','1');
  renderAdminDashboard();
}
function adminLogout(){localStorage.removeItem('psAdminSession');closeModal('adminModal');alert('Admin logged out.');}
function renderAdminDashboard(){
  const all=JSON.parse(localStorage.getItem('psBookings')||'[]');
  const counts={Pending:0,Confirmed:0,Completed:0,Cancelled:0}; all.forEach(x=>counts[x.status]=(counts[x.status]||0)+1);
  const rows=all.slice().sort((a,b)=>b.id-a.id).map(x=>`<div class="admin-booking"><div class="booking-main"><div><b>${escapeHtml(x.service)}</b><span class="badge status-${x.status.toLowerCase()}">${x.status}</span></div><p>👤 ${escapeHtml(x.name)} &nbsp; 📞 ${escapeHtml(x.phone)}</p><p>📅 ${escapeHtml(x.date)} ${escapeHtml(x.time)} &nbsp; 📍 ${escapeHtml(x.address)}</p>${x.note?`<p>📝 ${escapeHtml(x.note)}</p>`:''}<small>Booking ID: ${x.id}</small></div><div class="status-actions"><button onclick="updateBookingStatus(${x.id},'Pending')">Pending</button><button onclick="updateBookingStatus(${x.id},'Confirmed')">Confirm</button><button onclick="updateBookingStatus(${x.id},'Completed')">Complete</button><button onclick="updateBookingStatus(${x.id},'Cancelled')">Cancel</button></div></div>`).join('');
  $('adminContent').innerHTML=`<div class="admin-head"><div><h2>Owner Booking Dashboard</h2><p class="muted">View and manage all customer bookings.</p></div><button class="btn outline" onclick="adminLogout()">Logout</button></div><div class="admin-stats"><div><b>${all.length}</b><span>Total</span></div><div><b>${counts.Pending||0}</b><span>Pending</span></div><div><b>${counts.Confirmed||0}</b><span>Confirmed</span></div><div><b>${counts.Completed||0}</b><span>Completed</span></div><div><b>${counts.Cancelled||0}</b><span>Cancelled</span></div></div><div class="admin-list">${rows||'<p class="muted">No customer bookings yet.</p>'}</div>`;
}
function updateBookingStatus(id,status){
  const all=JSON.parse(localStorage.getItem('psBookings')||'[]');
  const booking=all.find(x=>x.id===id); if(!booking)return;
  booking.status=status; booking.updatedAt=new Date().toISOString();
  localStorage.setItem('psBookings',JSON.stringify(all));
  renderAdminDashboard();
}
function sendContact(e){e.preventDefault();alert('Thank you! Your enquiry has been received.');e.target.reset()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
$('menuBtn').addEventListener('click',()=> $('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=> $('navLinks').classList.remove('open')));
window.addEventListener('load',()=>{showUserBar();});
