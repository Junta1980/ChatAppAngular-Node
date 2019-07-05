import { AfterViewChecked , Component ,OnInit ,  ElementRef ,  ViewChild} from '@angular/core';
import { ChatSocketIoService } from './chat.socket.io.service';
import { User   } from './Interface'
import { msgtype } from './Interface'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit   {
  title = 'prjchatAngular';
  arrmsg = []
  arruser = []
  inUser = false
  erronick = ''
  user : User = {}
  Testo = ''
  userinroom = []
  msgtypes : msgtype[] = []
  canPublish : boolean = true

  @ViewChild("focusTrg" , {static: false}) trgFocusEl: ElementRef;
  @ViewChild('scrollMe', {static: false})  myScrollContainer: ElementRef;


  constructor( private chatService: ChatSocketIoService) { 

  }
  
  ngOnInit() {

    this.chatService.getMessages().subscribe( (data) => 
    {   
        this.arrmsg.push(data.message) 
        this.chatService.arrayTypeVerify(data)
        this.msgtypes = this.chatService.arraytypeget()
    })   

    this.chatService.getuserRoom().subscribe( data => 
        { 
          this.userinroom = data 
    })   
    
    this.chatService.gettype().subscribe( data => {  
            this.chatService.arraytypepush(data)
            this.chatService.timeoutmsgtype()
            this.msgtypes = this.chatService.arraytypeget()
     } )

      
  }

 private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

  }

  SendMess(msg :string  ) {
  
    this.chatService.sendMessage(msg , 'message')
    this.Testo = ''
    this.trgFocusEl.nativeElement.focus();
    this.canPublish = true

  }

  onSubmit()  {
    this.chatService.join(this.user , 'join').then( () => {
      this.inUser = true
      this.erronick = ''
    }
    ).catch(
      error => { this.erronick = error}
    )    
  }

  leave(){
    
    this.chatService.leave()
    window.location.reload(); 
  }

  onKey(){
    
    if(this.canPublish) {
      
      this.chatService.emitype()
  
      this.canPublish = false;
  
      setTimeout(function() {
        this.canPublish = true;
      }, 4000);  
    }
  } 

  

}


