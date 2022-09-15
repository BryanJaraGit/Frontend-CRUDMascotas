import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mascota } from 'src/app/interfaces/mascota';
import { MascotaService } from 'src/app/services/mascota.service';


@Component({
  selector: 'app-listado-mascota',
  templateUrl: './listado-mascota.component.html',
  styleUrls: ['./listado-mascota.component.css']
})
export class ListadoMascotaComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'edad', 'raza', 'color', 'peso', 'acciones'];
  dataSource = new MatTableDataSource<Mascota>();
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterName = '';
  filterRaza = '';
  filterColor = '';

  razaOptions: any = []
  colorOptions: any = []

  constructor(private _snackBar: MatSnackBar, private _mascotaService:MascotaService) { }

  ngOnInit(): void {
    this.obtenerMascotas();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.getFilterPredicate();
    if(this.dataSource.data.length>0){
      this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
    }
    
    
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  getFilterPredicate() {
    return (row: any, filters: string) => {
      const filterArray = filters.split('$');
      const color = filterArray[0];
      const raza = filterArray[1];
      const nombre = filterArray[2];

      const matchFilter = [];
      const columnColor = row.color;
      const columnRaza = row.raza;
      const columnNombre = row.nombre;

      const customFilterC = columnColor.includes(color);
      const customFilterR = columnRaza.includes(raza);
      const customFilterN = columnNombre.includes(nombre);

      matchFilter.push(customFilterC);
      matchFilter.push(customFilterN);
      matchFilter.push(customFilterR);

      return matchFilter.every(Boolean);
    };
  }

  applyFilter(filterValue: Event) {
    const nombre = this.filterName;
    const raza = this.filterRaza;
    const color = this.filterColor;

    this.filterColor = color === 'TODO' ? '' : color;
    this.filterRaza = raza === 'TODO' ? '' : raza;
    this.filterName = nombre === 'TODO' ? '' : nombre;

    const filterData = this.filterColor + '$' + this.filterRaza + '$' + this.filterName;
    this.dataSource.filter = filterData.trim();
  }

  obtenerMascotas(){
    this.loading = true;
    this._mascotaService.getMascotas().subscribe(data => {
      this.loading = false;
      this.dataSource.data = data;
      const values = [];
      const values2 = [];

      for(const d of data){
        values.push(d.raza);
        values2.push(d.color);
      }
      this.razaOptions = [... new Set(values)].sort();
      this.colorOptions = [... new Set(values2)].sort();

      
    })
  }

  eliminarMascota(id:number){
    this.loading = true;

    this._mascotaService.deleteMascota(id).subscribe(() => {
      this.mensajeExito();
      this.loading = false;
      this.obtenerMascotas();
    });
  }
  mensajeExito(){
    this._snackBar.open('La mascota fue eliminada con exito!','',{
      duration:4000,
      horizontalPosition:'right'
    });
  }

}
