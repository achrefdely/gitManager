import { BaseEntity } from './../../shared';

export class Commit implements BaseEntity {
    constructor(
        public id?: number,
        public user?: string,
        public date?: any,
    ) {
    }
}
