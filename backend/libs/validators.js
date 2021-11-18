function isValidCompanyName(companyName) {
    console.log(companyName, 'validity check')
    return true;
}
function isValidName(employeeName) {
    console.log(employeeName, 'validity check')
    return true;
}

function isValidUrl(url) {
    return true;
}

module.exports = {
    isValidCompanyName,
    isValidUrl,
    isValidName
}