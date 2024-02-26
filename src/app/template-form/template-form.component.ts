import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }


  ngOnInit(): void {
  }
  onSubmit(form: any){
    console.log(form);
    //this.resetaForm(form)
    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .pipe(
        map(res => res)
      ).subscribe(data => {
        console.log(data);
        this.resetaForm(form);
      })
    //console.log(this.usuario);
  }
  verificaValidTouched(campoRef: any){
    return !campoRef.valid && campoRef.touched;
  }
  aplicaCssErro(campoRef: any){
    return {'has-error': this.verificaValidTouched(campoRef), 'has-feedback': this.verificaValidTouched(campoRef)};
  }
  consultaCep(event: any, form: any){
    let cep = event.value;
    
    
    if(cep != null && cep !== ""){
      this.cepService.consultaCep(cep)?.subscribe(
        dados => this.populaDadosForm(dados, form)
      );
    }
    
  }
  populaDadosForm(dados: any, form: NgForm){
    /* form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        cep: dados.cep,
        rua: dados.logradouro,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    }); */
    form.form.patchValue({
      endereco: {
        cep: dados.cep,
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }
  resetaForm(form: NgForm){
    //form.reset();
    form.resetForm();
  }
  
}
