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
/*
function createProjectElement(project) {
  // Crear el contenedor principal para cada proyecto
  const cardContainer = document.createElement("div");
  cardContainer.className = "project-card";

  // Crear el contenedor de la imagen
  const imgContainer = document.createElement("img-container");
  //imgContainer.className = "article-container";
  const img = document.createElement("img");
  img.src = project.Image;
  img.alt = project.Title;
  img.className = "card-img";
  imgContainer.appendChild(img);
  cardContainer.appendChild(imgContainer);

  const cardRest = document.createElement("card-rest");
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
  const githubBtn = document.createElement("button");
  githubBtn.className = "btn";
  githubBtn.textContent = "Github";
  githubBtn.onclick = () => window.open(project.GithubLink, '_blank');
  btnContainer.appendChild(githubBtn);  

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

var isArrowVisible = false; // Variable para controlar la visibilidad de la flecha
window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;
    var profileSectionHeight = document.getElementById('profile').offsetHeight;
    var scrollArrowContainer = document.getElementById('scroll-arrow-container'); // Cambio aquí

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





var data = { q: "https://github.com/matichewer/PDF-Password-Remover" };
var key = "075f79d79c9a3861f50194f6c15b2119"

fetch("https://api.linkpreview.net", {
  method: "POST",
  headers: {
    'X-Linkpreview-Api-Key': key,
  },
  mode: "cors",
  body: JSON.stringify(data)
})
  .then((res) => res.json())
  .then((response) => {
   // document.getElementById("mytitle").innerHTML = response.title;
   // document.getElementById("mydescription").innerHTML = response.description;
    document.getElementById("myimage").src = response.image;
   // document.getElementById("myurl").innerHTML = response.url;
  });
*/




























function createProjectElement(project) {
  // Crear el contenedor principal para cada proyecto
  const cardContainer = document.createElement("div");
  cardContainer.className = "project-card";

  // Crear el contenedor de la imagen
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  img.alt = project.Title;
  img.className = "card-img";
  
  // Verificar si project.Image está vacío
  if (project.Image.trim() === "") {
    // Si está vacío, obtener la imagen de project.GithubLink mediante la API de LinkPreview
    const key = "075f79d79c9a3861f50194f6c15b2119";
    const data = { q: project.GithubLink };

    fetch("https://api.linkpreview.net", {
      method: "POST",
      headers: {
        'X-Linkpreview-Api-Key': key,
      },
      mode: "cors",
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((response) => {
      img.src = response.image;
    })
    .catch((error) => console.error("Error fetching image:", error));
  } else {
    // Si project.Image no está vacío, usar la imagen proporcionada en project.Image
    img.src = project.Image;
  }

  imgContainer.appendChild(img);
  cardContainer.appendChild(imgContainer);

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
  const githubBtn = document.createElement("button");
  githubBtn.className = "btn";
  githubBtn.textContent = "Github";
  githubBtn.onclick = () => window.open(project.GithubLink, '_blank');
  btnContainer.appendChild(githubBtn);  

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
