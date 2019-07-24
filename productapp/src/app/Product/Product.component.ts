import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../_services/Product.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Product } from '../_model/Product';
import { DepartmentService } from '../_services/Department.service';
import { Department } from '../_model/Department';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "app-Product",
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.css']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    departments: [[], [Validators.required]]
  });

  @ViewChild('form') form: NgForm;

  private unsubscribe$: Subject<any> = new Subject<any>();

  products: Product[] = [];
  departments: Department[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private deptosService: DepartmentService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(prods => this.products = prods);
    this.deptosService
      .getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deptos) => this.departments = deptos);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  save() {
    let data = this.productForm.value;
    if (data._id != null) {
      this.productService.updateProduct(data)
        .subscribe(() => this.notify('Updated!'));
    } else {
      this.productService.addProduct(data).subscribe(() => this.notify('Inserted!'));
    }
    this.resetForm();
  }

  delete(prod: Product) {
    this.productService.delProduct(prod)
      .subscribe(
        () => this.notify('Deleted'),
        (err) => console.log(err)
      );
  }

  edit(prod: Product) {
    this.productForm.setValue(prod) ;
  }

  notify(s: string) {
    this.snackbar.open(s, 'OK', {duration: 3000});
  }

  resetForm() {
    // this.productForm.reset();
    this.form.resetForm();
  }
}
