


//Battle winner Confirmed
function battleConfirmationText(namesOfWinners) {
    var confirmationText = [];

    for (var i = 0; i < namesOfWinners.length; i++) {
        var textToAdd = " " + namesOfWinners[i] + " is " + numberSuffix(i + 1);

        confirmationText.push(textToAdd);
    }
    return confirmationText;
}

function battleWinnerConfirmed() {
    var orderOfWinners = gameVars.battleScreenInfo.battleWinners,
    namesOfWinners = findPlayerNames(orderOfWinners),
    confirmationResults = battleConfirmationText(namesOfWinners),
    confirmationText = "The turn order will be:\n" + confirmationResults + "\nClick Ok to Accept";

    if (confirm (confirmationText)) {
        if (gameVars.gameStatus.mode === "setup") {

            setupBoard(confirmationResults, orderOfWinners);
        }
        else {
            //check for earthshaking event, or end of turn, go to map for next attack if not
            console.log("battle winner confirmed");
        }
    }
}

function resetWinners() {
    removeElement("battle-note", "confirm-winners");
    removeElement("battle-note", "reset-winners");
    for (var i = 0; i < gameVars.battleScreenInfo.battleWinners.length; i++) {
        var playerIdToRename = gameVars.battleScreenInfo.battleWinners[i],
        playerNameToRename = gameVars.playerInfo["Player" + playerIdToRename].name,
        buttonToRename = document.getElementById("battle-winner-"+ playerIdToRename);

        buttonToRename.innerHTML = playerNameToRename;
    }
    gameVars.battleScreenInfo.battleWinners = [];
}

function showWinningButtonText(winningPlace, totalBattlePlayers) {
    if (totalBattlePlayers === winningPlace) {
        addElement("battle-note", "button", "Confirm Winners", "confirm-winners", "noClass", battleWinnerConfirmed);
        return "utterly defeated";
    }
    else {
        return numberSuffix(winningPlace) + " place";
    }
}






//make button unclickable once clicked until reset

//Battle Winners Decided
function battleWinner(winningPlayerButton) {
    var playerId = winningPlayerButton.slice(14),
    winningPlayer = gameVars.playerInfo["Player" + playerId].name,
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length,
    winningPlace = winningPlayerCount + 1,
    totalBattlePlayers = gameVars.battleScreenInfo.playersInBattleCount.length,
    winningButtonText = winningPlayer + " is " + showWinningButtonText(winningPlace, totalBattlePlayers);

    //when clicked, display cancel button
    gameVars.battleScreenInfo.battleWinners.push(playerId);
    winningPlayerCount = gameVars.battleScreenInfo.battleWinners.length
    document.getElementById(winningPlayerButton).innerHTML = winningButtonText;

    if (winningPlayerCount === 1) {
        addElement("battle-note", "button", "Reset Winners", "reset-winners", "noClass", resetWinners);
    }
}

//Initiation game begins
function startIniGame() {
    if (confirm ("Save player information and start initiation game?")) {
        startIniGameConfirmed();
    }  
}

//player setup begins
function beginPlayerSetup() {
    gameVars.globalGameOptions.totalPlayers = document.getElementById("update-player-count").value;
    
    if (document.getElementById("shared-deck-pool").checked === true) {
        gameVars.globalGameOptions.sharedDeckPool = true
    } 
    else {
        gameVars.globalGameOptions.sharedDeckPool = false
    };

    if (document.getElementById("random-map-setup").checked === true) {
        gameVars.globalGameOptions.randomMapSetup = true
    } 
    else {
        gameVars.globalGameOptions.randomMapSetup = false
    };

    if (confirm("Are you sure you want these options for this game?\n Total Players: " + gameVars.globalGameOptions.totalPlayers + 
    "\n Shared Deck Pool: " + tfyn(gameVars.globalGameOptions.sharedDeckPool) + 
    "\n Random Map Setup: " + tfyn(gameVars.globalGameOptions.randomMapSetup))) {
        hideId("global-game-options");
        hideId("player-earned-info");
        unhideId("player-info");
        createPlayerOptions();
        refreshPlayerSetupInformation();
    } 
}

//setup begins
document.addEventListener("DOMContentLoaded", function() { 
    var maxPlayers = Object.keys(masterDeckList).length;

    addAuthorToDecklists(maxPlayers);

    hideId("player-info");
    hideId("battle-screen");
    hideId("map-screen");
    document.getElementById("update-player-count").max = maxPlayers;
    updateLog("Begin Setup");
});



//Task Masters
function numberSuffix(number) {
    switch (number) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        default: return number + "th";
    }
}

function findPlayerNames(playerNumberArray) {
    var playerNames = [];

    for (var i = 0; i < playerNumberArray.length; i++) {
        playerNames.push(gameVars.playerInfo["Player" + playerNumberArray[i]].name);
    }
    return playerNames;
}