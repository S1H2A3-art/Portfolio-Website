/* ============================================================
   AI Assistant Logic
   ============================================================ */

let AIAssistant = {
    // URL to RAG workflow
    webHookURL: "https://shawnqiu.app.n8n.cloud/webhook/a96db540-175e-473a-85a9-d3bac0b6fa8b",
    minimized: false,
    // interval between each AI face model image switch
    interval: 400,
    // current webpage 
    prefix: "",
    // AI face model image container
    AIFaceModelDisplay: null,
    AIFaceModelImages: ["AIFaceModelImage(1).png", "AIFaceModelImage(2).png", "AIFaceModelImage(3).png", "AIFaceModelImage(4).png", "AIFaceModelImage(5).png", "AIFaceModelImage(6).png", "AIFaceModelImage(7).png", "AIFaceModelImage(8).png", "AIFaceModelImage(9).png", "AIFaceModelImage(10).png", "AIFaceModelImage(11).png", "AIFaceModelImage(12).png", "AIFaceModelImage(13).png", "AIFaceModelImage(14).png", "AIFaceModelImage(15).png", "AIFaceModelImage(16).png", "AIFaceModelImage(17).png", "AIFaceModelImage(18).png", "AIFaceModelImage(19).png", "AIFaceModelImage(20).png", "AIFaceModelImage(21).png", "AIFaceModelImage(22).png", "AIFaceModelImage(23).png", "AIFaceModelImage(24).png", "AIFaceModelImage(25).png", "AIFaceModelImage(26).png", "AIFaceModelImage(27).png", "AIFaceModelImage(28).png", "AIFaceModelImage(29).png", "AIFaceModelImage(30).png", "AIFaceModelImage(31).png", "AIFaceModelImage(32).png", "AIFaceModelImage(33).png", "AIFaceModelImage(34).png", "AIFaceModelImage(35).png", "AIFaceModelImage(36).png", "AIFaceModelImage(37).png", "AIFaceModelImage(38).png"],
    // AI face model image alternation timer
    imageIntervalId: null,

    defaultMessage: "Hello! How can I assist you today?",
    recommendationMessages: [],
    recommendationMessagesIndex: 0,

    // current conversation memory ID
    memorySessionId: null,

    /* =========== AI Assistant DOM Logic =========== */
    displayAIAssistant() {

        // AI assistant container
        const AIContainer = document.createElement("div");
        AIContainer.id = "AIContainer";
        document.getElementsByTagName("body")[0].appendChild(AIContainer);

        // faster alternation between different AI face model images when mouse hovers above AI assistant
        AIContainer.addEventListener("mouseenter", () => {
            interval = 50;
        });
        AIContainer.addEventListener("mouseleave", () => {
            interval = 400;
        });

        // AI chatBox container
        const AIContainerBody = document.createElement("div");
        AIContainerBody.id = "AIContainerBody";
        AIContainer.appendChild(AIContainerBody);

        const AIChatBox = document.createElement("div");
        AIChatBox.id = "AIChatBox";
        AIContainerBody.appendChild(AIChatBox);

        const welcomeMessage = document.createElement("div");
        welcomeMessage.className = "AIMessage";
        welcomeMessage.innerHTML = `<strong>AI:</strong> ${this.defaultMessage}`;
        AIChatBox.appendChild(welcomeMessage);

        // user input
        const inputContainer = document.createElement("div");
        inputContainer.id = "aiInputContainer";
        AIContainerBody.appendChild(inputContainer);
        document.getElementById("AIContainerBody").appendChild(inputContainer);

        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "aiInputBox";
        inputBox.placeholder = "Type your message here...";
        inputContainer.appendChild(inputBox);

        // minimize buttom
        const minimizeButton = document.createElement("button");
        minimizeButton.id = "minimizeButton";
        minimizeButton.innerText = ">";
        document.getElementById("AIContainer").appendChild(minimizeButton);

        // stop propagation so the container's click handler doesn't also run
        minimizeButton.onclick = (e) => { e.stopPropagation(); this.toggleMinimize(); };

        const sendButton = document.createElement("button");
        sendButton.id = "sendButton";
        sendButton.innerText = "send";
        inputContainer.appendChild(sendButton);

        // when user inputs message
        sendButton.onclick = async () => {
            if (!inputBox.value) return;
            inputBox.disabled = true;

            const chatBox = document.getElementById("AIChatBox");

            // display user input
            const userMessage = document.createElement("div");
            userMessage.className = "userMessage";
            userMessage.innerHTML = `<strong>You:</strong> ${inputBox.value}`;
            chatBox.appendChild(userMessage);
            chatBox.scrollTop = chatBox.scrollHeight;

            // display AI response
            const aiMessage = document.createElement("div");
            aiMessage.className = "AIMessage";
            // label node (strong) + separate text node for incremental typing
            const label = document.createElement('strong');
            label.textContent = 'AI:';
            aiMessage.appendChild(label);

            const messageContent = document.createElement("pre");
            messageContent.className = "messageContent";
            messageContent.style.display = 'inline';
            messageContent.style.margin = '0';
            messageContent.style.whiteSpace = 'pre-wrap';
            aiMessage.appendChild(messageContent);

            const textNode = document.createTextNode(' Generating Response...');
            messageContent.appendChild(textNode);

            // ensure wrapping behavior
            aiMessage.style.display = 'block';
            aiMessage.style.whiteSpace = 'normal';
            chatBox.appendChild(aiMessage);

            sendButton.disabled = true;

            const response = await this.processMessage(inputBox.value);
            inputBox.value = "";
            inputBox.disabled = false;

            if (response) {
                textNode.data = "";
                // If response is a string, append to the text node letter-by-letter
                for (let i = 0; i < response.length; i++) {
                    textNode.data += response.charAt(i);
                    chatBox.scrollTop = chatBox.scrollHeight; // scroll to bottom as text is added
                    await new Promise(resolve => setTimeout(resolve, 20));
                }
            } else {
                // No response or non-JSON response could not be parsed
                textNode.data += 'No response from server.';
            }

            sendButton.disabled = false;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        //create AI recommendation messages container
        const recommendationDiv = document.createElement("div");
        recommendationDiv.id = "recommendationContainer";
        document.getElementsByTagName("body")[0].appendChild(recommendationDiv);

        // display AI Assistant Face Model Images DOM
        if (window.location.pathname.endsWith("Explorer.html") || window.location.pathname.endsWith("Archive.html") || window.location.pathname.endsWith("About.html")) {
            this.prefix = "../../Assets/AIFaceModelImages/";
        } else if (window.location.pathname.endsWith("index.html")) {
            this.prefix = "../../../Assets/AIFaceModelImages/";
        }
        else {
            this.prefix = "Assets/AIFaceModelImages/";
        }
        

        this.AIFaceModelDisplay = document.createElement("img");
        this.AIFaceModelDisplay.id = "AIFaceModelDisplay";
        this.AIFaceModelDisplay.src = this.prefix + "AIFaceModelImage(1).png";
        document.getElementById("AIContainer").appendChild(this.AIFaceModelDisplay);

        // Circular title wrapper (SVG textPath) - shown only when minimized via CSS
        const aiTitleWrap = document.createElement("div");
        aiTitleWrap.id = "aiTitleWrap";
        aiTitleWrap.innerHTML = `
                    <svg viewBox="0 0 220 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <!-- Path slightly larger than the visual circle so text sits outside -->
                            <path id="titleCircle" d="M110,10 a100,100 0 1,1 -0.01,0" />
                        </defs>
                        <g id="titleGroup">
                          <text font-size="12">
                            <textPath href="#titleCircle" startOffset="50%" text-anchor="middle" id="aiTitleText">
                                Click to Chat with AI Assistant • Click to Chat with AI Assistant •
                            </textPath>
                          </text>
                        </g>
                    </svg>
                `;

        AIContainer.appendChild(aiTitleWrap);     
    },

    toggleMinimize() {

        const AIContainer = document.getElementById("AIContainer");
        const minimizeButton = AIContainer ? AIContainer.querySelector("#minimizeButton") : null;
        const AIContainerBody = AIContainer ? AIContainer.querySelector("#AIContainerBody") : null;
        const AIFaceModelDisplay = AIContainer ? AIContainer.querySelector("#AIFaceModelDisplay") : null;
        const titleWrap = AIContainer ? AIContainer.querySelector("#aiTitleWrap") : null;
        const recommendationContainer = document.getElementById("recommendationContainer");

        // if AI assistant is expanded and exists, minimize it
        if (!this.minimized && AIContainer) {
            AIContainer.classList.add("minimized");
            this.minimized = true;
            AIContainer.onclick = this.toggleMinimize.bind(this);

            // hide expanded elements and show minimize elements
            minimizeButton.style.display = "none";
            AIContainerBody.style.display = "none";
            AIFaceModelDisplay.style.display = "block";
            if (recommendationContainer) recommendationContainer.style.display = "block";

            if (titleWrap) {
                const t = titleWrap.querySelector('#aiTitleText');
                if (t) t.textContent = 'Press to chat with AI Assistant';
                titleWrap.style.display = 'block';
            }
            AIContainer.addEventListener("mouseenter", () => {
                this.interval = 100;
                this.startImageCycle();
            });
            AIContainer.addEventListener("mouseleave", () => {
                this.interval = 1000;
                this.startImageCycle();
            });

        // if AI assistant is minimized and exists, expand it
        } else if (AIContainer) {
            AIContainer.classList.remove("minimized");
            this.minimized = false;
            AIContainer.onclick = null;

            // hide minimize elements and show expanded elements
            minimizeButton.style.display = "inline-block";
            AIContainerBody.style.display = "flex";
            AIFaceModelDisplay.style.display = "none";
            if (titleWrap) titleWrap.style.display = 'none';
            if (recommendationContainer) recommendationContainer.style.display = "none";
        }
    },

    /* =========== AI Assistant Recommendation Message Logic  =========== */
    async displayRecommendationMessage() {

        if (this.recommendationMessages.length === 0) return;

        // add recommendation DOM
        const recommendationDiv = document.getElementById("recommendationContainer");
        const recommendationText = document.createElement("p");
        recommendationText.id = "recommendationText";
        recommendationDiv.innerHTML = "";
        recommendationDiv.appendChild(recommendationText);

        // display each character of recommendation text one-by-one
        for (let i = 0; i < this.recommendationMessages[this.recommendationMessagesIndex].length; i++) {
            const char = this.recommendationMessages[this.recommendationMessagesIndex].charAt(i);
            recommendationText.innerHTML += char;
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        // show next recommendation message
        this.recommendationMessagesIndex = (this.recommendationMessagesIndex + 1) % this.recommendationMessages.length;
    },

    /* =========== AI Assistant Setup =========== */
    assistantStart() {

        // generate new unique memory session ID for each chat
        this.memorySessionId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        
        // show AI assistant DOM
        this.displayAIAssistant();

        // change recommendation messages based on webpage 
        if (window.location.pathname.endsWith("Explorer.html")) {
            this.recommendationMessages = [
                "Try searching for projects based on your favorite concepts!",
                "Explore different genres to find projects that interest you.",
                "Use the filters to narrow down your project search effectively."
            ];
        } else if (window.location.pathname.endsWith("Archive.html")) {
            this.recommendationMessages = [
                "Browse through the archive to discover past projects!",
                "Use the search bar to quickly find specific projects.",
                "Click on project titles to view detailed information."
            ];
        } else {
            this.recommendationMessages = [
                "Hello! I'm here to assist you with any questions about the website.",
                "Feel free to ask me about the projects featured on this site.",
                "I'm here to help you navigate and find information easily."
            ];
        }

        this.displayRecommendationMessage()

        // minimize it when initializes
        this.toggleMinimize();

        // start display face model images
        this.startImageCycle();

        setInterval(() => {
            this.displayRecommendationMessage()
        }, 20000); // Change image every 10 seconds
    },

    /* =========== AI Assistant RAG Logic =========== */
    async processMessage(message) {
        // tell RAG about current selected concept if applicable
        let currentSelectedConcept = "not applicable";
        if (window.location.pathname.endsWith("Explorer.html")) {
            if (lockMode >= 0 && lockMode < concepts.length) currentSelectedConcept = concepts[lockMode].name;
        }

        // tell RAG about current selected project if applicable
        let currentProjectTitle = "not applicable";
        if (window.location.pathname.endsWith("index.html")) {
            const params = new URLSearchParams(window.location.search);
            const projectTitle = params.get("project");
            if (projectTitle) {
                currentProjectTitle = projectTitle;
            }
        }

        // retreive RAG response based on user message
        try {
            const res = await fetch(AIAssistant.webHookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: message, currentPage: window.location.pathname, currentSelectedConcept: currentSelectedConcept, currentProjectTitle: currentProjectTitle, memorySessionId: this.memorySessionId, keepMemoryNumber: 10 })
            });

            const data = await res.json();
            return data.output;

        }catch (err) {
            console.error(err);
            return null;
        }
            
    },

    /* =========== AI Face Model Image Logic =========== */
    // pick random AI face model Image
    pickRandomIndex() {
        if (this.AIFaceModelImages.length === 1) return 0;

        let randomIndex;
        randomIndex = Math.floor(Math.random() * this.AIFaceModelImages.length);

        return randomIndex;
    },

    // alternate between random AI face model image
    startImageCycle() {
        if (this.imageIntervalId) clearInterval(this.imageIntervalId);
        this.imageIntervalId = setInterval(() => {
            const randomIndex = this.pickRandomIndex();
            const nextImage = this.AIFaceModelImages[randomIndex];
            this.AIFaceModelDisplay.src = this.prefix + nextImage;
        }, this.interval);
    }
}

AIAssistant.assistantStart();

