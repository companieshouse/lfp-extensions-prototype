const express = require('express')
const router = express.Router()

// Service Core Routes
require('./routes/core-service.js')(router)

// Core Journey Routes
require('./routes/core-journey.js')(router)

// Illness
require('./routes/illness.js')(router)

// Authentication Code
require('./routes/auth-code.js')(router)

// Theft Or Criminal Damage
require('./routes/theft-or-criminal-damage.js')(router)

// Problems Filing Online
require('./routes/problems-filing-online.js')(router)

// Accounting Issues
require('./routes/accounting-issues.js')(router)

// Changes To The Company
require('./routes/changes-to-the-company.js')(router)

// Natural Disaster
require('./routes/natural-disaster.js')(router)

// Other Reason
require('./routes/other-reason.js')(router)

module.exports = router
