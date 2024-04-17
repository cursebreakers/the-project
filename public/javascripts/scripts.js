// Client-side Scirpt Engine

let message = "Hello World!"

function hello(message) {
    console.log(message)
}

hello("Hello World!")


document.addEventListener('DOMContentLoaded', function() {
    const shareLink = document.getElementById('copyLinkBtn');
  
    if (shareLink) {
      shareLink.addEventListener('click', function() {
        const urlToCopy = window.location.href;
        
        navigator.clipboard.writeText(urlToCopy).then(function() {
          alert('Link copied to clipboard!');
        }).catch(function(err) {
          console.error('Error copying link to clipboard: ', err);
        });
      });
    }
});