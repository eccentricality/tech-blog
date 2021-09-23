async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const text = document.querySelector("#text").value;

  const post_id = parseInt(document.location.href.split("/").pop());

  if (title && text) {
    // put request to edit post
    const response = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace(`/posts/${post_id}`);
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector(".edit-post-form")
  .addEventListener("submit", editFormHandler);
