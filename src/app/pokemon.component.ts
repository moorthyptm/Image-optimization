import {
  AsyncPipe,
  NgOptimizedImage,
  NgTemplateOutlet,
  TitleCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';
import { PokeService } from './poke.service';
import { LoremComponent } from './lorem.component';

const DEFAULT_POKEMON_FETCH_URL = 'https://pokeapi.co/api/v2/pokemon';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full p-4">
      <div class="sticky top-0 bg-white h-20 p-4 shadow-sm">
        <div class="float-right space-x-2 ">
          <button
            [disabled]="!previous()"
            (click)="pagination(previous())"
            class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          >
            {{ 'Previous' }}
          </button>
          <button
            [disabled]="!next()"
            (click)="pagination(next())"
            class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          >
            {{ 'Next' }}
          </button>
        </div>
      </div>
      <app-filler-text></app-filler-text>
      @if (pokemons(); as pokemons) {
      <ul
        class="clear-both grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-md shadow-md mt-10"
      >
        @for (pokemon of pokemons.results; track pokemon.id) {
        <li class="shadow-lg rounded-lg bg-white">
          <img
            [ngSrc]="pokemon.img"
            [alt]="pokemon.name"
            disableOptimizedSrcset
            width="512"
            height="512"
          />
          <div
            class="text-center font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-sky-600 to-green-600 py-10"
          >
            {{ pokemon.name | titlecase }}
          </div>
        </li>
        }
      </ul>
      }
    </div>
  `,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    NgTemplateOutlet,
    NgOptimizedImage,
    LoremComponent,
  ],
})
export class PokemonComponent {
  private pokeService = inject(PokeService);
  private page$ = new BehaviorSubject<string>(DEFAULT_POKEMON_FETCH_URL);

  private pokemonsRes$ = this.page$.pipe(
    switchMap((url) => this.pokeService.getPokemons(url))
  );

  pokemons = toSignal(this.pokemonsRes$);
  next = computed(() => this.pokemons()?.next ?? null);
  previous = computed(() => this.pokemons()?.previous ?? null);

  pagination(url: string | null): void {
    if (url) {
      this.page$.next(url);
    }
  }
}
