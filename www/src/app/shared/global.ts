export class Global{

  static rarities = ['', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

  static random(what) {
    let min = 0,
      max = Math.floor(what),
      roll = Math.floor(Math.random() * (max - min + 1)) + min;
    //The maximum is inclusive and the minimum is inclusive
    return roll;
  }

}
