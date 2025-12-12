 function preload(){
    projectInformation = loadJSON("../../Projects/projectInformation.json", processProjectsInformation);
 }

function setup(){
   clearInput();

   //default by date sorting
   projects.sort((a, b) => new Date(b.date) - new Date(a.date));

   // Add project divs
   addProjectDivs();

   // Add genre buttons 
   for(let genre of genres){
      document.getElementById("genreContainer").innerHTML+=
         `
        <button class="genre" onclick="selectGenre('${genre}'); clearInput();">${genre}</button>
         `
      ;
   }

   //apply search filter
   searchProjects();
   
}

let genres = [];
let genreSet = new Set();

function addProjectDivs(){
   for(let project of projects){
      if(project.title){
         let categoryParts = project.category.split(",");
         for(let category of categoryParts){
            const trimmed = category.trim();
            const normalized = trimmed.toLowerCase();
            //if the genre is not already in the set, add it
            if(!genreSet.has(normalized)){
               genreSet.add(normalized);
               genres.push(trimmed);
            }
         }
         let projectContent = ""; 
         
         // Create project div
         projectContent += `

         <div class = "project">
            <div class = "projectInformation">
               <a href = "../Project_Pages/${project.page}?project=${encodeURIComponent(project.title)}"><h1>${project.title} - ${project.secondary_title}</h1></a>
               <p class = "projectDate" style="display:inline"><i>${project.date}</i></p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p style="display:inline " class = "projectCategory">${project.category}</p>
               <p>${project.description}</p>         
                  
            <div class = "projectConcepts">
         `
         for(let concept of project.concepts){
            projectContent += `
               <a class = "conceptTag" href = "../Explorer_Page/Explorer.html?concept=${encodeURIComponent(concept)}">
                  ${concept}
               </a>   
            `
         }

         projectContent += `
            </div>
            
            </div> 
            
            <!--<img src = "../../${project.mini_icon}" width="600*0.3" height="400*0.3" style="margin-left:2rem">-->
         
            <div class = "space">
               placeholder
            </div>
         </div> 
         `

         archiveContent.insertAdjacentHTML('beforeend',projectContent);
      }
   }
}


   let searchInput = document.getElementById("searchProject");

   //If user types in the search bar
   searchInput.addEventListener('input', function(){
      //reset to page 1 when searching
      pageNum = 1;
      //apply filter
      searchProjects();
      //reorganize pages based on new search results
      organizePages();
   });
   
   let selectedGenre = "genre";
   let projectsNum = 0;

   //function to filter projects based on search input and selected genre
   function searchProjects(){

      //reset number of projects that satisfy the search
      projectsNum = 0;
      const input = searchInput.value.toLowerCase();
      const normalizedGenre = selectedGenre;
      const projectDivs = document.getElementsByClassName("project");

      //check if each project matches the search input and selected genre
      for(let projectDiv of projectDivs){

         //get project title and categories
         const title = projectDiv.getElementsByTagName("h1")[0].innerText.toLowerCase();
         const categories = projectDiv.getElementsByClassName("projectCategory")[0].innerText.toLowerCase().split(',').map(c => c.trim());

         //check for matches
         const matchesGenre = normalizedGenre === "all" || normalizedGenre === "genre" || categories.includes(normalizedGenre);
         const matchesSearch = title.includes(input);

         //show project if it matches both genre and search input
         if(matchesGenre && matchesSearch){
            projectDiv.classList.remove("noSearchResults");
            projectDiv.classList.add("searchResults");
            //increment count of projects that match search criteria
            projectsNum++;
         }else{
            //hide project if it doesn't match
            projectDiv.classList.remove("searchResults");
            projectDiv.classList.add("noSearchResults");
         }
      }
      //display alert if no projects match the search criteria
      if(projectsNum === 0){
         searchAlert.innerHTML = `<div class="customSpacing" style="height:3rem"></div><h1 style="background-image: radial-gradient(ellipse at center, rgb(100, 100, 100));background-clip: text; -webkit-text-fill-color: transparent; ">No result. Please enter a valid project name.</h1>`;
      }else{
         searchAlert.innerHTML = ``;
      }
      
      //reorganize pages based on filtered results 
      organizePages();
   };

  function selectGenre(input){
   pageNum = 1;
   const normalizedInput = input.toLowerCase().trim();
   selectedGenre = normalizedInput;
   document.getElementById("genreLabel").textContent = normalizedInput === "genre" ? "Genre" : input.trim();
   clearInput();
   searchProjects();
     
  }

  function clearInput(){
   searchInput.value = "";
  }

let pageNum = 1;
function organizePages(){
   
   const results = Array.from(document.getElementsByClassName("searchResults")); // snapshot to avoid live collection issues
   const startIndex = (pageNum - 1) * 10;
   const endIndex = pageNum * 10;
 
   results.forEach((projectEl, idx) => {
      const inPageRange = idx >= startIndex && idx < endIndex;
      if(inPageRange){
         projectEl.classList.remove("noSearchResults");
         projectEl.classList.add("searchResults");
      }else{
         projectEl.classList.add("noSearchResults");
         projectEl.classList.remove("searchResults");
      }
   });
   let buttonsHTML = "<div id=\"pageButtonsContainer\">";
   
   for(let i = 1; i <= Math.ceil(projectsNum / 10); i++){
      const currentClass = i === pageNum ? "currentPageButton" : "";
      buttonsHTML += `<button class="${currentClass}" onclick="changePage(${i})">${i}</button>`;
   }
   buttonsHTML += "</div>";
   if(!document.getElementById("pageButtonsContainer")){
      document.getElementById("archiveContent").insertAdjacentHTML('beforeend', buttonsHTML);
   }
   else{
      document.getElementById("pageButtonsContainer").outerHTML = buttonsHTML;
   }
}

function changePage(num){
  if(num === pageNum) return;
   
   pageNum = num;
   searchProjects();
   window.scrollTo(0, 0);
}
