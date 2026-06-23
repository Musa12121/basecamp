let button=document.querySelector('.newprojectbtn')
let newprojectpage=document.querySelector('.newprojectpage')
let defaultpage=document.querySelector('.default')

let addProjectBtn=document.getElementById('newProjectButton').value

button.addEventListener('click',()=>{
    newprojectpage.classList.toggle("disappear");   
    defaultpage.classList.toggle("disappear");
})

addProjectBtn.addEventListener('click',()=>{
let projectName=document.getElementById('newProjectName').value
let projectInfo=document.getElementById('newProjectDescription').value

})

