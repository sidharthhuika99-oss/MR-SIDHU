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
function sendContact(e){e.preventDefault();alert('Thank you! Your enquiry has been received.');e.target.reset()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
$('menuBtn').addEventListener('click',()=> $('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=> $('navLinks').classList.remove('open')));
window.addEventListener('load',showUserBar);
