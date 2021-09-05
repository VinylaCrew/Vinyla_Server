module.exports = (requestVO) =>{
    requestVO = {
        "requestIdx": requestVO.requestIdx,
        "title": requestVO.title,
        "artist": requestVO.artist,
        "image": requestVO.image,
        "memo": requestVO.memo,
        "userIdx": requestVO.userIdx
    }
}