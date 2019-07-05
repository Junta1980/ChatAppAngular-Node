import { Injectable , EventEmitter , Output } from '@angular/core';


import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { User , msgtype} from './Interface'

@Injectable({
  providedIn: 'root'
})
export class ChatSocketIoService {

  private url = 'http://localhost:8080';
  private socket;
  arrtype  : msgtype[] = []

  constructor() {
    this.socket = io(this.url);
   }

   public join( message : User , tipomsg :  string) {

     return  new Promise( (resolve , reject )  => 
      { this.socket.emit( tipomsg , message , (error) => 
        { 
        
          if (error) {
  
            reject(error)
          }
          else { resolve() }
        } 
        ); 
      } 
      )
  } 


  public sendMessage ( message : string , tipomsg :  string) {
     this.socket.emit( tipomsg , message ) 
  }

  public leave(){
    
    this.socket.disconnect()
  }

  public getMessages() : Observable<any> {

    return Observable.create((observer) => {
      this.socket.on('message', (message , username) => {
          observer.next( {message , username} );
      });
    });
  }

  public gettype() : Observable<msgtype> {

    return Observable.create((observer) => {
      this.socket.on('typing', (message , username  ) => {
          observer.next({message , username});
         
      });
    });
  }
  public getuserRoom() : Observable<String[]> {

    return Observable.create((observer) => {
      this.socket.on('room', (message) => {
        observer.next(message);
      });
    });
  }

  arraytypepush( data: any){
    this.arrtype.push(data)
  }

  arraytypeget(){
    return this.arrtype
    }

  arrayTypeVerify( data : any) {

    while(this.arrtype.findIndex( arr => arr.username === data.username )  > -1 ){
      this.arrtype.splice(this.arrtype.findIndex( arr => arr.username === data.username ) , 1)
    }
  }


  timeoutmsgtype(){
  var root = this;  
  
    setTimeout(function() {  
      root.arrtype.splice(0,1)  
      }, 10000 ) ; 
  }

  emitype(){
    
    this.socket.emit('typing') 
  }

}
