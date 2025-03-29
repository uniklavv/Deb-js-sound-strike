const cues = document.querySelectorAll(".cue");
const primaryCue = document.querySelector(".cue-primary");

cues.forEach((cue) => {
  cue.addEventListener("click", () => {
    primaryCue.innerHTML = cue.innerHTML;

    cues.forEach((c) => c.classList.remove("active"));
    primaryCue.classList.remove("active");

    cue.classList.add("active");
    primaryCue.classList.add("active");
  });
});
