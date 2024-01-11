import express from 'express';
import { currentUser } from '@fairdeal/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    console.log('---- currentUser');
    return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
