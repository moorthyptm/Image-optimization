import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokimonComponent } from './pokemon';

const routes: Routes = [
  {
    path: '',
    component: PokimonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
