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
// Technical Skill Detection
// ============================================

function detectSkills() {

    const skills = [
        "html",
        "css",
        "javascript",
        "typescript",
        "python",
        "java",
        "c++",
        "c#",
        "react",
        "node.js",
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

    detectedSkills = [];

    const text = resumeText.toLowerCase();

    skills.forEach(function (skill) {

        const escapedSkill = skill.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(
            "(^|\\s|[,.;:()\\[\\]{}])" +
            escapedSkill +
            "($|\\s|[,.;:()\\[\\]{}])",
            "i"
        );

        if (regex.test(text)) {

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
// ============================================
// PROFESSIONAL PDF REPORT
// ============================================

// ============================================
// RESUME INFORMATION EXTRACTION
// ============================================

function extractContactInfo() {

    const emailMatch = resumeText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    const phoneMatch = resumeText.match(
        /(?:\+?\d[\d\s().-]{8,}\d)/
    );

    const linkedinMatch = resumeText.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s<]+/i
    );

    const githubMatch = resumeText.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s<]+/i
    );

    return {

        email: emailMatch
            ? emailMatch[0]
            : "Not mentioned",

        phone: phoneMatch
            ? phoneMatch[0].trim()
            : "Not mentioned",

        linkedin: linkedinMatch
            ? linkedinMatch[0].replace(/[),.;]+$/, "")
            : "Not mentioned",

        github: githubMatch
            ? githubMatch[0].replace(/[),.;]+$/, "")
            : "Not mentioned"

    };

}


// ============================================
// RESUME SECTION STATUS
// ============================================

function getSectionStatus() {

    const text = resumeText.toLowerCase();

    return {

        education:
            text.includes("education")
                ? "Mentioned"
                : "Not mentioned",

        skills:
            text.includes("skills")
                ? "Mentioned"
                : "Not mentioned",

        projects:
            text.includes("project")
                ? "Mentioned"
                : "Not mentioned",

        experience:
            text.includes("experience") ||
            text.includes("employment") ||
            text.includes("work history")
                ? "Mentioned"
                : "Not mentioned",

        certifications:
            text.includes("certification") ||
            text.includes("certificate")
                ? "Mentioned"
                : "Not mentioned"

    };

}


// ============================================
// PDF DOWNLOAD
// ============================================

downloadBtn.addEventListener("click", function () {

    // ----------------------------------------
    // Check resume
    // ----------------------------------------

    if (!resumeText || resumeText.trim() === "") {

        alert("Please analyze a resume first.");

        return;

    }


    // ----------------------------------------
    // Check jsPDF
    // ----------------------------------------

    if (!window.jspdf) {

        alert(
            "PDF library is not loaded. Please check index.html."
        );

        return;

    }


    const { jsPDF } = window.jspdf;


    // ----------------------------------------
    // Create PDF
    // ----------------------------------------

    const pdf = new jsPDF({

        orientation: "portrait",

        unit: "mm",

        format: "a4"

    });


    const pageWidth = 210;

    const pageHeight = 297;

    const margin = 18;

    let y = 20;


    // ----------------------------------------
    // Extract information
    // ----------------------------------------

    const contact = extractContactInfo();

    const sections = getSectionStatus();


    // ----------------------------------------
    // Resume rating
    // ----------------------------------------

    let rating = "Needs Improvement";

    if (score >= 90) {

        rating = "Excellent";

    }
    else if (score >= 80) {

        rating = "Very Good";

    }
    else if (score >= 70) {

        rating = "Good";

    }
    else if (score >= 60) {

        rating = "Fair";

    }


    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function addHeader() {

        pdf.setFillColor(20, 30, 55);

        pdf.rect(
            0,
            0,
            pageWidth,
            10,
            "F"
        );

        pdf.setTextColor(
            255,
            255,
            255
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(8);

        pdf.text(
            "RESUME ANALYZER",
            margin,
            6.5
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.text(
            "Resume Analysis",
            pageWidth - margin,
            6.5,
            {
                align: "right"
            }
        );

        pdf.setTextColor(
            30,
            30,
            30
        );

    }


    function addFooter() {

        pdf.setDrawColor(
            220,
            220,
            220
        );

        pdf.line(
            margin,
            pageHeight - 14,
            pageWidth - margin,
            pageHeight - 14
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(7);

        pdf.setTextColor(
            120,
            120,
            120
        );

        pdf.text(
            "Generated by Resume Analyzer",
            margin,
            pageHeight - 8
        );

        pdf.text(
            "Page " +
            pdf.internal.getCurrentPageInfo().pageNumber,
            pageWidth - margin,
            pageHeight - 8,
            {
                align: "right"
            }
        );

        pdf.setTextColor(
            30,
            30,
            30
        );

    }


    function newPage() {

        pdf.addPage();

        y = 20;

        addHeader();

    }


    function checkSpace(space) {

        if (
            y + space >
            pageHeight - 22
        ) {

            newPage();

        }

    }


    function sectionTitle(title) {

        checkSpace(20);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(13);

        pdf.setTextColor(
            25,
            35,
            55
        );

        pdf.text(
            title,
            margin,
            y
        );

        y += 4;

        pdf.setDrawColor(
            220,
            225,
            230
        );

        pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
        );

        y += 9;

    }


    function writeLine(label, value) {

        checkSpace(8);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
            40,
            40,
            40
        );

        pdf.text(
            label,
            margin,
            y
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.text(
            value,
            margin + 35,
            y
        );

        y += 7;

    }


    function cleanText(text) {

        return text

            .replace(/[^\x00-\x7F]/g, "")

            .replace(/\[OK\]/gi, "")

            .replace(/\[MISSING\]/gi, "")

            .replace(/\s+/g, " ")

            .trim();

    }


    // ========================================
    // FIRST PAGE HEADER
    // ========================================

    pdf.setFillColor(
        20,
        30,
        55
    );

    pdf.rect(
        0,
        0,
        pageWidth,
        48,
        "F"
    );


    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(24);

    pdf.text(
        "Resume Analysis",
        margin,
        23
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
        "Resume Analyzer",
        margin,
        33
    );


    pdf.setFontSize(8);

    pdf.text(
        new Date().toLocaleDateString(),
        pageWidth - margin,
        33,
        {
            align: "right"
        }
    );


    pdf.setTextColor(
        30,
        30,
        30
    );


    y = 62;


    // ========================================
    // SCORE CARD
    // ========================================

    pdf.setFillColor(
        245,
        247,
        250
    );

    pdf.roundedRect(
        margin,
        y,
        pageWidth - margin * 2,
        42,
        4,
        4,
        "F"
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(9);

    pdf.setTextColor(
        90,
        90,
        90
    );

    pdf.text(
        "OVERALL RESUME SCORE",
        margin + 8,
        y + 10
    );


    pdf.setFontSize(27);

    pdf.setTextColor(
        25,
        160,
        95
    );

    pdf.text(
        score + "/100",
        margin + 8,
        y + 28
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(11);

    pdf.setTextColor(
        70,
        70,
        70
    );

    pdf.text(
        rating,
        pageWidth - margin - 8,
        y + 24,
        {
            align: "right"
        }
    );


    y += 55;


    // ========================================
    // STATISTICS
    // ========================================

    sectionTitle(
        "Resume Statistics"
    );


    const wordCount =
        countWords();

    const pageCount =
        estimatePages();

    const skillCount =
        detectedSkills.length;


    const stats = [

        ["Words", wordCount],

        ["Pages", pageCount],

        ["Skills", skillCount]

    ];


    const boxWidth =
        (pageWidth - margin * 2 - 8) / 3;


    stats.forEach(
        function (stat, index) {

            const x =
                margin +
                index * (boxWidth + 4);


            pdf.setFillColor(
                248,
                249,
                251
            );


            pdf.roundedRect(
                x,
                y,
                boxWidth,
                25,
                3,
                3,
                "F"
            );


            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(16);

            pdf.setTextColor(
                35,
                45,
                65
            );

            pdf.text(
                String(stat[1]),
                x + 6,
                y + 11
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(8);

            pdf.setTextColor(
                100,
                100,
                100
            );

            pdf.text(
                stat[0],
                x + 6,
                y + 19
            );

        }
    );


    y += 38;


    // ========================================
    // CONTACT INFORMATION
    // ========================================

    sectionTitle(
        "Contact Information"
    );


    writeLine(
        "Email",
        contact.email
    );


    writeLine(
        "Phone",
        contact.phone
    );


    writeLine(
        "LinkedIn",
        contact.linkedin
    );


    writeLine(
        "GitHub",
        contact.github
    );


    y += 5;


    // ========================================
    // RESUME SECTIONS
    // ========================================

    sectionTitle(
        "Resume Sections"
    );


    writeLine(
        "Education",
        sections.education
    );


    writeLine(
        "Skills",
        sections.skills
    );


    writeLine(
        "Projects",
        sections.projects
    );


    writeLine(
        "Experience",
        sections.experience
    );


    writeLine(
        "Certifications",
        sections.certifications
    );


    y += 5;


    // ========================================
    // TECHNICAL SKILLS
    // ========================================

    sectionTitle(
        "Technical Skills"
    );


    if (
        detectedSkills.length === 0
    ) {

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9);

        pdf.text(
            "Not mentioned",
            margin,
            y
        );

        y += 10;

    }
    else {

        let skillX =
            margin;

        let skillY =
            y;


        detectedSkills.forEach(
            function (skill) {

                const label =
                    skill.toUpperCase();


                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.setFontSize(8);


                const width =
                    pdf.getTextWidth(label) +
                    10;


                if (
                    skillX + width >
                    pageWidth - margin
                ) {

                    skillX =
                        margin;

                    skillY += 11;

                }


                if (
                    skillY >
                    pageHeight - 30
                ) {

                    newPage();

                    skillX =
                        margin;

                    skillY =
                        y;

                }


                pdf.setFillColor(
                    230,
                    246,
                    238
                );


                pdf.roundedRect(
                    skillX,
                    skillY - 6,
                    width,
                    8,
                    2,
                    2,
                    "F"
                );


                pdf.setTextColor(
                    30,
                    125,
                    75
                );


                pdf.text(
                    label,
                    skillX + 5,
                    skillY
                );


                skillX +=
                    width + 4;

            }
        );


        y =
            skillY + 14;

    }


    // ========================================
    // ANALYSIS SUMMARY
    // ========================================

    sectionTitle(
        "Analysis Summary"
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(9);

    pdf.setTextColor(
        50,
        50,
        50
    );


    const analysisLines =
        reportText
            .split("\n")
            .filter(
                function (line) {

                    return line.trim() !== "";

                }
            );


    if (
        analysisLines.length === 0
    ) {

        pdf.text(
            "No analysis information available.",
            margin,
            y
        );

        y += 8;

    }
    else {

        analysisLines.forEach(
            function (line) {

                checkSpace(8);


                let cleanLine =
                    cleanText(line);


                cleanLine =
                    cleanLine
                        .replace(
                            /^Email\s*/i,
                            "Email: "
                        )
                        .replace(
                            /^Phone Number\s*/i,
                            "Phone: "
                        )
                        .replace(
                            /^Education\s*/i,
                            "Education: "
                        )
                        .replace(
                            /^Skills Section\s*/i,
                            "Skills: "
                        )
                        .replace(
                            /^Projects\s*/i,
                            "Projects: "
                        )
                        .replace(
                            /^Experience\s*/i,
                            "Experience: "
                        )
                        .replace(
                            /^Certifications\s*/i,
                            "Certifications: "
                        )
                        .replace(
                            /^Portfolio Links\s*/i,
                            "Portfolio Links: "
                        );


                if (
                    cleanLine.trim() === ""
                ) {

                    return;

                }


                pdf.text(
                    cleanLine,
                    margin,
                    y
                );


                y += 7;

            }
        );

    }


    // ========================================
    // RECOMMENDATIONS
    // ========================================

    y += 5;


    sectionTitle(
        "Recommended Improvements"
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(9);

    pdf.setTextColor(
        50,
        50,
        50
    );


    if (
        suggestions.length === 0
    ) {

        pdf.text(
            "No major improvements are required.",
            margin,
            y
        );

        y += 8;

    }
    else {

        suggestions.forEach(
            function (suggestion) {

                checkSpace(10);


                pdf.setFillColor(
                    245,
                    158,
                    11
                );


                pdf.circle(
                    margin + 2,
                    y - 1.5,
                    1.1,
                    "F"
                );


                const suggestionLines =
                    pdf.splitTextToSize(
                        suggestion,
                        pageWidth -
                        margin * 2 -
                        8
                    );


                suggestionLines.forEach(
                    function (line) {

                        checkSpace(7);

                        pdf.text(
                            line,
                            margin + 7,
                            y
                        );

                        y += 6;

                    }
                );


                y += 2;

            }
        );

    }


    // ========================================
    // FOOTERS
    // ========================================

    const totalPages =
        pdf.internal.getNumberOfPages();


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        pdf.setPage(page);

        addFooter();

    }


    // ========================================
    // SAVE PDF
    // ========================================

    pdf.save(
        "Resume_Analysis_Report.pdf"
    );

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
