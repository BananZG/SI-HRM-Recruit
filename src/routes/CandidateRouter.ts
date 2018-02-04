

import { Router, Request, Response, NextFunction } from 'express';
import DataStore from '../utilities/Datastore';
import { Candidate } from '../models/Candidate';

export class CandidateRouter {
  router: Router

  /**
   * Initialize the CandidateRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/create', this.create);
    this.router.get('/get/:id', this.getById);
    this.router.get('/update', this.update);
    this.router.get('/delete/:id', this.delete);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    var firstName: string = req.query.firstName;
    var middleName: string = req.query.middleName;
    var lastName: string = req.query.lastName;
    var nricPassport: string = req.query.nricPassport;

    if (firstName && lastName && nricPassport) {
      DataStore.createCandidate(new Candidate(0, firstName, middleName, lastName, nricPassport), (err, id): void => {
        if (err) {
          next(err);
          return;
        }
        res.status(200).json({
          status: res.status,
          message: 'New candidate created',
          id: id
        });
      });
    } else {
      res.status(404)
        .send({
          message: 'Please make sure the 4 keys are input correctly',
          status: res.status
        });
    }
  }

  // placeholder route handler
  public getAll(req: Request, res: Response, next: NextFunction) {
    DataStore.listCandidate((err, entities): void => {
      if (err) {
        res.status(404)
          .send({
            message: 'getAll error! ' + err,
            status: res.status
          });
        return;
      }
      res.status(200).json({
        status: res.status,
        items: entities
      });
    });
  }


  public getById(req: Request, res: Response, next: NextFunction) {
    let query: number = parseInt(req.params.id, 10);
    DataStore.getOne(query, (err, entity): void => {
      if (err) {
        res.status(404)
          .send({
            message: 'No candidate found with the given id (' + query + ').',
            status: res.status
          });
        return;
      }
      res.status(200)
        .send({
          message: 'Found!:',
          status: res.status,
          entity
        });
    });
  }


  public update(req: Request, res: Response, next: NextFunction) {
    var id: number = parseInt(req.query.id, 10);
    var firstName: string = req.query.firstName;
    var middleName: string = req.query.middleName;
    var lastName: string = req.query.lastName;
    var nricPassport: string = req.query.nricPassport;
    if (!id) {
      res.status(404)
        .send({
          message: 'id cannot be null',
          status: res.status
        });
      return;
    }
    DataStore.update(new Candidate(id, firstName, middleName, lastName, nricPassport), (err, entity): void => {
      if (err) {
        res.status(404)
          .send({
            message: 'No candidate found with the given id (' + id + ').',
            status: res.status
          });
        return;
      }
      res.status(200)
        .send({
          message: 'Updated!:',
          status: res.status,
          entity
        });
    });
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    let query: number = parseInt(req.params.id, 10);
    DataStore.delete(query, (err): void => {
      if (err) {
        res.status(404)
          .send({
            message: 'No candidate found with the given id (' + query + ').',
            status: res.status
          });
        return;
      }
      res.status(200)
        .send({
          message: 'Deleted!',
          status: res.status
        });
    });
  }
}


// Create the CandidateRouter, and export its configured Express.Router
const candidateRouter = new CandidateRouter();
candidateRouter.init();
export default candidateRouter.router;
