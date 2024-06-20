import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { NxWelcomeComponent } from "./nx-welcome.component";
import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { HttpClientModule } from "@angular/common/http";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { ToolbarModule } from "primeng/toolbar";
import { DropdownModule } from "primeng/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "primeng/chart";
import { InMemoryCache } from "apollo-cache-inmemory";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import * as fromSamples from "./+state/samples.reducer";
import { SamplesEffects } from "./+state/samples.effects";
import { SamplesFacade } from "./+state/samples.facade";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, LandingPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" }),
    ApolloModule,
    HttpClientModule,
    ToolbarModule,
    DropdownModule,
    ChartModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      },
    ),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ logOnly: !isDevMode() }),
    StoreModule.forFeature(
      fromSamples.SAMPLES_FEATURE_KEY,
      fromSamples.samplesReducer,
    ),
    EffectsModule.forFeature([SamplesEffects]),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: "https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql",
          }),
        };
      },
      deps: [HttpLink],
    },
    SamplesFacade,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
