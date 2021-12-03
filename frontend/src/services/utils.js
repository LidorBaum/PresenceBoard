function isValidPassword(password) {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return password.match(passRegex)
}

function handleErrors(err){
 console.log(err);   
}

module.exports = { isValidPassword, handleErrors }