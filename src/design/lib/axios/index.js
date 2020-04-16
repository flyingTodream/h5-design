import {
    Axios,
    Upload
} from 'src/utils/request';
import MyStorage from "src/utils/cache"
import API from 'src/design/utils/API';

export async function uploadFn(data) {

    return await Upload.post(API.UPLOAD_API, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-Litemall-Token': `${MyStorage.getItem('Token') || ''}`
        }
    })
}


export default Axios;