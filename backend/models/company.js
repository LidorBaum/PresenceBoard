const db = require('./db-connections/presence-board-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const CompanySchema = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: Libs.Validators.isValidCompanyName,
                message: Libs.Errors.TextValidation.InvalidCompanyName,
            },
        },
        logo: {
            type: String,
            required: false,
            validate: {
                validator: Libs.Validators.isValidUrl,
                message: Libs.Errors.InvalidUrl,
            },
            default:
                'https://res.cloudinary.com/echoshare/image/upload/v1638283806/upload_tjvouf.png',
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'companies',
        versionKey: false,
        timestamps: true,
    }
);

CompanySchema.set('autoIndex', true);

CompanySchema.statics.createCompany = async function (companyObj) {
    companyObj.logo =
        'https://res.cloudinary.com/echoshare/image/upload/v1638283806/upload_tjvouf.png';
    const isExist = Boolean(
        await this.findOne({
            name: { $regex: new RegExp(companyObj.name, 'i') },
        })
    );
    if (isExist) {
        throw new Error(Libs.Errors.CompanyValidation.CompanyNameAlreadyExists);
    }
    return this.create(companyObj);
};

CompanySchema.statics.deleteCompany = function (companyId) {
    return this.deleteOne({ _id: companyId });
};

CompanySchema.statics.getById = function (companyId) {
    return this.findById(companyId);
};

CompanySchema.statics.getCompanies = function () {
    return this.find({}).sort({ name: 1 }).exec();
};

CompanySchema.statics.updateCompany = async function (
    companyId,
    newName,
    newLogo
) {
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
    );
};

exports.CompaniesModel = db.connection.model('Company', CompanySchema);
