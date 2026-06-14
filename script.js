let registerButton=document.getElementById("register");
let registerBlock=document.querySelector(".register");
let container=document.querySelector('.container');
let loginlink=document.getElementById('loginlink');

registerButton.addEventListener("click",()=>{
    container.classList.toggle("disappear")
    registerBlock.classList.toggle("disappear");
})

loginlink.addEventListener('click',()=>{
    registerBlock.classList.toggle("disappear");
        container.classList.toggle("disappear")

})