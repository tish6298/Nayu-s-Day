const letters = {
    Nayu: [],
    Tish: []
};

document.getElementById('forNayuBtn').addEventListener('click', () => showLetters('Nayu'));
document.getElementById('forTishBtn').addEventListener('click', () => showLetters('Tish'));
document.getElementById('newLetterBtn').addEventListener('click', () => openEditor());

function showLetters(folder) {
    const letterList = document.getElementById('letterList');
    letterList.innerHTML = ''; // Clear previous list
    letterList.classList.remove('hidden');
    letterList.innerHTML += `<h2>Letters for ${folder}</h2>`;
    
    letters[folder].forEach((letter, index) => {
        letterList.innerHTML += `
            <div>
                <p>${letter.content}</p>
                <button onclick="replyToLetter('${folder}', ${index})">Reply</button>
                <button onclick="downloadLetter('${folder}', ${index}')">Download</button>
            </div>
        `;
    });
}

function openEditor() {
    document.getElementById('editor').classList.remove('hidden');
}

document.getElementById('submitLetterBtn').addEventListener('click', () => {
    const recipient = document.getElementById('recipientSelect').value;
    const content = document.getElementById('letterContent').value;
    const date = new Date().toISOString().split('T')[0];

    letters[recipient].push({ content: `Replying to >> ${date}\n` + content });
    
    // Save to GitHub here (implementation needed)

    alert('Letter saved!');
    document.getElementById('letterContent').value = '';
    showLetters(recipient);
});

function replyToLetter(folder, index) {
    const originalLetter = letters[folder][index].content;
    document.getElementById('letterContent').value = originalLetter;
    openEditor();
}

function downloadLetter(folder, index) {
    const letter = letters[folder][index].content;
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-${folder}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
