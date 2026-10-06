import {Request,Response,NextFunction} from 'express'; import {config} from '../config';
export function requireAdmin(req:Request,res:Response,next:NextFunction){const token=req.header('x-admin-token'); if(!config.adminToken||token!==config.adminToken)return res.status(401).json({error:'Admin authentication required'}); next();}
