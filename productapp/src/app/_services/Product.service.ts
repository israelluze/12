import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { Product } from "../_model/Product";
import { tap, map, filter } from "rxjs/operators";
import { DepartmentService } from "./Department.service";
import { pipeDef } from "@angular/core/src/view";
import { Department } from "../_model/Department";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  url = "http://localhost:9000/products";

  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >(null);
  private loaded = false;

  constructor(
    private http: HttpClient,
    private deptoService: DepartmentService
  ) {}

  getProducts(): Observable<Product[]> {
    if (!this.loaded) {
      this.loaded = true;
      combineLatest(
        this.http.get<Product[]>(this.url),
        this.deptoService.getDepartments()
      )
        .pipe(
          filter(([products, departments]) => products != null && departments != null),
          map(([products, departments]) => {
            for (let p of products) {
              let ids = p.departments as string[];
              p.departments = ids.map(id =>
                departments.find(dep => dep._id === id)
              );
            }
            return products;
          })
        )
        .subscribe(this.productsSubject$);
    }
    return this.productsSubject$.asObservable();
  }

  addProduct(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d => d._id);
    return this.http.post<Product>(this.url, { ...prod, departments })
      .pipe(
        tap((p) =>
          this.productsSubject$.getValue()
            .push({ ...prod, _id: p._id })
        )
      );
  }

  delProduct(prod: Product): Observable<any> {
    console.log(prod._id);
    return this.http.delete(`${this.url}/${prod._id}`)    
    .pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let i = products.findIndex(p => p._id === prod._id);

        // tslint:disable-next-line: curly
        if (i >= 0) 
          products.splice(i, 1);
      })
    );
  }



  updateProduct(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d => d._id);
    return this.http
      .patch<Product>(`${this.url}/${prod._id}`, { ...prod, departments })
      .pipe(
        tap(p => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id === prod._id);

          if (i >= 0) {
            products[i] = prod;
          }
        })
      );
  }
}
