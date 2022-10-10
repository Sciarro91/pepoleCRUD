import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from './services/api.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'pepoleApi';

  
    displayedColumns: string[] = ['id', 'nome', 'cognome','luogo_nascita','provincia','sesso','data_nascita','codice_fiscale','action'];
  dataSource !: MatTableDataSource<any>;

  
  
  
  //filteredOptions: Observable<string[]>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(private dialog : MatDialog, private api : ApiService){
    
  }

  ngOnInit(): void {
    this.getAllPepole();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllPepole();
      }
    })
  }

  getAllPepole(){
    this.api.getPerson()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Something went wrong!")
      }
    })
  }

  editPerson(row : any){

    console.log(row)
    this.dialog.open(DialogComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllPepole();
      }
    })
  }

  deletePerson(id : number){
    this.api.deletePerson(id)
    .subscribe({
      next:(res)=>{
        alert("Person Deleted");
        this.getAllPepole();
      },
      error:()=>{
        alert("Something went wrong!")
      }
    })
  } 

  

}