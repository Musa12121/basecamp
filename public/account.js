let button = document.querySelector(".newprojectbtn");
let newprojectpage = document.querySelector(".newprojectpage");
let defaultpage = document.querySelector(".default");
let projectList = document.querySelector(".projectList");
let addProjectBtn = document.getElementById("newProjectButton");
let settingsPage = document.querySelector(".settingsPage");

button.addEventListener("click", () => {
  let projectName = document.getElementById("newProjectName");
  let projectInfo = document.getElementById("newProjectdDescription");
  newprojectpage.classList.toggle("disappear");
  defaultpage.classList.toggle("disappear");
  projectName.value = "";
  projectInfo.value = "";
});

addProjectBtn.addEventListener("click", () => {
  let projectName = document.getElementById("newProjectName");
  let projectInfo = document.getElementById("newProjectdDescription");
  let card = document.createElement("li");
  card.classList.add("project");
  card.innerHTML = `<div class="newProjectPart1">
                        <div>
                            <h3 id="title">${projectName.value}</h3>
                            <div>
                                <i class="fa-solid fa-pen"></i>
                                <span>email@gmail.com</span>
                            </div>
                        </div>
                        <div class="newProjectIcon1">
                            <i class="fa-solid fa-gear settings"></i>
                        </div>
                    </div>
                    <div class="newProjectPart2"><p id="description">${projectInfo.value}</p></div>
                    <div class="newProjectPart3">
                        <div><i class="fa-solid fa-user-group"></i><span class="userCount">1</span>
                        <i class="fa-solid fa-comments"></i><span class="commentCount">0</span></div>
                        <i class="fa-regular fa-trash-can delete" style="color: rgb(255, 255, 255);"></i></div>`;
  projectList.appendChild(card);
  newprojectpage.classList.toggle("disappear");
  defaultpage.classList.toggle("disappear");
  projectName.value = "";
  projectInfo.value = "";
});

projectList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.parentElement.remove();
  } else if (e.target.classList.contains("settings")) {
    settingsPage.classList.remove("disappear");
    if (!newprojectpage.classList.contains("disappear")) {
      newprojectpage.classList.add("disappear");
    }
    if (!defaultpage.classList.contains("disappear")) {
      defaultpage.classList.add("disappear");
    }
  }
});
