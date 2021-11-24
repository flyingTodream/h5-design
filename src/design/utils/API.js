// const BASE_URL = `/`;
const UPLOAD_BASE_URL = `/storage/`;
const TEMPLATE_BASE_URL = `/goods/`;
const PRODUCTION_BASE_URL = `/production/`;
const USER_BASE_URL = `/auth/`
const RESOURE_BASE_URL = `/resource/`

const UPLOAD_API = `${UPLOAD_BASE_URL}upload`;
const UPLOADPSD_API = `${UPLOAD_BASE_URL}uploadpsd`;
const TEMPLATE_API = `${TEMPLATE_BASE_URL}detail`; // get
const SAVE_API = `${PRODUCTION_BASE_URL}save`; // post
const SEARCH_API = `${TEMPLATE_BASE_URL}list`;




const EFFECTS_API = `${RESOURE_BASE_URL}list`;
const EFFECT_DETAIL_API = `${RESOURE_BASE_URL}detail`;
const PHONR_LOGIN_API = `${USER_BASE_URL}login`;
const FONT_DETAIL_API = `${RESOURE_BASE_URL}getfont`;




export default {
    UPLOAD_API,
    UPLOADPSD_API,
    TEMPLATE_API,
    SAVE_API,
    SEARCH_API,
    EFFECTS_API,
    PHONR_LOGIN_API,
    EFFECT_DETAIL_API,
    FONT_DETAIL_API
}
