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
  const projectContainer = document.createElement("div");
  projectContainer.className = "about-container"; 

  // Crear el contenedor de detalles del proyecto
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container color-container";
  projectContainer.appendChild(detailsContainer);

  // Crear el contenedor de la imagen
  const imgContainer = document.createElement("div");
  imgContainer.className = "article-container";
  const img = document.createElement("img");
  img.src = project.Image;
  img.alt = project.Title;
  img.className = "project-img";
  imgContainer.appendChild(img);
  detailsContainer.appendChild(imgContainer);

  // Crear el título del proyecto
  const title = document.createElement("h2");
  title.className = "experience-sub-title project-title";
  title.textContent = project.Title;
  detailsContainer.appendChild(title);

  // Crear la descripción del proyecto con la clase de margen
  const description = document.createElement("p");
  description.textContent = project.Description;
  description.className = "description-margin"; // Aplica la clase de margen
  detailsContainer.appendChild(description);

  // Crear el contenedor de botones
  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";
  detailsContainer.appendChild(btnContainer);

  // Crear el botón de Github
  const githubBtn = document.createElement("button");
  githubBtn.className = "btn";
  githubBtn.textContent = "Github";
  githubBtn.onclick = () => (window.location.href = project.GithubLink);
  btnContainer.appendChild(githubBtn);

  // Crear el botón de Live Demo solo si el proyecto tiene un enlace de demostración
  if (project.LiveDemoLink) {
    const liveDemoBtn = document.createElement("button");
    liveDemoBtn.className = "btn";
    liveDemoBtn.textContent = "Live Demo";
    liveDemoBtn.onclick = () => (window.location.href = project.LiveDemoLink);
    btnContainer.appendChild(liveDemoBtn);
  }

  return projectContainer; // Devolver el contenedor principal del proyecto
}


function scrollToProjects() {
  const projectsSection = document.getElementById("projects");
  projectsSection.scrollIntoView({ behavior: "smooth" });
}
/*
function scrollToProjects() {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('scroll-arrow-container').style.display = 'none'; // Oculta el contenedor de la flecha
}
*/

var isArrowVisible = false; // Variable para controlar la visibilidad de la flecha
window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;
    var profileSectionHeight = document.getElementById('profile').offsetHeight;
    var scrollArrowContainer = document.getElementById('arrow');

    if (scrollTop < windowHeight * 0.1 && scrollTop < profileSectionHeight) { // Ajusta el umbral a un 10% de la altura de la ventana
        if (!isArrowVisible) {
            scrollArrowContainer.style.display = 'block';
            isArrowVisible = true;
        }
    } else {
        if (isArrowVisible) {
            scrollArrowContainer.style.display = 'none';
            isArrowVisible = false;
        }
    }
});
