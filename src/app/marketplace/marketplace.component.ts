import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Global} from "../shared/global";
import {Fiend} from "../shared/fiend";
import {UnitGenerator} from "../shared/unit-generator";
import {Unit} from "../shared/unit";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent {

  @Output() onBattle: EventEmitter<boolean> = new EventEmitter<boolean>();

  gui: any = {
    searchModal: true,
    filters: true,
    searchName: ''
  };

  unitGenerator: UnitGenerator;
  data: Fiend[];

  search: Fiend[] = [];

  constructor(private http: HttpClient) {
    this.addSearchItem('size', ['Huge', 'Large', 'Medium', 'Small']);
    this.addSearchItem('rarity', ['C', 'U', 'R', 'E', 'L']);
    this.addSearchItem('level', [1, 2, 3, 4, 5]);
    this.addSearchItem('attribute', ['Assassin', 'Healthy', 'Precise']);

    this.unitGenerator = new UnitGenerator();

    (this.http.get("assets/units.json"))
      .subscribe((units: Unit[]) => {
        this.data = this.unitGenerator.generateAll(units);
        let time = 0;
        let listener = setInterval(()=>{
          time+=99;
          if(this.data.length === units.length * this.unitGenerator.combos) {
            clearInterval(listener);
            this.filterSearch();
            console.log('data loaded ' + time + ' ms', this.data.length + '');
          }
        }, 99);
      });
  }

  sortBy(){
    this.search = this.search.sort((a, b)=>{
      let v = 0;
      if(a.attribute > b.attribute) v+=1;
      if(a.attribute < b.attribute) v-=1;
      if(a.rarity > b.rarity) v+=3;
      if(a.rarity < b.rarity) v-=3;
      if(a.level > b.level) v+=5;
      if(a.level < b.level) v-=5;
      if(a.name > b.name) v+=7;
      if(a.name < b.name) v-=7;
      return v;
    });
  }

  isValid(fiend){
    let valid = true;
    if(this.gui.attribute.active)
      valid = fiend.attribute === this.gui.attribute.selected.substring(0, 1).toLowerCase() + this.gui.attribute.selected.substring(1);
    if(this.gui.level.active && valid)
      valid = fiend.level === this.gui.level.selected;
    if(this.gui.rarity.active && valid)
      valid = fiend.rarity === this.gui.rarity.options.indexOf(this.gui.rarity.selected) + 1;
    if(this.gui.size.active && valid)
      valid = fiend.size === this.gui.size.options.indexOf(this.gui.size.selected) + 1;
    return valid;
  }

  filterSearch() {
    if(this.gui.filters) {
      this.search = this.data.filter(fiend => this.isValid(fiend));
      if (this.gui.searchName.trim().length > 0)
        this.search = this.search.filter(fiend=>fiend.name===this.gui.searchName);
    } else this.search = this.data;
    this.sortBy();
  }

  addSearchItem(name, options) {
    this.gui[name] = {
      name: name,
      search: false,
      dying: false,
      options: options,
      selected: options[0],
      active: true
    };
  }

  searchFilterItems() {
    return [this.gui.size, this.gui.rarity, this.gui.level, this.gui.attribute];
  }

  toggleSearchFilter(name) {
    if (this.gui[name].search) {
      this.gui[name].dying = true;
      setTimeout(() => {
        this.gui[name].search = !this.gui[name].search;
        this.gui[name].dying = false;
      }, 299);
    } else
      this.gui[name].search = !this.gui[name].search;
  }

  isSearchFilterOpen(name) {
    return this.gui[name].search;
  }

  isSearchFilterDying(name) {
    return {'dying': this.gui[name].dying};
  }

  getSelectStyle(gui) {
    return {
      'width': 1 / gui.options.length * 100 + '%',
      'margin-left': gui.options.indexOf(gui.selected) / gui.options.length * 100 + '%'
    }
  }

  getRarity(unit) {
    return {[Global.rarities[unit.rarity]]: true};
  }

  getSize(unit) {
    return {['size' + unit.size]: true};
  }

  exit(){
    this.gui.searchModal = false;
    this.filterSearch();
  }

  getRarityLabel(unit){
    return Global.rarities[unit.rarity];
  }

  getCost(unit){
    return ((unit.rarity * .2121)  * (unit.level * .04)).toFixed(4);
  }

}
