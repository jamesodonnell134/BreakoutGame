function breakoutView() {
    let str = document.getElementById("start"), canvas = document.getElementById("myCanvas"),
        context = canvas.getContext("2d");
    let ballRadius = 15, x = canvas.width / 2, y = canvas.height - 30,
        dx = 5, dy = -5, pongH = 20, pongW = 150, pongX = (canvas.width - pongW) / 2, blockWidth = 50,
        blockHeight = 20, blockPadding = 12, topBlockOffset = 40, rightTilt = false, leftTilt = false,
        blockRows = 4, blockColumns = 12, leftBlockOffset = 40, noBlocks = 48, gmCounter = 0, colour = 0,
        drawCalls = 0, blocks = [];

    for (let row = 0; row < blockRows; row++) {
        for (let column = 0; column < blockColumns; column++) {
            blocks.push({
                x: (column * (blockWidth + blockPadding)) + leftBlockOffset,
                y: (row * (blockHeight + blockPadding)) + topBlockOffset,
                status: 1
            });
        }
    }

    function drawBall() {
        context.beginPath();
        context.arc(x, y, ballRadius, 0, Math.PI * 2);
        context.fillStyle = "#ff0000";
        context.fill();
        context.closePath();
    }


    function drawBlocks() {
        colour = 0;
        blocks.forEach(function (block) {
            colour += 1;
            if (!block.status) return;

            if (colour <= 12) {
                context.beginPath();
                context.rect(block.x, block.y, blockWidth, blockHeight);
                context.fillStyle = "#ff0000";
                context.fill();
                context.closePath();
            }

            if (colour > 12 && colour <= 24) {
                context.beginPath();
                context.rect(block.x, block.y, blockWidth, blockHeight);
                context.fillStyle = "#0000ff";
                context.fill();
                context.closePath();
            }

            if (colour > 24 && colour <= 36) {
                context.beginPath();
                context.rect(block.x, block.y, blockWidth, blockHeight);
                context.fillStyle = "#32CD32";
                context.fill();
                context.closePath();
            }

            if (colour > 36) {
                context.beginPath();
                context.rect(block.x, block.y, blockWidth, blockHeight);
                context.fillStyle = "#ffa500";
                context.fill();
                context.closePath();

            }
        });
    }

    function impact() {
        blocks.forEach(function (blk) {
            if (!blk.status) return;

            let inBlocksColumn = x > blk.x && x < blk.x + blockWidth,
                inBlocksRow = y > blk.y && y < blk.y + blockHeight;

            if (inBlocksColumn && inBlocksRow) {
                dy = -dy;
                blk.status = 0;
                noBlocks -= 1
            }
        });
    }

    function drawPong() {
        context.beginPath();
        context.rect(pongX, canvas.height - pongH, pongW, pongH);
        context.fillStyle = "#FF8C00";
        context.fill();
        context.closePath();
    }


    function start() {
        showHideStart();
        setInterval(draw, 10)
    };

    function showHideStart() {
        if (str.style.display === "inline-block") {
            str.style.display = "none";
        }
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks();
        drawBall();
        drawPong();
        impact();

        if (sideHit())
            dx = -dx;

        if (topHit() || hitPong())
            dy = -dy;

        if (noBlocks == 0) {
            gmCounter += 1
            if (gmCounter <= 500) {
                if (gmCounter % 10 == 0) {
                    displayWinner();
                }
            } else {
                window.location.reload();
            }
        }

        if (gameOver()) {
            gmCounter += 1
            if (gmCounter <= 100) {
                if (gmCounter % 10 == 0 && noBlocks == 0) {
                    displayWinner();
                }
                if (gmCounter % 10 == 0 && noBlocks !== 0) {
                    displayGameover();
                }
            } else {
                window.location.reload();
            }
        }

        function displayGameover() {
            let gmOver = document.getElementById("game-over")
            if (gmOver.style.display === "none") {
                gmOver.style.display = "block";
            } else {
                gmOver.style.display = "none";
            }
        }

        function displayWinner() {
            let win = document.getElementById("winner")
            if (win.style.display === "none") {
                win.style.display = "block";
            } else {
                win.style.display = "none";
            }
        }

        function hitPong() {
            return bottomHit() && ballOnPong();
        }

        function ballOnPong() {
            return x > pongX && x < pongX + pongW;
        }

        function topHit() {
            return y + dy < ballRadius;
        }

        function bottomHit() {
            return y + dy > canvas.height - ballRadius;
        }

        function gameOver() {
            return bottomHit() && !ballOnPong();
        }

        function sideHit() {
            return x + dx > canvas.width - ballRadius || x + dx < ballRadius;
        }

        // Limiting lag when using event listener
        if (drawCalls % 50 == 0) {
            window.addEventListener("deviceorientation", handleOrientation, true);
        }

        function handleOrientation(event) {

            let x = event.gamma;
            x = x * 15;
            pongX = (canvas.width - pongW) / 2 + x;

            let maxX = canvas.width - pongW, minX = 0, pongDelta = rightTilt ? 7 : leftTilt ? -7 : 0;

            pongX = pongX + pongDelta;
            pongX = Math.min(pongX, maxX);
            pongX = Math.max(pongX, minX);
        };

        x += dx;
        y += dy;
        drawCalls += 1
    }


    this.init = function () {
        console.log("Initialising view...");
        drawBlocks();
        drawPong();
        str.addEventListener("click", start);
    };
}