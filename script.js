const GITHUB_TOKEN = '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'; // Your GitHub token
const GITHUB_USERNAME = 'tish6298'; // Your GitHub username
const REPOSITORY_NAME = 'tishandnayu'; // Your repository name
const FOLDER_NAYU = 'for_nayu/'; // Folder for Nayu's letters
const FOLDER_TISH = 'for_tish/'; // Folder for Tish's letters

// Display letter form when "Write a Letter" button is clicked
document.getElementById('writeLetterBtn').addEventListener('click', () => {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('letterForm').classList.remove('hidden');
});

// Prompt for credentials when "Read Letters" is clicked
document.getElementById('readLettersBtn').addEventListener('click', () => {
    promptForCredentials();
});

// Handle letter submission
document.getElementById('submitLetterBtn').addEventListener('click', async () => {
    const recipient = document.getElementById('recipientSelect').value;
    const content = document.getElementById('letterContent').value;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `${date}.txt`;
    let folderPath = '';

    if (recipient === 'For Nayu') {
        folderPath = FOLDER_NAYU;
    } else if (recipient === 'For Tish') {
        folderPath = FOLDER_TISH;
    }

    if (folderPath === '') {
        alert('Invalid recipient selected.');
        return;
    }

    try {
        await uploadFile(content, folderPath + fileName); // Include folder path
        alert('Letter submitted successfully!');
        document.getElementById('letterContent').value = ''; // Clear textarea
    } catch (error) {
        alert('Failed to submit the letter: ' + error.message); // Error handling
        console.error('Error details:', error); // Log detailed error
    }
});

// Go back to the main menu
document.getElementById('backToMenu').addEventListener('click', () => {
    document.getElementById('lettersContainer').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('letterForm').classList.add('hidden'); // Hide letter form when going back
});

// Upload letter to GitHub
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

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return response.json();
}

// Prompt for credentials and load letters from the respective folder
async function promptForCredentials() {
    const username = prompt("Enter your username (Tish/Nayu):");
    const password = prompt("Enter your password:");

    if (username === 'Nayu' && password === '8474') {
        loadLetters(FOLDER_NAYU);
    } else if (username === 'Tish' && password === '6298') {
        loadLetters(FOLDER_TISH);
    } else {
        alert('Incorrect username or password.');
        return;
    }
}

// Load letters from the respective folder and display them
async function loadLetters(folder) {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('lettersContainer').classList.remove('hidden');
    
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${folder}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load letters: ${response.statusText}`);
        }

        const letters = await response.json();
        const letterList = document.getElementById('letterList');
        letterList.innerHTML = ''; // Clear previous letters

        letters.forEach(letter => {
            const letterItem = document.createElement('div');
            letterItem.innerText = letter.name.replace('.txt', '');
            letterItem.classList.add('letter-item');
            letterItem.onclick = () => previewLetter(folder + letter.name);
            letterList.appendChild(letterItem);
        });
    } catch (error) {
        alert('Failed to load letters: ' + error.message);
        console.error('Error loading letters:', error); // Log detailed error
    }
}

// Preview and handle actions on a letter
async function previewLetter(fileName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${fileName}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to preview letter: ${response.statusText}`);
        }

        const letterData = await response.json();
        const content = atob(letterData.content); // Decode Base64

        const letterContent = document.createElement('div');
        letterContent.innerText = content;
        letterContent.classList.add('letter-preview');
        const threeDots = document.createElement('div');
        threeDots.innerText = '...';
        threeDots.classList.add('three-dots');

        // Handle actions (download or reply)
        threeDots.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the letter click event
            const action = prompt("Choose an action: download, reply");
            if (action === 'download') {
                downloadLetter(content);
            } else if (action === 'reply') {
                const reply = prompt("Write your reply:");
                uploadFile(`Replying to: ${content}\n${reply}`, `${fileName.replace('.txt', '')}_reply_${new Date().toISOString().split('T')[0]}.txt`);
            }
        };

        letterContent.appendChild(threeDots);
        document.getElementById('letterList').innerHTML = ''; // Clear the list
        document.getElementById('letterList').appendChild(letterContent);
    } catch (error) {
        alert('Failed to preview letter: ' + error.message);
        console.error('Error previewing letter:', error); // Log detailed error
    }
}

// Download letter as a text file
function downloadLetter(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
