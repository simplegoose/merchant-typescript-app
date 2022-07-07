import { connect } from 'mongoose';
import { settings } from '../config/config';
const { database } = settings;

connect(`${database}glassmart`)
.then(() => console.log('DB connected sucessfullly'))
.catch((e: any) => console.log(e));