import {
  AsyncPipe,
  NgFor,
  NgIf,
  NgTemplateOutlet,
  TitleCasePipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokemonsResponse } from './model/poke.model';
import { PokeService } from './poke.service';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, TitleCasePipe, NgTemplateOutlet],
  template: `
    <div class="w-full p-4">
      <div class="sticky top-0 bg-white h-20 p-4 shadow-sm">
        <div class="float-right space-x-2 ">
          <ng-container
            *ngTemplateOutlet="
              paginationTemplate;
              context: { url: previous$ | async, btnText: 'Previous' }
            "
          ></ng-container>
          <ng-container
            *ngTemplateOutlet="
              paginationTemplate;
              context: { url: next$ | async, btnText: 'Next' }
            "
          ></ng-container>
        </div>
      </div>
      <ul
        *ngIf="pokemons$ | async as pokemons"
        class="clear-both grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-md shadow-md mt-10"
      >
        <li
          class="shadow-lg rounded-lg bg-white"
          *ngFor="let pokemon of pokemons.results"
        >
          <img
            [src]="pokemon.img"
            [alt]="pokemon.name"
            width="512"
            height="512"
          />
          <div
            class="text-center font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-sky-600 to-green-600 py-10"
          >
            {{ pokemon.name | titlecase }}
          </div>
        </li>
      </ul>
    </div>

    <ng-template #paginationTemplate let-data="url" let-text="btnText">
      <button
        [disabled]="!data"
        (click)="pagination(data)"
        class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {{ text }}
      </button>
    </ng-template>
  `,
})
export class PokemonComponent {
  pokemons$: Observable<PokemonsResponse>;
  next$!: Observable<string | null>;
  previous$!: Observable<string | null>;

  constructor(private pokeService: PokeService) {
    this.pokemons$ = this.pokeService.getPokemons();
    this.paginationState();
  }

  pagination(url: string | null): void {
    if (url) {
      this.pokemons$ = this.pokeService.getPokemons(url);
      this.paginationState();
    }
  }

  paginationState(): void {
    this.next$ = this.pokemons$.pipe(
      map((pokemonsResponse) => pokemonsResponse.next)
    );
    this.previous$ = this.pokemons$.pipe(
      map((pokemonsResponse) => pokemonsResponse.previous)
    );
  }
}
