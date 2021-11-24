import { uploadFn, psdUploadFn } from "src/design/lib/axios";

export default () => {
  return new Promise((resolve, reject) => {
    let els = document.querySelectorAll('[data-id="upload"]');
    els.forEach((item) => {
      item.remove();
    });
    let upload = document.createElement("input");
    upload.style = `display: none;`;
    upload.setAttribute("data-id", "upload");
    upload.setAttribute("type", "file");
    upload.setAttribute("accept", "image/*");
    document.body.appendChild(upload);
    upload.focus();
    upload.click();
    upload.addEventListener("change", async () => {
      if (upload.files.length === 0) reject("请选择文件");
      let file = upload.files[0];
      if (!/^image\//.test(file.type)) reject("请选择图片文件");
      if (file.size > 12582912) reject("图片大小必须是12MB以内");
      let form = new FormData();
      form.append("file", file, file.name);
      uploadFn(form)
        .then((res) => {
          if (res && res.data) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          upload.remove();
        });
    });
  });
};

export function PsdUpload() {
  return new Promise((resolve, reject) => {
    let els = document.querySelectorAll('[data-id="uploadpsd"]');
    console.log(els)
    els.forEach((item) => {
      item.remove();
    });
    let uploadpsd = document.createElement("input");
    console.log(uploadpsd)
    uploadpsd.style = `display: none;`;
    uploadpsd.setAttribute("data-id", "uploadpsd");
    uploadpsd.setAttribute("type", "file");
    uploadpsd.setAttribute("accept", "/*");
    document.body.appendChild(uploadpsd);
    uploadpsd.focus();
    uploadpsd.click();
    uploadpsd.addEventListener("change", async () => {
      if (uploadpsd.files.length === 1) {
        this.$message({
          message: "已上传成功，请到我的作品中查看",
          type: "success",
          duration: 5 * 1000, // 显示时长(ms)
        });
      }
      let file = uploadpsd.files[0];
      let form = new FormData();
      form.append("file", file, file.name);
      psdUploadFn(form)
        .then((res) => {
          if (res && res.data) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          uploadpsd.remove();
        });
    });
  });
}

export function blobUpload(data, name) {
  return new Promise((resolve, reject) => {
    let form = new FormData();
    form.append("file", data, name);
    uploadFn(form)
      .then((res) => {
        if (res && res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
