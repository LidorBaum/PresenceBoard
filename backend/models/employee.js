const db = require('./db-connections/presence-board-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const EmployeeSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
            validate: {
                validator: Libs.Validators.isValidName,
                message: Libs.Errors.TextValidation.InvalidName,
            },
        },
        lastName: {
            type: String,
            required: true,
            validate: {
                validator: Libs.Validators.isValidName,
                message: Libs.Errors.TextValidation.InvalidName,
            },
        },
        image: {
            type: String,
            required: false,
            default:
                'https://res.cloudinary.com/echoshare/image/upload/v1636896856/3219840_ngmgts.png',
            validate: {
                validator: Libs.Validators.isValidUrl,
                message: Libs.Errors.InvalidUrl,
            },
        },
        company: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        isPresence: {
            type: Boolean,
            required: false,
            default: false,
        },
        lastScan: {
            type: Date,
            required: false,
        },
    },
    {
        collection: 'employees',
        versionKey: false,
        timestamps: true,
    }
);

EmployeeSchema.set('autoIndex', true);

EmployeeSchema.statics.createEmployee = function (employeeObj) {
    return this.create(employeeObj);
};

EmployeeSchema.statics.deleteEmployee = function (employeeId) {
    return this.deleteOne({ _id: employeeId });
};

EmployeeSchema.statics.updateEmployee = async function (employeeObj) {
    if (!Libs.Validators.isValidUrl(employeeObj.image)) {
        throw new Error(Libs.Errors.InvalidUrl);
    }

    return this.findOneAndUpdate(
        { _id: employeeObj._id },
        {
            $set: {
                image: employeeObj.image,
                firstName: employeeObj.firstName,
                lastName: employeeObj.lastName,
            },
        },
        { new: true }
    );
};

EmployeeSchema.statics.updateIsPresence = async function (employeeId) {
    const employeeObj = await this.getById(employeeId);

    if (!employeeObj) {
        throw new Error(Libs.Errors.EmployeeValidation.EmployeeIdDoesNotExists);
    }
    return this.findOneAndUpdate(
        { _id: employeeId },
        {
            $set: {
                isPresence: Boolean(!employeeObj.isPresence),
                lastScan: new Date(),
            },
        },
        { new: true }
    );
};

EmployeeSchema.statics.getAllEmployeesInCompany = async function (
    companyId,
    sort,
    filterBy
) {
    if (!filterBy.text && !filterBy.presence && sort === 'list')
        return this.find({ company: companyId }).sort({ updatedAt: -1 });
    const textRegex = new RegExp(filterBy.text || '', 'i');
    let getEmployeeFilters = {
        company: companyId,
        $or: [
            { firstName: { $regex: textRegex } },
            { lastName: { $regex: textRegex } },
        ],
    };
    if (filterBy.presence !== null)
        getEmployeeFilters.isPresence = filterBy.presence;
    return this.find(getEmployeeFilters).sort({ isPresence: -1, lastScan: -1 });
};
EmployeeSchema.statics.getById = async function (employeeId) {
    return this.findOne({ _id: employeeId });
};

EmployeeSchema.statics._setAllPresence = async function (isPresence = true) {
    return this.updateMany(
        {},
        {
            $set: {
                isPresence: Boolean(isPresence),
                lastScan: new Date(),
            },
        }
    );
};

exports.EmployeesModel = db.connection.model('Employee', EmployeeSchema);
