import {
    uploadFn
} from 'src/design/lib/axios';
export default () => {
    return new Promise((resolve, reject) => {
        let els = document.querySelectorAll('[data-id="upload"]');
        els.forEach(item => {
            item.remove();
        });
        let upload = document.createElement('input');
        upload.style = `display: none;`;
        upload.setAttribute('data-id', 'upload');
        upload.setAttribute('type', 'file');
        upload.setAttribute('accept', 'image/*');
        document.body.appendChild(upload);
        upload.focus();
        upload.click();
        upload.addEventListener('change', async () => {
            if (upload.files.length === 0) reject('请选择文件');
            let file = upload.files[0];
            if (!/^image\//.test(file.type)) reject('请选择图片文件');
            if (file.size > 12582912) reject('图片大小必须是12MB以内');
            let form = new FormData();
            form.append('file', file, file.name);
            uploadFn(form).then(res => {
                if (res && res.data) {
                    resolve(res.data)
                }
            }).catch(err => {
                reject(err);
            }).finally(() => {
                upload.remove();
            });
        });
    });
}

export function blobUpload(data, name) {
    return new Promise((resolve, reject) => {
        let form = new FormData();
        form.append('file', data, name);
        uploadFn(form).then(res => {
            if (res && res.data) {
                resolve(res.data)
            }

        }).catch(err => {
            reject(err);
        });
    });
}