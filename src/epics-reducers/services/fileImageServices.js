import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";

function uploadFiles(files) {
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
  }
  let path = `${COMMON_APP.HOST_API}${"/api/files"}`
  let dataRes = []
  const uploaders = files.map((file, index) => {
    const {name, uri} = file;
    const uriParts = name.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();
    formData.append("image", {
      uri,
      name,
      type: `application/${fileType}`,
    });
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data) dataRes = [...dataRes, data.image_id]
    }).catch(error => {
    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function uploadImages(images) {
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
  }
  let path = `${COMMON_APP.HOST_API}${"/api/files"}`

  let dataRes = []
  const uploaders = images.map((file, index) => {
    const uri = file.uri || file.file;
    const fileType = "jpg";
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data) dataRes = [...dataRes, data.image_id]
    }).catch(error => {

    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function deleteFiles(idReq, file) {
  return axios.delete(`${COMMON_APP.HOST_API_PHAN_HOI}/api/citizen/request/${idReq}/file/${file}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}

function deleteImages(idReq, img) {
  return axios.delete(`${COMMON_APP.HOST_API_PHAN_HOI}/api/citizen/request/${idReq}/img/${img}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}

export {uploadFiles, uploadImages, deleteFiles, deleteImages}
