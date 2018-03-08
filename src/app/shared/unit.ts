export class Unit{
  name: string;
  ability: string;
  size: number;
  tags: string[];
  color: string;


  constructor(name: string, ability: string, size: number, tags: string[]) {
    this.name = name;
    this.ability = ability;
    this.size = size;
    this.tags = tags;
  }
}
