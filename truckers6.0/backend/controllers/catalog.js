const Catalog = require('../models/catalog');

exports.createCatalog = (req, res, next) => {
    const catalog = new Catalog({
        catalogname: req.body.catalogname,
        company: req.body.company,
        itemkeyword: req.body.itemkeyword,
        quantity: req.body.quantity
    });
    catalog.save().then(result => {
        res.status(201).json({
            message: 'Catalog added successfully'
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating catalog failed'
        });
    });
};

exports.getCatalogs = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const catalogQuery = Catalog.find();
    let fetchedCatalogs;
    if (pageSize && currentPage) {
      catalogQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    catalogQuery.then(documents => {
      fetchedCatalogs = documents;
      return Catalog.count();
    }).then(count => {
      res.status(200).json({
        message: 'Catalogs fetched successfully!',
        catalogs: fetchedCatalogs,
        maxCatalogs: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching catalogs failed!"
      })
    });
  };

  exports.deleteCatalog = (req, res, next) => {
    Catalog.deleteOne({_id: req.params.id}).then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Deleting catalog failed!"
      });
    });
  };