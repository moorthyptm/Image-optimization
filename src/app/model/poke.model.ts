export interface PokemonsResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
  img: string;
}
