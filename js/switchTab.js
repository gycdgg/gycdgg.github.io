var titleContainer = "";
(function () {
  document.addEventListener("visibilitychange", function () {
    document.hidden && (titleContainer = document.title)
    document.title = document.hidden ? "别在外面瞎逛悠了，快回来吧" : titleContainer;
  })
})()