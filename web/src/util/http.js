import { get } from 'superagent'
import { post } from 'superagent'

export function oca_post(url, body, response) {
    post(url)
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end(function(err, res) {
            console.log(res);
            response(res);
        });
}

export function oca_get(url, query, response) {
    get(url)
        .query(query)
        .end(function (err, res) {
            response(res);
        });
}
