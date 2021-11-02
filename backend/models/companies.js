const db = require('./db-connections/presence-board-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const CompanySchema = Schema(
    {
        name: {
            type: String,
            require: true,
            validate: {
                validator: Libs.Validators.isValidCompanyName,
                message: Libs.Errors.TextValidation.InvalidCompanyName,
            }
        },
        logo: {
            type: String,
            require: false,
            validate: {
                validator: Libs.Validators.isValidUrl,
                message: Libs.Errors.InvalidUrl,
            }
        }
    },
    {
        collection: 'Companies',
        versionKey: false,
        timestamps: true
    }
);

CompanySchema.set('autoIndex', true);

CompanySchema.statics.createCompany = function (companyObj) {
    return this.create(companyObj);
};

CompanySchema.statics.deleteCompany = function (companyId) {
    return this.deleteOne(companyId);
}

CompanySchema.statics.getById = function (companyId) {
    return this.findById(companyId)
};

CompanySchema.statics.updateLogo = async function (companyId, newLogo) {
    const companyObj = await this.getById(companyId);

    if (!companyObj) {
        throw new Error(Libs.Errors.CompanyValidation.CompanyIdDoesNotExists);
    }

    if (!Libs.Validators.isValidUrl(newLogo)) {
        throw new Error(Libs.Errors.InvalidUrl);
    }

    return this.findOneAndUpdate(
        { _id: companyId },
        { $set: { logo: newLogo } },
        { new: true }
    )
};

CompanySchema.statics.updateName = async function (companyId, newName) {
    const companyObj = await this.getById(companyId);

    if (!companyObj) {
        throw new Error(Libs.Errors.CompanyValidation.CompanyIdDoesNotExists);
    }

    if (!Libs.Validators.isValidCompanyName(newName)) {
        throw new Error(Libs.Errors.TextValidation.InvalidCompanyName);
    }

    return this.findOneAndUpdate(
        { _id: companyId },
        { $set: { logo: newLogo } },
        { new: true }
    )
};

exports.CompaniesModel = db.connection.model('Company', CompanySchema);