const GITHUB_TOKEN = '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'; // Your GitHub token
const GITHUB_USERNAME = 'tish6298'; // Your GitHub username
const REPOSITORY_NAME = 'tishandnayu'; // Your repository name

document.getElementById('write-letter').addEventListener('click', () => {
    const letterForm = document.getElementById('letterForm');
    letterForm.classList.toggle('hidden');
});

document.getElementById('submitLetterBtn').addEventListener('click', async () => {
    const recipient = document.getElementById('recipientSelect').value;
    const letterContent = document.getElementById('letterContent').value;

    if (!letterContent) {
        alert('Please write a letter before submitting.');
        return;
    }

    const date = new Date().toISOString().split('T')[0];
    const fileName = `${recipient}_${date}.txt`;
    await uploadFile(letterContent, fileName);

    document.getElementById('letterContent').value = ''; // Clear the textarea
    document.getElementById('letterForm').classList.add('hidden'); // Hide the form
    loadLetters(); // Reload letters
});

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

async function loadLetters() {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/`);
    const files = await response.json();

    const letterList = document.getElementById('letterList');
    letterList.innerHTML = ''; // Clear previous letters

    files.forEach(file => {
        if (file.name.startsWith('For')) { // Only show relevant letters
            const div = document.createElement('div');
            div.innerText = file.name;
            letterList.appendChild(div);
        }
    });
}

loadLetters(); // Load letters on startup
