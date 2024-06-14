module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        // Define any socket events here

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
