document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("nav-container");
    const contentContainer = document.getElementById("content");

    // Load navigation
    fetch('data/pages.json')
    .then(response => response.json())
    .then(pages => {
      pages.forEach(page => {
        if (page.submenu) {
          // Create submenu container
          const submenuContainer = document.createElement('div');
          submenuContainer.classList.add('submenu');
  
          const parentLink = document.createElement('div');
          parentLink.classList.add('nav-item');
          parentLink.textContent = page.name;
  
          submenuContainer.appendChild(parentLink);
  
          // Create submenu links
          const submenuList = document.createElement('div');
          submenuList.classList.add('submenu-items');
  
          page.submenu.forEach(subpage => {
            const subLink = document.createElement('a');
            subLink.textContent = subpage.name;
            subLink.href = "#";
            subLink.classList.add('submenu-item');
            subLink.addEventListener('click', (e) => {
              e.preventDefault();
              loadContent(subpage);
            });
  
            submenuList.appendChild(subLink);
          });
  
          submenuContainer.appendChild(submenuList);
          navContainer.appendChild(submenuContainer);
  
        } else {
          const link = document.createElement('a');
          link.textContent = page.name;
          link.href = "#";
          link.classList.add('nav-item');
          link.addEventListener('click', (e) => {
            e.preventDefault();
            loadContent(page);
          });
  
          navContainer.appendChild(link);
        }
      });
    });
  

    // Generalised Content Loader
    function loadContent(page) {
        contentContainer.innerHTML = `<h2>${page.name}</h2>`;
    
        if (page.submenu) return; // Skip parent menu items like "Phases"
    
        if (page.page === "workout") {
            loadWorkoutContent(); // ✅ Ensures essentials.json still loads
        } else if (["phase1", "phase2", "phase3", "phase4"].includes(page.page)) {
            loadPhaseData(`data/${page.page}.json`);
        } else {
            contentContainer.innerHTML += `<p>${page.content}</p>`;
        }
    }
    

    // Reusable Phase Data Loader (new function!)
    function loadPhaseData(jsonPath) {
        fetch(jsonPath)
            .then(res => res.json())
            .then(data => {
                contentContainer.innerHTML = `
                    <h2>${data.phase}</h2>
                    <h4>${data.goal}</h4>
                `;

                renderWeeklyPlan(data.weekly_plan);
                data.exercise_categories.forEach(renderExerciseCategory);
            })
            .catch(err => contentContainer.textContent = "Error loading phase data.");
    }

    // Helper function: Weekly Plan
    function renderWeeklyPlan(weekly_plan) {
        const table = document.createElement('table');
        table.classList.add('weekly-table');

        let headers = `<tr><th>Day</th>${weekly_plan.days.map(day => `<th>${day}</th>`).join('')}</tr>`;
        let activities = `<tr><th>Activities</th>${weekly_plan.days.map(day => 
            `<td>${weekly_plan.schedule[day]?.join("<br>") || ""}</td>`
        ).join('')}</tr>`;

        table.innerHTML = headers + activities;
        contentContainer.appendChild(table);
    }

    // Helper function: Exercise Categories
// 🔹 This function handles rendering exercise categories
function renderExerciseCategory(category) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('exercise-section');

    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category.category;
    sectionDiv.appendChild(categoryTitle);

    // ✅ Calls the new helper function to generate the exercise table
    const table = generateExerciseTable(category);
    sectionDiv.appendChild(table);

    contentContainer.appendChild(sectionDiv);
}

// 🔹 This function generates an exercise table (NEW!)
function generateExerciseTable(category) {
    const table = document.createElement('table');
    table.classList.add('workout-table');

    if (category.category === "Energy System Development") {
        table.innerHTML = `
            <tr><th>Name</th><th>Description</th><th>Work Interval</th><th>Rest Interval</th><th>Total Time</th></tr>
            ${category.exercises.map(ex => `
                <tr>
                    <td>${ex.name}</td>
                    <td>${ex.description}</td>
                    <td>${ex.work_interval}</td>
                    <td>${ex.rest_interval}</td>
                    <td>${ex.total_time}</td>
                </tr>
            `).join('')}
        `;
    } else {
        table.innerHTML = `
            <tr><th>Exercise</th><th>Sets</th><th>Week 1</th><th>Week 2</th><th>Week 3</th></tr>
            ${category.exercises.map(ex => `
                <tr>
                    <td>${ex.name}</td>
                    <td>${ex.sets || '-'}</td>
                    ${ex.reps.map(rep => `<td>${rep}</td>`).join('')}
                </tr>
            `).join('')}
        `;
    }

    return table;
}
    

    // Workout Loader (leave as-is or simplify later)
    function loadWorkoutContent() {
        fetch('data/essentials.json')
            .then(res => res.json())
            .then(workout => {
                workout.levels.forEach(level => {
                    const details = document.createElement('details');
                    details.innerHTML = `<summary><h3>${level.level}</h3></summary>`;

                    level.sections.forEach(section => {
                        const h4 = document.createElement('h4');
                        h4.textContent = section.title;
                        details.appendChild(h4);

                        const table = document.createElement('table');
                        table.classList.add('workout-table');
                        table.innerHTML = `
                            <tr><th>Exercise</th><th>Stage 1</th><th>Stage 2</th><th>Stage 3</th><th>Stage 4</th></tr>
                            ${section.exercises?.map(ex => `
                                <tr>
                                    <td>${ex.exercise}</td>
                                    ${ex.reps.map(rep => `<td>${rep}</td>`).join('')}
                                </tr>
                            `).join('') || ''}
                        `;
                        details.appendChild(table);
                    });

                    contentContainer.appendChild(details);
                });
            });
    }
});
