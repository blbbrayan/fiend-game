import {Injectable} from '@angular/core';
import {Unit} from "../shared/unit";
import {FiendGroup} from "../shared/fiend-group";

@Injectable()
export class GameService {

  constructor() {
  }

  animationSpeed: string = '.5s';
  animations: any = {};

  loadAnimation(unit: FiendGroup, callback?: any) {
    let fiend = unit.unit().name;
    Object.keys(unit.unit().animations).forEach(name => {
      let length = unit.unit().animations[name];

      if (!this.animations[fiend]) this.animations[fiend] = {};
      if (!this.animations[fiend][name]) {

        let styleText = ` .${fiend}_${name}{animation: ${fiend}-${name} ${this.animationSpeed} infinite;} @keyframes ${fiend}-${name}{`;
        for (let i = 0; i < length; i++) {
          let url = `assets/units/${fiend}/${name}/${i}.png`;
          styleText += `${(i * (i / length)).toFixed(2)}%{backfround-image: url(${url})} `;
        }
        styleText += '}';

        this.animations[fiend][name] = styleText;
      }
    });
    if (callback) setTimeout(() => callback(), 0);
  }

  composeAnimationStyleSheet() {
    let sheet = '';
    Object.keys(this.animations).forEach(fiends => {
      Object.keys(this.animations[fiends]).forEach(animation=>{
        sheet += this.animations[fiends][animation];
      })
    });
    return sheet;
  }

  getAnimation(fiend, name) {
    return this.animations[fiend][name];
  }

  isAnimationLoaded(fiend, name) {
    return this.animations[fiend] && this.animations[fiend][name];
  }

}
