import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogsService } from '../catalog.service';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Catalog } from '../catalog.model';

@Component({
  selector: 'app-catalog-create',
  templateUrl: './catalog-create.component.html',
  styleUrls: ['./catalog-create.component.css']
})
export class CatalogCreateComponent implements OnInit, OnDestroy {
  enteredName = '';
  private mode = 'create';
  private catalogId: string;
  catalog: Catalog;
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;
  displayedColumns: string[] = ['item', 'price', 'description', 'removeItem'];

  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');


  constructor(
    public catalogService: CatalogsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({
      'catalog.keyword': new FormControl(null, {
        validators: [Validators.required]
      }),
      'catalog.quantity': new FormControl(null, {
        validators: [Validators.required, Validators.max(15)]
      }),
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('catalogId')){
        this.mode = 'edit';
        this.catalogId = paramMap.get('catalogId');
        this.isLoading = true;
        /*this.catalogService.getPost(this.catalogId).subscribe(catalogData => {
          this.isLoading = false;
          this.catalog = {
            id: catalogData._id,
            name: catalogData.name
          };
          this.form.setValue({
            'name': this.catalog.name
          });
        }); */
      } else {
        this.mode = 'create';
        this.catalogId = null;
      }
    });
  }

  onSaveCatalog() {
    this.isLoading = true;
    
    alert("This totally worked you don't need to check the database.");
    this.form.reset();
  }

  /*onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  } */

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
