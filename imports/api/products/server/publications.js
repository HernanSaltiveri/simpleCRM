import Products from '../products';

const ProductListFields = {
    name: 1,
    price: 1,
    createdAt: 1
};

Meteor.publish('Products.public', function () {

    // TODO: Security
    //if (!this.userId) {
    //    return this.ready();
    //}

    return Products.find(
        {},
        {
            fields: ProductListFields
        }
    );
});

Meteor.publish('Product.get', function (_id) {
    //console.log("publication match ", Products.find({_id: custId}).fetch());

    // TODO: Security
    //if (!this.userId) {
    //    return this.ready();
    //}

    return Products.find(
        {
            _id
        },
        {
            fields: ProductListFields
        }
    );
});

Meteor.publish('Products.searchByName', function (searchTerm) {
    //console.log("Products.searchByName - " +
    //    searchTerm + " - ", Products.find({name: new RegExp(searchTerm)}).fetch());


    // the 'i' makes the search case insensitive
    return Products.find(
        {
            name: new RegExp(searchTerm, 'i')
        },
        {
            fields: ProductListFields
        }
    );
});

Meteor.methods({
    'Products.fullTextSearch.method'({ searchValue }) {

        if (Meteor.isServer) {
            const results = Products.find(
                {$text: {$search: searchValue}},
                {
                    // `fields` is where we can add MongoDB projections. Here we're causing
                    // each document published to include a property named `score`, which
                    // contains the document's search rank, a numerical value, with more
                    // relevant documents having a higher score.
                    fields: {
                        score: {$meta: "textScore"},
                        name: 1
                    },
                    // This indicates that we wish the publication to be sorted by the
                    // `score` property specified in the projection fields above.
                    sort: {
                        score: {$meta: "textScore"}
                    }
                }
            );
            //console.log('Products.fullTextSearch results ', results.fetch());

            return results.fetch();
        }
    }
});