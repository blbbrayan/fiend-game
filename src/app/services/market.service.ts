import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbilityService} from "./ability.service";
import {Unit} from "../shared/unit";
import {Fiend} from "../shared/fiend";

@Injectable()
export class MarketService {

  units: Unit[];
  fiends: Fiend[];

  constructor(private http: HttpClient, abilityService: AbilityService) {

  }

  getUnits(callback?: any){
    (this.http.get("assets/units.json"))
      .subscribe((units: Unit[]) => {
        this.units = units;
        if(callback) callback();
      });
  }

  getFiends(){

  }

}
