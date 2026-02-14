const { updateOrderStatus } = require('../../Controllers/orderController');
const { adminOrderUpdateValidation } = require('../../Validators/adminOrderUpdateValidator');

const router = require('express').Router();

router.route('/:id/status')
.patch(adminOrderUpdateValidation, updateOrderStatus)

module.exports = router;