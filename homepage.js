const headerNavOffset = 60;
const projectsYesButton = document.getElementById("projects-yes");
const scrollToProjects = (event) => {
    const projectsYOffset = document.getElementById("projects-directory").offsetTop;
    window.scroll({
        top: projectsYOffset - headerNavOffset,
        behavior: "smooth",
    });
};

projectsYesButton.addEventListener("click", scrollToProjects);