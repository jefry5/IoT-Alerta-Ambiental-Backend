const express = require('express');
const router = express.Router();

router.post('login', (req, res) => {
    return res.json({message: 'Sesión'});
});

module.exports = router;