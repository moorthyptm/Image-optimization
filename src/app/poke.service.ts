import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, mergeMap, Observable, of, switchMap, toArray } from 'rxjs';
import { PokemonsResponse } from './model/poke.model';
// ! Avoid using type any [its just for NgOptimizedImage demo]

@Injectable()
export class PokeService {
  constructor(private httpClient: HttpClient) {}

  getPokemons(
    url = 'https://pokeapi.co/api/v2/pokemon'
  ): Observable<PokemonsResponse> {
    return this.getData(url).pipe(
      // ? its not required, We can also use pokemon id to retrieve image
      // switchMap(this.mapImageUsingAPI.bind(this))
      map(this.mapImageUsingID.bind(this))
    );
  }

  private getData(url: string): Observable<any> {
    return this.httpClient.get<any>(url);
  }

  private mapImageUsingID(response: any): any {
    response.results = response.results.map((item: any) => {
      const urlMap: string[] = item.url.split('/');
      const id = urlMap[urlMap.length - 2];
      return { ...item, img: `${id}.png` };
    });
    return response;
  }

  private mapImageUsingAPI(response: any): Observable<any> {
    return from(response.results).pipe(
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
    );
  }
}
