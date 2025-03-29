const stickers = document.querySelectorAll(".sticker");
const vinylCover = document.getElementById("vinylCover");
const vinylStickersCover = document.querySelector(".vinyl-stickers-cover");

stickers.forEach((sticker) => {
  sticker.addEventListener("dragstart", handleDragStart);
  sticker.addEventListener("touchstart", handleTouchStart);
  sticker.addEventListener("touchmove", handleTouchMove);
  sticker.addEventListener("touchend", handleTouchEnd);
  sticker.addEventListener("touchcancel", (e) => e.preventDefault());
  sticker.addEventListener("touchleave", (e) => e.preventDefault());
});

function handleDragStart(e) {
  e.dataTransfer.setData("stickerId", e.target.id);
  e.target.dataset.originalParent = e.target.parentElement.id;
}

function handleTouchStart(e) {
  e.preventDefault();
  const sticker = e.target;
  const touch = e.touches[0];
  const rect = sticker.getBoundingClientRect();
  const parentRect = sticker.offsetParent.getBoundingClientRect();

  sticker.dataset.offsetX = touch.clientX - rect.left;
  sticker.dataset.offsetY = touch.clientY - rect.top;
  sticker.dataset.parentLeft = parentRect.left;
  sticker.dataset.parentTop = parentRect.top;

  if (window.getComputedStyle(sticker).position !== "absolute") {
    sticker.style.position = "absolute";
    sticker.style.left = `${rect.left - parentRect.left}px`;
    sticker.style.top = `${rect.top - parentRect.top}px`;
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  const sticker = e.target;
  const touch = e.touches[0];

  const x =
    touch.clientX - sticker.dataset.offsetX - sticker.dataset.parentLeft;
  const y = touch.clientY - sticker.dataset.offsetY - sticker.dataset.parentTop;

  sticker.style.left = `${x}px`;
  sticker.style.top = `${y}px`;
}

function handleTouchEnd(e) {
  e.preventDefault();
  const sticker = e.target;
  const touch = e.changedTouches[0];

  sticker.style.pointerEvents = "none";

  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

  sticker.style.pointerEvents = "auto";

  if (dropTarget === vinylCover) {
    handleDrop(sticker, dropTarget, touch.clientX, touch.clientY);
  } else {
    resetStickerPosition(sticker); 
  }
}

function handleDrop(sticker, target, clientX, clientY) {
  if (target === vinylStickersCover) {
    resetStickerPosition(sticker);
  } else {
    const targetRect = target.getBoundingClientRect();
    const x = clientX - targetRect.left - sticker.offsetWidth / 2;
    const y = clientY - targetRect.top - sticker.offsetHeight / 2;

    sticker.style.position = "absolute";
    sticker.style.left = `${x}px`;
    sticker.style.top = `${y}px`;
    target.appendChild(sticker);
  }
}

[vinylCover, vinylStickersCover].forEach((target) => {
  target.addEventListener("dragover", (e) => e.preventDefault());
  target.addEventListener("drop", (e) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData("stickerId");
    const sticker = document.getElementById(stickerId);
    handleDrop(sticker, target, e.clientX, e.clientY);
  });
});

function resetStickerPosition(sticker) {
  sticker.style.removeProperty("position");
  sticker.style.removeProperty("left");
  sticker.style.removeProperty("top");
  vinylStickersCover.appendChild(sticker);
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".sticker").forEach((sticker) => {
    if (sticker.parentElement === vinylCover) {
      const targetRect = vinylCover.getBoundingClientRect();
      const x = (parseFloat(sticker.style.left) / targetRect.width) * 100;
      const y = (parseFloat(sticker.style.top) / targetRect.height) * 100;

      sticker.style.left = `${x}%`;
      sticker.style.top = `${y}%`;
    }
  });
});
