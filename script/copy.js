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

    // Creating notification Div
    var notificationDiv = document.createElement("div");
    notificationDiv.id = "copied-notification";
    notificationDiv.textContent = "Copied to Clipboard!";
    // fade-in animation
    notificationDiv.classList.add("Fade-in");
    // Adding notification Div to title-container
    document.getElementById("title-container").appendChild(notificationDiv);

    // fade-out animation and deleting notification div
    setTimeout(function() {
      notificationDiv.classList.add("Fade-out");
      setTimeout(function() {
        notificationDiv.remove();
      }, 500);
    }, 3000);

    console.log('Text copied to clipboard:', ServerIP);
  } catch (err) {
    console.error('Unable to copy text to clipboard', err);
    alert('Unable to copy text to clipboard');
  }

  document.body.removeChild(textarea);
}