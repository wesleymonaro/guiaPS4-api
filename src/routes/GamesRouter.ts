import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { API_BASE_URL_GAMES, LOCALE, LANGUAGE, API_BASE_URL_PLUS } from '../consts'
//let TASKS = require('../tasks.data');

export class GamesRouter {

  router: Router

  /**
   * Initialize the GamesRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Search Games.
   */
  public search(req: Request, res: Response, next: NextFunction) {
    let query = req.param('query');
    //let urlBase = 'https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/BR/pt/999/';
    let complementQuery = '?suggested_size=30&mode=game';

    if (!query) res.status(400).send({ status: false });
    console.log('trying to call: ', API_BASE_URL_GAMES + query.replace(/\s/g, '+') + complementQuery)
    axios.get(API_BASE_URL_GAMES + query.replace(/\s/g, '+') + complementQuery)
      .then(function (response) {
        res.send(response.data)
      })
      .catch(function (error) {
        res.send(error);
      });
  }

  /**
   * Get Free PSN Games.
   */
  public getPSNFreeGames(req: Request, res: Response, next: NextFunction) {
    //console.log('chegou aqui')
    let complementQuery = `?size=30&gkb=1&geoCountry=${LOCALE}&start=0`;

    axios.get(API_BASE_URL_PLUS + complementQuery)
      .then(function (response) {
        res.send(response.data)
      })
      .catch(function (error) {
        res.send(error);
      });
  }

  // /**
  //  * GET one task by id
  //  */
  // public getOne(req: Request, res: Response, next: NextFunction) {
  //     let query = parseInt(req.params.id);
  //     let task = TASKS.find(task => task.id === query);
  //     if (task) {
  //         res.status(200)
  //             .send({
  //                 data: task,
  //                 status: true,
  //                 timestamp: new Date().getTime()
  //             });
  //     } else {
  //         res.status(404)
  //             .send({
  //                 status: false
  //             });
  //     }
  // }
  //
  // /**
  //  * POST create one task
  //  */
  // public create(req: Request, res: Response, next: NextFunction) {
  //
  //     let newTask = req.body;
  //     newTask.synchronized = ('synchronized' in newTask);
  //     if (!newTask.id) { newTask.id = new Date().getTime(); }
  //     TASKS.push(newTask);
  //
  //     res.status(201)
  //         .send({
  //             data: newTask,
  //             status: res.status,
  //             timestamp: new Date().getTime()
  //         });
  // }
  //
  // /**
  //  * PUT update one task
  //  */
  // public update(req: Request, res: Response, next: NextFunction) {
  //
  //     // param and body
  //     let taskId: number = parseInt(req.params.id);
  //     let updatedTask = req.body;
  //
  //     // task in server
  //     let serverTask = TASKS.find(task => task.id === taskId);
  //
  //     if (serverTask) {
  //
  //         // task id in server
  //         let serverTaskId: number = TASKS.indexOf(serverTask);
  //
  //         // make sure the 'id' attribute is deleted
  //         delete updatedTask.id;
  //
  //         // set the 'id' of updated task
  //         updatedTask.id = taskId;
  //
  //         // update the array of tasks
  //         TASKS.splice(serverTaskId, 1, updatedTask);
  //
  //         res.status(200)
  //             .send({
  //                 data: updatedTask,
  //                 status: true,
  //                 timestamp: new Date().getTime()
  //             });
  //
  //     } else {
  //         res.status(404)
  //             .send({
  //                 status: false
  //             });
  //     }
  // }
  //
  // /**
  //  * DELETE one task
  //  */
  // public delete(req: Request, res: Response, next: NextFunction) {
  //     let taskId: number = parseInt(req.params.id);
  //
  //     if (TASKS.some(task => task.id === taskId)) {
  //         TASKS = TASKS.filter(task => task.id !== taskId);
  //         res.status(202)
  //             .send({
  //                 status: true
  //             });
  //     } else {
  //         res.status(404)
  //             .send({
  //                 status: false
  //             });
  //     }
  // }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    console.log('chegou aqui no init');
    this.router.get('/search/:query', this.search);
    this.router.get('/psn', this.getPSNFreeGames);
    // this.router.get('/:id', this.getOne);
    // this.router.post('/', this.create);
    // this.router.put('/:id', this.update);
    // this.router.delete('/:id', this.delete);
  }

}

// Create the TasksRouter, and export its configured Express.Router
const gamesRoutes = new GamesRouter();
gamesRoutes.init();

export default gamesRoutes.router;
