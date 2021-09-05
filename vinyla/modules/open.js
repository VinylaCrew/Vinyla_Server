const request = require('request');
const convert = require('xml-js');

//move to config
const interparkKey = '10314E70B7CACE808549DB374CF0D42C9B222E7163AF9E80C1C26FFEC212ACD0'

module.exports = {
    maniadb : (keyword) =>{
        return new Promise((resolve, reject) =>{
            let path = `http://www.maniadb.com/api/search/`
            path += encodeURI(keyword)
            path += `/?sr=artist&display=100&/?key=khl6235@gmail.com&v=0.5`
            console.log(path);
            request(path, async(err, result) =>{
                const jsonResult = convert.xml2json(result.body, {compact: true, spaces: 4});
                if(err){
                    console.log('request err: '+err);
                    reject(err);
                }
                else resolve(jsonResult);
            })
        })
    },
    
    interpark : (keyword) => {
        return new Promise((resolve, reject) =>{
            let path = `http://book.interpark.com/api/search.api?key=${interparkKey}&query=`;
            path += encodeURI(keyword);
            path += `&categoryId=320&output=json&searchTarget=cd`;
            request(path, async(err, result) =>{
                const jsonResult = JSON.parse(result.body);
                if(err){
                    console.log('request err: '+err);
                    reject(err);
                }
                else resolve(jsonResult);
            })
        })
    }

};