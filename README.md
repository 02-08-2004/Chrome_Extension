Sure! Here's a clean version of your `README.md` content—all in one place, without any `*` stars or markdown symbols—ready for pasting directly into GitHub or any editor:

---

GMAIL UNREAD CHECKER EXTENSION

Gmail Unread Checker is a Chrome Extension that allows users to quickly view unread emails from their Gmail inbox for any specific date. Designed for productivity, this extension provides a clean, user-friendly interface to preview sender details, subject, and time, with added features like visited mail tracking and dark mode support.

FEATURES

* View unread emails from a selected date
* Filter emails using a date picker
* Display sender name, subject, and timestamp
* Open individual emails in Gmail directly from the popup
* Mark emails as visited after clicking (won’t show again unless reset)
* Show All Again button to re-display visited emails for that date
* Dark/Light theme toggle with persistent preference
* Per-date visited tracking using local Chrome storage
* OAuth 2.0 secured login using your Google account

INSTALLATION

1. Download the project folder or clone the repository
2. Open Google Chrome and go to chrome://extensions/
3. Enable Developer Mode (top right)
4. Click "Load Unpacked"
5. Select the project folder containing manifest.json

HOW IT WORKS

* Uses Google OAuth 2.0 to securely request access to Gmail data
* On load, fetches unread messages using the Gmail API with the query:
  is\:unread after:<timestamp> before:<timestamp> label\:inbox
* Displays the emails for the selected date with sender, subject, and time
* Emails opened by the user are tracked and marked as visited per day
* Clicking "Show All Again" resets visited emails only for the selected date
* Local storage is used to persist visited data and theme preference

PROJECT STRUCTURE

manifest.json
popup.html
popup.js
background.js
content.js
styles.css
icon.png
README.md

ABOUT THE DEVELOPER

This extension was developed as part of a learning project and internship with AdTip Private Limited, a company located in Vizag, India. The company is currently working on the development of websites, apps, and digital platforms focused on user engagement and monetization. The goal of this project was to understand and implement Chrome Extension APIs, Gmail API integration, OAuth 2.0 authentication, and user-centric design.

LICENSE

This project is released under the MIT License.

CONTACT

For questions or suggestions, feel free to reach out at: [sowjanya_makka@srmap.edu.in ]

