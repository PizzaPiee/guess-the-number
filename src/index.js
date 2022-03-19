const gameInfoModal = new bootstrap.Modal(
    document.getElementById("gameInfo"),
    {}
);
const gameLostModal = new bootstrap.Modal(
    document.getElementById("gameLost"),
    {}
);
const gameWonModal = new bootstrap.Modal(
    document.getElementById("gameWon"),
    {}
);
let secretNumber = Math.floor(Math.random() * 100 + 1);
let numbers = [];
const root = document.getElementById("numbers");
let counter = 0;
const counterElement = document.getElementById("counter");

function updateCounter() {
    if (counter == 6) {
        restart("lost");
        return;
    }
    counter++;
    counterElement.innerHTML = `Number of guesses left: ${7 - counter}`;
}

function restart(reason) {
    counter = 0;
    secretNumber = Math.floor(Math.random() * 100 + 1);
    numbers = [];
    root.innerHTML = "";
    counterElement.innerHTML = `Number of guesses left: ${7 - counter}`;
    loadNumbers();
    if (reason === "lost") gameLostModal.show();
    if (reason === "won") gameWonModal.show();
}

function loadNumbers() {
    // this function renders all the 100 buttons inside the 'root' element
    for (let i = 1; i <= 100; i++) {
        // create 100 buttons and save them in the numbers array
        const element = document.createElement("button");
        element.className = "btn btn-info";
        element.innerHTML = i;
        element.onclick = handleGuess;
        numbers.push(element);
    }

    let i = 0;
    for (let x = 0; x < 10; x++) {
        // create a row
        const rowElement = document.createElement("div");
        rowElement.className = "row";
        root.append(rowElement);
        for (let y = 0; y < 10; y++) {
            // create 10 cols inside the row and put a button inside each one
            const colElement = document.createElement("div");
            colElement.className = "col m-2";
            colElement.appendChild(numbers[i]);
            i++;
            rowElement.appendChild(colElement);
        }
    }
}

function handleGuess(e) {
    // In this function I check whether the guess is right or not.
    // CASE 1: the guess is right. I change the button's color and restart the game
    // CASE 2: the guess is smaller than the actual number. The color of all the buttons smaller than the guess is changed to a red and they can't be guessed anymore
    // CASE 3: It's like 'CASE 2' but with all the numbers greatest than the guess
    let num = parseInt(e.target.innerHTML);

    if (e.target.className !== "btn btn-danger") {
        // CASE 1
        if (num === secretNumber) {
            e.target.className = "btn btn-success";
            restart("won");
            return;
        } else if (num < secretNumber) {
            // CASE 2
            numbers.forEach((element) => {
                if (parseInt(element.innerHTML) <= num)
                    element.className = "btn btn-danger";
            });
        } else {
            // CASE 3
            numbers.forEach((element) => {
                if (parseInt(element.innerHTML) >= num)
                    element.className = "btn btn-danger";
            });
        }
        updateCounter();
    } else {
        let alertContainer = document.getElementById("alerts");
        let alert = document.createElement("div");
        alert.className = "alert alert-danger alert-dismissible fade show m-5";
        alert.innerHTML =
            '<strong>Invalid guess!</strong> You can\'t guess the red numbers. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        alertContainer.appendChild(alert);
        setTimeout(() => {
            let element = new bootstrap.Alert(alert);
            element.close();
        }, 3000);
    }
}

window.addEventListener("load", () => {
    // Show the bootstrap modal telling how to play the game
    gameInfoModal.show();
    loadNumbers();
});


