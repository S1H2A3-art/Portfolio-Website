let state = false;

//opens/closes menu
function toggleMenu(){

    let menuBar = document.getElementById("menuBar");
    let menuName = document.getElementById("menuName");

    if(!state){
        menuBar.style.display ='flex';
        menuBar.style.transition = "width 0.3s";
        menuBar.style.width = "20%";
       
        menuName.style.display ='none';

        //move information panel to the right when showing menu
        if(document.getElementById("informationPanel")){
            let informationPanel = document.getElementById("informationPanel");
            if(window.innerWidth > 1380){
            informationPanel.style.transition ="left 0.3s";
            informationPanel.style.left="23%";
            }       
        }

        if(document.getElementById("archiveContent")){
            let archiveContent = document.getElementById("archiveContent");
            if(window.innerWidth > 1380){
                archiveContent.style.transition ="margin-left 0.3s";
            archiveContent.style.marginLeft="23%";
            }       
        }

        if(document.getElementById("aboutContent")){
            let aboutContent = document.getElementById("aboutContent");
            if(window.innerWidth > 1380){
            aboutContent.style.transition ="margin-left 0.3s";
            aboutContent.style.marginLeft="23%";
            }       
        }
    
        state = true;
        let currentWindow = window.location.pathname;
        console.log(currentWindow);
        //determines which page it's currently on
        if(currentWindow.endsWith("Explorer.html")){
            let navigationPage = document.getElementById("Explorer_Page");
            navigationPage.innerHTML = `
            <a>Explorer</a>
            <div class="circle"> </div>
            `
        }else if(currentWindow.endsWith("Project.html")){
            let navigationPage = document.getElementById("Explorer_Page");
            navigationPage.innerHTML = `
            <a href="../Explorer_Page/Explorer.html">Explorer</a>
            `
        }

        
        if(currentWindow.endsWith("Archive.html")){
            let archivePage = document.getElementById("Archive_Page");
            archivePage.innerHTML = `
            <a>Archive</a>
            <div class="circle"> </div>
            `
        }else{
            let archivePage = document.getElementById("Archive_Page");
            archivePage.innerHTML = `
            <a href="../Archive_Page/Archive.html">Archive</a>
            `
        }

        if(currentWindow.endsWith("About.html")){
            let aboutPage = document.getElementById("About_Page");
            aboutPage.innerHTML = `
            <a>About</a>
            <div class="circle"> </div>
            `
        }else{
            let aboutPage = document.getElementById("About_Page");
            aboutPage.innerHTML = `
            <a href="../About_Page/About.html">About</a>
            `
        }

    }else{//close it
        menuBar.style.display ='none';
        menuName.style.display ='block';
        if(document.getElementById("informationPanel")){
            let informationPanel = document.getElementById("informationPanel");
            informationPanel.style.transition ="left 0.3s";
            informationPanel.style.left="10%";
        }
        if(document.getElementById("archiveContent")){
            let archiveContent = document.getElementById("archiveContent");
            archiveContent.style.transition ="margin-left 0.3s";
            archiveContent.style.marginLeft="10%";
        }
        if(document.getElementById("aboutContent")){
            let aboutContent = document.getElementById("aboutContent");
            aboutContent.style.transition ="margin-left 0.3s";
            aboutContent.style.marginLeft="10%";
        }
        state = false;
    }
    
}
