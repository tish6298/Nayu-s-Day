const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'tish6298';
const REPOSITORY_NAME = 'tishandnayu';

const lettersFolder = {
    'For Nayu': 'for_nayu/',
    'For Tish': 'for_tish/'
};

document.getElementById('writeLetterBtn').addEventListener('click', () => {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('letterForm').classList.remove('hidden');
    document.getElementById('lettersContainer').classList.add('hidden');
});

document.getElementById('readLettersBtn').addEventListener('click', async () => {
    const isValidUser = await checkUser();
    if (isValidUser) {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('lettersContainer').classList.remove('hidden');
        loadLetters();
    }
});

document.getElementById('submitLetterBtn').addEventListener('click', async () => {
    const letterContent = document.getElementById('letterContent').value;
    const recipient = document.getElementById('recipientSelect').value;
    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}.txt`;
    
    if (letterContent.trim() !== "") {
        await uploadFile(letterContent, lettersFolder[recipient] + fileName);
        document.getElementById('letterContent').value = ''; // Clear textarea
    }
});

document.getElementById('backToMenu').addEventListener('click', () => {
    document.getElementById('letterForm').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
});

document.getElementById('backToMenuLetters').addEventListener('click', () => {
    document.getElementById('lettersContainer').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
});

async function checkUser() {
    const username = prompt('Enter your username (Tish/Nayu):');
    const password = prompt('Enter your password:');
    if ((username === 'Tish' && password === '6298') || (username === 'Nayu' && password === '8474')) {
        return true;
    }
    alert('Invalid username or password');
    return false;
}

async function loadLetters() {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/`);
    const files = await response.json();
    
    const letterList = document.getElementById('letterList');
    letterList.innerHTML = '';

    files.forEach(file => {
        if (file.path.startsWith(lettersFolder['For Nayu']) || file.path.startsWith(lettersFolder['For Tish'])) {
            const listItem = document.createElement('div');
            listItem.innerHTML = `
                <span>${file.name}</span>
                <button onclick="downloadFile('${file.path}')">Download</button>
                <button onclick="replyToLetter('${file.path}')">Reply</button>
                <button onclick="previewLetter('${file.path}')">Preview</button>
            `;
            letterList.appendChild(listItem);
        }
    });
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
            content: btoa(fileContent)
        })
    });
    return response.json();
}

function downloadFile(filePath) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}/main/${filePath}`;
    window.open(url);
}

function replyToLetter(filePath) {
    const date = filePath.split('/').pop().replace('.txt', '');
    const replyContent = prompt(`Replying to ${date}. Please write your reply:`);
    if (replyContent) {
        const fullReply = `Replying to >> ${date}\n\n${replyContent}`;
        uploadFile(fullReply, filePath);
    }
}

function previewLetter(filePath) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}/main/${filePath}`;
    fetch(url)
        .then(response => response.text())
        .then(data => {
            alert(`Preview of letter:\n\n${data}`);
        })
        .catch(error => console.error('Error fetching letter:', error));
}
