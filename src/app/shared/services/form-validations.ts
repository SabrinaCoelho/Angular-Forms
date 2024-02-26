import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidations{
    public static requiredMinCheckbox(min = 1): ValidatorFn{//inferencia
        //versao estruturada ---------------------
        return (formArray: AbstractControl):ValidationErrors | null => {//tipo de campo a ser validado eh o param
          // const values = formArray.value;
          // let totalChecked = 0;
          // for(let i = 0; i < values.length; i++){
          //   if(values[i]){
          //     totalChecked += 1;
          //   }
          // }
          
          //versao funcional ---------------------
          const totalChecked = formArray.value
          .reduce((total: any, atual: any) => atual ? total + atual: total, 0);
    
          //passou? nao tem o que o retornar
          //se nao, NECESSARIO retornar um obj 
          //console.log(totalChecked);
          return totalChecked >= min ? null : {required: true} 
        }
    }
    public static cepValidator(formControl: AbstractControl): ValidationErrors | null{
        const cep = formControl.value;
        if(cep && cep != ''){
            let validacep = /^[0-9]{8}$/;
            return validacep.test(cep) ? null : {cepInvalido: true }
        }
        return null;
    }
    public static equalsTo(otherField: string): ValidatorFn{
        return (formControl: AbstractControl): ValidationErrors | null => {
            if(otherField == null){//dif. de null e vazio
                throw new Error('Necessário informar um campo');
            }
            if(!formControl.root || !(<FormGroup>formControl.root).controls){
                return null;
            }
            //acessando campo
            const field = (<FormGroup>formControl.root).get(otherField);
            if(!field){//se o campo nao existir
                throw new Error('Necessário informar um campo válido');
            }
            if(field.value !== formControl.value){
                return { equalsTo: true}
            }
            return null;
        }
    }
    public static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){
        const config: any = {//contem todas as mensagens de erro
            "required": `${fieldName} é obrigatório.`,
            "minlength": `${fieldName} necessário ter no mínimo ${validatorValue.requiredLength} caracteres.`,
            "maxlength": `${fieldName} necessário ter no máximo ${validatorValue.requiredLength} caracteres.`,
            "email": `${fieldName} é obrigatório.`,
            "equalsTo": `${fieldName}s não são iguais.`,
            "cepInvalido": "CEP inválido"
        }
        return config[validatorName];
    }
}