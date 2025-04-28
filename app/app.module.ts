import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  // Import HTTP_INTERCEPTORS
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth.interceptor';  // Import the AuthInterceptor

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    HttpClientModule,  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,  
      useClass: AuthInterceptor,  
      multi: true,  
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
