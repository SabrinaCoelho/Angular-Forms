import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Cidade } from '../models/cidade';
import { EstadoBr } from '../models/estado-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  getEstados(){
    return this.http.get<EstadoBr[]>('assets/dados/estadosBr.json');
  }
  getCargos(){
    return [
      {nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr'},
      {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'},
      {nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr'},
    ]
  }
  getTecnologias(){
    return [
      {nome: 'java', desc: 'Java'},
      {nome: 'javascript', desc: 'JavaJcript'},
      {nome: 'csharp', desc: 'C#'},
      {nome: 'php', desc: 'PHP'},
    ]
  }
  getNewsLetter(){
    return [
      {valor: "s", desc: "Sim"},
      {valor: "n", desc: "Não"},
    ]
  }
  getCidades(idEstado: string){//metodo que retorna todas as cidades
    return this.http.get<Cidade[]>('assets/dados/Cidades.json').pipe(//mapea o resultado no que estou interessada
      map((cidades: Cidade[]) => cidades.filter((cidade: Cidade)=> cidade.estado == idEstado))
    )
  }
  constructor(
    private http: HttpClient
  ) { }
}
