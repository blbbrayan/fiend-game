import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FiendCardComponent } from './fiend-card/fiend-card.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DiceComponent } from './dice/dice.component';
import { BattlePageComponent } from './battle-page/battle-page.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';


@NgModule({
  declarations: [
    AppComponent,
    FiendCardComponent,
    DiceComponent,
    BattlePageComponent,
    MarketplaceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
