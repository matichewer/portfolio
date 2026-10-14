const GITHUB_ICON =
  '<svg class="btn-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>';
const PLAY_ICON =
  '<svg class="btn-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2v12l10-6z"/></svg>';

const projectCards = [];
let renderedColumnCount = 0;

window.addEventListener("DOMContentLoaded", () => {
  fetch("projects.csv")
    .then((response) => response.text())
    .then((data) => {
      parseCSV(data).forEach((project) => {
        projectCards.push(createProjectElement(project));
      });
      layoutProjects();
      window.addEventListener("resize", layoutProjects);
    })
    .catch((error) => console.error("Error fetching projects:", error));
});


// Masonry layout: each card goes into the shortest column, so the first row
// follows the CSV order. The column count comes from --columns in the CSS.
function layoutProjects() {
  const container = document.getElementById("projects-container");
  const columnCount =
    parseInt(getComputedStyle(container).getPropertyValue("--columns"), 10) || 1;
  if (columnCount === renderedColumnCount) return;
  renderedColumnCount = columnCount;

  const columns = Array.from({ length: columnCount }, () => {
    const column = document.createElement("div");
    column.className = "projects-column";
    return column;
  });
  container.replaceChildren(...columns);

  projectCards.forEach((card) => {
    const shortest = columns.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a));
    shortest.appendChild(card);
  });
}


// Mouse wheel on the profile section glides to Projects, and scrolling up from
// Projects glides back to the top. Inside Projects the wheel scrolls normally.
const GLIDE_DURATION = 900; // ms
let gliding = false;

window.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (gliding) {
      event.preventDefault(); // ignore wheel/trackpad input until the glide ends
      return;
    }

    const projectsTop = document.getElementById("projects").offsetTop;
    if (event.deltaY > 0 && window.scrollY < projectsTop - 1) {
      event.preventDefault();
      glideTo(projectsTop);
    } else if (event.deltaY < 0 && window.scrollY > 0 && window.scrollY + event.deltaY < projectsTop - 1) {
      event.preventDefault();
      glideTo(0);
    }
  },
  { passive: false }
);

// The arrow uses the same glide (its href still works without JS)
document.querySelector(".arrow").addEventListener("click", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  event.preventDefault();
  glideTo(document.getElementById("projects").offsetTop);
});

// Custom animation instead of behavior: "smooth", which is short and starts abruptly
function glideTo(top) {
  const start = window.scrollY;
  const distance = top - start;
  const startTime = performance.now();
  gliding = true;

  function step(now) {
    const progress = Math.min((now - startTime) / GLIDE_DURATION, 1);
    window.scrollTo({ top: start + distance * easeInOutCubic(progress), behavior: "instant" });
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      gliding = false;
    }
  }
  requestAnimationFrame(step);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}


function parseCSV(csv) {
  const rows = csv.split(/\r?\n/).map((row) => row.split(";"));
  const headers = rows[0];
  // Skip blank or malformed rows instead of rendering empty cards
  return rows
    .slice(1)
    .filter((row) => row.length === headers.length)
    .map((row) => {
      const project = {};
      headers.forEach((header, index) => {
        project[header.trim()] = row[index].trim();
      });
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
    img.loading = "lazy";
    img.decoding = "async";
    // Reserve the image's space before it loads (no layout shift)
    if (project.ImageWidth && project.ImageHeight) {
      img.width = project.ImageWidth;
      img.height = project.ImageHeight;
    }
    imgContainer.appendChild(img);
    cardContainer.appendChild(imgContainer);
  }

  const cardRest = document.createElement("div");
  cardRest.className = "card-rest"; 
  cardContainer.appendChild(cardRest);

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = project.Title;
  cardRest.appendChild(title);

  if (project.Tags) {
    const tagList = document.createElement("ul");
    tagList.className = "card-tags";
    tagList.setAttribute("aria-label", "Technologies");
    project.Tags.split(",").forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = tag.trim();
      tagList.appendChild(item);
    });
    cardRest.appendChild(tagList);
  }

  const description = document.createElement("p");
  description.textContent = project.Description;
  description.className = "card-description"; 
  cardRest.appendChild(description);

  if (!project.GithubLink && !project.LiveDemoLink) return cardContainer;

  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";
  cardRest.appendChild(btnContainer);

  if (project.GithubLink) {
    const githubBtn = document.createElement("a");
    githubBtn.className = "btn";
    githubBtn.href = project.GithubLink;
    githubBtn.target = "_blank";
    githubBtn.rel = "noopener noreferrer";
    githubBtn.innerHTML = `${GITHUB_ICON} GitHub`;
    btnContainer.appendChild(githubBtn);    
  }

  if (project.LiveDemoLink) {
    const liveDemoBtn = document.createElement("a");
    liveDemoBtn.className = "btn";
    liveDemoBtn.href = project.LiveDemoLink;
    liveDemoBtn.target = "_blank"; // Abre en nueva pestaña
    liveDemoBtn.rel = "noopener noreferrer"; // Seguridad
    liveDemoBtn.innerHTML = `${PLAY_ICON} Try it`;

    btnContainer.appendChild(liveDemoBtn);
  } 

  return cardContainer;
}

