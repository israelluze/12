import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Department } from '../_model/Department';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

readonly url = 'http://localhost:9000/departments';

private departmentsSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
private loaded = false;
constructor(private http: HttpClient) {}

getDepartments(): Observable<Department[]> {
  if (!this.loaded) {
    this.http.get<Department[]>(this.url)
      .subscribe(this.departmentsSubject$);
    this.loaded = true;
  }
  return this.departmentsSubject$.asObservable();
}

addDepartment(dep: Department): Observable<Department> {
  return this.http.post<Department>(this.url, dep)
    .pipe(tap((dep: Department) => this.departmentsSubject$.getValue().push(dep)));
}

delDepartment(dep: Department): Observable<any> {
  return this.http.delete(`${this.url}/${dep._id}`)
    .pipe(tap(() => {
      let departments = this.departmentsSubject$.getValue();
      let i = departments.findIndex(d => d._id === dep._id);

      if (i >= 0) {
        departments.splice(i, 1);
      }
    }
    ));
}

updateDepartment(dep: Department): Observable<Department> {
  return this.http.patch<Department>(`${this.url}/${dep._id}`, dep)
    .pipe(tap((d) => {
      let departments = this.departmentsSubject$.getValue();
      let i = departments.findIndex(d => d._id === dep._id);

      if (i >= 0) {
        departments[i].name = d.name;
      }
    }));
}





}
