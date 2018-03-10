import { Component, OnInit } from '@angular/core';
import {FiendGroup} from "../shared/fiend-group";
import {Unit} from "../shared/unit";
import {Fiend} from "../shared/fiend";
import {GameService} from "../services/game.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent {

  fiendGroup: FiendGroup;

  constructor(private game: GameService) {
    let obj = {fiend: new Fiend('archer', 5, 1, 'assassin', 3, {"idle": 12, "attack": 15})};
    this.fiendGroup = new FiendGroup(obj.fiend, true);
    delete obj.fiend;
    game.loadAnimation(this.fiendGroup);
  }

}
