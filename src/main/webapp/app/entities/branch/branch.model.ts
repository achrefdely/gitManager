import { BaseEntity } from './../../shared';

export class Branch implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public date?: any,
    ) {
    }
}
