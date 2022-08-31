import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mascota } from 'src/app/interfaces/mascota';


const listMascotas: Mascota[] = [
  { nombre: 'Tobbi', edad: 3, raza: 'Golden', color: 'Dorado', peso: 13},
  { nombre: 'Deus', edad: 2, raza: 'Labrador', color: 'Dorado', peso: 10},
  { nombre: 'Betoven', edad: 10, raza: 'Labrador', color: 'Blanco', peso: 50},
  { nombre: 'Spinky', edad: 5, raza: 'Ovejero Aleman', color: 'Negro', peso: 30},
  { nombre: 'Homero', edad: 7, raza: 'Chihuahua', color: 'Cafe', peso: 20},
  { nombre: 'Michi', edad: 7, raza: 'Turco', color: 'Blanco', peso: 18},
];

@Component({
  selector: 'app-listado-mascota',
  templateUrl: './listado-mascota.component.html',
  styleUrls: ['./listado-mascota.component.css']
})
export class ListadoMascotaComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'edad', 'raza', 'color', 'peso', 'acciones'];
  dataSource = new MatTableDataSource<Mascota>(listMascotas);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarMascota(){
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this._snackBar.open('La mascota fue eliminada con exito!','',{
        duration:4000,
        horizontalPosition:'right'
      });
    }, 3000);
  }


}
