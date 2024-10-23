function showConfetti() {
    let confettiColors = ['#ff69b4', '#ff1493', '#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#8a2be2'];
    let container = document.querySelector('.container');

    for (let i = 0; i < 200; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(confetti);
    }

    setTimeout(() => {
        document.querySelectorAll('.confetti').forEach(c => c.remove());
    }, 8000); // Confetti lasts for 5 seconds
}
