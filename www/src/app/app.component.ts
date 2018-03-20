import {Component} from '@angular/core';
import {GameService} from "./services/game.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  page = ['home', 'marketplace', 'battle', 'sandbox'][2];

  constructor(){}

}
