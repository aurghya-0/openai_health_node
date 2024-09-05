import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";
import { openDb } from './database.js';

dotenv.config();

// Load API Key from .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Template object for Patient Profile
const PatientProfile = z.object({
  name: z.string(),
  age: z.string(),
  previousMedications: z.array(z.string()),
  previousConditions: z.array(z.string()),
  patientQuery: z.string(),
});

// Template object for Department Suggestion (This object gets sent)
const DepartmentSuggestion = z.object({
  patientProfile: PatientProfile,
  departmentSuggestion: z.string(),
  emergency: z.boolean(),
});

// Function to get the response from OpenAI and save the response to DB
export async function getDepartmentSuggestion(userMessage) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content:
          "You are a hospital OPD assistant suggesting patients to go to different departments for their checkup and creating a patient profile. You won't answer any other questions except the ones related to health checkup or problems. You won't suggest any treatment either. You will strictly just suggest the department, create the profile and that's it. MAKE SURE THE DEPARTMENT WHICH THE PATIENT NEEDS TO GO TO IS THERE. Set emergency to true if you feel there's an emergency.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    response_format: zodResponseFormat(
      DepartmentSuggestion,
      "department_suggestion"
    ),
  });

  console.log(completion.choices);
  const departmentSuggestion = completion.choices[0].message.parsed;

  // Save to the database
  const db = await openDb();
  await db.run(
    `INSERT INTO patients (name, age, previousMedications, previousConditions, departmentSuggestion, emergency, patientQuery) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
        departmentSuggestion.patientProfile.name,
        departmentSuggestion.patientProfile.age,
        departmentSuggestion.patientProfile.previousMedications.join(', '),
        departmentSuggestion.patientProfile.previousConditions.join(', '),
        departmentSuggestion.departmentSuggestion,
        departmentSuggestion.emergency,
        userMessage  // Save the original query
    ]
  );

  return departmentSuggestion;
}
