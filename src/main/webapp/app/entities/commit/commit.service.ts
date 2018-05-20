import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Commit } from './commit.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Commit>;

@Injectable()
export class CommitService {

    private resourceUrl =  SERVER_API_URL + 'api/commits';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(commit: Commit): Observable<EntityResponseType> {
        const copy = this.convert(commit);
        return this.http.post<Commit>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(commit: Commit): Observable<EntityResponseType> {
        const copy = this.convert(commit);
        return this.http.put<Commit>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Commit>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Commit[]>> {
        const options = createRequestOption(req);
        return this.http.get<Commit[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Commit[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Commit = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Commit[]>): HttpResponse<Commit[]> {
        const jsonResponse: Commit[] = res.body;
        const body: Commit[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Commit.
     */
    private convertItemFromServer(commit: Commit): Commit {
        const copy: Commit = Object.assign({}, commit);
        copy.date = this.dateUtils
            .convertLocalDateFromServer(commit.date);
        return copy;
    }

    /**
     * Convert a Commit to a JSON which can be sent to the server.
     */
    private convert(commit: Commit): Commit {
        const copy: Commit = Object.assign({}, commit);
        copy.date = this.dateUtils
            .convertLocalDateToServer(commit.date);
        return copy;
    }
}
