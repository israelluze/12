import { Component, OnInit } from "@angular/core";
import { Department } from "../_model/Department";
import { DepartmentService } from "../_services/Department.service";
import { refreshDescendantViews } from "@angular/core/src/render3/instructions";
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-Department",
  templateUrl: "./Department.component.html",
  styleUrls: ["./Department.component.css"]
})
export class DepartmentComponent implements OnInit {
  depName = "";
  departments: Department[] = [];
  depEdit: Department = null;
  private unsubscribe$: Subject<any> = new Subject();
  constructor(private departmentService: DepartmentService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.departmentService
      .getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deps => (this.departments = deps));
  }

  save() {
    if (this.depEdit) {
      this.departmentService.updateDepartment(
        {name: this.depName, _id: this.depEdit._id})
          .subscribe(
            (dep) => {
              this.notify('Updated!');
            },
            (err) => {
              this.notify('Error');
              console.error(err);
            }
          );
    } else {
      this.departmentService.addDepartment({ name: this.depName }).subscribe(
        dep => {          
          console.log(dep);
          this.clearFields();
          this.notify('Inserted!');
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  clearFields() {
    this.depName = '';
    this.depEdit = null;
  }

  cancel() {}
  edit(dep: Department) {
    this.depName = dep.name;
    this.depEdit = dep;
  }

  delete(dep: Department) {
    this.departmentService.delDepartment(dep)
      .subscribe(() => this.notify('Removed!'),
        (err) => {this.notify('Erro');
                  console.error(err);
        }
      );
  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', {duration: 3000});
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}


