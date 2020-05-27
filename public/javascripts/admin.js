window.onscroll = function() {getSticky()};

var titleBar = document.getElementById("title-bar");
var sticky = titleBar.offsetTop;

var statusBox = document.getElementById("status");
var statusSticky = statusBox.offsetTop;

function getSticky() {
  if (window.pageYOffset >= sticky) {
    titleBar.classList.add("sticky")
  } else {
    titleBar.classList.remove("sticky");
  }
  if (window.pageYOffset >= 100) {
    statusBox.classList.add("stickyside")
  } else {
    statusBox.classList.remove("stickyside");
  }
}

n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = m + "/" + d + "/" + y;