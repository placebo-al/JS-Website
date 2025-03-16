document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("nav-container");
    const contentContainer = document.getElementById("content");

    // Fetch the pages data from JSON
    fetch('data/pages.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(pages => {
            // Dynamically create navigation links
            pages.forEach(page => {
                const link = document.createElement('a');
                link.textContent = page.name;
                link.href = "#";
                link.dataset.page = page.page;
                link.addEventListener('click', event => {
                    event.preventDefault();
                    loadContent(page);
                });
                navContainer.appendChild(link);
            });

            // Load initial page content (first item by default)
            if (pages.length > 0) {
                loadContent(pages[0]);
            }
        })
        .catch(error => {
            console.error("Error loading pages:", error);
            contentContainer.textContent = "Error loading content.";
        });

    // Function to dynamically load page content
    function loadContent(page) {
        contentContainer.innerHTML = "";
    
        const heading = document.createElement('h2');
        heading.textContent = page.name;
        contentContainer.appendChild(heading);
    
        if (page.page === "workout") {
            loadWorkoutContent();
        } else if (page.page === "phase1") {
            loadPhase1Content();
        } else if (page.page === "phase2") {
            loadPhase2Content(); // Load Phase 2
        } else if (page.page === "phase3") {  // Load Phase 3
            loadPhase3Content();
        } else if (page.page === "phase4") {  // Load Phase 4
            loadPhase4Content();
        } else {
            const paragraph = document.createElement('p');
            paragraph.textContent = page.content;
            contentContainer.appendChild(paragraph);
        }
    }

// Inside your JS loadWorkoutContent function
// Function to load workout data from essentials.json
function loadWorkoutContent() {
    fetch('data/essentials.json')
        .then(response => response.json())
        .then(workoutData => {
            workoutData.levels.forEach(level => {
                const levelDiv = document.createElement('details');

                // Move <h3> heading out of summary
                levelDiv.innerHTML = `<summary><h3>${level.level}</h3></summary>`;

                level.sections.forEach(section => {
                    const sectionTitle = document.createElement('h4');
                    sectionTitle.textContent = section.title;
                    levelDiv.appendChild(sectionTitle);

                    const table = document.createElement('table');
                    table.classList.add('workout-table');
                    let tableHTML = `<tr><th>Exercise</th><th>Stage 1</th><th>Stage 2</th><th>Stage 3</th><th>Stage 4</th></tr>`;

                    if(section.exercises){
                        section.exercises.forEach(exercise => {
                            tableHTML += `<tr>
                                            <td>${exercise.exercise}</td>
                                            ${exercise.reps.map(rep => `<td>${rep}</td>`).join('')}
                                          </tr>`;
                        });
                    }
                    if(section.details){
                        section.details.forEach(detail => {
                            tableHTML += `<tr>
                                            <td>${detail.exercise}</td>
                                            ${detail.reps.map(rep => `<td>${rep}</td>`).join('')}
                                          </tr>`;
                        });
                    }

                    table.innerHTML = tableHTML;
                    levelDiv.appendChild(table);
                });

                contentContainer.appendChild(levelDiv);
            });
        })
        .catch(error => {
            console.error("Error loading workout:", error);
            contentContainer.textContent = "Error loading workout information.";
        });
}

// Function to add the phase 1 content to the page
function loadPhase1Content() {
    fetch('data/phase1.json')
      .then(response => response.json())
      .then(phase => {
        contentContainer.innerHTML = `
          <h2>${phase.phase}</h2>
          <h4>${phase.goal}</h4>
        `;

        // Weekly Overview Table
        const weekTable = document.createElement('table');
        weekTable.classList.add('weekly-table');
        let weekHTML = `<tr><th>Week</th>${phase.weekly_plan.days.map(day => `<th>${day}</th>`).join('')}</tr>`;
        phase.weekly_plan.weeks.forEach(week => {
          weekHTML += `<tr><td>${week.week}</td>`;
          phase.weekly_plan.days.forEach(day => {
            weekHTML += `<td>${week.schedule[day] ? week.schedule[day].join("<br>") : ""}</td>`;
          });
          weekHTML += '</tr>';
        });
        weekTable.innerHTML = weekHTML;
        contentContainer.appendChild(weekTable);

        // Detailed Exercises
        phase.exercises.forEach(section => {
          const sectionDiv = document.createElement('details');
          sectionDiv.innerHTML = `<summary><h3>${section.category}</h3></summary>`;

          if (section.details) {
              const detailTable = document.createElement('table');
              detailTable.classList.add('workout-table');
              let detailHTML = `<tr><th>Exercise</th><th>Week 1</th><th>Week 2 & 3</th></tr>`;
              section.details.forEach(exercise => {
                  detailHTML += `<tr>
                                  <td>${exercise.exercise}</td>
                                  <td>${exercise.week1 || exercise.description || '-'}</td>
                                  <td>${exercise.week2_3 || '-'}</td>
                                </tr>`;
              });
              detailTable.innerHTML = detailHTML;
              sectionDiv.appendChild(detailTable);
          }

          if (section.subcategories) {
              section.subcategories.forEach(sub => {
                  const subHeading = document.createElement('h4');
                  subHeading.textContent = sub.subcategory;
                  sectionDiv.appendChild(subHeading);

                  const subTable = document.createElement('table');
                  subTable.classList.add('workout-table');
                  let subHTML = `<tr><th>Exercise</th><th>Week 1</th><th>Week 2 & 3</th></tr>`;
                  sub.exercises.forEach(ex => {
                      subHTML += `<tr>
                                  <td>${ex.exercise}</td>
                                  <td>${ex.week1 || ex.reps?.join(', ') || '-'}</td>
                                  <td>${ex.week2_3 || '-'}</td>
                                </tr>`;
                  });
                  subTable.innerHTML = subHTML;
                  sectionDiv.appendChild(subTable);
              });
          }

          contentContainer.appendChild(sectionDiv);
        });

      })
      .catch(error => {
          console.error("Error loading phase 1:", error);
          contentContainer.textContent = "Error loading Phase 1 information.";
      });
}

function loadPhase2Content() {
    fetch('data/phase2.json')
      .then(response => response.json())
      .then(phase => {
        contentContainer.innerHTML = `
          <h2>${phase.phase}</h2>
          <h4>${phase.goal}</h4>
        `;

        // Weekly Schedule (horizontal version)
        const weekTable = document.createElement('table');
        weekTable.classList.add('weekly-table');

        let daysRow = `<tr><th>Day</th>${phase.weekly_plan.days.map(day => `<th>${day}</th>`).join('')}</tr>`;
        let activitiesRow = `<tr><th>Activities</th>${phase.weekly_plan.days.map(day => {
        const activities = phase.weekly_plan.schedule[day];
        return `<td>${activities ? activities.join("<br>") : ""}</td>`;
        }).join('')}</tr>`;

        weekTable.innerHTML = daysRow + activitiesRow;
        contentContainer.appendChild(weekTable);


        // Exercise Categories
        phase.exercise_categories.forEach(section => {
            const detailsDiv = document.createElement('details');
            detailsDiv.innerHTML = `<summary><h3>${section.category}</h3></summary>`;

            const exercises = section.exercises || section.details; // handles both cases

            if (exercises) {
              const table = document.createElement('table');
              table.classList.add('workout-table');

              let tableHTML = "";

              // Decide headers based on available data
              if (exercises[0].reps && Array.isArray(exercises[0].reps)) {
                  tableHTML += `<tr><th>Exercise</th><th>Week 1</th><th>Week 2</th><th>Week 3</th></tr>`;
                  exercises.forEach(ex => {
                      tableHTML += `<tr>
                          <td>${ex.exercise}</td>
                          ${ex.reps.map(rep => `<td>${rep}</td>`).join('')}
                      </tr>`;
                  });
              } else if (exercises[0].sets) {
                  tableHTML += `<tr><th>Exercise</th><th>Sets</th><th>Reps</th></tr>`;
                  exercises.forEach(ex => {
                      tableHTML += `<tr>
                          <td>${ex.exercise}</td>
                          <td>${ex.sets}</td>
                          <td>${ex.reps.join(", ")}</td>
                      </tr>`;
                  });
              } else if (exercises[0].description) {
                  tableHTML += `<tr><th>Exercise</th><th>Description</th></tr>`;
                  exercises.forEach(ex => {
                      tableHTML += `<tr>
                          <td>${ex.exercise}</td>
                          <td>${ex.description}</td>
                      </tr>`;
                  });
              }

              table.innerHTML = tableHTML;
              detailsDiv.appendChild(table);
            }

            contentContainer.appendChild(detailsDiv);
        });

      })
      .catch(error => {
          console.error("Error loading phase 2:", error);
          contentContainer.textContent = "Error loading Phase 2 information.";
      });
}

function loadPhase3Content() {
    fetch('data/phase3.json')
      .then(response => response.json())
      .then(phase => {
        contentContainer.innerHTML = `
          <h2>${phase.phase}</h2>
          <h4>${phase.goal}</h4>
        `;

        // Weekly Schedule Table (Horizontal)
        const weekTable = document.createElement('table');
        weekTable.classList.add('weekly-table');

        let daysRow = `<tr><th>Day</th>${phase.weekly_plan.days.map(day => `<th>${day}</th>`).join('')}</tr>`;
        let activitiesRow = `<tr><th>Activities</th>${phase.weekly_plan.days.map(day => {
            const activities = phase.weekly_plan.schedule[day];
            return `<td>${activities.join("<br>")}</td>`;
        }).join('')}</tr>`;

        weekTable.innerHTML = daysRow + activitiesRow;
        contentContainer.appendChild(weekTable);

        // Exercise categories
        phase.exercise_categories.forEach(section => {
            const detailsDiv = document.createElement('details');
            detailsDiv.innerHTML = `<summary><h3>${section.category}</h3></summary>`;

            const table = document.createElement('table');
            table.classList.add('workout-table');
            let tableHTML = `<tr><th>Exercise</th><th>Sets</th><th>Reps Week 1</th><th>Week 2</th><th>Week 3</th></tr>`;

            section.exercises.forEach(ex => {
                tableHTML += `<tr>
                    <td>${ex.exercise}</td>
                    <td>${ex.sets || '-'}</td>
                    ${ex.reps.map(rep => `<td>${rep}</td>`).join('')}
                </tr>`;
            });

            table.innerHTML = tableHTML;
            detailsDiv.appendChild(table);
            contentContainer.appendChild(detailsDiv);
        });

      })
      .catch(error => {
          console.error("Error loading phase 3:", error);
          contentContainer.textContent = "Error loading Phase 3 information.";
      });
}

// Repeat for Phase 4 (change the filename reference only)
function loadPhase4Content() {
    fetch('data/phase4.json')
      .then(response => response.json())
      .then(phase => {
        contentContainer.innerHTML = `
          <h2>${phase.phase}</h2>
          <h4>${phase.goal}</h4>
        `;

        // Weekly Schedule Table (Horizontal)
        const weekTable = document.createElement('table');
        weekTable.classList.add('weekly-table');

        let daysRow = `<tr><th>Day</th>${phase.weekly_plan.days.map(day => `<th>${day}</th>`).join('')}</tr>`;
        let activitiesRow = `<tr><th>Activities</th>${phase.weekly_plan.days.map(day => {
            const activities = phase.weekly_plan.schedule[day] || [];
            return `<td>${activities.join("<br>")}</td>`;
        }).join('')}</tr>`;

        weekTable.innerHTML = daysRow + activitiesRow;
        contentContainer.appendChild(weekTable);

        // Exercise categories
        phase.exercise_categories.forEach(section => {
            const detailsDiv = document.createElement('details');
            detailsDiv.innerHTML = `<summary><h3>${section.category}</h3></summary>`;
        
            const exercises = section.exercises || section.details;
        
            if (exercises) {
                const table = document.createElement('table');
                table.classList.add('workout-table');
        
                let tableHTML = '';
        
                // Check first element to determine structure
                if (exercises[0].reps && Array.isArray(exercises[0].reps)) {
                    tableHTML += `<tr><th>Exercise</th><th>Sets</th><th>Week 1</th><th>Week 2</th><th>Week 3</th></tr>`;
                    exercises.forEach(ex => {
                        tableHTML += `<tr>
                            <td>${ex.exercise}</td>
                            <td>${ex.sets || '-'}</td>
                            ${ex.reps.map(rep => `<td>${rep}</td>`).join('')}
                        </tr>`;
                    });
                } else if (exercises[0].description) {
                    tableHTML += `<tr><th>Exercise</th><th>Description</th></tr>`;
                    exercises.forEach(ex => {
                        tableHTML += `<tr>
                            <td>${ex.exercise}</td>
                            <td>${ex.description}</td>
                        </tr>`;
                    });
                }
        
                table.innerHTML = tableHTML;
                detailsDiv.appendChild(table);
            }
        
            contentContainer.appendChild(detailsDiv);
        });
        

      })
      .catch(error => {
          console.error("Error loading phase 4:", error);
          contentContainer.textContent = "Error loading Phase 4 information.";
      });
}

    
});
