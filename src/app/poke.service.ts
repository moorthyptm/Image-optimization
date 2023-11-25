import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, mergeMap, Observable, switchMap, tap, toArray } from 'rxjs';
import {
  PokemonDetailResponse,
  PokemonsResponse,
  PokemonsResponseExtends,
  ResultExtends,
} from './model/poke.model';

@Injectable()
export class PokeService {
  constructor(private httpClient: HttpClient) {}

  getPokemons(
    url = 'https://pokeapi.co/api/v2/pokemon'
  ): Observable<PokemonsResponseExtends> {
    return this.getData<PokemonsResponse>(url).pipe(
      // ? its not required, We can also use pokemon id to retrieve image
      // switchMap(this.mapImageUsingAPI.bind(this))
      map(this.mapImageUsingID.bind(this))
    );
  }

  private getData<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url).pipe(tap(console.log));
  }

  private mapImageUsingID(response: PokemonsResponse): PokemonsResponseExtends {
    const results = response.results.map((item): ResultExtends => {
      const urlMap: string[] = item.url.split('/');
      const id = urlMap[urlMap.length - 2];
      return { ...item, img: `${id}.png` };
    });
    return { ...response, results };
  }

  private mapImageUsingAPI(
    response: PokemonsResponse
  ): Observable<PokemonsResponseExtends> {
    return from(response.results).pipe(
      mergeMap((item) =>
        this.getData<PokemonDetailResponse>(item.url).pipe(
          map((detail) => ({
            ...item,
            img: detail.sprites.other.home.front_default,
          }))
        )
      ),
      toArray(),
      map((results) => ({
        ...response,
        results,
      }))
    );
  }
}
