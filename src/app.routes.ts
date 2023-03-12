import { ImageLoaderConfig, IMAGE_LOADER } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Route } from '@angular/router';
import { PokeService } from './app/poke.service';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./app/pokemon.component').then((m) => m.PokemonComponent),
    providers: [
      provideHttpClient(),
      PokeService,
      {
        provide: IMAGE_LOADER,
        useValue: (config: ImageLoaderConfig) => {
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${config.src}`;
        },
      },
    ],
  },
];
