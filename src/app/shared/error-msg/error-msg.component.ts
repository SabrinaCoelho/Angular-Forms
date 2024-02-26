import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../services/form-validations';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent implements OnInit {

  // @Input() mostrarErro: boolean = false;
  // @Input() msgErro: string = '';
  @Input() label: string = '';
  @Input() control: any;//equivale ao "mostrar-erro" de "campo-control-erro"
  
  constructor() { }

  ngOnInit(): void {
  } 
  get errorMessage(){//declarou a propriedade e ja criado metodo get
    for(const propertyName in this.control.errors){
      if(this.control.errors.hasOwnProperty(propertyName) &&
      this.control.touched ){
        //todo logico do serviço
        return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

}
