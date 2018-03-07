import {Component} from '@angular/core';
import {UnitGenerator} from '../shared/unit-generator';
import {FiendGroup} from '../shared/fiend-group';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Unit} from '../shared/unit';
import {HttpClient} from '@angular/common/http';
import {Global} from '../shared/global';
import {SquadReport} from '../shared/squad-report';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'battle-page',
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.css']
})
export class BattlePageComponent {

  units: Unit[];

  unitGenerator: UnitGenerator = new UnitGenerator();

  teamOne: FiendGroup[] = [];
  teamTwo: FiendGroup[] = [];
  turn = true;
  teamOneTurn = 0;
  teamTwoTurn = 0;

  selectedUnit: FiendGroup;
  attackMode: boolean;

  history: SquadReport[] = [];
  combos = 0;

  constructor(private http: HttpClient) {
    (this.http.get('assets/units.json'))
      .subscribe((units: Unit[]) => {
        this.units = units;
        this.combos = units.length * this.unitGenerator.combos;

        for (let i = 0; i < 4; i++) {
          this.teamOne.push(this.getRandomUnit());
          this.teamTwo.push(this.getRandomUnit());
        }
      });
  }

  getRandomUnit() {
    const random = Global.random(this.units.length);
    const unit = this.units[random];
    return new FiendGroup(this.unitGenerator.generate(unit, 5, 5));
  }

  getAttackMode(unit) {
    return unit === this.selectedUnit && this.attackMode;
  }

  selectUnit(unit) {
    this.selectedUnit = unit;
    this.attackMode = true;
  }

  modTurnTeam(val) {
    this.turn ? this.teamOneTurn += val : this.teamTwoTurn += val;
  }

  getTurnTeam(team?) {
    if (team) { return team ? this.teamOne : this.teamTwo; }
    return this.turn ? this.teamOne : this.teamTwo;
  }

  getTurnIndex(team?) {
    if (team) { return team ? this.teamOneTurn : this.teamTwoTurn; }
    return this.turn ? this.teamOneTurn : this.teamTwoTurn;
  }

  getUnitTeam(unit) {
    return this.teamOne.filter(u => u === unit).length > 0;
  }

  select(unit) {
    if (this.attackMode && this.selectedUnit
      && this.selectedUnit !== unit
      && (this.getUnitTeam(unit) !== this.getUnitTeam(this.selectedUnit))) {
      this.history.push(this.selectedUnit.attack(unit));
      this.attackMode = false;
      this.selectedUnit = undefined;
      this.endTurn();
    }
  }

  turnStyle() {
    return {[this.turn ? 'border-top' : 'border-bottom']: '2px solid #666'};
  }

  isTurn(fiend, team) {
    if (team !== this.turn) {
      return false;
    }
    return this.getTurnTeam(team).indexOf(fiend) === this.getTurnIndex(team);
  }

  updateTeams() {
    this.teamOne = this.teamOne.filter(unit => {
      unit.update();
      return unit.squad.length > 0;
    });
    this.teamTwo = this.teamTwo.filter(unit => {
      unit.update();
      return unit.squad.length > 0;
    });
  }

  checkTeam() {
    return this.getTurnTeam().filter(unit => this.isTurn(unit, this.turn)).length > 0;
  }

  endTurn() {
    this.updateTeams();
    this.modTurnTeam(1);
    if (this.getTurnIndex() >= this.getTurnTeam().length) {
      this.turn ? this.teamOneTurn = 0 : this.teamTwoTurn = 0;
    }
    this.turn = !this.turn;
    if (this.getTurnTeam().length > 0 && !this.checkTeam()) {
      this.modTurnTeam(-1);
    }
  }
}
