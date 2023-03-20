const clickEvent = new MouseEvent("click", { bubbles: true });

export function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export function keyboardNav(event: KeyboardEvent) {
  let active = -1;
  for (let i = 1; i <= 4; i++) {
    if (document.activeElement?.id === "card" + i) active = i;
  }
  if (event.key === "ArrowUp") {
    if (active === -1)
      document.getElementById("card1")?.dispatchEvent(clickEvent);
    else if (active > 1)
      document.getElementById("card" + (active - 1))?.dispatchEvent(clickEvent);
  } else if (event.key === "ArrowDown") {
    if (active === -1)
      document.getElementById("card4")?.dispatchEvent(clickEvent);
    else if (active < 4)
      document.getElementById("card" + (active + 1))?.dispatchEvent(clickEvent);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const pagination = document.getElementById("Pagination");
    if (pagination === null) return;
    pagination.scrollIntoView();
    pagination.focus();
    const navButtons = pagination.getElementsByTagName("li");
    if (event.key === "ArrowLeft")
      navButtons[0].firstChild?.dispatchEvent(clickEvent);
    else if (event.key === "ArrowRight")
      navButtons[navButtons.length - 1].firstChild?.dispatchEvent(clickEvent);
  }
}
