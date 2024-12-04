
const correctCodes = {
    1: "7",
    2: "3",
    3: "5",
    4: "8",
    5: "2"
};

let unlockedCount = 0;

//https://stackoverflow.com/questions/33982850/javascript-that-checks-for-password-input-to-enable-a-button; https://www.shecodes.io/athena/3695-using-javascript-to-create-a-password-confirmation-field#google_vignette
function unlockBox(boxNumber){
    const inputElement = document.getElementById(`input${boxNumber}`);
    const statusElement = document.getElementById(`box${boxNumber}`).querySelector('.status');

    const userCode = inputElement.value.trim();

    if (userCode === correctCodes[boxNumber]){
        statusElement.textContent = "Correct!";
        statusElement.style.color = "green";
        unlockedCount++;
    } else {
        statusElement.textContent = "Incorrect. Try Again";
        statusElement.style.color = "red";
    }

    if (unlockedCount === Object.keys(correctCodes).length){
        setTimeout(function(){
            window.location.href = "intermediate.html";
        }, 1000);
    }
}

