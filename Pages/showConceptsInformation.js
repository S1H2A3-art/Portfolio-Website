function showConceptsInformation(){
  let conceptInformationList = [];
   for(let concept of concepts){
    let conceptInformation = {
      conceptName: concept.name,
      relatedProjects: [],
      relatedConcepts: []
    };
    for(let project of concept.projects){
      conceptInformation.relatedProjects.push(project.title);
    }
    for(let i = 0; i < conceptsNum; i++){
      if(relatedness[concepts.indexOf(concept)][i]){
        conceptInformation.relatedConcepts.push(concepts[i].name + " (relatedness: " + relatedness[concepts.indexOf(concept)][i].toFixed(2) + ")"); 
      }
    }
    
    conceptInformationList.push(conceptInformation);

  }
  conceptInformationList = JSON.stringify(conceptInformationList);
  console.log(conceptInformationList);
}