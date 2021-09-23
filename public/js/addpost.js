const postFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const text = document.querySelector("#text").value.trim();

  if (title && text) {
    // post request to add post
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, text }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector(".add-post-form")
  .addEventListener("submit", postFormHandler);
