const headerNavOffset = 60;
const projectsYesButton = document.getElementById("projects-yes");
const projectsNoButton = document.getElementById("projects-no");
const scrollToProjects = () => {
    const projectsYOffset = document.getElementById("projects-directory").offsetTop;
    window.scroll({
        top: projectsYOffset - headerNavOffset,
        behavior: "smooth",
    });
};
const toggleActiveButton = (activeButton, inactiveButton) => {
    inactiveButton.classList.remove("active");
    activeButton.classList.add("active");
};

const onProjectsYesClick = (event) => {
    toggleActiveButton(projectsYesButton, projectsNoButton);
    scrollToProjects();
};

const onProjectsNoClick = (event) => {
    toggleActiveButton(projectsNoButton, projectsYesButton);
    // show popup
};

projectsYesButton.addEventListener("click", onProjectsYesClick);
projectsNoButton.addEventListener("click", onProjectsNoClick);