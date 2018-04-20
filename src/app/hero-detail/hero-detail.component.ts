import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { states, Hero, Address } from '../data-model';
import { FormControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnChanges {

  heroForm: FormGroup;
  @Input() hero : Hero;
  states = states;

  // code sans formBuilder (aide à réduire répétition et encombrement en gérant détails de la création de contrôle)

  // heroForm = new FormGroup({
  //   heroName : new FormControl(),
  //   etc... 
  // });

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    // FormBuilder.group est une méthode d'usine qui crée un FormGroup
    // prend un objet dont clés et valeurs sont des FormControl noms et leurs définitions( ex: controleName : [valeur initiale '',valeur attendue required] )
    // La définition d'un groupe de contrôles dans un seul objet rend le code + compact/lisible, car pas besoin d'écrire des instructions répétées
    this.heroForm = this.fb.group({ // -> parent formGroup
      name: ['', Validators.required],
      //address: this.fb.group(new Address()), //-> child formGroup for display multiple formControl to example -> properties of Adress object
      secretLairs : this.fb.array([]), // repaire secret remplace le formGroup addresses - > form array initialisé vide qui peut contenir tableau de formgroup
      power: '',
      sidekick: ''
    });
  }

  rebuildForm(){
    this.heroForm.reset({
      name : this.hero.name,
      //address : this.hero.addresses[0] || new Address() // for formGroup
    });
    this.setAddresses(this.hero.addresses);  // for formArray
  }

  setAddresses(addresses: Address[]){
    const addressFormGroups = addresses.map(address => this.fb.group(addresses)); // tableau de formGroup a partir du tableau d'addresses
    const addressFormArray = this.fb.array(addressFormGroups); // initialise le formArray avec le tableau de formGroup
    this.heroForm.setControl('secretLairs', addressFormArray); 
  }

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  }

  addSecretLair(){
    this.secretLairs.push(this.fb.group(new Address()));
  }

  // ngOnInit() {
  //   this.heroForm.setValue({
  //     name:  this.hero.name,
  //     address:  this.hero.addresses[0] || new Address(),
  //     power: '',
  //     sidekick: 'false'
  //   })
  //   // this.heroForm.controls['name'].markAsDirty();
  //   // this.heroForm.get('address.street').markAsDirty();
  // }

  ngOnChanges(): void {
    this.rebuildForm();
  }
}
