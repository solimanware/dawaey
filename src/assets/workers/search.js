//importing fuse script to be used in web worker
//note that web worker is completely separate than dom and only communicate with messages
importScripts('./../libs/fuse.js');

let drugs;

//main worker messanger
onmessage = function (e) {
    //get drugs and store it in worker object so can increase performance
    if (e.data.drugs && e.data.drugs.length) {
        console.log('Message received from main script');
        drugs = e.data.drugs
        console.log("received dataset from main thread")
    }

    //get term and search exactly with that term according to searchBy key
    if (e.data.key && e.data.term && e.data.type === "exact") {
        console.log("received search terms... doing search now");
        let workerResult = doSearch(drugs, e.data.key, e.data.term)
        console.log('Posting workerResult back to main script');
        postMessage(workerResult);
    }

    //get term and search approximatly with that term according to searchBy key
    if (e.data.term && e.data.term && e.data.type === "approximate") {
        console.log("received search term... doing approximate search now");
        let workerResult = doApproximate(drugs, e.data.key, e.data.term)
        console.log('Posting workerResult back to main script');
        console.log(workerResult);

        postMessage(workerResult);
    }
}

//approxiamting function
function doApproximate(drugs, key, term) {
    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [key]
    };
    const fuse = new Fuse(drugs, options);
    return fuse.search(term)
}

//exact search function
function doSearch(drugs, key, term) {
    return drugs.filter(drug => {
        switch (key) {
            //this case search with price exactly like input
            case "price":
                return Number(drug.price) === Number(term);
            case key:
                return (
                    drug[key]
                        .toLowerCase()
                        .indexOf(term.toLowerCase()) > -1
                );
            default:
                return (
                    drug["tradename"].toLowerCase().indexOf(term.toLowerCase()) >
                    -1
                );
        }
    })
}