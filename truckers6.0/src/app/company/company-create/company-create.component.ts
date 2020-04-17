import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompaniesService } from '../company.service';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from '../company.model';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.css']
})
export class CompanyCreateComponent implements OnInit, OnDestroy {
  enteredName = '';
  private mode = 'create';
  private companyId: string;
  company: Company;
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(
    public companyService: CompaniesService,
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
      'name': new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('companyId')){
        this.mode = 'edit';
        this.companyId = paramMap.get('companyId');
        this.isLoading = true;
        /*this.companyService.getPost(this.companyId).subscribe(companyData => {
          this.isLoading = false;
          this.company = {
            id: companyData._id,
            name: companyData.name
          };
          this.form.setValue({
            'name': this.company.name
          });
        }); */
      } else {
        this.mode = 'create';
        this.companyId = null;
      }
    });
  }

  onSaveCompany() {

    if (this.form.invalid)
      return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.companyService.addCompany(
        this.form.value.name,
      );
    } /*else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } */
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
