import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, mergeMap, Observable, of, switchMap, toArray } from 'rxjs';
import { PokemonsResponse } from './model/poke.model';

@Injectable()
export class PokeService {
  constructor(private httpClient: HttpClient) {}

  getPokemons(
    url = 'https://pokeapi.co/api/v2/pokemon'
  ): Observable<PokemonsResponse> {
    return this.getData(url).pipe(
      // ? its not required, We can also use pokemon id to retrieve image
      switchMap((response) =>
        from(response.results).pipe(
          mergeMap((item: any) =>
            this.getData(item.url).pipe(
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
        )
      )
    );
  }

  private getData(url: string): Observable<any> {
    return this.httpClient.get<any>(url);
  }
}
