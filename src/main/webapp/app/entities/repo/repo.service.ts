import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Repo } from './repo.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Repo>;

@Injectable()
export class RepoService {

    private resourceUrl =  SERVER_API_URL + 'api/repos';

    constructor(private http: HttpClient) { }

    create(repo: Repo): Observable<EntityResponseType> {
        const copy = this.convert(repo);
        return this.http.post<Repo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(repo: Repo): Observable<EntityResponseType> {
        const copy = this.convert(repo);
        return this.http.put<Repo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Repo>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Repo[]>> {
        const options = createRequestOption(req);
        return this.http.get<Repo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Repo[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Repo = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Repo[]>): HttpResponse<Repo[]> {
        const jsonResponse: Repo[] = res.body;
        const body: Repo[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Repo.
     */
    private convertItemFromServer(repo: Repo): Repo {
        const copy: Repo = Object.assign({}, repo);
        return copy;
    }

    /**
     * Convert a Repo to a JSON which can be sent to the server.
     */
    private convert(repo: Repo): Repo {
        const copy: Repo = Object.assign({}, repo);
        return copy;
    }
}
