import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Routes } from '@angular/router';
import { PokeService } from './poke.service';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pokemon.component').then((m) => m.PokemonComponent),
    providers: [
      PokeService,
      {
        provide: IMAGE_LOADER,
        useValue: (config: ImageLoaderConfig) => {
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${config.src}`;
        },
      },
    ],
  },
] as Routes;
