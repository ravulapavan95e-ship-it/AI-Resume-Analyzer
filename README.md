# Resume Analyzer Pro

Resume Analyzer Pro is a browser-based resume analysis project designed to help users understand how competitive their resume is.

The application lets a user upload a PDF or TXT resume, preview the extracted content, analyze important resume sections, receive a strict score out of 100, and download a professional PDF report.

## Features

- Resume upload for PDF and TXT files
- Resume content preview
- Resume analysis dashboard
- Strict 100-point scoring system
- Contact information detection
- Professional summary evaluation
- Education detection
- Technical skills detection
- Work experience evaluation
- Project detection
- Certification detection
- GitHub, LinkedIn and portfolio link detection
- ATS keyword evaluation
- Resume quality and formatting evaluation
- Improvement recommendations
- Professional PDF report generation
- Responsive interface for desktop and mobile
- 3D/glass-style user interface
- Floating resume background design

## Scoring System

The application uses a 100-point scoring model:

| Category | Points |
|---|---:|
| Contact Information | 10 |
| Professional Summary | 8 |
| Education | 10 |
| Technical Skills | 15 |
| Work Experience | 20 |
| Projects | 12 |
| Certifications | 5 |
| GitHub / LinkedIn / Portfolio | 5 |
| ATS Keywords | 5 |
| Quality & Formatting | 10 |
| **Total** | **100** |

The scoring is intended to be strict. A resume should receive strong marks only when the relevant information is present, useful and well presented.

### Score Levels

| Score | Rating |
|---|---|
| 0–39 | Needs Major Improvement |
| 40–59 | Needs Improvement |
| 60–74 | Fair |
| 75–89 | Strong |
| 90–100 | Exceptional |

## Project Structure

```text
AI Resume Analyzer Project/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- PDF.js
- jsPDF

PDF.js is used to extract text from PDF resumes.

jsPDF is used to generate the downloadable PDF analysis report.

## How to Run

No backend server is required for the current browser-based version.

1. Download or clone the project.
2. Keep `index.html`, `style.css`, `script.js` and `README.md` in the same folder.
3. Open `index.html` in a modern web browser.
4. Select a PDF or TXT resume.
5. Click **Analyze Resume**.
6. Review the score and analysis.
7. Click **Download PDF Report** to generate the report.

## Important

The project currently uses browser-side JavaScript. Resume processing is performed in the browser using the libraries included in `index.html`.

The project does not require a Gemini API key for the current rule-based analysis version.

## GitHub Pages

To publish the project using GitHub Pages:

1. Create a GitHub repository.
2. Upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Open the repository's **Settings**.
4. Find **Pages**.
5. Select the branch containing the project, usually `main`.
6. Select the root folder.
7. Save the Pages configuration.
8. GitHub will provide the published website address.

## Privacy

Resume files are processed by the browser in the current version. The project is designed so that the resume does not need to be uploaded to a personal backend server for the basic analysis workflow.

Do not upload sensitive documents to any third-party service unless you understand how that service handles the data.

## Future Improvements

Possible future improvements include:

- Job-description matching
- Industry-specific scoring
- Role-specific ATS keyword analysis
- Better experience quality scoring
- Achievement and metric detection
- Resume section quality scoring
- More advanced PDF formatting
- Multiple resume templates
- Export to additional formats
- Optional AI-assisted recommendations

## Project Goal

The goal of Resume Analyzer Pro is to provide a simple, professional and strict resume evaluation experience rather than giving users an unrealistically high score.

A high score should be difficult to achieve and should reflect a resume that is complete, relevant, well structured and ready for professional use.

---

**Resume Analyzer Pro**

Analyze. Improve. Get hired.

