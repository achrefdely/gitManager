import { BaseEntity } from './../../shared';

export class Repo implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public path?: string,
        public logoUrl?: string,
    ) {
    }
}
