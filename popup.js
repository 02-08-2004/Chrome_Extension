// popup.js

let currentToken = null;
let visited = [];
let currentStorageKey = '';

function formatKey(date) {
  return date.toISOString().split('T')[0].replace(/-/g, '_');
}

document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');
  const resetBtn = document.getElementById('reset-visited');
  const themeToggle = document.getElementById('toggle-theme');
  const dateInput = document.getElementById('filter-date');
  let showAll = false;

  // Load saved theme
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme === 'dark') {
      document.body.classList.add('dark');
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    chrome.storage.local.set({ theme });
  });

  resetBtn.addEventListener('click', () => {
    if (!currentStorageKey) return;
    chrome.storage.local.remove(currentStorageKey, () => {
      visited = [];
      showAll = true;
      const picked = dateInput.value;
      fetchUnreadEmails(currentToken, new Date(picked));
    });
  });

  function fetchUnreadEmails(token, selectedDate) {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const afterTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const beforeTimestamp = Math.floor(endOfDay.getTime() / 1000);
    const query = `is:unread after:${afterTimestamp} before:${beforeTimestamp} label:inbox`;

    currentStorageKey = `visited_${formatKey(selectedDate)}`;
    chrome.storage.local.get([currentStorageKey], (result) => {
      visited = result[currentStorageKey] || [];

      fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.messages || data.messages.length === 0) {
            statusDiv.innerHTML = `<p class="empty">No unread emails ✅</p>`;
            return;
          }

          const promises = data.messages.map(msg =>
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
              headers: { Authorization: 'Bearer ' + token }
            })
              .then(res => res.json())
              .then(fullMsg => {
                const headers = fullMsg.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
                const from = headers.find(h => h.name === 'From')?.value || '(Unknown)';
                const date = headers.find(h => h.name === 'Date')?.value || '';
                return { id: msg.id, subject, from, date };
              })
          );

          Promise.all(promises).then(emails => {
            const ul = document.createElement('ul');

            emails.forEach(email => {
              if (!showAll && visited.includes(email.id)) return; // Skip visited if not showing all

              const li = document.createElement('li');
              li.innerHTML = `
                <strong>${email.subject}</strong>
                <br>
                <small>${email.from}<br>${new Date(email.date).toLocaleString()}</small>
              `;

              if (visited.includes(email.id)) li.classList.add('visited');

              li.addEventListener('click', () => {
                if (!visited.includes(email.id)) {
                  visited.push(email.id);
                  chrome.storage.local.set({ [currentStorageKey]: visited });
                }
                chrome.tabs.create({ url: `https://mail.google.com/mail/u/0/#inbox/${email.id}` });
                li.classList.add('visited');
              });

              ul.appendChild(li);
            });

            statusDiv.innerHTML = '';
            statusDiv.appendChild(ul);
            showAll = false; // Reset for next run
          });
        })
        .catch(err => {
          console.error(err);
          statusDiv.innerText = 'Failed to fetch emails ❌';
        });
    });
  }

  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (!token) {
      statusDiv.innerText = 'Authorization error 😕';
      return;
    }

    currentToken = token;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;
    dateInput.value = defaultDate;

    dateInput.addEventListener('change', () => {
      const picked = dateInput.value;
      fetchUnreadEmails(token, new Date(picked));
    });

    fetchUnreadEmails(token, today);
  });
});
