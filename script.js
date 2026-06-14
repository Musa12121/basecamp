let registerButton = document.getElementById("register");
let registerBlock = document.querySelector(".register");
let container = document.querySelector('.container');
let loginlink = document.getElementById('loginlink');
let nameinput = document.getElementById("name");
let emailinput = document.getElementById("email");
let passwordinput = document.getElementById("password");
let passwordrepeat = document.getElementById("passwordrepeat");
let submitbutton = document.getElementById("submitbtn");
let textunderinput = document.querySelector("span");
let errormsg=document.getElementById("errormsg");
let signuplink=document.getElementById("signuplink");

registerButton.addEventListener("click", () => {
    container.classList.toggle("disappear")
    registerBlock.classList.toggle("disappear");
})

loginlink.addEventListener('click', () => {
    registerBlock.classList.toggle("disappear");
    container.classList.toggle("disappear")
})

submitbutton.addEventListener("click", () => {
    if (passwordinput.value != passwordrepeat.value) {
        textunderinput.textContent = "passwords don't match";
        textunderinput.style.color = 'red';
        passwordinput.style.outlineColor = 'red';
        passwordrepeat.style.outlineColor = 'red';
    }
    if (passwordinput.value.length == 0) {
        passwordinput.style.outlineColor = 'red';
        textunderinput.style.color = 'red';
        textunderinput.textContent="can't be blank";
        errormsg.innerHTML="<h1 style='text-align:left;'>1 error prohibited this user from being saved:</h1><ul style='padding-left:40px;'><li>Password can't be blank</li></ul>";
    }
    if (passwordinput.value.length < 6) {
        textunderinput.style.color = 'red';
        passwordinput.style.outlineColor = 'red';
    }
    if (passwordinput.value.length >= 6 && passwordinput.value == passwordrepeat.value) {
        textunderinput.textContent = "";
        textunderinput.style.color = 'gray';
        passwordinput.style.outlineColor = 'lightgray';
        passwordrepeat.style.outlineColor = 'lightgray';
        signuplink.setAttribute('href','account.html')
    }
})