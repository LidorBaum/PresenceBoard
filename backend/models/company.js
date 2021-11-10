const db = require('./db-connections/presence-board-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const CompanySchema = Schema(
    {
        name: {
            type: String,
            required: true,
            validate: {
                validator: Libs.Validators.isValidCompanyName,
                message: Libs.Errors.TextValidation.InvalidCompanyName,
            }
        },
        logo: {
            type: String,
            required: false,
            validate: {
                validator: Libs.Validators.isValidUrl,
                message: Libs.Errors.InvalidUrl,
            }
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        collection: 'companies',
        versionKey: false,
        timestamps: true
    }
);

CompanySchema.set('autoIndex', true);

CompanySchema.statics.createCompany = function (companyObj) {
    return this.create(companyObj);
};

CompanySchema.statics.deleteCompany = function (companyId) {
    return this.deleteOne({ _id: companyId });
}

CompanySchema.statics.getById = function (companyId) {
    return this.findById(companyId)
};
CompanySchema.statics.getByName = function (companyName) {
    return this.findById(companyName)
};

CompanySchema.statics.getCompanies = function () {
    return this.find({}).exec();
}

CompanySchema.statics.updateCompany = async function (companyId, newName, newLogo) {
    const companyObj = await this.getById(companyId);
    let setObject = {};

    if (!companyObj) {
        throw new Error(Libs.Errors.CompanyValidation.CompanyDoesNotExists);
    }

    if (newName) {
        if (Libs.Validators.isValidCompanyName(newName)) {
            setObject.name = newName;
        } else {
            throw new Error(Libs.Errors.TextValidation.InvalidCompanyName);
        }
    }
    if (newLogo) {
        if (Libs.Validators.isValidUrl(newLogo)) {
            setObject.logo = newLogo;
        } else {
            throw new Error(Libs.Errors.InvalidUrl);
        }
    }

    return this.findOneAndUpdate(
        { _id: companyId },
        { $set: setObject },
        { new: true }
    )
};

exports.CompaniesModel = db.connection.model('Company', CompanySchema);