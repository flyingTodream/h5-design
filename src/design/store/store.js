function posterStoreSetHandler(data){
    sessionStorage.setItem('poster', JSON.stringify(data))
}
function posterStoreGetHandler(){
    try {
        return JSON.parse(sessionStorage.getItem('poster'));
    } catch (error) {
        return null
    }
    
}

export {
    posterStoreSetHandler,
    posterStoreGetHandler
}