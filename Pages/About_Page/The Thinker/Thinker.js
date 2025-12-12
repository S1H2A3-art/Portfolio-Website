
/* ============================================================
   THINKER ENGINE
   ============================================================ */

let Thinker = {

    /* =========== INTERNAL STATE =========== */

    pressureLevel: 0.0,          // value 0.0 — 1.0, represents instability
    pressureRange: "(0.0-0.3)",

    /* =========== LAST OUTPUT FROM LLM =========== */

    json: null,                  // raw JSON returned by the LLM

    speech: "",                  // text the Thinker speaks
    action: "idle",              // body motion
    expression: "neutral",       // facial expression
    emotion: "neutral",
    imagePrompt: "",             // image prompt based on action, expression, and emotion

    /* ===========
       OUTPUT FROM ACT()
       =========== */
    referenceImage: null,        // reference image
    images: [],                  // generated image set based on reference image
    
    /* =========== CONSTANTS =========== */

    THINKER_IDENTITY: null,
    memorySessionId: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,

    /* =========== CORE ENGINE FUNCTIONS =========== */

    async think(userMessage) {
        // → Build the full prompt using current state and core identity prompt
        const prompt = this.buildLLMPrompt({ userMessage: userMessage });
        // → Send prompt to LLM
        // → Parse the returned JSON and store into this.response
        const response = await this.generateLLMThought(prompt);
        this.json = response;
        // → Call update() to apply state changes
        this.update();
    },

    update() {

        if (this.json) {
            // update based on LLM output
            this.speech = this.json.speech;
            this.expression = this.json.expression;
            this.action = this.json.action;
            this.emotion = this.json.emotion;
            
            this.pressureLevel += parseFloat(this.json.pressure_adjustment);

            // disallow pressure level below 0
            if (this.pressureLevel < 0) {
                this.pressureLevel = 0.0;
            }

            // if pressure level exceeds 1, escape the game
            if (this.pressureLevel >= 1) {
                window.location.reload();
            }

            //update pressure range
            this.pressureRange =
                this.pressureLevel < 0.3 ? "(0.0-0.3)" :
                    this.pressureLevel < 0.6 ? "(0.3-0.6)" :
                        this.pressureLevel < 0.8 ? "(0.6-0.8)" :
                            "(0.8-1.0)";

            //present the thinker based on updated properties
            this.act();
        }
    },

    async act() {

        // build image prompt from updated properties
        const imagePrompt = this.buildImagePrompt();

        // use imagePrompt to request images from SDXL Lightning
        if (imagePrompt) {
            //generate 5 similar images
            await this.generateImages({ prompt: imagePrompt, imageSize: "square", steps: 2, imageNumbers: 5 });
        }

        // display speech
        document.getElementById("thinkerMessageContainer").innerText = this.speech;

    },

    /* =========== SECONDARY ENGINE FUNCTIONS =========== */

    buildLLMPrompt({ userMessage }) {

        let prompt = "";

        // 1.apply core identity rules
        prompt += [
            this.THINKER_IDENTITY.identityEssence,
            this.THINKER_IDENTITY.constraints,
            this.THINKER_IDENTITY.thinkingStyle,
            this.THINKER_IDENTITY.behavioralRules,
            
        ].join("\n") + "\n";

        // 2.add pressure rules if pressure level is beyond 0.3
        if(this.pressureLevel >= 0.3){
            prompt += this.THINKER_IDENTITY.pressureRules + "\n";
        }

        const range = this.pressureRange;
        
        // 3.Action rules
        prompt += "Choose one from the following instruction for action:";
        prompt += this.THINKER_IDENTITY["actions" + range] + "\n";

        // 4.Expression rules
        prompt += "Choose one from the following instruction for expression:";
        prompt += this.THINKER_IDENTITY["expressions" + range] + "\n";

        // 5.Emotion rules
        prompt += "Choose one from the following instruction for emotion:";
        prompt += this.THINKER_IDENTITY["emotion" + range] + "\n";

        // 6.Inject state
        prompt += `Current pressure_level: ${this.pressureLevel}. Shift your speech according to the pressure rules.\n`;
        prompt += `Current memory_phase: ${this.memoryPhase}\n`;
        prompt += `Current memory_summary: "${this.memorySummary}"\n`;
        prompt += `Current user_impression: "${this.userImpression}"\n`;

        // 7.User message
        prompt += `User message: "${userMessage}"\n`;

        // 8.Required JSON output schema
        prompt += `Output ONLY the following JSON object in one line, with no text before or after it:\n`;
        prompt += `${this.THINKER_IDENTITY.outputSchema}\n`;

        return prompt;
    },

    // retrieve response from LLM based on the LLM prompt
    async generateLLMThought(prompt) {
        try {
            const res = await fetch("https://shawnqiu.app.n8n.cloud/webhook/8d84f4fe-79a7-4111-ac80-d482ca33bee8", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: prompt,memorySessionId:this.memorySessionId })
            });

            const data = await res.json();

            return JSON.parse(data["0"].output);

        } catch (err) {
            console.error(err);
            return null;
        }
    },

    
    buildImagePrompt() {
        const range = this.pressureRange;

        // 1.Appearance
        let imagePrompt = this.THINKER_IDENTITY["appearance" + range];

        // 2.Camera
        imagePrompt += `The Camera angle is set to: `;
        imagePrompt += this.THINKER_IDENTITY["camera" + range];

        // 3.Core motion + emotion
        imagePrompt += `The figure is shown performing: ${this.action}.`;
        imagePrompt += `The facial expression is: ${this.expression}.`;
        imagePrompt += `The emotion is: ${this.emotion}.`;
        imagePrompt += `The background should be pure white.`;

        return imagePrompt;
    },

    //retrieve set of n images based on image prompt
    async generateImages({ prompt, imageSize, steps, imageNumbers }) {

        //stablize the reults
        const baseSeed = 50000;
        //add slight variations
        const seed = baseSeed + Math.floor(Math.random() * 3);

   
        const res = await fetch("https://shawnqiu.app.n8n.cloud/webhook/ad0e4ce7-a0d2-4bdb-a41a-576c20adc793", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data:
                {
                    "prompt": prompt,
                    "strength": map(this.pressureLevel,0,1,0.3,0.8),
                    "image_size": imageSize,
                    "num_inference_steps": steps,
                    "num_images": imageNumbers,
                    "seed": seed 
                }
            })
        });

        
        const data = await res.json();

        
        this.images[0] = (loadImage(data["0"].image.url));
        this.images[1] = (loadImage(data["1"].image.url));
        this.images[2] = (loadImage(data["2"].image.url));
        this.images[3]=( loadImage(data["3"].image.url));
        this.images[4]=( loadImage(data["4"].image.url));

    }
};