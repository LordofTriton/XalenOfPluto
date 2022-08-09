// Compile Atheneum or Yggdrasil into client-side acceptable format.
function StoreCompiler(array) {
    let store = {}
    for (let i = 0; i < array.length; i++) {
        store = {...store, [array[i].label]: [...array[i].records]}
    }
    return store;
}

// Compile Research into client-side acceptable format.
function ResearchCompiler(array) {
    let research = []
    for (let i = 0; i < array.length; i++) {
        research.push(array[i].researchTopic)
    }
    return research;
}

// Generic Promise object for fetching stores from MongoDB.
var GetStore = (db_connect, storeName) => (
    new Promise((resolve, reject) => {
        db_connect
            .collection(storeName)
            .find({})
            .toArray(function (err, result) {
             var somethingWentWrong = (result == null);
            (somethingWentWrong) ? reject('Something messed up :)') : resolve(result);
        });
    })
);

const StoreService = {StoreCompiler, ResearchCompiler, GetStore};

export default StoreService;