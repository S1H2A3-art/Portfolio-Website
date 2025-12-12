 let pageFont;

async function preloadProjects(){
   projectInformation = fetch("../../../Projects/projectInformation.json").then(response => {return response.json();}).then(data => {processProjectsInformation(data)});
   pageFont = loadFont("../../../Assets/Manrope_Font_Family_(Fontmirror)/Manrope3 Regular 400.otf")
   await projectInformation;
}

async function displayBasicInformation(){
   await preloadProjects();
   let params = new URLSearchParams(window.location.search);
   let currentProjectName = params.get("project");
   console.log(params);

   let currentProject = projects.find(project => project.title === currentProjectName);

   let projectContent = `
      <custom-spacing size = "5rem"></custom-spacing>
   `; 
         
         projectContent += `

         <div class = "project">
            <div class = "projectInformation">
               <h1>${currentProject.title} - ${currentProject.secondary_title}</h1>
               <p class = "projectDate"><i>${currentProject.date}</i>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${currentProject.category}</p>
               <p>${currentProject.description}</p>         
                  
            <div class = "projectConcepts">
         `
         for(let concept of currentProject.concepts){
            projectContent += `
               <a class = "conceptTag" href = "../../Explorer_Page/Explorer.html?concept=${encodeURIComponent(concept)}">
                  ${concept}
               </a>   
            `
         }

         projectContent += `
            </div>
            
            </div> 
            
            <!--<img src = "../../../${currentProject.mini_icon}" width="600*0.3" height="400*0.3" style="margin-left:2rem">-->
         
            <custom-spacing size = "2.5rem"></custom-spacing>
         </div> 
         `


    pageBody.innerHTML = projectContent + pageBody.innerHTML;
    
}
