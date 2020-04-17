import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthData } from '../auth-data.model';

export interface Role {
  role: string;
}

@Component({
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  selectedRole = null;
  private mode = 'create';
  private userId: string;
  private userRole: string;
  form: FormGroup;
  user: AuthData;
  title = "Add User";

  roles: Role[] = [
    { role: "Driver" },
    { role: "Sponsor" }
  ];

  constructor(public authService: AuthService,
              public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      'password': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'fname': new FormControl(null, {
        validators: [Validators.required]
      }),
      'lname': new FormControl(null, {
        validators: [Validators.required]
      }),
      'username': new FormControl(null, {
        validators: [Validators.required]
      }),
      'role': new FormControl(null, {
        validators: [Validators.required]
      }),

    })

    this.userRole = this.authService.getUserRole();
    if (this.userRole === "Admin") {
      this.roles = [
        { role: "Driver" },
        { role: "Sponsor" },
        { role: "Admin" }
      ]; 
    }

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')){
        this.mode = 'edit';
        this.title = "Edit User"
        this.userRole = this.authService.getUserRole();
        if (this.userRole === "Admin") {
          this.roles = [
            { role: "Driver" },
            { role: "Sponsor" },
            { role: "Admin" }
          ];
        }
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.authService.getUser(this.userId).subscribe(userData => {
          this.isLoading = false;
          this.user = {
            id: userData._id,
            email: userData.email,
            password: null,
            fname: userData.fname,
            lname: userData.lname,
            username: userData.username,
            role: userData.role,
            companyId: userData.companyId
          };
          console.log(this.user);
          this.form.setValue({
            'email': this.user.email,
            'password': null,
            'fname': this.user.fname,
            'lname': this.user.lname,
            'username': this.user.username,
            'role': this.user.role
          }) 
        })
      }
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignup() {
    if (this.form.invalid)
      return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.authService.addUser(
        this.form.value.email, 
        this.form.value.password,
        this.form.value.fname,
        this.form.value.lname,
        this.form.value.username,
        this.form.value.role
        );
    } else {
      this.authService.updateUser(
        this.user.id,
        this.form.value.email,
        this.form.value.password,
        this.form.value.fname,
        this.form.value.lname,
        this.form.value.username,
        this.form.value.role,
        this.user.companyId
      );
    }
    this.form.reset();
  }

}
