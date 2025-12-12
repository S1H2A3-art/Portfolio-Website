function goBackOrHome() {
  const referrer = document.referrer;
  const currentOrigin = window.location.origin;
  
  if (referrer && referrer.startsWith(currentOrigin)) {
    let params = new URLSearchParams(window.location.search);
    let concept = params.get("concept");
    if(concept){
       window.location.href = `../../Explorer_Page/Explorer.html?concept=${encodeURIComponent(concept)}`; 
      return;
    }
    history.back();
  } else {
    window.location.href = "../../Explorer_Page/Explorer.html"; 
  }
}