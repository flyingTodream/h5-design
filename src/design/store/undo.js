import History from 'simple-undo';
const history = window.Undo = function(data){
    return new History({
        maxLength: 50,
        provider: done => {
            done(JSON.stringify(data));
        }
    });
};

export {
    history
}