import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { API_BASE_URL_GAMES, LOCALE, LANGUAGE, API_BASE_URL_PLUS } from '../consts'
//import crawlerjs from 'crawler-js';

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

  public getTrophiesGamesList(req: Request, res: Response, next: NextFunction) {

    var crawlerjs = require('crawler-js');

    var games = [];

    crawlerjs({
      interval: 100,
      get: 'http://forum.mypst.com.br/index.php/topic/30296-%C3%8Dndice-de-guias-de-trof%C3%A9us-ps4/',
      encodeget: false,
      preview: 0,
      extractors: [
        {
          selector: 'a',
          callback: function (err, html, url, response) {
            if (!err) {
              let data: { url: string, game: string } = { url: '', game: '' };

              data.url = html.attr('href');
              data.game = html.text();
              if (
                data &&
                data.url !== "#" &&
                data.game !== '' &&
                data.url.indexOf("user") == -1 &&
                data.url.indexOf("privacypolicy") == -1 &&
                data.url.indexOf("forum/67-ps4") == -1 &&
                data.url.indexOf("79-guia") == -1 &&
                data.url.indexOf("profile") == -1 &&
                data.url.indexOf("page-") == -1 &&
                data.url.indexOf("?app=forums") == -1 &&
                data.url.indexOf("?app=core") == -1 &&
                data.url.indexOf("apps/board") == -1 &&
                data.url.indexOf("?showtopic") == -1 &&
                data.url.indexOf("apps/board") == -1 &&
                data.game.indexOf("Curtir") == -1 &&
                data.game.indexOf("Descurtir") == -1 &&
                data.game.indexOf("topo") == -1 &&
                data.game.indexOf("http") == -1 &&
                data.game.indexOf("RECOMENDAÇÕES") == -1 &&
                data.game.indexOf("aqui") == -1 &&
                data.game !== "Link" &&
                data.game !== "myPSt" &&
                data.game !== " myPSt " &&
                data.game !== "Fórum" &&
                data.game !== "Membros" &&
                data.game !== "Portal" &&
                data.game !== "cliquem aqui" &&
                data.game !== "Ir para conteúdo" &&
                data.url.indexOf("/rank") == -1 &&
                data.url.indexOf("apps/board") == -1 &&
                data.url.indexOf("entry") == -1
              ) {
                games.push(data);
              }

            } else {
              res.send(err);
            }
          }
        }
      ]
    }, {});

    setTimeout(() => {
      res.send(games.sort(function (a, b) {
        if (a.game > b.game) return 1;
      }));
    }, 5000)
  }


  init() {
    this.router.get('/search/:query', this.search);
    this.router.get('/psn', this.getPSNFreeGames);
    this.router.get('/trophies', this.getTrophiesGamesList);
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
