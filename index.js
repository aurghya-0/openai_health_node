// main.js

import { getDepartmentSuggestion } from "./departmentSuggestion.js";

async function run() {
  const userMessage =
    "I am John Doe (M), my date of birth is 19th Nov, 1994. I am having a slight pain in stomach. I have a history of gastritis. I take Pantaprazole 40mg once daily in the morning. I have had no previous surgeries and no family problems as such.";

  try {
    const departmentSuggestion = await getDepartmentSuggestion(userMessage);
    console.log(departmentSuggestion);
  } catch (error) {
    console.error("Error getting department suggestion:", error);
  }
}

run();
