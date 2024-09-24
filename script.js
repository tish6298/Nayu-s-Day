const GITHUB_TOKEN = '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'; // Your actual GitHub token
const GITHUB_USERNAME = 'tish6298'; // Your GitHub username
const REPOSITORY_NAME = 'tishandnayu'; // Your repository name

let loggedInUser = '';

document.getElementById('writeLetterBtn').addEventListener('click', showLetterForm);
document.getElementById('showLettersBtn').addEventListener('click', showLoginForm);
document.getElementById('loginBtn').addEventListener('click', authenticateUser);
document.getElementById('submitLetterBtn').addEventListener('click', submitLetter);

function showLetterForm() {
    document.getElementById('letterForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('letterForm').classList.add('hidden');
}

function authenticateUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials (hardcoded for simplicity)
    if ((username === 'Nayu' && password === '8474') || (username === 'Tish' && password === '6298')) {
        loggedInUser = username;
        loadLetters(username);
    } else {
        alert('Invalid credentials');
    }
}

function submitLetter() {
    const recipient = document.getElementById('recipientSelect').value;
    const content = document.getElementById('letterContent').value;
    const date = new Date().toISOString().split('T')[0]; // Get current date

    const folder = recipient === 'For Nayu' ? 'for_nayu' : 'for_tish';
    const fileName = `${date}.txt`;

    uploadFile(content, folder, fileName);
}

async function uploadFile(content, folder, fileName) {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${folder}/${fileName}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Added letter: ${fileName}`,
            content: btoa(content) // Base64 encode
        })
    });

    if (response.ok) {
        alert('Letter submitted successfully!');
    } else {
        alert('Failed to submit the letter');
    }
}

async function loadLetters(folder) {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${folder}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });

    const files = await response.json();
    const letterList = document.getElementById('letterList');
    letterList.innerHTML = '';

    files.forEach(file => {
        const letterItem = document.createElement('div');
        letterItem.className = 'letter-item';
        letterItem.innerHTML = `
            <p>${file.name}</p>
            <button onclick="previewLetter('${file.path}')">Preview</button>
            <button onclick="downloadLetter('${file.path}')">Download</button>
            <button onclick="replyToLetter('${file.path}')">Reply</button>
        `;
        letterList.appendChild(letterItem);
    });

    document.getElementById('lettersContainer').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
}

async function previewLetter(path) {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${path}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });
    const data = await response.json();
    const content = atob(data.content);

    alert(`Letter content:\n\n${content}`);
}

function downloadLetter(path) {
    const link = document.createElement('a');
    link.href = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}/main/${path}`;
    link.download = path.split('/').pop();
    link.click();
}

function replyToLetter(path) {
    const letterForm = document.getElementById('letterForm');
    letterForm.classList.remove('hidden');
    const letterContent = document.getElementById('letterContent');
    letterContent.value = `Replying to letter: ${path}`;
}
