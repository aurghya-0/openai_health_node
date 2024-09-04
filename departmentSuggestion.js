// departmentSuggestion.js

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI with the API key
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Define the schema for PatientProfile
const PatientProfile = z.object({
  name: z.string(),
  age: z.string(),
  previousMedications: z.array(z.string()),
  previousConditions: z.array(z.string()),
});

// Define the schema for DepartmentSuggestion
const DepartmentSuggestion = z.object({
  patientProfile: PatientProfile,
  departmentSuggestion: z.string(),
  emergency: z.boolean(),
});

// Function to get department suggestion
export async function getDepartmentSuggestion(userMessage) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
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
      "department_suggestion",
    ),
  });

  return completion.choices[0].message.parsed;
}
