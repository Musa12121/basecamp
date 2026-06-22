let button=document.querySelector('.newprojectbtn')
let newprojectpage=document.querySelector('.newprojectpage')
let defaultpage=document.querySelector('.default')

button.addEventListener('click',()=>{
    newprojectpage.classList.toggle("disappear");   
    defaultpage.classList.toggle("disappear");
})