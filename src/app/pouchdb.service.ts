import { Injectable, EventEmitter } from '@angular/core';
// import PouchDB from 'pouchdb';
import * as PouchDB from 'pouchdb';
// const PouchDB = $PouchDB['default'];
@Injectable()
export class PouchDBService {

  private isInstantiated: boolean;
  private database: PouchDB.Database;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor(private dbname: string) {
    if (!this.isInstantiated) {
      this.database = new PouchDB(dbname);
      this.isInstantiated = true;
    }
  }

  public fetch() {
    this.database.allDocs({ include_docs: true });
  }

  public get(id: string) {
    return this.database.get(id);
  }

  public put(id: string, document: any) {
    document._id = id;
    return this.get(id).then(result => {
      document._rev = result._rev;
      return this.database.put(document);
    }, error => {
      if (error.status === '404') {
        return this.database.put(document);
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    });
  }
  public sync(remote: string) {
    const remoteDatabase = new PouchDB(remote);
    this.database.sync(remoteDatabase, {
      live: true
    }).on('change', change => {
      this.listener.emit(change);
    });
  }

  public getChangeListener() {
    return this.listener;
  }
}

