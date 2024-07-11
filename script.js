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
  // Crear el contenedor principal para cada proyecto
  const cardContainer = document.createElement("div");
  cardContainer.className = "project-card";

  // Crear el contenedor de la imagen
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

  // Crear el título del proyecto
  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = project.Title;
  cardRest.appendChild(title);

  // Crear la descripción del proyecto con la clase de margen
  const description = document.createElement("p");
  description.textContent = project.Description;
  description.className = "card-description"; 
  cardRest.appendChild(description);

  // Crear el contenedor de botones
  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";
  cardRest.appendChild(btnContainer);

  // Crear el botón de Github
  if (project.GithubLink) {
    const githubBtn = document.createElement("button");
    githubBtn.className = "btn";
    githubBtn.textContent = "Github";
    githubBtn.onclick = () => window.open(project.GithubLink, '_blank');
    btnContainer.appendChild(githubBtn);  
  }

  // Crear el botón de Live Demo solo si el proyecto tiene un enlace de demostración
  if (project.LiveDemoLink) {
    const liveDemoBtn = document.createElement("button");
    liveDemoBtn.className = "btn";
    liveDemoBtn.textContent = "Live Demo";
    liveDemoBtn.onclick = () => window.open(project.LiveDemoLink, '_blank');
    btnContainer.appendChild(liveDemoBtn);
  }  

  return cardContainer; // Devolver el contenedor principal del proyecto
}
