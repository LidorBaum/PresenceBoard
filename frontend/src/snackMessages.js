const snackLinkCopied = {
    severity: 'success',
    open: true,
    message: 'NFC Link Copied',
};
const snackDeletedEmployee = {
    severity: 'warning',
    open: true,
    message: 'Deleted Succesfully',
};
const snackNoImg = {
    severity: 'warning',
    open: true,
    message: 'You Must Upload A Photo',
};
const snackCompanySaved = {
    severity: 'success',
    open: true,
    message: 'Company info saved successfully',
};
const snackError500 = {
    severity: 'error',
    open: true,
    message: 'There was an Error with the server, please try again',
};
const snackEmployeeSaved = {
    severity: 'success',
    open: true,
    message: 'The employee saved successfully',
};
const snackNoEmployees = {
    severity: 'error',
    open: true,
    message: 'You need to add at least one employee first',
};
const snackMissingCreds = {
    severity: 'error',
    open: true,
    message: 'Missing Name / Password',
};
const snackCompanyExist = {
    severity: 'error',
    open: true,
    message: 'This Company Already Exist!',
};
const snackIncorrectPassword = {
    severity: 'error',
    open: true,
    message: 'Incorrect Password!',
};
const snackInvalidPasswordRegex = {
    severity: 'error',
    open: true,
    message: 'Password does not meet the requirements!',
};

module.exports = {
    snackLinkCopied,
    snackDeletedEmployee,
    snackError500,
    snackCompanySaved,
    snackNoImg,
    snackEmployeeSaved,
    snackNoEmployees,
    snackMissingCreds,
    snackCompanyExist,
    snackIncorrectPassword,
    snackInvalidPasswordRegex,
};
