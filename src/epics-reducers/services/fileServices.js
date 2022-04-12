import * as FileSystem from "expo-file-system";
import {COMMON_APP} from "../../constants";
import axios from "axios";

export function postFile(id, uri, fieldName) {
    return FileSystem.uploadAsync(
        `${COMMON_APP.HOST_API}${"/api/uploads/"}${id}`,
        uri,
        {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: fieldName,
        }).then((res) => {
        console.log(res)
        if (res.status === 200) {
            console.log(res)
            return res;
        }
        return null;
    }).catch((err) => {
        console.log(err.message)
        return null;
    });
}

export async function postImages(images, id) {

    let path = `${COMMON_APP.HOST_API}${"/api/uploads/"}${id}`

    const uploads = images.map((image, index) => {
        return image.uri
    })

    const response = await Promise.all(uploads.map((uri, index) => {
        return FileSystem.uploadAsync(
            path,
            uri,
            {
                httpMethod: "POST",
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'files',
            }).then((res) => {
            if (res.status === 200) {
                return res;
            }
            return null;
        }).catch((err) => {
            return null;
        });
    }))
    console.log(response)
    // return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    //     return dataRes
    // }));
    return response;
}
