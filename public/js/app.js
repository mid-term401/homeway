"use strict";




function getImageSearchData(anime, res) {
    const imageSearchQuery = { url: anime };
    const imageSearchURl = 'https://trace.moe/api/search';
    return superagent
      .get(imageSearchURl)
      .query(imageSearchQuery)
      .then((data) => {
        let similarResults = [];
        data.body.docs.map((element) => {
          similarResults.push(new AnimeImageSearch(element));
        });
        return similarResults.slice(0, 3);
      })
      .catch((error) => {
        console.log('Error in getting data from trace.moe API: ', error);
      });
  }
  


function Country(element){
    country = element;
    foag = element;
}