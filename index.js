// main.js

import { getDepartmentSuggestion } from "./departmentSuggestion.js";

async function run() {
  const userMessage =
    "Nova Scott, 28 M, Previously diagnosed with choleterol, having high blood pressure with blood sugar, feeling dizzy.";

  try {
    const departmentSuggestion = await getDepartmentSuggestion(userMessage);
    console.log(departmentSuggestion);
  } catch (error) {
    console.error("Error getting department suggestion:", error);
  }
}

run();
