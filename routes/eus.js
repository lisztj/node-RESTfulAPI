'use strict';

import express from 'express';
import User from '../controller/v2/user'
const router = express.Router();
/**
 * @swagger
 * /v1/users/:user_id/avatar:
 *   post:
 *     tags:
 *       - v1
 *     description: 添加用户头像
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: avatar
 *         description: avatar object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/avatar'
 *     responses:
 *       200:
 *         description: 添加成功
 */

router.post('/v1/users/:user_id/avatar', User.updateAvatar)

export default router