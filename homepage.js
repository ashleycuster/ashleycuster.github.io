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
const animatePopup = (popupElement) => {
    popupElement.classList.add("elementToFadeInAndOut");
    popupElement.setAttribute("aria-hidden", false);
    // Wait until the animation is over and then remove the class, so that
    // the next click can re-add it.
    setTimeout(() => {
        popupElement.classList.remove("elementToFadeInAndOut");
        popupElement.setAttribute("aria-hidden", true);
    }, 8000);
}

const onProjectsYesClick = (event) => {
    toggleActiveButton(projectsYesButton, projectsNoButton);
    scrollToProjects();
};

const onProjectsNoClick = (event) => {
    toggleActiveButton(projectsNoButton, projectsYesButton);
    animatePopup(document.getElementById("question-popup"));
};

projectsYesButton.addEventListener("click", onProjectsYesClick);
projectsNoButton.addEventListener("click", onProjectsNoClick);