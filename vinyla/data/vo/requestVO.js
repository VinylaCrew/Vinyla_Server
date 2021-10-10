module.exports = (requestVo) =>{
    requestVo = {
        "requestIdx": requestVo.requestIdx,
        "title": requestVo.title,
        "artist": requestVo.artist,
        "image": requestVo.image,
        "memo": requestVo.memo,
        "userIdx": requestVo.userIdx
    }
}