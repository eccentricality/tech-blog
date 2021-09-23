const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment = document.querySelector("#comment").value.trim();
  const post_id = parseInt(document.location.href.split("/").pop());

  if (comment && post_id) {
    // post request to add new comment
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ comment, post_id }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector(".new-comment-form")
  .addEventListener("submit", commentFormHandler);
