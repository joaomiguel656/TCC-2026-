const authRoutes = require('./modules/auth/auth.routes');

import express from 'express'
const server = express()


// ...
server.use('/auth', authRoutes);

export default server