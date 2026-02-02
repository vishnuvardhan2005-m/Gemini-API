const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const output = document.getElementById("output");

// Show image preview when user selects a file
input.addEventListener("change", () => {
  const file = input.files[0];
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  output.innerText = "Ready to analyze...";
});

async function analyzeImage() {
  const file = input.files[0];
  if (!file) return alert("Select an image first!");

  output.innerText = "Analyzing image, please wait...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    output.innerText = data.summary || data.error || "No response from server.";
  } catch (err) {
    console.error(err);
    output.innerText = `Error: ${err.message}`;
  }
}
