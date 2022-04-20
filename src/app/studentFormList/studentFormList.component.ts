import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { studentInfo, StudentFormService } from '../studentForm.service';
import { GenericService } from '../generic.services';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { eventNames } from 'process';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-studentFormList',
  templateUrl: './studentFormList.component.html',
  styleUrls: ['./studentFormList.component.css'],
})
export class StudentFormListComponent implements OnInit {
  constructor(
    private studentData: StudentFormService,
    private router: Router,
    private generic: GenericService
  ) {}

  newTempData = [{}];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('table', { static: false }) table: MatTable<any>;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild ('paginator') paginator:MatPaginator

  // data=  new MatTableDataSource([]);
  data;
  public totalSize = 0;
  public pageSize = 5;
  // currentSize=0
  columnToDisplay = [
    'sno',
    'studentCnic',
    'name',
    'fatherName',
    'guardianCnic',
    'studentRecord',
    'options',
  ];
  public offset = 0;
  public limit = 5;
  ngOnInit(): void {
    this.getDataByAPI().then(x => {

      let data=x['rows']
      this.dataSource.data=data
      setTimeout(() => {

        this.paginator.length = x['count'];
      });

    })
  }
  OnLoadList() {
    this.router.navigate(['./create']);
  }

  OnView(id) {
    this.router.navigate(['./view/' + id]);
  }
  OnEdit(id) {
    this.router.navigate(['./edit/' + id]);
  }

  OnDelete(id) {
    console.log('this is called');

    this.generic.delete('studentForm/delete/' + id).subscribe((res) => {
      window.location.reload();
      console.log(res);
    });
  }

  // makeTempData(x) {
  //   let tempData: {
  //     id: number;
  //     studentCnic: string;
  //     name: string;
  //     fatherName: string;
  //     guardianCnic: string;
  //     studentRecord: [];
  //   }[] = [];

  //   for (let oneRow of x) {
  //     tempData.push({
  //       id: oneRow['id'],
  //       studentCnic: oneRow['cnicId'],
  //       name: oneRow['name'],
  //       fatherName: oneRow['guardianName'],
  //       guardianCnic: oneRow['guardianCnic'],
  //       studentRecord: oneRow['studentAcademicRecord'],
  //     });
  //   }
  //   const allDegs = ['Matric', 'Inter', 'Graduate', 'Any Other Exam '];

  //   return tempData.map((e) => {
  //     let obj = e;
  //     let noOfdegs = obj['studentRecord'].length;
  //     let availableDegs = [...allDegs];
  //     availableDegs.length = noOfdegs;
  //     obj['degree'] = availableDegs;
  //     return obj;
  //   });
  // }





  // getStudentDataFromApi() {
  //   this.studentData.getStudentData(this.offset, this.limit).subscribe((x) => {
  //     x = x['rows'];

  //     setTimeout(() => {
  //       this.data = new MatTableDataSource(x);
  //     }, 20);


  //   });
  // }

  // private createPagination() {
  //   this.paginator.page.subscribe((e) => {
  //     this.offset = e.pageSize * e.pageIndex;

  //   this.studentData
  //     .getStudentData(this.offset, this.limit)
  //     .subscribe((x: any) => {

  //       // x = x['rows'];
  //       // let tempData = this.makeTempData(x);
  //       setTimeout(() => {

  //          this.data = new MatTableDataSource<any>(x['rows']);
  //         this.totalSize=x['count']
  //         this.data.paginator = this.paginator;
  //         console.log(this.totalSize,"==============")
  //         //this.data.sort = this.sort;
  //       }, 20);

  //     });
  //   });


  //     this.data = new MatTableDataSource<any>(x['rows']);
  //     console.log(this.paginator,"ggggggggggggg")
  //     this.totalSize = x['count'];
  //     this.totalSize = 10;
  //     this.data.paginator = 30
  //     this.paginator['length']=this.totalSize
  //     console.log(this.data.paginator,'===============++++++++++++++++');




  //     console.log(this.totalSize, '==============');

  //     console.log("total size is",this.totalSize);

  //   );
  // }


  private getDataByAPI() {
    return new Promise((resolve, reject) => {
      this.studentData.getStudentData(this.offset, this.limit).subscribe(
        (x: any) => {

          resolve(x);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  pageChangeEvent(event) {

    this.limit = event.pageSize;
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;

    this.getDataByAPI().then(x => {

      let data=x['rows']
      console.log(data,"ssssssssssssssss");

      this.dataSource.data=data
      setTimeout(() => {
        this.paginator.pageIndex = event.pageIndex;;
        this.paginator.length = x['count'];
      });

    })



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  displayDegree(degs) {
    //  if(false){
    let str = '';
    degs.map((e, i) => {
      i == degs.length - 1 ? (str += e) : (str += e + ' - ');
    });
    return str;

    //  }else{
    //    return ''
    //  }
  }
}
