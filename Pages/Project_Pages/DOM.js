class ControlInstruction extends HTMLElement{
    constructor(){
        super();
        this.classList.add("controlInstruction");

        if(this.getAttribute("instructions") !== undefined){

            this.innerHTML = `
                <h3>CONTROLS</h3> 
                <div id = "instructions">
                </div>
            `;
            
            if(this.getAttribute("instructions") != "" && this.getAttribute("instructions") !== null){
                this.instructions = this.getAttribute("instructions").split(",");

                for(let i = 0; i < this.instructions.length; i++){
                    this.instructions[i] = this.instructions[i].split(":");
                }
                

                for(let instruction of this.instructions){

                    const span = document.createElement("span");
                    span.innerHTML = `
                    <p style = "display:inline; font-weight:500">
                        ${instruction[0]}: 
                    </p>
                    <p style = "display:inline; color:#666666; ">
                        &ensp;${instruction[1]}
                        &emsp;&emsp;
                    </p>
                    `
                    
                    this.querySelector("#instructions").appendChild(span);

                }
            }
        }
    }
  
}

customElements.define("control-instruction",ControlInstruction);

class CustomSpacing extends HTMLElement{
    constructor(){
        super();
        this.classList.add("customSpacing");
        this.innerHTML = `placeholder`;
        this.style.height = this.getAttribute("size");
    }
}

customElements.define("custom-spacing", CustomSpacing);

class CustomSeperator extends HTMLElement{
    constructor(){
        super();
        this.classList.add("customSeperator");
        this.innerHTML = `placeholder`;
    }
}

customElements.define("custom-seperator", CustomSeperator);

class CustomParagraph extends HTMLElement{
     constructor(){
        super();
        this.classList.add("customParagraph");
        this.insertAdjacentHTML('afterbegin', '<br>&emsp;&emsp;&emsp;');
    }
}

customElements.define("custom-paragraph", CustomParagraph);

class CustomExcerpt extends HTMLElement{
     constructor(){
        super();
        this.classList.add("customExcerpt");
        this.insertAdjacentHTML('afterbegin', '<br>');
        this.insertAdjacentHTML('afterend', '<br>');
    }
}

customElements.define("custom-excerpt", CustomExcerpt);

class CustomCitationList extends HTMLElement{
     constructor(){
        super();
        this.classList.add("customCitationList");
    }
}

customElements.define("custom-citation-list", CustomCitationList);

class CustomCitation extends HTMLElement{
     constructor(){
        super();
        this.classList.add("customCitation");
        this.insertAdjacentHTML('afterbegin', '<br><br>');
    }
}

customElements.define("custom-citation", CustomCitation);

class ImageGallery extends HTMLElement{
     constructor(){
        super();
        this.classList.add("imageGallery");
        this.column = this.getAttribute("column");
        this.row = this.getAttribute("row");
        this.images = this.innerText.split(',');
        const altPrefix = this.getAttribute("alt-prefix") || document.title || "Project image";
        this.innerHTML = "";
        for(let i = 0; i < this.row; i++){
            let imageRows = `<div class="imageRow">`;
            for(let j = 0; j < this.column; j++){
                const index = j + i * this.column + 1;
                imageRows += `<img width="${100/this.column}%" style="margin:${(100/this.column-5)/100}%; " src = "${this.images[j+i*this.column]}" alt="${altPrefix} ${index}">`
            }
            imageRows += `</div>`;
            this.innerHTML += imageRows;
           
        }
    }
}

customElements.define("image-gallery", ImageGallery);

class TextAndImage extends HTMLElement{
     constructor(){
        super();
        this.leftWidth = 50;

        if(this.getAttribute("leftWidth"))
        this.leftWidth = parseInt(this.getAttribute("leftWidth"));

        this.rightWidth = 100 - this.leftWidth;
        
        this.classList.add("textAndImage");
        this.content = this.innerText.split(",,");
        this.innerHTML="";
        const altPrefix = this.getAttribute("alt-prefix") || document.title || "Project image";
        if(this.content[0].startsWith("page_asset")||this.content[0].startsWith("Assets")||this.content[0].startsWith("../")||this.content[0].startsWith("../../Assets")){
            this.innerHTML += `<div style="width:${this.leftWidth}%" class="leftTextAndImageElement"><img width="100%" style="margin-right:1rem"src="${this.content[0]}" alt="${altPrefix} illustration"></div>`;
            this.innerHTML += `<div style="width:${this.rightWidth}%" class="rightTextAndImageElement"><p style="margin-left:2rem">${this.content[1]}</p></div>`
        }else{
            this.innerHTML += `<div style="width:${this.leftWidth}%" class="leftTextAndImageElement"><p style="margin-right:2rem">${this.content[0]}</p></div>`
            this.innerHTML += `<div style="width:${this.rightWidth}%" class="rightTextAndImageElement"><img width="100%" style="margin-left:1rem" src="${this.content[1]}" alt="${altPrefix} illustration"></div>`;
        }
    }
}

customElements.define("text-and-image", TextAndImage);
