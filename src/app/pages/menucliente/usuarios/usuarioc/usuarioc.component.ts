import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UsuarioeventoService, EventoService } from 'src/app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertMessages } from 'src/app/config/alert-messages';

@Component({
  selector: 'app-usuarioc',
  templateUrl: './usuarioc.component.html',
  styleUrls: ['./usuarioc.component.css']
})
export class UsuariocComponent implements OnInit {
  @Output()
  action = new EventEmitter();

  data: any;
  forma: FormGroup;
  ponente = false;
  prefs = [
    { name: 'Asistente', value: 'ASISTENTE' },
    { name: 'Staff', value: 'STAFF' },
    { name: 'Ponente', value: 'PONENTE' },
  ];

  imagen: File;

  isEdit = false;
  marcas: any[] = [];

  constructor(
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public _usuarioService: UsuarioeventoService,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.data = this.modalService.config.initialState;
    this.getMarcas();

    this.forma = this.formBuilder.group(
      {
        nombre: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        appaterno: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        apmaterno: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        calle: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        estado: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        img: new FormControl(null, []),
        ciudad: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        codigopostal: new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5)
        ]),
        colonia: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        numeroexterior: new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ]),
        numerointerior: new FormControl(null, [Validators.maxLength(50)]),
        rol: new FormControl(null, [Validators.required]),
        marca: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        emailconfirm: new FormControl(null, [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(5)
        ]),
        passwordconfirm: new FormControl(null, [Validators.required])
      },
      { validators: [this.matchEmail, this.matchPassword] }
    );

    if (this.data.edit) {

      this._usuarioService.getUsuarioById(this.data._id).subscribe(
        (res: any) => {
          this.isEdit = true;
          this.forma.get('email').disable();
          this.forma.get('emailconfirm').disable();
          this.forma.get('password').disable();
          this.forma.get('passwordconfirm').disable();
          this.forma.get('nombre').setValue(res.data.nombre);
          this.forma.get('appaterno').setValue(res.data.apellidoPaterno);
          this.forma.get('apmaterno').setValue(res.data.apellidoMaterno);
          this.forma.get('calle').setValue((res.data.direccion) ? res.data.direccion.calle : '');
          this.forma.get('estado').setValue((res.data.direccion) ? res.data.direccion.estado : '');
          this.forma.get('ciudad').setValue((res.data.direccion) ? res.data.direccion.ciudad : '');
          this.forma.get('codigopostal').setValue((res.data.direccion) ? res.data.direccion.cp : '');
          this.forma.get('colonia').setValue((res.data.direccion) ? res.data.direccion.colonia : '');
          this.forma.get('numeroexterior').setValue((res.data.direccion) ? res.data.direccion.numeroExterior : '');
          this.forma.get('numerointerior').setValue((res.data.direccion) ? res.data.direccion.numeroInterior : '');
          this.forma.get('rol').setValue(res.data.rol);
          if (res.data.rol === 'PONENTE') {
            this.ponente = true;
            this.forma.get('marca').enable();
            this.forma.get('marca').setValue(res.data.marcas);
          } else {
            this.ponente = false;
            this.forma.get('marca').disable();
          }

        },
        error => {
          AlertMessages.showToast('Error al optner información del usuario', 'Error', 3000, 'error');

        }
      );
    }
  }

  uploadDocument(archivo: File) {
    if (!archivo) {
      this.imagen = null;
      return;
    }
    this.imagen = archivo;
  }

  onChange(event) {
    if (event.target.value === 'PONENTE') {
      this.forma.get('marca').enable();
      this.ponente = true;
    } else {
      this.forma.get('marca').setValue(null);
      this.forma.get('marca').disable();
      this.ponente = false;

    }

  }

  getMarcas() {
    this.eventoService.getMarcasByEvento(this.data.idevento).subscribe((res: any) => {
      this.marcas = res.data.marcas;

    }, error => {

    });
  }

  matchEmail(AC: AbstractControl) {
    const email = AC.get('email').value; // to get value in input tag
    const confirmEmail = AC.get('emailconfirm').value; // to get value in input tag
    if (email !== confirmEmail) {
      AC.get('emailconfirm').setErrors({ matchemail: true });
    } else {
      return null;
    }
  }

  matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('passwordconfirm').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('passwordconfirm').setErrors({ matchpassword: true });
    } else {
      return null;
    }
  }

  queEs() {
    if (this.data.edit) {
      this.actualizarUsuario(this.data._id);
    } else {
      this.registrarUsuario();
    }
  }

  actualizarUsuario(id) {
    if (this.forma.invalid) {

      return;
    }
    const uploadData = new FormData();
    uploadData.append('nombre', this.forma.get('nombre').value);
    uploadData.append('email', this.forma.get('email').value);
    uploadData.append('appaterno', this.forma.get('appaterno').value);
    uploadData.append('apmaterno', this.forma.get('apmaterno').value);
    uploadData.append('calle', this.forma.get('calle').value);
    uploadData.append('estado', this.forma.get('estado').value);
    uploadData.append('ciudad', this.forma.get('ciudad').value);
    uploadData.append('codigopostal', this.forma.get('codigopostal').value);
    uploadData.append('colonia', this.forma.get('colonia').value);
    uploadData.append('numeroexterior', this.forma.get('numeroexterior').value);
    uploadData.append('numerointerior', this.forma.get('numerointerior').value);
    uploadData.append('rol', this.forma.get('rol').value);
    uploadData.append('marca', this.forma.get('marca').value);
    uploadData.append('password', this.forma.get('password').value);
    uploadData.append('evento', this.data.idevento);
    if (this.imagen) {
      uploadData.append('img', this.imagen, this.imagen.name);
    } else {
      uploadData.append('img', null);
    }

    this._usuarioService.actualizarUsuario(id, uploadData).subscribe(
      res => {

        AlertMessages.showToast('Se actualizó el registro', 'Éxito', 3000, 'success');

        this.action.emit();
        this.modalRef.hide();
      },
      error => {
        AlertMessages.showToast('Ocurrio un error en la petición', 'Error', 3000, 'error');
      }
    );
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }
    const uploadData = new FormData();
    uploadData.append('nombre', this.forma.get('nombre').value);
    uploadData.append('email', this.forma.get('email').value);
    uploadData.append('appaterno', this.forma.get('appaterno').value);
    uploadData.append('apmaterno', this.forma.get('apmaterno').value);
    uploadData.append('calle', this.forma.get('calle').value);
    uploadData.append('estado', this.forma.get('estado').value);
    uploadData.append('ciudad', this.forma.get('ciudad').value);
    uploadData.append('codigopostal', this.forma.get('codigopostal').value);
    uploadData.append('colonia', this.forma.get('colonia').value);
    uploadData.append('numeroexterior', this.forma.get('numeroexterior').value);
    uploadData.append('numerointerior', this.forma.get('numerointerior').value);
    uploadData.append('rol', this.forma.get('rol').value);
    uploadData.append('marca', this.forma.get('marca').value);
    uploadData.append('password', this.forma.get('password').value);
    uploadData.append('evento', this.data.idevento);
    if (this.imagen) {
      uploadData.append('img', this.imagen, this.imagen.name);
    } else {
      uploadData.append('img', null);
    }

    this._usuarioService.crearUsuario(uploadData).subscribe(
      res => {

        AlertMessages.showToast('Usuario creado correctamente', 'Éxito', 3000, 'success');
        this.action.emit();
        this.modalRef.hide();
      },
      error => {
        AlertMessages.showToast(error.error.body, 'Error', 3000, 'errror');

      }
    );
  }
}
