import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [ Validators.required ] ],
    pais: ['', [ Validators.required ] ],
    frontera: ['', [ Validators.required ] ]
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      })

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true;
        }),
        switchMap(code => this.paisesService.getPaisPorCca3( code ))
      )
      .subscribe( (pais:any) => {
        if(pais){
          this.fronteras = pais[0].borders ? pais[0].borders : ['No tiene países fronterizos'];
        }
        this.cargando = false;
    })
  }

  guardar () {
    console.log(this.miFormulario.value);
  }

}
