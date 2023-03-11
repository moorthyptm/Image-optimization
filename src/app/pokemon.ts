import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokemonsResponseModified } from './poke.model';
import { PokiService } from './poke.service';

@Component({
  selector: 'app-pokimon',
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
          <ng-container *ngIf="pokemon.data | async as details">
            <img
              [src]="details.sprites.other.home.front_default"
              [alt]="pokemon.name"
            />
          </ng-container>
          <div
            class="text-center font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-sky-400 to-green-600 py-10"
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
export class PokimonComponent {
  pokemons$: Observable<PokemonsResponseModified>;
  next$!: Observable<string | null>;
  previous$!: Observable<string | null>;

  constructor(private pokiService: PokiService) {
    this.pokemons$ = this.pokiService.getPokimons();
    this.paginationState();
  }

  pagination(url: string | null): void {
    if (url) {
      this.pokemons$ = this.pokiService.getPokimons(url);
      this.paginationState();
    }
  }

  paginationState() {
    this.next$ = this.pokemons$.pipe(
      map((pokemonsResponse) => pokemonsResponse.next)
    );
    this.previous$ = this.pokemons$.pipe(
      map((pokemonsResponse) => pokemonsResponse.previous)
    );
  }
}
