import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, LandingPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ApolloModule,
    HttpClientModule,
    ToolbarModule,
    DropdownModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
