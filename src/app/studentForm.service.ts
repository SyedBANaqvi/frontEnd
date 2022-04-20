import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, observable } from 'rxjs';



export interface countryInfo{
  id:number,
  code:string,
  abbreviation:string
}
export interface studentInfo{
  id:number,
  studentCnic:string,
  name:string,
  fatherName:string,
  guardianCnic:string
  studentRecord:{}
}

@Injectable({
  providedIn: 'root'
})


export class StudentFormService {
  public resultCampusArray=[]

  constructor(private http:HttpClient) { }

url="http://localhost:4201/countryList";
urlStudentList="http://localhost:4201/studentFormList"
urlConfiguration="http://localhost:4201/cityList"
urlProvince="http://localhost:4201/provinceList"
urlAdmissionType="http://localhost:4201/admissionTypesList"
urlAcademicSession="http://localhost:4201/academicSessionList"


  getData():Observable<countryInfo[]>{
return this.http.get<countryInfo[]>(this.url)
}
getStudentData(offset:number,limit:number):Observable<studentInfo[]>{
  let params=new HttpParams();
  return this.http.get<studentInfo[]>(this.urlStudentList+'?offset='+offset+'&limit='+limit)
  }
getCampus(){
  let url1="http://localhost:4201/campusList"
  return new Promise((resolve,reject)=>{

    this.http.get(url1).subscribe(result=>{
      this.resultCampusArray.push(result)
      resolve(result)
    },error=>{
      reject(error)
    })
})
}



getCities(){
   return this.http.get(this.urlConfiguration)
}
getProvince(){
  return this.http.get(this.urlProvince)
}

getAdmissionTypes(){
  return this.http.get(this.urlAdmissionType)
}

getAcademicSession(){
  return this.http.get(this.urlAcademicSession)
}



}
