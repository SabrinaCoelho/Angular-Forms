import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,//a cereja do bolo
  useExisting: forwardRef(() => InputFieldComponent),//forwardRef -> "Allows to refer to references which are not yet defined."
  multi: true,//indica que para esse campo (componente generico), usaremos este token, esta instancia, e nao outras instancias do mesmo por ai
}

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {

  @Input() classCss: any;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() control: AbstractControl | undefined | null;
  //@Input() control = new FormControl();
  @Input() isReadOnly = false;


  private innerValue: any;//para manipulacao aqui na classe
  get value(){//para acesso x.value
    return this.innerValue;
  }
  set value(v: any){
    if(v !== this.innerValue){//informa o angular qnd o valor mudar
      this.innerValue = v;
      //"sup, angular, the value got modified bro"
    }
  }
  //Abaixo, funcoes dummy---------------------------
  //Abaixo é uma funcao "falsa" serve para auxilio nosso. Quando o componente for instanciado, o angular vai fazer a magia dele
  onChangeCallback: (_?: any) => void = () => {}//vai receber qualquer valor, é void e vai executar uma funcao vazia
  onTouchedCallback: (_?: any) => void = () => {}//vai receber qualquer valor, é void e vai executar uma funcao vazia
  //-----------------------------------------------

  constructor() { }
  
  ngOnInit(): void {
  }
  writeValue(v: any): void {//resp. por setar o valor. Ex.: campo.value
    this.value = v;
  }
  registerOnChange(fn: any): void {//informa o angular sempre que mudar o valor do campo. É o valueChanges, statusChanges
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {//informa o angular sempre que o campo ganhar foco
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {//informa o angular se o campo ta desabilitado
    this.isReadOnly = isDisabled;
  }

}
