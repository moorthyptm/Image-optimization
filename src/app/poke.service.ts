import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PokemonsResponse, PokemonsResponseModified } from './poke.model';

@Injectable({ providedIn: 'root' })
export class PokiService {
  constructor(private httpClient: HttpClient) {}

  getPokimons(
    url = 'https://pokeapi.co/api/v2/pokemon'
  ): Observable<PokemonsResponseModified> {
    return this.getData(url).pipe(
      map((data: PokemonsResponse) => {
        data.results = data.results.map((pokemon) => {
          return { ...pokemon, data: this.getData(pokemon.url) };
        });
        return data as PokemonsResponseModified;
      })
    );
  }

  getData(url: string) {
    return this.httpClient.get<any>(url);
  }
}
