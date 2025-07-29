
function extractTasksFromGmail() {
  const emailBodies = document.querySelectorAll('div[dir="ltr"]');
  let tasks = [];

  emailBodies.forEach((body) => {
    const lines = body.innerText.split('\n');
    lines.forEach((line) => {
      const taskRegex = /(?:please|can you|don't forget to|remember to|kindly)\s.+/i;
      if (taskRegex.test(line)) {
        tasks.push(line.trim());
      }
    });
  });

  if (tasks.length > 0) {
    chrome.storage.local.set({ tasks });
  }
}

setTimeout(extractTasksFromGmail, 5000);
