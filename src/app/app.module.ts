import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FiendCardComponent } from './fiend-card/fiend-card.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DiceComponent } from './dice/dice.component';
import { BattlePageComponent } from './battle-page/battle-page.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { FiendSelectComponent } from './fiend-select/fiend-select.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import {GameService} from "./services/game.service";


@NgModule({
  declarations: [
    AppComponent,
    FiendCardComponent,
    DiceComponent,
    BattlePageComponent,
    MarketplaceComponent,
    FiendSelectComponent,
    SandboxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClient, GameService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
