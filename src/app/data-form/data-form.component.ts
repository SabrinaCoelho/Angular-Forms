import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, Validator, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { catchError, distinctUntilChanged, EMPTY, empty, map, Observable, switchMap, tap } from 'rxjs';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { FormValidations } from '../shared/services/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario: FormGroup;//tem na classe mae
  estados: EstadoBr[] = [];
  //estados: Observable<EstadoBr[]>;//associado ao" | async" no template
  cargos: any[] = [];
  tecnologias: any[] = [];
  newsLetterOp: any[] = [];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];
  cidades: Cidade[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
    /* this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
      endereco: new FormGroup({
        cep: new FormControl(null)
      })
    }); */
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
      email: [null, [Validators.required, Validators.email], this.validarEmail.bind(this)],
      confirmarEmail: [null, [Validators.required, Validators.email, FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],//angular entende que o parametro eh o proprio controle
        numero: [null, Validators.required],
        rua: [null, Validators.required],
        complemento: [null],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsLetter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });
    //this.estados = this.dropdownService.getEstados();
    this.dropdownService.getEstados().subscribe(
      dados => this.estados = dados//"cache local"
    );
    /* this.formulario.get('endereco.cep')?.valueChanges.subscribe(
      value => console.log('CEP = ', value)
    ); */
    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(console.log),
        switchMap(
          status => status === 'VALID'? 
            this.cepService.consultaCep(this.formulario.get('endereco.cep')?.value):
            EMPTY
        )
      ).subscribe(
        dados => {
          dados ? this.populaDadosForm(dados) : {}
        }
      );  
    
  }
  buildFrameworks(){
    const values = this.frameworks.map(
      (e)  => new FormControl(false)
    );
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));//dinamico
    /* return this.formBuilder.array([//manual
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]); */
  }
  /* 
  //DEPRECATED
  requiredMinCheckbox(min = 1){//inferencia
    //versao estruturada
    const validator = (formArray: FormArray) => {//tipo de campo a ser validado eh o param
      // const values = formArray.controls;
      // let totalChecked = 0;
      // for(let i = 0; i < values.length; i++){
      //   if(values[i].value){
      //     totalChecked++;
      //   }
      // }
      //versao funcional
      const totalChecked = formArray.controls
      .map((v) => v.value)//substitui transformando em um boolean[]
      .reduce((total: any, atual: any) => atual ? total + atual: total, 0);
      //passou? nao tem o que o retornar
      //se nao, NECESSARIO retornar um obj 
      return totalChecked >= min ? null : { required: true }
    }
    return validator;
  } */
  /* requiredMinCheckbox(min = 1): ValidatorFn{//inferencia
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
  } */
  override ngOnInit(): void {
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsLetterOp = this.dropdownService.getNewsLetter();
    /* this.verificaEmailService.verificarEmail('email@email.com').subscribe(
      v => console.log(v)
    ); */
    //this.dropdownService.getCidades('8').subscribe(e => console.log(e));
    this.formulario.get('endereco.estado')?.valueChanges.pipe(
      tap((estado: string) => console.log("Novo UF:", estado)),//temos a sigla
      map((estado: string) => this.estados.filter(e => e.sigla === estado)),//pega o id do estado encontrado atraves da sigla
      map((estados: any[]) => estados && estados.length > 0 ? estados[0].id: EMPTY),//se o estado existir e haver comprimento
      switchMap(
        (estadoId: string) => this.dropdownService.getCidades(estadoId)
      ),
      tap(console.log)
    ).subscribe(
      cidades => this.cidades = cidades
    );
  }
  submit() {//SO VAI SER CHAMADO SE O FORM ESTIVER VALIDO
    //copia o valor do formulario para um objeto vazio e o atrabui a valueSubmit
    let valueSubmit = Object.assign({}, this.formulario.value);
    //fazendo substituição no proprio valueSubmit
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: boolean, i: number) => v? this.frameworks[i]:null)
        .filter((v: any) => v != null)
    });
    //console.log(valueSubmit);
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)).pipe(
        map(res => res)
      ).subscribe(
        {
          next: (data) => {
            // console.log(data);
            this.formulario.reset();
          },
          error: (error: any) => alert('erro')
        }
      );
    //throw new Error('Method not implemented.');
  }
  /* //PASSADO PARA BASE-FORM
  onSubmit(){
    if(this.formulario.valid){
      
    }else{
      console.log('form invalid');
      this.verificaValidacoesForm(this.formulario);
    }
  } */
  /* //PASSADO PARA BASE-FORM
  verificaValidacoesForm(form: FormGroup){
    console.log(form.controls);
    Object.keys(form.controls).forEach(campo => {
      let controle = form.get(campo);
      //console.log(controle);
      controle?.markAsTouched();
      if(controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    });
  } */
  /* //PASSADO PARA BASE-FORM
  resetar(){
    this.formulario.reset();
    //console.log(this.formulario);
  } */
  /* PASSADO PARA BASE-FORM
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
  } */
  consultaCep(){//Nao passado para base-form porque eh especifico desse form
    let cep = this.formulario.get('endereco.cep')?.value;
    //cep = cep.replace(/\D/g,'');
    
    if(cep != null && cep !== ''){
      this.cepService.consultaCep(cep)?.subscribe(
        dados => this.populaDadosForm(dados)
      );
    }
  }
  populaDadosForm(dados: any){
    this.formulario.patchValue({
      endereco: {
        numero: dados.numero,
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
    
  }
  setarCargo(){
    const cargo = {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.formulario.get('cargo')?.setValue(cargo);
    this.retornaFramework();
  }
  retornaFramework(){
    let a = this.formulario.get('frameworks') as FormArray;
    //console.log(a.controls);
    return a.controls;
    //return [0, 1, 2, 3];
  }
  compararCargos(obj1: any, obj2: any){
    //se existem, compara nome...
    //se nao existir, aplica a comparacao fuleira do Angular mesmo
    return obj1 && obj2 ? (obj1?.nome === obj2?.nome && obj1?.nivel === obj2?.nivel): obj1.nivel === obj2.nivel;
  }
  setarTecnologias(){
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php']);
  }
  validarEmail(formControl: AbstractControl): ValidationErrors | null{
    return this.verificaEmailService.verificarEmail(formControl.value).pipe(
      map((emailExiste: boolean) => emailExiste? {emailInvalido: true} : null)
    );
  }
}
