
import express from 'express';
import {deleteUser, getUserListings, test, updateUser,getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
//here first we have to verify if the user is authenticated or not
// WE WILL DO THIS BY USING THE TOKENS THAT WE HAVE CRETED WHILE SIGNING IN OR SIGNING UP

router.delete('/delete/:id',verifyToken,deleteUser);

router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser);
export default router;