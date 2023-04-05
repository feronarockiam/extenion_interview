let startTime = null;
let endTime = null;
const questions = ["what is machine learning","what is data science","what is data structures"];
let currentQuestionIndex = 0;

window.addEventListener("load",()=>{
  // console.log(document.getElementsByClassName("startButton").addEventListener);

  function startTimestamp() {
    chrome.runtime.sendMessage({command: "start"});
    //console.log('in start');
    startTime = new Date().getTime();
    //console.log("Start time: " + formatTimestamp(startTime));
    document.getElementsByClassName("startButton")[0].style.display = "none";
    document.getElementsByClassName("endButton")[0].style.display = "block";
    displayQuestion();
    fetch('http://localhost:3000/start')
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.error(error));
  }
  
  function endTimestamp() {
    console.log(startTime);
    endTime = new Date().getTime();
    let duration = endTime - startTime;
    const formattedDuration = formatDuration(duration);
    let starttime = formatTimestamp(startTime);
    let endtime = formatTimestamp(endTime);
    console.log("Start time: " + formatTimestamp(startTime));
    console.log("End time: " + formatTimestamp(endTime));
    console.log(`question ${currentQuestionIndex + 1} duration : ${formattedDuration} `);
    
    fetch('http://localhost:3000/timestamps',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ start : starttime, end : endtime})
    }).then(response => response.json()).then(data => console.log(data)).catch(err => console.log(err))
    
    document.getElementsByClassName("endButton")[0].style.display = "block";
    document.getElementsByClassName("startButton")[0].style.display = "none";
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
      displayQuestion();
    }
    else{
      document.getElementsByClassName("endButton")[0].style.display = "none";
      document.getElementsByClassName("finishButton")[0].style.display = "block";
      document.getElementsByClassName("finishButton")[0].addEventListener("click", finish);
    }
    startTime = endTime;
  }

  function displayQuestion(){
    document.getElementsByClassName("question")[0].innerHTML = questions[currentQuestionIndex];
    document.getElementsByClassName("duration")[0].innerHTML = "";
  }

  function displayMessage(message){
    document.getElementsByClassName("question")[0].innerHTML = message;
    document.getElementsByClassName("duration")[0].innerHTML = "";
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function formatDuration(duration) {
    const milliseconds = parseInt((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const parts = [];
    if (days > 0) {
      parts.push(`${days} day${days > 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    if (seconds > 0) {
      parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    }
    if (milliseconds > 0) {
      parts.push(`${milliseconds} millisecond${milliseconds > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
  }

  function finish(){
    displayMessage("Questions Completed")
    document.getElementsByClassName("finishButton")[0].style.display = "none";
  }
  
  chrome.tabs.query({active : true, currentWindow: true}, function(tabs){
    if(tabs[0].url.includes("meet.google.com")){
      displayMessage("Google Meet Extension"); 
      //console.log(document.getElementsByClassName("startButton").length); 
      document.getElementsByClassName("startButton")[0].style.display = "block";
  
      document.getElementsByClassName("endButton")[0].addEventListener("click", endTimestamp);
      document.getElementsByClassName("startButton")[0].addEventListener("click", startTimestamp)
    }
    else{
      displayMessage("This is a Google Meet Extension")
    }
  })

})

