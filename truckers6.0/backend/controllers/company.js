const Company = require('../models/company');

exports.createCompany = (req, res, next) => {
    const company = new Company({
        name: req.body.name
    });
    company.save().then(result => {
        res.status(201).json({
            message: 'Company added successfully'
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating company failed'
        });
    });
};

exports.getCompanies = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const companyQuery = Company.find();
    let fetchedCompanies;
    if (pageSize && currentPage) {
      companyQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    companyQuery.then(documents => {
      fetchedCompanies = documents;
      return Company.count();
    }).then(count => {
      res.status(200).json({
        message: 'Companies fetched successfully!',
        companies: fetchedCompanies,
        maxCompanies: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching companies failed!"
      })
    });
  };

  exports.deleteCompany = (req, res, next) => {
    Company.deleteOne({_id: req.params.id}).then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Deleting company failed!"
      });
    });
  };
