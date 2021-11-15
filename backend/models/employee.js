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
            default: "https://res.cloudinary.com/echoshare/image/upload/v1636896856/3219840_ngmgts.png",
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
        collection: 'employees',
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

EmployeeSchema.statics.getAllEmployeesInCompany = async function (companyId){
    return this.find({company: companyId}).sort({isPresence: -1})
}
EmployeeSchema.statics.getById = async function (employeeId){
    return this.findOne({_id: employeeId})
}

EmployeeSchema.statics._setAllPresence = async function (isPresence=true){
    return this.updateMany({}, { 
        $set: {
            isPresence: Boolean(isPresence),
            lastScan: new Date()
        }
    },
    )
}

exports.EmployeesModel = db.connection.model('Employee', EmployeeSchema);