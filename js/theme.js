document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  function setTheme(theme) {
    body.classList.remove("dark-yellow", "light-yellow");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme") || "dark-yellow";
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = body.classList.contains("dark-yellow") ? "light-yellow" : "dark-yellow";
      setTheme(newTheme);
    });
  }
});