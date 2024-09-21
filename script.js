const octokit = new Octokit({ auth: 'YOUR_PERSONAL_ACCESS_TOKEN' });

document.getElementById('writeLetterBtn').addEventListener('click', () => {
    document.getElementById('letterForm').classList.toggle('hidden');
});

async function saveLetterToGitHub(folder, content) {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `letter-${folder}-${date}.txt`;
    
    const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner: 'YOUR_GITHUB_USERNAME',
        repo: 'YOUR_REPOSITORY_NAME',
        path: fileName,
        message: `Add letter for ${folder}`,
        content: btoa(content), // Encode content to base64
        committer: {
            name: 'Your Name',
            email: 'your-email@example.com'
        }
    });
    
    console.log(response.data);
    alert('Letter saved to GitHub!');
}

document.getElementById('submitLetterBtn').addEventListener('click', async () => {
    const recipient = document.getElementById('recipientSelect').value;
    const content = document.getElementById('letterContent').value;

    await saveLetterToGitHub(recipient, content);
    
    // Optionally, clear the textarea after saving
    document.getElementById('letterContent').value = '';
});
