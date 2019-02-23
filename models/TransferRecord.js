let mongoose = require('mongoose');
let TransferRecordSchema = require('../schemas/TransferRecordSchema');
let TransferRecord = mongoose.model('transferRecord', TransferRecordSchema);
module.exports = TransferRecord;
