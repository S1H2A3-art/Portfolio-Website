/* ============================================================
   Add DOM to about page
   ============================================================ */

// generation button and logic
function createGenerationButton(type, containerId, buttonId, buttonLabel, loadingText, prompt){
    let container = null;
    if(type === "class"){
        container = document.getElementsByClassName(containerId)[0];
    }
    else if(type === "id"){
        container = document.getElementById(containerId);
    }

    let generateButton = document.createElement("button");
    generateButton.id = buttonId;
    generateButton.innerText = buttonLabel;
    generateButton.onclick = () => {
        generateButton.disabled = true;
        generateButton.innerText = loadingText;
        generateDescription(prompt, container);
    }

    container.appendChild(generateButton);
}

// create button to generate description for the artist statement
createGenerationButton("class", "rightTextAndImageElement", "descriptionButton", "Generate artist statement", "Generating artist statement...", "Infer and compose an artist statement for designer Shawn Qiu based on the holistic skills and themes expressed across his portfolio website from a third person perspective. Do not focus on particular projects or individual concepts—capture the overall creative identity instead. Respond with a single brief paragraph and include no extra commentary or formatting.")

// create button to generate description for the skills
createGenerationButton("id", "skillsDescriptionContainer", "skillsDescriptionButton", "Generate skills summary of Shawn Qiu", "Generating skills summary...", "provide a detailed summary of the technical and artistic skills possessed by the designer Shawn Qiu based on his portfolio website, highlighting key areas of expertise.")

// create button to generate description for the interesteed concepts
createGenerationButton("id", "interestedConceptsContainer", "interestedConceptsButton", "Generate a list of notions Shawn Qiu is interested in", "Generating notions...", "only list 5 essential concepts that the designer Shawn Qiu used in his projects in based on his portfolio website. Provide the concepts in a bullet point format and a one sentence explanation for each. Do not include any additional information beyond the list. Seperated each concept with a newline and space in between.")

// create button to generate description for the featured projects
createGenerationButton("id", "featuredProjectsContainer", "featuredProjectsButton", "Generate a list of featured projects", "Generating featured projects...", "list these 3 featured projects created by the designer Shawn Qiu based on his portfolio website: Zero Gravity Theatre: The Brothers Karamazov, The Guidebook for the Conscious Book, Shhhh!!!, and Water... .Provide a brief description of each project and its significance.")

// retrieve RAG response from prompt
async function askAIAssistant(message) {
    try {
        const res = await fetch(AIAssistant.webHookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: message, currentPage: window.location.pathname, currentSelectedConcept: "not applicable", currentProjectTitle: "not applicable", memorySessionId: 0, keepMemoryNumber: 0 })
        });

        const data = await res.json();
        return data.output;

    }catch (err) {
        console.error(err);
        return null;
    }
}

// insert description text based response from askAIAssistant 
async function generateDescription(message, containerElement) {
    const response = await askAIAssistant(message);

    if (!response) {
        console.error('No response from AI Assistant');
        return;
    }

    const descriptionTextBody = document.createElement("pre");
    descriptionTextBody.id = "descriptionTextBody";
    containerElement.innerHTML = "";
    containerElement.appendChild(descriptionTextBody);

    // add letter one-by-one and scroll to bottom
    for (let i = 0; i < response.length; i++) {
        descriptionTextBody.innerHTML += response.charAt(i);
        await new Promise(resolve => setTimeout(resolve, 20));
        descriptionTextBody.scrollTop = descriptionTextBody.scrollHeight;
    }
}

