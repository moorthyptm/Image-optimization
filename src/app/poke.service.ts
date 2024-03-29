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

  getPokemons(url: string): Observable<PokemonsResponseExtends> {
    return this.getData<PokemonsResponse>(url).pipe(
      // ? its not required, We can also use pokemon id to retrieve image
      // switchMap(this.mapImageUsingAPI.bind(this))
      map(this.mapImageUsingID.bind(this))
    );
  }

  private getData<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }

  private mapImageUsingID(response: PokemonsResponse): PokemonsResponseExtends {
    const results = response.results.map((item): ResultExtends => {
      const urlMap: string[] = item.url.split('/');
      const id = urlMap[urlMap.length - 2];
      return { ...item, img: `${id}.png`, id };
    });
    return { ...response, results };
  }

  private mapImageUsingAPI(
    response: PokemonsResponse
  ): Observable<PokemonsResponseExtends> {
    return from(response.results).pipe(
      mergeMap((item) =>
        this.getData<PokemonDetailResponse>(item.url).pipe(
          map((detail): ResultExtends => {
            const urlMap: string[] = item.url.split('/');
            return {
              ...item,
              img: detail.sprites.other.home.front_default,
              id: urlMap[urlMap.length - 2],
            };
          })
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
