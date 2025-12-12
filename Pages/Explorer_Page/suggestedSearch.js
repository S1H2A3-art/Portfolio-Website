
//select concept based on suggestions(rather than typing in the input field directly)
function suggestedConceptFinder(input){   

  //make search bar respond to when suggested concept is pressed
  let inputElement = document.getElementById("searchConcept");
  inputElement.value = document.getElementById(input).textContent.trim();
  let userInput = document.getElementById("searchConcept").value;

  //same logic in ConceptMap.js/conceptFinder()
  for(let i = 0; i < conceptsNum; i++){
    if(concepts[i].name == userInput){
      lockMode = i;
      suggestConcepts();
      if(state){
      toggleMenu();
      }
      let acc = p5.Vector.random3D().setMag(5);
      concepts[lockMode].velocity.add(acc);
      return;
    }
  }
}


let conceptsRandom;

//make suggestions
function suggestConcepts(){

    //if a concept is already selected, suggest nearby concepts
    if(lockMode >= 0){
        document.getElementById("suggestedSearch").innerHTML = 
        `<h3 class="red" id="rcLabel">Related concepts</h3>
        <div id="relatedConcepts">
          
        </div>`;
        let distances = [];
        
        let x = concepts[lockMode].position.x;
        let y = concepts[lockMode].position.y
       
        for(let i = 0; i < concepts.length; i++){
            let distance = {name:concepts[i].name, distance:dist(x,y,concepts[i].position.x,concepts[i].position.y)}
            distances.push(distance);
        }
            
        distances.sort((a, b) => a.distance - b.distance);
            
        let relationsHTML = ``;
        for(let i = 1; i < random([5,7,6]); i++){
            let relationHTML = `<button class="relatedConcept" id="r${i}" onclick="suggestedConceptFinder(id)">${distances[i].name}</button>`;
            relationsHTML = relationsHTML + "\n" + relationHTML;
        }
        document.getElementById("relatedConcepts").innerHTML = relationsHTML;
        
    }//else, suggest random concepts
    else{
        document.getElementById("suggestedSearch").innerHTML = 
        `<h3 id="ssLabel">Suggested search</h3>
        <div id="suggestedConcepts">
          
        </div>`;
        let suggestionsHTML = ``;
        
        conceptsRandom = shuffle(concepts);
        for(let i = 0; i < random([4,5,6]); i++){
            let suggestionHTML = `<button class="suggestedConcept" id="s${i}" onclick="suggestedConceptFinder(id)">${conceptsRandom[i].name}</button>`;
            suggestionsHTML = suggestionsHTML + "\n" + suggestionHTML;
        }
        document.getElementById("suggestedConcepts").innerHTML = suggestionsHTML;
    }
       
}

//shows possible matching search results
function searchAssist(){

    let inputElement = document.getElementById("searchConcept");

    //if input is detected
    if(inputElement.value !== "" && inputElement.value!=="Enter concept"){
        let searchOptions = [];
     
        //if letters match, add concept
        for(let concept of concepts){
            if(concept.name.includes(inputElement.value.toLowerCase())){
                searchOptions.push(concept.name);
            }
        }

        //if there are matching search results, add it as HTML button that locks unto its corresponding concept via suggestedConceptFinder()
        if(searchOptions && concepts.findIndex(obj => obj.name === inputElement.value) < 0){
        let assistsHTML = ``;
        for(let i = 0; i < Math.min(searchOptions.length,10);i++){
            let assistWordParts = searchOptions[i].split(new RegExp(`(${inputElement.value})`, 'i'));
            let assistHTML = `
                <button class="assistConcept" id="as${i}" onmousedown="suggestedConceptFinder(id)">
            `;
            for(let assistWordPart of assistWordParts){
                if(assistWordPart.toLowerCase() === inputElement.value.toLowerCase()){
                    assistHTML += `<span style="color:red;">${assistWordPart}</span>`;
                }
                else{
                    assistHTML += `<span style="color:black;">${assistWordPart}</span>`;
                }
            }
            assistHTML += "</button>";
            assistsHTML = assistsHTML + "\n" + assistHTML;
        }
        document.getElementById("searchAssist").innerHTML = assistsHTML;

    //make elements appear/disappear to make matching search results fit on screen
        if(document.getElementById("suggestedConcepts")){
            document.getElementById("suggestedConcepts").style.display="none";
            document.getElementById("ssLabel").style.display="none";
        }else{
            document.getElementById("relatedConcepts").style.display="none";
            document.getElementById("rcLabel").style.display="none";
        }
        }else{
            document.getElementById("searchAssist").innerHTML = "";
        }   
    }
    else{
       
        document.getElementById("searchAssist").innerHTML = "";
        if(document.getElementById("suggestedConcepts")){
            document.getElementById("suggestedConcepts").style.display="flex";
            document.getElementById("ssLabel").style.display="flex";
        }else{
            document.getElementById("relatedConcepts").style.display="flex";
            document.getElementById("rcLabel").style.display="flex";
        }
       
    }
}





