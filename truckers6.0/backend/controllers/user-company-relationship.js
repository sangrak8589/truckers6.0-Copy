const UserCompanyRelationship = require('../models/user-company-relationship');

exports.joinCompany = (req, res, next) => {
    const relationship = new UserCompanyRelationship({
        userId: req.body.userId,
        companyId: req.body.companyId,
        userName: req.body.userName,
        companyName: req.body.companyName,
        points: req.body.points
    });
    relationship.save().then(result => {
        res.status(201).json({
            message: 'Successfully joined Company'
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Joining company failed'
        });
    });
};

exports.getRelationships = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const filter = req.query.filter;
    let query;
    const value = req.query.value;

    if (filter == "userId")
        query = { userId: value };
    else if (filter == "companyId")
        query = { companyId: value };
    else
        query = {};

    const relationshipQuery = UserCompanyRelationship.find(query);
    let fetchedRelationships;
    if (pageSize && currentPage) {
        relationshipQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    relationshipQuery.then(documents => {
        fetchedRelationships = documents;
        return UserCompanyRelationship.count();
    }).then (count => {
        res.status(200).json({
            message: 'Relationships fetched successfully!',
            relations: fetchedRelationships,
            maxRelations: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching relationships failed!"
        })
    });
};

exports.getRelation = (req, res, next) => {
    UserCompanyRelationship.findById(req.params.id).then(relation => {
        if (relation) {
            res.status(200).json(relation);
        } else {
            res.status(404).json({ message: 'Relation not found!' });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching relation failed!'
        });
    });
};

exports.updatePoints = (req, res, next) => {
    const relation = new UserCompanyRelationship({
        _id: req.body.id,
        userId: req.body.userId,
        companyId: req.body.companyId,
        userName: req.body.userName,
        companyName: req.body.companyName,
        points: req.body.points
    });
    UserCompanyRelationship.updateOne({_id: req.params.id}, relation)
        .then(result => {
            res.status(201).json({
                message: 'Update successful!'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            });
        });
}