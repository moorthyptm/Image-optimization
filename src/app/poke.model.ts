import { Observable } from 'rxjs';

export interface PokemonsResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

interface ResultModified extends Result {
  data: Observable<any>;
}

export interface PokemonsResponseModified extends PokemonsResponse {
  results: ResultModified[];
}
