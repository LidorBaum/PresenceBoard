module.exports = connectSockets;

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('board_page', data => {
            socket.join(data);
        });

        socket.on('update_board', ({ companyId, employeeId }) => {
            socket
                .to(companyId)
                .emit('update_board', { companyId, employeeId });
        });
    });
}
