import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FiendCardComponent } from './components/fiend-card/fiend-card.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DiceComponent } from './components/dice/dice.component';
import { BattlePageComponent } from './battle-page/battle-page.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import {GameService} from "./services/game.service";
import {AbilityService} from "./services/ability.service";
import { ReportModalComponent } from './components/report-modal/report-modal.component';
import { AbilityCardComponent } from './components/ability-card/ability-card.component';
import { HomeComponent } from './home/home.component';
import { BattleCardComponent } from './components/battle-card/battle-card.component';


@NgModule({
  declarations: [
    AppComponent,
    FiendCardComponent,
    DiceComponent,
    BattlePageComponent,
    MarketplaceComponent,
    SandboxComponent,
    ReportModalComponent,
    AbilityCardComponent,
    HomeComponent,
    BattleCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClient, GameService, AbilityService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
