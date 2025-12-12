
//show projects that contain selected concept based on project information
function showProjects(){
 
        let projectsHTML =`<h3>Related Projects</h3>`;
        for(let project of concepts[lockMode].projects){
            projectsHTML += `
            <div class="projectInformation">
                
                <div class="projectDescription">
                    <a class="projectTitle" href="../Project_Pages/${project.page}?concept=${encodeURIComponent(concepts[lockMode].name)}&project=${encodeURIComponent(project.title)}"><p><strong>${project.title}</strong></p></a>
                    <p class="categoryTitle"> ${project.category} </p>
                    <p class="dateTitle"> ${project.date} </p>
                </div>
                <div class="imageContainer">
                <img class="icons" src="../../${project.mini_icon}">
                </div>
            </div>
                `
        }
        document.getElementById("projectsInformation").innerHTML = projectsHTML;
         
      
}
