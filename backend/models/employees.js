const db = require('./db-connections/presence-board-db');
const Libs = require('../libs');

const Schema = db.model.Schema;

const EmployeeSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
            validate: {
                validator: Libs.Validators.isValidName,
                message: Libs.Errors.TextValidation.InvalidName
            }
        },
        lastName: {
            type: String,
            required: true,
            validate: {
                validator: Libs.Validators.isValidName,
                message: Libs.Errors.TextValidation.InvalidName
            }
        },
        image: {
            type: String,
            required: false,
            validate: {
                validator: Libs.Validators.isValidUrl,
                message: Libs.Errors.InvalidUrl
            }
        },
        company: {
            type: Schema.Types.ObjectId,
            required: true
        },
        isPresence: {
            type: Boolean,
            required: false,
            default: false
        },
        lastScan: {
            type: Date,
            required: false,
        }
    },
    {
        collection: 'Employees',
        versionKey: false,
        timestamps: true
    }
);

EmployeeSchema.set('autoIndex', true);

EmployeeSchema.statics.createEmployee = function (employeeObj) {
    return this.create(employeeObj);
};

EmployeeSchema.statics.deleteEmployee = function (employeeId) {
    return this.deleteOne(employeeId);
};

EmployeeSchema.statics.updateImage = async function (employeeId, newImg) {
    const employeeObj = await this.getById(employeeId);

    if (!employeeObj) {
        throw new Error(Libs.Errors.EmployeeValidation.EmployeeIdDoesNotExists);
    }

    if (!Libs.Validators.isValidUrl(newImg)) {
        throw new Error(Libs.Errors.InvalidUrl);
    }

    return this.findOneAndUpdate(
        { _id: employeeId },
        { $set: { image: newImg } },
        { new: true }
    )
};

EmployeeSchema.statics.updateIsPresence = async function (employeeId, isPresence) {
    const employeeObj = await this.getById(employeeId);

    if (!employeeObj) {
        throw new Error(Libs.Errors.EmployeeValidation.EmployeeIdDoesNotExists);
    }

    return this.findOneAndUpdate(
        { _id: employeeId },
        { 
            $set: {
                isPresence: Boolean(isPresence),
                lastScan: new Date()
            }
        },
        { new: true }
    )
};

exports.EmployeesModel = db.connection.model('Employee', EmployeeSchema);