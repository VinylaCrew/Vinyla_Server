module.exports = (vinylSearchDetailDto) =>{
    vinylSearchDetailDto = {
        "id": vinylSearchDetailDto.id,
        "title": vinylSearchDetailDto.title,
        "artist": vinylSearchDetailDto.artist,
        "image": vinylSearchDetailDto.image,
        "year": vinylSearchDetailDto.year,
        "rate": vinylSearchDetailDto.rate,
        "rateCount": vinylSearchDetailDto.rateCount,
        "genres": vinylSearchDetailDto.genres,
        "tracklist": vinylSearchDetailDto.tracklist
    }
}