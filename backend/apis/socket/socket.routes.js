
module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        console.log('user connected to socket : ', socket.id);

        
        socket.on('board_page', (data) =>{
            socket.join(data)
            console.log(`company with socket id ${socket.id} joined the board id ${data}`);
        })

        socket.on('update_board', ({companyId, employeeId}) =>{
            console.log('UPDATE BOARD ' ,companyId, employeeId);
            socket.to(companyId).emit('update_board',{companyId, employeeId})
        })
        
    })
}