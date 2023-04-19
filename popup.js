let startTime = null;
let endTime = null;
let questions = ["what is machine learning?","what is data science?","what is data structures?"];
let currentQuestionIndex = 0;
let i=0;
let count = 0;
window.addEventListener("load",()=>{
  console.log(questions.length);
  // console.log(document.getElementsByClassName("startButton").addEventListener);

  function speech(text){
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-us'
    speechSynthesis.speak(utterance);
  }

  function startTimestamp() {
    if ('speechSynthesis' in window){
      speech('Welcome to the virtual interview i am Andrew, your AI interviewer, all the best for your interview and now shall we start the interview. The first question is ' + questions[i]);
    }
    else{
      console.log('chrome has no speech to text');
    }
    

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
    .catch(error => console.log(error));
    count = 1
  }
  
  function endTimestamp() {

    chrome.runtime.sendMessage({command: "app"});
    fetch('http://localhost:3000/app')
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.log(error));

    if (count===1){
      speech('the second question is '+questions[1])
    }
    else if(count === 2){
      speech('here comes the third question'+questions[2])
    }
    else if(count === 3){
      speech('the fourth question is '+questions[3]+'Thats it for this session Thanks for attending the interview you can see the percentage of you question accuracy in the extension')
    }
    

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
    
    if(count < 3){
      displayQuestion();
    }
    else if(count === 3){
      displayQuestion();
      document.getElementsByClassName("endButton")[0].style.display = "none";
      document.getElementsByClassName("finishButton")[0].style.display = "block";
      document.getElementsByClassName("finishButton")[0].addEventListener("click", finish);
    }
    else{
      document.getElementsByClassName("endButton")[0].style.display = "none";
      document.getElementsByClassName("finishButton")[0].style.display = "block";
      document.getElementsByClassName("finishButton")[0].addEventListener("click", finish);
    }
    count++
    startTime = endTime;
  }

  function displayQuestion(){
    document.getElementsByClassName("question")[0].innerHTML = questions[count];
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
    chrome.runtime.sendMessage({command: "end"});
    fetch('http://localhost:3000/end')
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.log(error));
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

