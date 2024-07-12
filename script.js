window.addEventListener("DOMContentLoaded", () => {
  fetch("projects.csv")
    .then((response) => response.text())
    .then((data) => {
      const projects = parseCSV(data);
      const projectsContainer = document.getElementById("projects-container");

      projects.forEach((project) => {
        const projectElement = createProjectElement(project);
        projectsContainer.appendChild(projectElement);
      });
    })
    .catch((error) => console.error("Error fetching projects:", error));
});


function scrollToProjects() {
  const projectsSection = document.getElementById("projects");
  projectsSection.scrollIntoView({ behavior: "smooth" });
}


function parseCSV(csv) {
  const rows = csv.split(/\r?\n/).map((row) => row.split(";"));
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const project = {};
    if (row.length === headers.length) {
      headers.forEach((header, index) => {
        project[header.trim()] = row[index] ? row[index].trim() : "";
        // Verifica si el elemento de la fila está definido antes de acceder a él
      });
    }
    return project;
  });
}


function createProjectElement(project) {
  const cardContainer = document.createElement("div");
  cardContainer.className = "project-card";

  if (project.Image) {
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    img.alt = project.Title;
    img.className = "card-img";
    img.src = project.Image;
    imgContainer.appendChild(img);
    cardContainer.appendChild(imgContainer);
  }

  const cardRest = document.createElement("div");
  cardRest.className = "card-rest"; 
  cardContainer.appendChild(cardRest);

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = project.Title;
  cardRest.appendChild(title);

  const description = document.createElement("p");
  description.textContent = project.Description;
  description.className = "card-description"; 
  cardRest.appendChild(description);

  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";
  cardRest.appendChild(btnContainer);

  if (project.GithubLink) {
    const githubBtn = document.createElement("a");
    githubBtn.className = "btn";
    githubBtn.href = project.GithubLink;
    githubBtn.target = "_blank";
    githubBtn.rel = "noopener noreferrer";
    githubBtn.innerHTML = '<i class="fab fa-github icon-spacing"></i> GitHub';
    btnContainer.appendChild(githubBtn);    
  }

  if (project.LiveDemoLink) {
    const liveDemoBtn = document.createElement("a");
    liveDemoBtn.className = "btn";
    liveDemoBtn.href = project.LiveDemoLink;
    liveDemoBtn.target = "_blank"; // Abre en nueva pestaña
    liveDemoBtn.rel = "noopener noreferrer"; // Seguridad

    // Opción 1: Icono de monitor
    // liveDemoBtn.innerHTML = '<i class="fas fa-desktop icon-spacing"></i> Live Demo';

    // Opción 2: Icono de "play"
    liveDemoBtn.innerHTML = '<i class="fas fa-play icon-spacing"></i> Live Demo';

    btnContainer.appendChild(liveDemoBtn);
  } 

  return cardContainer;
}

