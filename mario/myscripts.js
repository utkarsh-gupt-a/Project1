const gameContainer = document.getElementById('game-container');
  const mario = document.getElementById('mario');
  const scoreDisplay = document.getElementById('score');
  let marioPositionY = 0;
  let isJumping = false;
  let isFalling = false;
  let canJump = true; // Variable to control jumping
  let score = 0;

  function jump() {
    if (canJump && !isJumping && !isFalling) {
      canJump = false; // Disable jumping until the character touches the ground again
      isJumping = true;
      mario.style.bottom = '230px'; // Jump height

      setTimeout(() => {
        mario.style.bottom = '0';
        isJumping = false;
        isFalling = true;
        checkCollision(); // Check collision after landing
      }, 500); // Jump duration
    }
  }

  function createWall() {
    const wall = document.createElement('div');
    wall.className = 'wall';
    wall.style.height = `${Math.floor(Math.random() * 115) + 36}px`; // Random height between 36 and 150
    wall.style.left = `${window.innerWidth}px`; // Start from the right of the screen
    gameContainer.appendChild(wall);

    const moveWallInterval = setInterval(() => {
      const wallRect = wall.getBoundingClientRect();
      wall.style.left = `${parseFloat(wall.style.left) - 5}px`; // Constant speed

      if (parseFloat(wall.style.left) + wallRect.width < 0) {
        clearInterval(moveWallInterval);
        gameContainer.removeChild(wall);
        updateScore();
      }

      checkCollision();
    }, 16); // Update every 16 milliseconds (60 FPS)
  }

  function checkCollision() {
    const marioRect = mario.getBoundingClientRect();
    const walls = document.querySelectorAll('.wall');

    walls.forEach((wall) => {
      const wallRect = wall.getBoundingClientRect();

      if (
        marioRect.bottom > wallRect.top &&
        marioRect.top < wallRect.bottom &&
        marioRect.right > wallRect.left &&
        marioRect.left < wallRect.right
      ) {
        // Collision detected
        if (marioRect.bottom <= wallRect.top + 5) {
          // Jumped on top of the wall
          marioPositionY = wallRect.bottom;
          mario.style.bottom = `${marioPositionY}px`;
        } else {
          // Game over - Mario touched the wall
          alert(`Game Over! Your Score: ${score}`);
          resetGame();
        }
      }
    });

    // Check if Mario is on the ground
    if (marioPositionY === 0) {
      isFalling = false;
      canJump = true; // Enable jumping when the character touches the ground
    }
  }

  function updateScore() {
    score += 100;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function resetGame() {
    // Reset Mario position and score
    marioPositionY = 0;
    score = 0;
    mario.style.bottom = `${marioPositionY}px`;
    scoreDisplay.textContent = `Score: ${score}`;

    // Remove all walls
    const walls = document.querySelectorAll('.wall');
    walls.forEach(wall => gameContainer.removeChild(wall));
  }

  // Event listeners for tap and keyboard controls
  gameContainer.addEventListener('touchstart', jump);

  document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !isJumping && !isFalling && canJump) {
      jump();
    }
  });

  setInterval(createWall, 3000); // Create a new wall every 3 seconds
