const screens=[...document.querySelectorAll(".screen")];
const navItems=[...document.querySelectorAll(".nav-item")];
const toast=document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function goTo(id){
  const target=document.getElementById(id);
  if(!target)return;
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
  navItems.forEach(n=>n.classList.toggle("active",n.dataset.go===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>goTo(el.dataset.go)));
document.getElementById("menuBtn").addEventListener("click",()=>showToast("Use the navigation bar to explore NetFree."));
document.getElementById("settingsBtn").addEventListener("click",()=>goTo("settings"));

const placeData=[
  {type:"Transport",icon:"✈",name:"Airport public Wi-Fi",detail:"Check the airport's official network name and sign-in rules."},
  {type:"Shopping",icon:"▦",name:"Shopping mall guest Wi-Fi",detail:"Ask the information desk whether guest Wi-Fi is available."},
  {type:"Cafe",icon:"☕",name:"Café or restaurant Wi-Fi",detail:"Ask staff for the official network and password, if provided."},
  {type:"Public",icon:"▣",name:"Library or public facility",detail:"Check with staff about visitor access and opening hours."},
  {type:"Shopping",icon:"⌂",name:"Large retail centre",detail:"Some venues provide guest Wi-Fi. Availability varies by location."},
  {type:"Public",icon:"◉",name:"Community centre",detail:"Ask whether visitors may use a public internet connection."}
];
const wifiList=document.getElementById("wifiList");
let currentFilter="All";
function renderPlaces(){
  const city=document.getElementById("citySelect").value;
  const filtered=placeData.filter(p=>currentFilter==="All"||p.type===currentFilter);
  wifiList.innerHTML="";
  filtered.forEach(p=>{
    const card=document.createElement("div");card.className="place-card";
    const icon=document.createElement("span");icon.className="place-icon";icon.textContent=p.icon;
    const info=document.createElement("span");info.className="place-info";
    const title=document.createElement("strong");title.textContent=p.name;
    const desc=document.createElement("small");desc.textContent=city+" area · "+p.detail;
    info.append(title,desc);
    const tag=document.createElement("span");tag.className="tag";tag.textContent="Check";
    card.append(icon,info,tag);wifiList.append(card);
  });
}
document.getElementById("placeFilters").addEventListener("click",e=>{
 const btn=e.target.closest("[data-filter]");if(!btn)return;
 currentFilter=btn.dataset.filter;
 document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));
 renderPlaces();
});
document.getElementById("citySelect").addEventListener("change",renderPlaces);
renderPlaces();

function updateConnection(){
 const online=navigator.onLine;
 document.getElementById("connectionTitle").textContent=online?"Browser reports online":"Browser reports offline";
 document.getElementById("connectionText").textContent=online?"Run a connectivity test to verify access.":"Check Wi-Fi or mobile data settings.";
 document.querySelector(".status-dot").style.background=online?"#16e6a0":"#ff6b6b";
 document.getElementById("browserStatus").textContent=online?"Online (browser status)":"Offline (browser status)";
 const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 document.getElementById("connectionApi").textContent=conn?(conn.effectiveType||conn.type||"Available"):"Not exposed by browser";
}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);updateConnection();

document.getElementById("runTestBtn").addEventListener("click",async()=>{
 const btn=document.getElementById("runTestBtn"),icon=document.getElementById("testIcon");
 const title=document.getElementById("testTitle"),msg=document.getElementById("testMessage");
 btn.disabled=true;btn.textContent="Testing…";title.textContent="Checking connection";msg.textContent="Trying to reach a public connectivity endpoint…";icon.textContent="…";
 try{
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
   const start=performance.now();
   await fetch("https://www.gstatic.com/generate_204?netfree="+Date.now(),{mode:"no-cors",cache:"no-store",signal:controller.signal});
   clearTimeout(timeout);
   const elapsed=Math.round(performance.now()-start);
   title.textContent="Request completed";msg.textContent="The browser completed a request in about "+elapsed+" ms. This is not a certified speed test.";
   icon.textContent="✓";icon.style.borderColor="#16e6a0";icon.style.color="#16e6a0";
 }catch(err){
   title.textContent=navigator.onLine?"Could not verify access":"Device appears offline";
   msg.textContent="The test endpoint may be blocked or unreachable. Try opening a trusted website or reconnecting to Wi-Fi.";
   icon.textContent="!";icon.style.borderColor="#ffc857";icon.style.color="#ffc857";
 }finally{btn.disabled=false;btn.textContent="Run test again";updateConnection()}
});
document.getElementById("privacyBtn").addEventListener("click",()=>{document.getElementById("infoTitle").textContent="Privacy and safety";document.getElementById("infoText").textContent="This demo runs in your browser and does not ask for personal details or passwords. External connectivity tests contact the configured test endpoint.";goTo("info")});
document.getElementById("aboutBtn").addEventListener("click",()=>{document.getElementById("infoTitle").textContent="About NetFree";document.getElementById("infoText").textContent="NetFree is a guidance tool for legitimate free Wi-Fi, official operator offers and basic network troubleshooting.";goTo("info")});
