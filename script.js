// ============================================
// Resume Analyzer Pro
// Part 1 - Setup & File Reading
// ============================================

// HTML Elements

const fileInput = document.getElementById("resumeFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const preview = document.getElementById("preview");
const analysis = document.getElementById("analysis");
const scoreValue = document.getElementById("scoreValue");
const circle = document.querySelector(".circle");

// Global Variables

let resumeText = "";
let score = 0;
let reportText = "";
let detectedSkills = [];
let suggestions = [];

// Configure PDF.js

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";


// ============================================
// Show Selected File Name
// ============================================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if(file){

        document.getElementById("fileName").innerHTML =
        "📄 " + file.name;

    }
    else{

        document.getElementById("fileName").innerHTML =
        "No file selected";

    }

});


// ============================================
// Analyze Button
// ============================================

analyzeBtn.addEventListener("click", () => {

    const file = fileInput.files[0];

    if(!file){

        alert("Please choose a Resume.");

        return;

    }

    analysis.innerHTML = `
        <div class="loader">
            ⏳ Analyzing Resume...
        </div>
    `;

    if(file.type === "application/pdf"){

        readPDF(file);

    }

    else if(file.type === "text/plain"){

        readText(file);

    }

    else{

        analysis.innerHTML = `
        <div class="fail">
            Unsupported File Type
        </div>
        `;

    }

});


// ============================================
// Read TXT File
// ============================================

function readText(file){

    const reader = new FileReader();

    reader.onload = function(e){

        resumeText = e.target.result;

        preview.innerText = resumeText;

        analyzeResume();

    };

    reader.readAsText(file);

}


// ============================================
// Read PDF File
// ============================================

async function readPDF(file){

    const reader = new FileReader();

    reader.onload = async function(){

        const typedArray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument({

            data:typedArray

        }).promise;

        resumeText = "";

        for(let i=1;i<=pdf.numPages;i++){

            const page = await pdf.getPage(i);

            const content = await page.getTextContent();

            const strings = content.items.map(item=>item.str);

            resumeText += strings.join(" ");

            resumeText += "\n\n";

        }

        preview.innerText = resumeText;

        analyzeResume();

    };

    reader.readAsArrayBuffer(file);

}
// ============================================
// Part 2 - Resume Analysis
// ============================================

function analyzeResume() {

    score = 0;
    reportText = "";
    detectedSkills = [];
    suggestions = [];

    analysis.innerHTML = "";

    const text = resumeText.toLowerCase();

    // ----------------------------
    // Email
    // ----------------------------

    if (/\S+@\S+\.\S+/.test(resumeText)) {

        addSuccess("📧 Email Found");
        score += 10;

    } else {

        addFail("📧 Email Missing");
        suggestions.push("Add a professional email address.");

    }

    // ----------------------------
    // Phone Number
    // ----------------------------

    const phoneRegex = /(\+?\d[\d\s-]{8,}\d)/;

    if (phoneRegex.test(resumeText)) {

        addSuccess("📱 Phone Number Found");
        score += 10;

    } else {

        addFail("📱 Phone Number Missing");
        suggestions.push("Add a phone number.");

    }

    // ----------------------------
    // Education
    // ----------------------------

    if (text.includes("education")) {

        addSuccess("🎓 Education Found");
        score += 15;

    } else {

        addFail("🎓 Education Missing");
        suggestions.push("Include an Education section.");

    }

    // ----------------------------
    // Skills
    // ----------------------------

    if (text.includes("skills")) {

        addSuccess("💻 Skills Section Found");
        score += 15;

    } else {

        addFail("💻 Skills Section Missing");
        suggestions.push("Add a Skills section.");

    }

    // ----------------------------
    // Projects
    // ----------------------------

    if (text.includes("project")) {

        addSuccess("📂 Projects Found");
        score += 15;

    } else {

        addFail("📂 Projects Missing");
        suggestions.push("Add at least two projects.");

    }

    // ----------------------------
    // Experience
    // ----------------------------

    if (text.includes("experience")) {

        addSuccess("💼 Experience Found");
        score += 15;

    } else {

        addFail("💼 Experience Missing");
        suggestions.push("Include internship or work experience.");

    }

    // ----------------------------
    // Certifications
    // ----------------------------

    if (
        text.includes("certification") ||
        text.includes("certificate")
    ) {

        addSuccess("🏆 Certifications Found");
        score += 10;

    } else {

        addFail("🏆 Certifications Missing");
        suggestions.push("Add certifications.");

    }

    // ----------------------------
    // GitHub / LinkedIn
    // ----------------------------

    if (
        text.includes("github") ||
        text.includes("linkedin")
    ) {

        addSuccess("🔗 Portfolio Links Found");
        score += 10;

    } else {

        addFail("🔗 Portfolio Links Missing");
        suggestions.push("Add GitHub and LinkedIn links.");

    }

    detectSkills();

    showSkills();

    showSuggestions();

    animateScore(score);

}
// ============================================
// Success Card
// ============================================

function addSuccess(message){

    analysis.innerHTML += `

        <div class="success">

            ${message}

        </div>

    `;

    reportText += "✔ " + message + "\n";

}

// ============================================
// Fail Card
// ============================================

function addFail(message){

    analysis.innerHTML += `

        <div class="fail">

            ${message}

        </div>

    `;

    reportText += "✖ " + message + "\n";

}
// ============================================
// Circular Score Animation
// ============================================

function animateScore(finalScore){

    let current = 0;

    const interval = setInterval(() => {

        scoreValue.innerHTML = current + "%";

        const degree = current * 3.6;

        circle.style.background =
        `conic-gradient(
            #22c55e ${degree}deg,
            rgba(255,255,255,.25) ${degree}deg
        )`;

        if(current >= finalScore){

            clearInterval(interval);

        }

        current++;

    },15);

}
// ============================================
// Part 3 - Skills Detection
// ============================================

function detectSkills(){

    const skills=[

        "html",
        "css",
        "javascript",
        "java",
        "python",
        "c",
        "c++",
        "react",
        "node",
        "express",
        "sql",
        "mysql",
        "mongodb",
        "git",
        "github",
        "bootstrap",
        "tailwind",
        "figma",
        "aws",
        "docker"

    ];

    detectedSkills=[];

    const text=resumeText.toLowerCase();

    skills.forEach(skill=>{

        if(text.includes(skill)){

            detectedSkills.push(skill);

        }

    });

}
// ============================================
// Show Skills
// ============================================

function showSkills(){

    analysis.innerHTML+=`

    <div class="card">

        <h2>🛠 Detected Skills</h2>

        <div class="skills-container">

            ${
                detectedSkills.length>0

                ?

                detectedSkills.map(skill=>

                    `<span class="badge">${skill.toUpperCase()}</span>`

                ).join("")

                :

                "<p>No Skills Detected</p>"

            }

        </div>

    </div>

    `;

}
// ============================================
// Suggestions
// ============================================

function showSuggestions(){

    analysis.innerHTML+=`

    <div class="card">

        <h2>💡 Suggestions</h2>

        <ul>

        ${
            suggestions.length>0

            ?

            suggestions.map(item=>`<li>${item}</li>`).join("")

            :

            "<li>Your resume looks excellent.</li>"

        }

        </ul>

    </div>

    `;

}
// ============================================
// Resume Statistics
// ============================================

function countWords(){

    return resumeText.trim().split(/\s+/).length;

}

function estimatePages(){

    const words=countWords();

    if(words<=500) return 1;

    if(words<=1000) return 2;

    return Math.ceil(words/500);

}
// ============================================
// Download PDF Report
// ============================================

downloadBtn.addEventListener("click",()=>{

    if(resumeText===""){

        alert("Please analyze a resume first.");

        return;

    }

    const {jsPDF}=window.jspdf;

    const pdf=new jsPDF();

    pdf.setFontSize(22);

    pdf.text("Resume Analyzer Pro",20,20);

    pdf.setFontSize(14);

    pdf.text("Resume Score : "+score+"/100",20,35);

    pdf.text("Word Count : "+countWords(),20,45);

    pdf.text("Estimated Pages : "+estimatePages(),20,55);

    pdf.text("Detected Skills",20,70);

    let y=80;

    detectedSkills.forEach(skill=>{

        pdf.text("• " + skill, 20, y);

        y+=8;

    });

    y+=10;

    pdf.text("Analysis",20,y);

    y+=10;

    reportText.split("\n").forEach(line=>{

        pdf.text(line,20,y);

        y+=8;

    });

    y+=10;

    pdf.text("Suggestions",20,y);

    y+=10;

    suggestions.forEach(item=>{

        pdf.text("• "+item,20,y);

        y+=8;

    });

    pdf.save("Resume_Report.pdf");

});
// ============================================
// Part 4 - Dashboard & Final Features
// ============================================

// Show Resume Summary

function showSummary() {

    let message = "";

    if (score >= 90) {

        message = "🌟 Excellent Resume! Ready for job applications.";

    } else if (score >= 75) {

        message = "✅ Good Resume. A few improvements will make it stronger.";

    } else if (score >= 60) {

        message = "⚠ Average Resume. Consider adding more details.";

    } else {

        message = "❌ Resume needs significant improvements.";

    }

    analysis.innerHTML += `

    <div class="card">

        <h2>🧠 Resume Summary</h2>

        <p>${message}</p>

    </div>

    `;

}



// ============================================
// Statistics Card
// ============================================

function showStatistics(){

    analysis.innerHTML += `

    <div class="card">

        <h2>📊 Resume Statistics</h2>

        <p><strong>Words:</strong> ${countWords()}</p>

        <p><strong>Estimated Pages:</strong> ${estimatePages()}</p>

        <p><strong>Detected Skills:</strong> ${detectedSkills.length}</p>

        <p><strong>Resume Score:</strong> ${score}/100</p>

    </div>

    `;

}



// ============================================
// Reset Dashboard
// ============================================

function resetDashboard(){

    preview.innerHTML = `

    <p>

    Your resume preview will appear here.

    </p>

    `;

    analysis.innerHTML = "Waiting...";

    scoreValue.innerHTML = "0%";

    circle.style.background =
    "conic-gradient(#22c55e 0deg,#ffffff33 0deg)";

    resumeText = "";

    reportText = "";

    detectedSkills = [];

    suggestions = [];

    score = 0;

}



// ============================================
// Keyboard Shortcut
// Ctrl + Delete
// ============================================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Delete"){

        e.preventDefault();

        resetDashboard();

    }

});



// ============================================
// Extra Resume Rating
// ============================================

function getResumeRating(){

    if(score>=90){

        return "★★★★★";

    }

    if(score>=80){

        return "★★★★☆";

    }

    if(score>=70){

        return "★★★☆☆";

    }

    if(score>=60){

        return "★★☆☆☆";

    }

    return "★☆☆☆☆";

}



// ============================================
// Update analyzeResume()
// ============================================
//
// Inside analyzeResume(),
// AFTER:
//
// animateScore(score);
//
// add these lines:
//
// showStatistics();
//
// showSummary();
//
// analysis.innerHTML += `
//
// <div class="card">
//
// <h2>⭐ Resume Rating</h2>
//
// <h1>${getResumeRating()}</h1>
//
// </div>
//
// `;
//
// ============================================