(() => {
  document.querySelectorAll("[data-year]").forEach(node => node.textContent = new Date().getFullYear());
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open") || false;
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".password-toggle").forEach(button => button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Hide" : "Show";
    button.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }));
  const reservation = document.querySelector("#reservationForm");
  reservation?.addEventListener("submit", event => {
    event.preventDefault();
    const message = reservation.querySelector(".form-message");
    if (message) message.textContent = "Thanks — this demo has recorded your request locally. No booking has been sent.";
    reservation.reset();
  });
  const login = document.querySelector("#loginForm");
  login?.addEventListener("submit", event => {
    event.preventDefault();
    const message = login.querySelector(".form-message");
    if (message) message.textContent = "This is a front-end demo. Connect a secure authentication service to sign in.";
  });
  const profileForm = document.querySelector("#profileForm");
  if (profileForm) {
    const saved = JSON.parse(localStorage.getItem("emberOakProfile") || "null");
    if (saved) Object.entries(saved).forEach(([key,value]) => { const field=profileForm.elements.namedItem(key); if(field){if(field.type==="checkbox")field.checked=!!value;else field.value=value;} });
    profileForm.addEventListener("submit", event => {
      event.preventDefault();
      const data=Object.fromEntries(new FormData(profileForm).entries());
      data.updates=profileForm.elements.namedItem("updates")?.checked||false;
      localStorage.setItem("emberOakProfile",JSON.stringify(data));
      const message=profileForm.querySelector(".form-message");
      if(message)message.textContent="Your profile details have been saved in this browser.";
      const name=document.querySelector("#profileName"),email=document.querySelector("#profileEmail"),avatar=document.querySelector("#avatarInitials");
      if(name)name.textContent=data.name||"Guest diner";if(email)email.textContent=data.email||"";if(avatar)avatar.textContent=(data.name||"EO").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
    });
    document.querySelector("#logoutButton")?.addEventListener("click",()=>{localStorage.removeItem("emberOakProfile");profileForm.reset();location.href="login.html";});
  }
})();