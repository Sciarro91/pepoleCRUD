import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Luoghi } from '../model/Luoghi';
import { Observable, map, startWith, filter,  debounceTime, tap, switchMap, finalize, distinctUntilChanged } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  pepoleForm !: FormGroup;
  actionBtn : string = "Save"; 
  
  myControl = new FormControl('');
  filteredLuoghi: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedLuogo: any = "";
  http: any;

  constructor(
    private formBuilder: FormBuilder, 
    private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>,
    private http_autocomplete: HttpClient,
    private dateAdapter: DateAdapter<Date>) { 

      this.dateAdapter.setLocale('en-GB');

    }

    private API_URL= environment.API_URL;

    onSelected() {
      console.log(this);
      this.selectedLuogo = this.selectedLuogo;
      this.pepoleForm.controls['luogo_nascita'].setValue(this.selectedLuogo);
    }
  
    displayWith(value: any) {
      return value?.Title;
    }
  
    clearSelection() {
      this.selectedLuogo = "";
      this.filteredLuoghi = [];
    }

  ngOnInit(): void {
    this.pepoleForm = this.formBuilder.group({
      nome : ['',Validators.required],
      cognome : ['',Validators.required],
      luogo_nascita : ['',Validators.required],
      provincia : ['',Validators.required],
      sesso : ['',Validators.required],
      data_nascita : ['',Validators.required],
      codice_fiscale : ['',Validators.required]
    });

    console.log(this.pepoleForm.controls);


    if(this.editData){
      this.actionBtn = "Update";
      this.pepoleForm.controls['nome'].setValue(this.editData.nome);
      this.pepoleForm.controls['cognome'].setValue(this.editData.cognome);
      this.pepoleForm.controls['luogo_nascita'].setValue(this.editData.luogo_nascita);
      this.pepoleForm.controls['provincia'].setValue(this.editData.provincia);
      this.pepoleForm.controls['sesso'].setValue(this.editData.sesso);
      this.pepoleForm.controls['data_nascita'].setValue(this.editData.data_nascita);
      this.pepoleForm.controls['codice_fiscale'].setValue(this.editData.codice_fiscale);
      
    }

    this.myControl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredLuoghi = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http_autocomplete.get(this.API_URL+'/luoghiNascita?src=' + value) 
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.filteredLuoghi = [];
        } else {
          this.errorMsg = "";
          this.filteredLuoghi = data;
          console.log(data);
        }
        console.log(this.filteredLuoghi);
      });
    
  }

  

  addPerson(){
    console.log(this);
    if(!this.editData){
      if(this.pepoleForm.valid){
        this.api.postPerson(this.pepoleForm.value)
        .subscribe({
          next:(res)=>{
            alert("Person Added");
            this.pepoleForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Something went wrong!")
          }
        })
      }
    } else {
      this.updatePerson()
    }
    
    
  }

  updatePerson(){
    this.api.putPerson(this.pepoleForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Person Updated");
        this.pepoleForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert('Something goes wrong!');
      }
    })
  }

  

}
