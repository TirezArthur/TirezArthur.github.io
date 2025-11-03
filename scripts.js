let skills = [];
let projects = [];
let activeSkill = null;

// Load data from JSON file
async function loadProjects() {
  try {
    const response = await fetch("projects.json");
    const data = await response.json();
    console.log(data);
    
    skills = data.skills;
    projects = data.projects;
    
    renderSkills();
    renderProjects();
    setupEventListeners();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function renderSkills() {
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = '';
  
  skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill';
    span.setAttribute('data-skill', skill);
    span.textContent = skill;
    skillsList.appendChild(span);
  });
}

function renderProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';
  
  projects.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project';
    projectDiv.setAttribute('data-skills', project.skills.join(', '));
    
    projectDiv.innerHTML = `
      <img src="${project.image}" alt="${project.title}" />
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-footer">
          <div class="used-skills">
            ${project.skills.map(skill => `<span class="used-skill">${skill}</span>`).join('')}
          </div>
          <a href="${project.link}" target="_blank" class="project-link">
            <img src="Images/link.png" alt="link" />
          </a>
        </div>
      </div>
    `;
    
    projectsGrid.appendChild(projectDiv);
  });
}

function setupEventListeners() {
  const skillElements = document.querySelectorAll(".skill");
  const projectsGrid = document.querySelector(".projects-grid");
  
  skillElements.forEach((skill) => {
    skill.addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedSkill = skill.getAttribute("data-skill");

      if (activeSkill === selectedSkill) {
        clearFilter();
        return;
      }

      activeSkill = selectedSkill;
      updateSkillHighlights(selectedSkill);
      applySkillFilter(selectedSkill);
    });
  });

  // Event delegation for project skill tags
  projectsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("used-skill")) {
      e.stopPropagation();
      const selectedSkill = e.target.textContent.trim();
      const skillElements = document.querySelectorAll(".skill");
      const matchingMainSkill = [...skillElements].find(
        (s) => s.getAttribute("data-skill") === selectedSkill
      );
      
      if (matchingMainSkill) {
        if (activeSkill === selectedSkill) {
          clearFilter();
          return;
        }

        activeSkill = selectedSkill;
        updateSkillHighlights(selectedSkill);
        applySkillFilter(selectedSkill);
      }
    }
  });

  document.body.addEventListener("click", (e) => {
    if (!activeSkill) return;

    const clickedProject = e.target.closest(".project");
    if (clickedProject) {
      const projSkills = clickedProject
        .getAttribute("data-skills")
        .split(",")
        .map((s) => s.trim());
      if (projSkills.includes(activeSkill)) return;
    }

    clearFilter();
  });
}

function updateSkillHighlights(selectedSkill) {
  const skillElements = document.querySelectorAll(".skill");
  const projectSkillTags = document.querySelectorAll(".used-skill");
  
  // Update main skills
  skillElements.forEach((s) => {
    if (s.getAttribute("data-skill") === selectedSkill) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });

  // Update project skill tags
  projectSkillTags.forEach((tag) => {
    if (tag.textContent.trim() === selectedSkill) {
      tag.classList.add("active");
    } else {
      tag.classList.remove("active");
    }
  });
}

function applySkillFilter(selectedSkill) {
  const projectsGrid = document.querySelector(".projects-grid");
  const projectElements = Array.from(document.querySelectorAll(".project"));
  const matching = [];
  const others = [];

  projectElements.forEach((project) => {
    const projSkills = project
      .getAttribute("data-skills")
      .split(",")
      .map((s) => s.trim());
    if (projSkills.includes(selectedSkill)) {
      project.classList.remove("dimmed");
      matching.push(project);
    } else {
      project.classList.add("dimmed");
      others.push(project);
    }
  });

  [...matching, ...others].forEach((p) => projectsGrid.appendChild(p));
}

function clearFilter() {
  const skillElements = document.querySelectorAll(".skill");
  const projectSkillTags = document.querySelectorAll(".used-skill");
  const projectElements = document.querySelectorAll(".project");
  const projectsGrid = document.querySelector(".projects-grid");
  
  activeSkill = null;
  skillElements.forEach((s) => s.classList.remove("active"));
  projectSkillTags.forEach((tag) => tag.classList.remove("active"));
  projectElements.forEach((p) => p.classList.remove("dimmed"));
  projectElements.forEach((p) => projectsGrid.appendChild(p));
}
