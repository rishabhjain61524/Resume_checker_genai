const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated"
        },
        matchScore: {
            type: Type.INTEGER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover" }
                },
                required: [ "question", "intention", "answer" ]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover" }
                },
                required: [ "question", "intention", "answer" ]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in candidate's profile along with severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: [ "low", "medium", "high" ], description: "The severity of this skill gap" }
                },
                required: [ "skill", "severity" ]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day" },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of tasks to be done on this day"
                    }
                },
                required: [ "day", "focus", "tasks" ]
            }
        }
    },
    required: [ "title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan" ]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const launchOptions = {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process"
        ]
    }

    if (process.env.PUPPETEER_EXECUTABLE_PATH || process.platform === "linux" || process.env.NODE_ENV === "production") {
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium"
    }

    let browser
    try {
        browser = await puppeteer.launch(launchOptions)
        const page = await browser.newPage()

        // FIX: Changed waitUntil to domcontentloaded to avoid hanging on external resources like Google Fonts
        await page.setContent(htmlContent, { 
            waitUntil: "domcontentloaded",
            timeout: 15000 
        })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        })

        return pdfBuffer
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: {
                type: Type.STRING,
                description: "The HTML content of the resume which can be converted to PDF using puppeteer"
            }
        },
        required: [ "html" ]
    }

    const prompt = `Generate resume for a candidate with the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}

The response should be a JSON object with a single field "html" containing the HTML content of the resume.
The resume should be tailored for the given job description and should highlight strengths.
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }