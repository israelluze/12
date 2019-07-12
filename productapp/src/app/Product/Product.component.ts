import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/Product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../_model/Product';
import { DepartmentService } from '../_services/Department.service';
import { Department } from '../_model/Department';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: "app-Product",
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.css']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required]],
    price: [0, [Validators.required]],
    departments: [[], [Validators.required]]
  });

  private unsubscribe$: Subject<any> = new Subject<any>();

  products: Product[] = [];
  departments: Department[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private deptosService: DepartmentService
  ) {}

  ngOnInit() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods) => this.products = prods);
    console.log(this.products);
    this.deptosService
      .getDepartments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deptos => (this.departments = deptos));
    console.log(this.departments);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  save() {
    let data = this.productForm.value;
    if (data._id != null) {
      this.productService.updateProduct(data)
        .subscribe();
    } else {
      this.productService.addProduct(data).subscribe();
    }
  }

  delete(prod: Product) {}

  edit(prod: Product) {}
}
