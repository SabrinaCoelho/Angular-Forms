import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>',
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup = new FormGroup({});
  constructor() { }

  ngOnInit(): void {
  }
  abstract submit(): any;//classe filha deve dar corpo ao metodo

  onSubmit(){
    if(this.formulario.valid){//ta valido?
      this.submit();//de fato faz o submit
    }else{
      console.log('form invalid');
      this.verificaValidacoesForm(this.formulario);
    }
  }
  verificaValidacoesForm(form: FormGroup | FormArray){
    console.log(form.controls);
    Object.keys(form.controls).forEach(campo => {
      let controle = form.get(campo);
      console.log(controle);
      controle?.markAsTouched();
      if(controle instanceof FormGroup || controle instanceof FormArray){
        this.verificaValidacoesForm(controle);
      }
    });
  }
  resetar(){
    this.formulario.reset();
  }
  verificaValidTouched(campo: string): boolean{
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched || false;
  }
  verificaEmailInvalido(){
    let campo = this.formulario.get('email');
    if(campo?.errors){
      return campo?.errors['email']  && campo.touched;
    }
    return false;
  }
  aplicaCssErro(campo: string){
    return {'has-error': this.verificaValidTouched(campo), 'has-feedback': this.verificaValidTouched(campo)};
  }
}
