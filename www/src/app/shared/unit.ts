export class Unit{
  name: string;
  ability: string;
  size: number;
  tags: string[];
  animations: any;


  constructor(name: string, ability: string, size: number, tags: string[], animations: any) {
    this.name = name;
    this.ability = ability;
    this.size = size;
    this.tags = tags;
    this.animations = animations;
  }
}
