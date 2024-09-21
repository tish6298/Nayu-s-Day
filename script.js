const GITHUB_TOKEN = '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'; // Your actual token
const GITHUB_USERNAME = 'tish6298'; // Your GitHub username
const REPOSITORY_NAME = 'tishandnayu'; // Your repository name

const FOLDERS = {
    'For Tish': '6298',
    'For Nayu': '8474'
};

let currentFolder = '';

document.getElementById('write-letter').addEventListener('click', () => {
    const selectedFolder = prompt("Who are you writing for? (For Tish / For Nayu)");
    if (selectedFolder in FOLDERS) {
        currentFolder = selectedFolder;
        openLetterEditor();
    } else {
        alert("Invalid folder name. Please select 'For Tish' or 'For Nayu'.");
    }
});

function openLetterEditor() {
    const letterContent = prompt("Write your letter:");
    if (letterContent) {
        const confirmation = confirm("Do you want to save this letter?");
        if (confirmation) {
            saveLetter(letterContent);
        }
    }
}

async function saveLetter(content) {
    const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `${currentFolder}/${date}.txt`; // Save in respective folder
    await uploadFile(content, fileName);
    alert("Letter saved successfully!");
}

async function uploadFile(fileContent, fileName) {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${fileName}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add ${fileName}`,
            content: btoa(fileContent) // Convert to Base64
        })
    });

    return response.json();
}

function showUploadedFiles() {
    // Logic to display uploaded files (not implemented here)
}

// Example of how to call showUploadedFiles when a button is clicked
document.getElementById('show-files').addEventListener('click', showUploadedFiles);
