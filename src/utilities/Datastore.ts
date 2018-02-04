
import * as Datastore from '@google-cloud/datastore';
import { Candidate } from '../models/Candidate';

const kind = "Candidate";
export class SIDatastore {

    static datastore = new Datastore({
        keyFilename: "./SI HRM Recruit-252f34a12683.json",
    });

    public createCandidate(candidate: Candidate, callback: (err, id) => void) {
        const key = SIDatastore.datastore.key(kind);
        const entity = {
            key: key,
            data: [
                {
                    name: 'created',
                    value: new Date().toJSON(),
                },
                {
                    name: 'firstName',
                    value: candidate.firstName ? candidate.firstName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'middleName',
                    value: candidate.middleName ? candidate.middleName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'lastName',
                    value: candidate.lastName ? candidate.lastName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'nricPassport',
                    value: candidate.nricPassport ? candidate.nricPassport : "",
                    excludeFromIndexes: false,
                }
            ],
        };
        SIDatastore.datastore
            .save(entity)
            .then(() => {
                console.log(`Candidate ${key.id} created successfully.`);
                callback(null, key.id);
            })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err, null);
            });
    }

    public listCandidate(callback: (err, entity) => void) {
        const query = SIDatastore.datastore.createQuery(kind).order('created');

        SIDatastore.datastore
            .runQuery(query)
            .then(results => {
                console.log('list Candidates');
                var candidates: Candidate[] = results[0].map(e => {
                    const key = e[SIDatastore.datastore.KEY];

                    return new Candidate(
                        key.id,
                        e.firstName,
                        e.middleName,
                        e.lastName,
                        e.nricPassport
                    )
                });
                // console.log(JSON.stringify(candidates, null, 4));
                callback(null, candidates);
            })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err, null);
            });
    }

    public getOne(id: number, callback: (err, entity) => void) {
        const key = SIDatastore.datastore.key([kind, id]);
        const query = SIDatastore.datastore.get(key).then(results => {
            console.log('Find Candidate by Id (' + id + ')\n:');
            var e = results[0];
            if (!e) {
                callback("empty callback", null);
                return;
            }
            console.log(JSON.stringify(e, null, 4));
            const candidate: Candidate = new Candidate(
                id,
                e.firstName,
                e.middleName,
                e.lastName,
                e.nricPassport
            );
            console.log(JSON.stringify(candidate, null, 4));
            callback(null, candidate);
        })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err, null);
            });
    }


    public update(candidate: Candidate, callback: (err, entity) => void) {
        let key;

        if (candidate.id) {
            key = SIDatastore.datastore.key([kind, candidate.id]);
        } else {
            key = SIDatastore.datastore.key(kind);
        }

        const entity = {
            key: key,
            data: [
                {
                    name: 'updated',
                    value: new Date().toJSON(),
                },
                {
                    name: 'firstName',
                    value: candidate.firstName ? candidate.firstName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'middleName',
                    value: candidate.middleName ? candidate.middleName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'lastName',
                    value: candidate.lastName ? candidate.lastName : "",
                    excludeFromIndexes: true,
                },
                {
                    name: 'nricPassport',
                    value: candidate.nricPassport ? candidate.nricPassport : "",
                    excludeFromIndexes: false,
                }
            ],
        };

        SIDatastore.datastore
            .save(entity)
            .then(() => {
                console.log(`Candidate ${key.id} updated successfully.`);
                callback(null, key.id);
            })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err, null);
            });

    }

    public delete(id: number, callback: (err) => void) {
        const key = SIDatastore.datastore.key([kind, id]);
        const query = SIDatastore.datastore.delete(key).then(results => {
            callback(null);
        })
            .catch(err => {
                console.error('ERROR:', err);
                callback(err);
            });
    }
}
const dataStore = new SIDatastore();
export default dataStore;