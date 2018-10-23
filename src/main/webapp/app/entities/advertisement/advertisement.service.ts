import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Advertisement } from './advertisement.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class AdvertisementService {

    private resourceUrl =  SERVER_API_URL + 'api/advertisements';

    constructor(private http: Http) { }

    create(advertisement: Advertisement): Observable<Advertisement> {
        const copy = this.convert(advertisement);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(advertisement: Advertisement): Observable<Advertisement> {
        const copy = this.convert(advertisement);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Advertisement> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Advertisement.
     */
    private convertItemFromServer(json: any): Advertisement {
        const entity: Advertisement = Object.assign(new Advertisement(), json);
        return entity;
    }

    /**
     * Convert a Advertisement to a JSON which can be sent to the server.
     */
    private convert(advertisement: Advertisement): Advertisement {
        const copy: Advertisement = Object.assign({}, advertisement);
        return copy;
    }
}
