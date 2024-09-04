document.getElementById('suggestionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userMessage = document.getElementById('userMessage').value;
    
    const response = await fetch('/suggest-department', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
    });

    const result = await response.json();
    
    document.getElementById('result').innerHTML = `
        <h2>Department Suggestion</h2>
        <p><strong>Department:</strong> ${result.departmentSuggestion}</p>
        <p class="${result.emergency ? 'emergency' : ''}">
            <strong>Emergency:</strong> ${result.emergency ? 'Yes' : 'No'}
        </p>
        <div class="profile-box">
            <h3>Patient Profile</h3>
            <p><strong>Name:</strong> ${result.patientProfile.name}</p>
            <p><strong>Age:</strong> ${result.patientProfile.age}</p>
            <p><strong>Patient Query:</strong> ${result.patientProfile.patientQuery}</p>
            <p><strong>Previous Medications:</strong> ${result.patientProfile.previousMedications.join(', ')}</p>
            <p><strong>Previous Conditions:</strong> ${result.patientProfile.previousConditions.join(', ')}</p>
        </div>
    `;
});
