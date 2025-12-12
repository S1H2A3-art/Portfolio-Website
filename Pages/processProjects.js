//load all JSON data
let projectInformation;

//stores all projects
let projects = [];

//stores all concepts
let concepts = [];
let conceptsNum = 0; 

//2D array that stores relatedness between each and every concept
let relatedness = [];
let maxRelation = 0;

function processProjectsInformation(results){

  //set up projects array and concepts array
  for(let project of results){
    if(project && project.concepts){
      projects.push(project);
      for(let concept of project.concepts){
        if(concepts && !concepts.some(obj => obj.name === concept)){
          concepts.push({
            position: p5.Vector.random3D().setMag(conceptsNum*10),
            velocity: createVector(0,0,0),
            name: concept,
            relations:0,
            projects:[]
          });
          conceptsNum++;   
        }
      }   

      //concepts contained in the same project will increase in relatedness 
      for(let i = 0; i < project.concepts.length; i++){
        let conceptIndex = concepts.findIndex(obj => obj.name === project.concepts[i]);
        concepts[conceptIndex].projects.push(project);
        if(relatedness[conceptIndex]){
          relatedness[conceptIndex] = relatedness[conceptIndex].concat(new Array(concepts.length - relatedness[conceptIndex].length));
        }else{
          relatedness.push(new Array(concepts.length));
        }
        for(let j = 0; j < project.concepts.length; j++){
          let concept2Index = concepts.findIndex(obj => obj.name === project.concepts[j]);
          
          if(relatedness[conceptIndex][concept2Index]){
            relatedness[conceptIndex][concept2Index]++;
          }else{
            relatedness[conceptIndex][concept2Index] = 1;
          }  
        }
      }

      //caculates total relations for each concept
      for(let i = 0; i < conceptsNum; i++){
        let relationsSum = 0;
        for(let j = 0; j < conceptsNum; j++){
          if(i != j && relatedness[i][j]){
            relationsSum += relatedness[i][j];
          }
        }
        concepts[i].relations = relationsSum;
        if(relationsSum > maxRelation){
          maxRelation = relationsSum;
        }
      }

    }
  }
}