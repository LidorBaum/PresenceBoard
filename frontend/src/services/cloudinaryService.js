export async function uploadImg(ev) {
    const CLOUD_NAME = "echoshare"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`

    const formData = new FormData();
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', 'echoshareImgs');
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        console.log(data);
        return data.secure_url
    } catch (err) {
        console.log(err);
    }
}