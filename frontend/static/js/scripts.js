async function uploadPhotos() {
    const input = document.getElementById('photoInput');
    const files = input.files;
    if (files.length === 0) {
        alert("Please select files to upload.");
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        formData.append('photo', file);
    }

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message || result.error);
}

document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const response = await fetch('/random-photo');
        if (response.ok) {
            document.getElementById('photoDisplay').src = URL.createObjectURL(await response.blob());
        } else {
            const result = await response.json();
            alert(result.error);
        }
    }
});
