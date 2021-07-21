const nav = document.querySelector("#navContainer");
const openMenu = document.querySelector("#openMenu");
const closeMenu = document.querySelector("#closeMenu");
const linksMenu = document.querySelectorAll('li.menu ul li a');

const socialNav = document.querySelector("#socialNav");
const openSocial = document.querySelector("#openSocial");
const closeSocial = document.querySelector("#closeSocial");
const header = document.querySelector("header");

openMenu.addEventListener("click", () => {
    nav.classList.add("active");
});

closeMenu.addEventListener("click", () => {
    nav.classList.remove("active");
});

for (let i = 0; i < linksMenu.length; i++) {
    linksMenu[i].addEventListener("click", function() {
        if(nav.classList.contains("active")) {
            nav.classList.remove("active");
        } else return
    });
  }

openSocial.addEventListener("click", () => {
    socialNav.classList.add("active");
});

closeSocial.addEventListener("click", () => {
    socialNav.classList.remove("active");
});

window.addEventListener("scroll", () => {
    let windowTop = window.pageYOffset;
    windowTop > 50 ? header.classList.add("scrolled") : header.classList.remove("scrolled")
})