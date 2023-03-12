import { provideHttpClient } from '@angular/common/http';
import { Route } from '@angular/router';
import { PokeService } from './app/poke.service';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./app/pokemon.component').then((m) => m.PokemonComponent),
    providers: [provideHttpClient(), PokeService],
  },
];
