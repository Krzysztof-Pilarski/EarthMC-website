var notificationDiv = document.getElementById("copied-notification");

function copyToClipboard() {
  // text to copy
  var ServerIP = "play.EarthMC.net";

  var textarea = document.createElement("textarea");
  textarea.value = ServerIP;
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    // copying text
    document.execCommand('copy');

    // Setting textContent after copying to clipboard
    notificationDiv.textContent = "Copied to Clipboard!";

    // fade-in animation
    notificationDiv.classList.add("fade-in");
    // Displaying the notificationDiv
    notificationDiv.style.display = 'block';

    // fade-out animation and deleting notification div
    setTimeout(function() {
      notificationDiv.classList.add("fade-out");
    }, 1500);

    // Removing the fade-out class and hiding the notificationDiv after the animation ends
    setTimeout(function() {
      notificationDiv.classList.remove("fade-out");
      notificationDiv.style.display = 'none';
    }, 2000); 

    console.log('Text copied to clipboard:', ServerIP);
  } catch (err) {
    console.error('Unable to copy text to clipboard', err);
    alert('Unable to copy text to clipboard');
  }

  document.body.removeChild(textarea);
}